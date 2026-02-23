import fs from 'fs';
import csv from 'csv-parser';
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2023-10-01',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
});

function textToBlocks(text) {
    if (!text) return [];
    const lines = text.split('\n').filter(line => line.trim() !== '');
    return lines.map(line => ({
        _type: 'block',
        _key: Array.from({ length: 12 }, () => Math.random().toString(36)[2]).join(''),
        style: 'normal',
        children: [
            {
                _type: 'span',
                _key: Array.from({ length: 12 }, () => Math.random().toString(36)[2]).join(''),
                text: line.trim(),
                marks: []
            }
        ],
        markDefs: []
    }));
}

function parseAttributes(attrString) {
    if (!attrString) return [];
    const lines = attrString.split('\n').filter(line => line.trim() !== '');
    return lines.map(line => {
        const parts = line.split(':');
        if (parts.length >= 2) {
            return {
                _key: Array.from({ length: 12 }, () => Math.random().toString(36)[2]).join(''),
                name: parts[0].trim(),
                value: parts.slice(1).join(':').trim()
            };
        } else {
            const eqParts = line.split('=');
            if (eqParts.length >= 2) {
                return {
                    _key: Array.from({ length: 12 }, () => Math.random().toString(36)[2]).join(''),
                    name: eqParts[0].trim(),
                    value: eqParts.slice(1).join('=').trim()
                };
            }
            return {
                _key: Array.from({ length: 12 }, () => Math.random().toString(36)[2]).join(''),
                name: 'Presentación',
                value: line.trim()
            };
        }
    });
}

async function processCsv() {
    const results = [];

    await new Promise((resolve, reject) => {
        fs.createReadStream('Maestro.csv')
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve())
            .on('error', (err) => reject(err));
    });

    console.log(`Loaded ${results.length} rows from CSV.`);

    for (const row of results) {
        const slug = row.Slug?.trim();
        if (!slug) continue;

        // query Sanity to find product by slug
        const query = `*[_type == "product" && slug.current == $slug][0]`;
        const product = await client.fetch(query, { slug });

        if (!product) {
            console.log(`Product not found for slug: ${slug}, skipping...`);
            continue;
        }

        const patch = client.patch(product._id);
        let hasUpdates = false;

        // description
        const newDescription = textToBlocks(row.Description);
        if (newDescription.length > 0) {
            patch.set({ description: newDescription });
            hasUpdates = true;
        }

        // Price
        if (row.Price) {
            const priceVal = parseFloat(row.Price.replace(/[^\d.-]/g, ''));
            if (!isNaN(priceVal)) patch.set({ price: priceVal });
            hasUpdates = true;
        }

        // Regular Price
        if (row['Regular Price']) {
            const regularPriceVal = parseFloat(row['Regular Price'].replace(/[^\d.-]/g, ''));
            if (!isNaN(regularPriceVal)) patch.set({ precioRegular: regularPriceVal });
            hasUpdates = true;
        }

        // Stock
        if (row.Stock) {
            const stockVal = parseInt(row.Stock, 10);
            if (!isNaN(stockVal)) patch.set({ stock: stockVal });
            hasUpdates = true;
        }

        // Registro INVIMA
        if (row['Registro INVIMA']) {
            patch.set({ registroInvima: row['Registro INVIMA'].trim() });
            hasUpdates = true;
        }

        // Advertencia (Contraindicaciones)
        if (row.Advertencia) {
            patch.set({ contraindicaciones: row.Advertencia.trim() });
            hasUpdates = true;
        }

        // Beneficios
        if (row.Beneficios) {
            patch.set({ beneficios: row.Beneficios.trim() });
            hasUpdates = true;
        }

        // Specifications
        if (row.Width || row.Height || row.Depth) {
            patch.set({
                specifications: {
                    width: row.Width?.trim() || '',
                    height: row.Height?.trim() || '',
                    depth: row.Depth?.trim() || ''
                }
            });
            hasUpdates = true;
        }

        // Attributes
        if (row.Attributes) {
            const attrs = parseAttributes(row.Attributes);
            if (attrs.length > 0) {
                patch.set({ attributes: attrs });
                hasUpdates = true;
            }
        }

        // Modo de Uso
        if (row['Modo de Uso']) {
            const modoBlocks = textToBlocks(row['Modo de Uso']);
            if (modoBlocks.length > 0) {
                patch.set({ modoDeUso: modoBlocks });
                hasUpdates = true;
            }
        }

        if (hasUpdates) {
            try {
                await patch.commit();
                console.log(`Updated product: ${slug}`);
            } catch (err) {
                console.error(`Error updating product ${slug}: `, err.message);
            }
        } else {
            console.log(`No fields to update for: ${slug}`);
        }
    }

    console.log("Finished updating products.");
}

processCsv().catch(console.error);
