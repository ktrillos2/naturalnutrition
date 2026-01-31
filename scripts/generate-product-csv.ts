
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env.local BEFORE imports
dotenv.config({ path: '.env.local' });

// Manually define apiVersion and projectId to avoid importing from sanity/env before dotenv loads
// These values are typically static or from env
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

if (!dataset || !projectId) {
    console.error('Missing environment variables: NEXT_PUBLIC_SANITY_DATASET or NEXT_PUBLIC_SANITY_PROJECT_ID');
    process.exit(1);
}

// Import createClient after env vars are loaded
import { createClient } from '@sanity/client';

// Create Sanity client
const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false, // Ensure fresh data
    token: process.env.SANITY_API_TOKEN, // Optional, if needed for private datasets
});

const query = `*[_type == "product"] {
  name,
  "slug": slug.current,
  price,
  regularPrice,
  stock,
  "categories": categories[]->title,
  tags,
  registroInvima,
  modoDeUso,
  contraindicaciones,
  beneficios,
  specifications,
  attributes,
  description
}`;

async function generateCSV() {
    try {
        console.log('Fetching products from Sanity...');
        const products = await client.fetch(query);

        if (!products || products.length === 0) {
            console.log('No products found.');
            return;
        }

        console.log(`Found ${products.length} products. Generating CSV...`);

        const headers = [
            'Name',
            'Slug',
            'Price',
            'Regular Price',
            'Stock',
            'Categories',
            'Tags',
            'Registro INVIMA',
            'Contraindicaciones',
            'Beneficios',
            'Width',
            'Height',
            'Depth',
            'Attributes',
            'Modo de Uso',
            'Description',
        ];

        const escapeCSV = (value: any) => {
            if (value === null || value === undefined) return '';
            const stringValue = String(value).replace(/"/g, '""'); // Escape double quotes
            return `"${stringValue}"`;
        };

        const rows = products.map((product: any) => {
            // Helper to convert portable text blocks to plain text
            const blocksToText = (blocks: any[]) => {
                if (!blocks || !Array.isArray(blocks)) return '';
                return blocks
                    .map((block) => {
                        if (block._type !== 'block' || !block.children) return '';
                        return block.children.map((child: any) => child.text).join('');
                    })
                    .join('\n\n');
            };

            const categories = Array.isArray(product.categories) ? product.categories.join(', ') : '';
            const tags = Array.isArray(product.tags) ? product.tags.join(', ') : '';
            const attributes = Array.isArray(product.attributes)
                ? product.attributes.map((attr: any) => `${attr.name}: ${attr.value}`).join('; ')
                : '';
            const modoDeUso = blocksToText(product.modoDeUso);
            const description = blocksToText(product.description);

            return [
                product.name,
                product.slug,
                product.price,
                product.regularPrice,
                product.stock,
                categories,
                tags,
                product.registroInvima,
                product.contraindicaciones,
                product.beneficios,
                product.specifications?.width,
                product.specifications?.height,
                product.specifications?.depth,
                attributes,
                modoDeUso,
                description,
            ].map(escapeCSV).join(',');
        });

        const csvContent = [headers.join(','), ...rows].join('\n');
        const outputPath = path.join(process.cwd(), 'products_full_export.csv');

        fs.writeFileSync(outputPath, csvContent);
        console.log(`CSV generated successfully at: ${outputPath}`);

    } catch (error) {
        console.error('Error generating CSV:', error);
    }
}

generateCSV();
