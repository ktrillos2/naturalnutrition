const fs = require('fs');
const csv = require('csv-parser');
const cheerio = require('cheerio');
const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

// Initialize Sanity Client
// IMPORTANT: You need to set these environment variables in .env.local
const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_API_TOKEN, // Needs write access
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function parseDescription(html) {
    const $ = cheerio.load(html);
    const data = {};

    // Extract from tables
    $('table tr').each((i, el) => {
        const label = $(el).find('td').first().text().trim().toLowerCase();
        const value = $(el).find('td').last().text().trim();

        if (label.includes('registro invima') || label.includes('invima')) {
            data.registroInvima = value;
        } else if (label.includes('modo de uso')) {
            data.modoDeUso = value;
        } else if (label.includes('contraindicaciones')) {
            data.contraindicaciones = value;
        } else if (label.includes('beneficios')) {
            data.beneficios = value;
        } else if (label.includes('ancho')) {
            if (!data.specifications) data.specifications = {};
            data.specifications.width = value;
        } else if (label.includes('alto')) {
            if (!data.specifications) data.specifications = {};
            data.specifications.height = value;
        } else if (label.includes('profundidad') || label.includes('largo')) {
            if (!data.specifications) data.specifications = {};
            data.specifications.depth = value;
        }
    });

    return data;
}

async function getOrCreateCategory(categoryName) {
    if (!categoryName) return null;
    const slug = categoryName.toLowerCase().replace(/\s+/g, '-').slice(0, 96);

    // Check if exists
    const query = `*[_type == "category" && slug.current == "${slug}"][0]`;
    const existing = await client.fetch(query);

    if (existing) {
        return existing._id;
    }

    // Create new
    const doc = {
        _type: 'category',
        name: categoryName,
        slug: { _type: 'slug', current: slug },
    };

    const created = await client.create(doc);
    console.log(`Created category: ${categoryName}`);
    return created._id;
}

// Main migration function
async function migrateData() {
    const results = [];

    fs.createReadStream('products.csv')
        .pipe(csv({
            mapHeaders: ({ header }) => header.trim().replace(/^\ufeff/, '')
        }))
        .on('data', (data) => {
            // Only push if Name exists
            if (data.Name && data.Name.trim() !== '') {
                results.push(data);
            }
        })
        .on('end', async () => {
            console.log(`Parsed ${results.length} valid rows from CSV.`);

            for (const row of results) {
                try {
                    console.log(`Processing: ${row.Name}`);

                    // Parse description specifically
                    const specializedData = await parseDescription(row.Description || '');

                    // Handle Categories 
                    const categoryNames = row.Categories ? row.Categories.split(',').map(c => c.trim()) : [];
                    const categoryRefs = [];

                    for (const catName of categoryNames) {
                        const catId = await getOrCreateCategory(catName);
                        if (catId) {
                            categoryRefs.push({
                                _key: catId,
                                _type: 'reference',
                                to: [{ type: 'category' }]
                            });
                        }
                    }

                    // Clean price
                    const cleanPrice = (val) => {
                        if (!val) return 0;
                        return parseFloat(val.toString().replace(/[^0-9.]/g, '')) || 0;
                    };

                    const price = cleanPrice(row['Regular price'] || row['Price']);

                    // Custom slug generation to handle special chars
                    const generateSlug = (text) => {
                        return text.toString().toLowerCase()
                            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/^-+|-+$/g, '')
                            .slice(0, 96);
                    };

                    // Build attributes
                    const attributes = [];
                    if (row['Attribute 1 name'] && row['Attribute 1 value(s)']) {
                        attributes.push({
                            _key: 'attr1',
                            name: row['Attribute 1 name'],
                            value: row['Attribute 1 value(s)']
                        });
                    }

                    const productDoc = {
                        _type: 'product',
                        name: row.Name,
                        slug: {
                            _type: 'slug',
                            current: generateSlug(row.Name)
                        },
                        shortDescription: row['Short description'],
                        description: [
                            {
                                _key: 'desc1',
                                _type: 'block',
                                children: [{ _key: 'c1', _type: 'span', text: row.Description ? row.Description.replace(/<[^>]*>?/gm, '') : '' }],
                                markDefs: [],
                                style: 'normal'
                            }
                        ],
                        price: price,
                        stock: 100,
                        tags: row.Tags ? row.Tags.split(',').map(t => t.trim()) : [],
                        ...specializedData,
                        categories: categoryRefs,
                        attributes: attributes
                    };

                    await client.create(productDoc);
                    console.log(`Imported product: ${row.Name}`);

                } catch (error) {
                    console.error(`Error processing ${row.Name || 'Unknown'}:`, error.message);
                }
            }

            console.log('Migration complete!');
        });
}

migrateData();
