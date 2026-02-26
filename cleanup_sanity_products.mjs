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

async function runCleanup() {
    const validNames = new Set();
    const validSlugs = new Set();

    // 1. Read Maestro.csv and collect valid names and slugs
    await new Promise((resolve, reject) => {
        fs.createReadStream('Maestro.csv')
            .pipe(csv())
            .on('data', (data) => {
                if (data.Name) validNames.add(data.Name.trim());
                if (data.Slug) validSlugs.add(data.Slug.trim());
            })
            .on('end', () => resolve())
            .on('error', (err) => reject(err));
    });

    console.log(`Loaded ${validNames.size} valid names and ${validSlugs.size} valid slugs from Maestro.csv`);

    // 2. Query all products from Sanity
    const query = `*[_type == "product"]{_id, name, "slug": slug.current}`;
    const sanityProducts = await client.fetch(query);

    console.log(`Found ${sanityProducts.length} products in Sanity.`);

    // 3. Compare and delete
    let deletedCount = 0;
    for (const product of sanityProducts) {
        const hasValidName = product.name && validNames.has(product.name.trim());
        const hasValidSlug = product.slug && validSlugs.has(product.slug.trim());

        if (!hasValidName && !hasValidSlug) {
            console.log(`Deleting product: ${product.name || 'Unknown'} (Slug: ${product.slug || 'None'}) - ID: ${product._id}`);
            try {
                // Remove product references from 'featured' collection
                const featuredRefsQuery = `*[_type == "featured" && references("${product._id}")]`;
                const featuredDocs = await client.fetch(featuredRefsQuery);

                for (const featuredDoc of featuredDocs) {
                    console.log(`Detaching reference from featured doc: ${featuredDoc._id}`);
                    // For a document that contains an array of references to products (like products[]),
                    // we need to unset the specific reference
                    const patch = client.patch(featuredDoc._id).unset([`products[_ref == "${product._id}"]`]);
                    await patch.commit();
                }

                await client.delete(product._id);
                deletedCount++;
                console.log(`Successfully deleted ${product._id}`);
            } catch (err) {
                console.error(`Error deleting product ${product._id}:`, err.message);
            }
        }
    }

    console.log(`Cleanup complete. Deleted ${deletedCount} products out of ${sanityProducts.length}.`);
}

runCleanup().catch(console.error);
