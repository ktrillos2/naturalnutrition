const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function seedFeatured() {
    try {
        // First, let's try to find some existing products to reference
        // This is a best-effort. If no products exist, the list will be empty
        // but the document structure will be created.
        const products = await client.fetch(`*[_type == "product"][0...4] { _id }`);

        const featuredDoc = {
            _id: 'featured',
            _type: 'featured',
            title: 'Productos Destacados',
            subtitle: 'Descubre nuestra selección de los productos más populares y mejor valorados por nuestros clientes',
            products: products.map(p => ({
                _type: 'reference',
                _ref: p._id,
                _key: p._id // utilizing _id as key for simplicity in seed
            }))
        };

        const result = await client.createOrReplace(featuredDoc);
        console.log('Featured document created/updated:', result._id);
        console.log(`Linked ${products.length} products to featured section.`);

    } catch (error) {
        console.error('Error seeding featured:', error.message);
    }
}

seedFeatured();
