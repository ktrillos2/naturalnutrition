
import { createClient } from '@sanity/client'
import csv from 'csv-parser'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config(); // Fallback to .env

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_TOKEN || process.env.NEXT_PUBLIC_SANITY_TOKEN

if (!projectId || !dataset) {
    console.error('Missing Sanity configuration. Please check your .env file.')
    process.exit(1)
}

if (!token) {
    console.error('Missing SANITY_API_TOKEN. Please add it to your .env file to allow writing data.')
    process.exit(1)
}

const client = createClient({
    projectId,
    dataset,
    useCdn: false, // We want fresh data
    apiVersion: '2024-01-01',
    token,
})

const CSV_FILE_PATH = path.join(process.cwd(), 'products.csv')

interface CsvProduct {
    Name: string
    Slug: string
    Price: string
    'Regular Price': string
    Stock: string
    Categories: string
    Tags: string
    'Registro INVIMA': string
    Advertencia: string
    Beneficios: string
    Width: string
    Height: string
    Depth: string
    Attributes: string
    'Modo de Uso': string
    Description: string
}

async function fetchCategories() {
    const categories = await client.fetch(`*[_type == "category"]{_id, title}`)
    return categories
}

async function fetchExistingProducts() {
    // Fetch all products to check for existence by name/slug
    // We'll map by normalized name for comparison
    const products = await client.fetch(`*[_type == "product"]{_id, name, slug}`)
    return products
}

function normalize(str: string) {
    if (!str) return ""
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
}

function parseAttributes(attrString: string) {
    if (!attrString) return []
    // Example: "Color: Rojo, Talla: M" or just text. 
    // The CSV shows "Cantidad: x60", "Dimensions: ..." 
    // We'll try to split by some delimiter or just treat it as a single attribute if it doesn't match a pattern.
    // Based on CSV view: "Cantidad: x60"

    // We'll treat comma separated key:value pairs if possible, otherwise just raw string as value for "General"
    // Actually schema expects: {name: string, value: string} objects.

    const attrs = []
    const parts = attrString.split('\n').map(s => s.trim()).filter(Boolean)

    for (const part of parts) {
        if (part.includes(':')) {
            const [key, value] = part.split(':').map(s => s.trim())
            attrs.push({
                _key: Math.random().toString(36).substring(7),
                name: key,
                value: value
            })
        } else {
            attrs.push({
                _key: Math.random().toString(36).substring(7),
                name: 'General',
                value: part
            })
        }
    }
    return attrs
}

function createBlockContent(text: string) {
    if (!text) return []
    return text.split('\n').filter(Boolean).map(line => ({
        _key: Math.random().toString(36).substring(7),
        _type: 'block',
        style: 'normal',
        children: [{
            _key: Math.random().toString(36).substring(7),
            _type: 'span',
            text: line.trim()
        }]
    }))
}

function generateSlug(str: string) {
    if (!str) return ""
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 -]/g, "") // Remove invalid chars
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/-+/g, "-") // Collapse dashes
}

async function main() {
    console.log('Starting product sync...')

    const existingCategories = await fetchCategories()
    const existingProducts = await fetchExistingProducts()

    const products: CsvProduct[] = []

    fs.createReadStream(CSV_FILE_PATH)
        .pipe(csv())
        .on('data', (data) => products.push(data))
        .on('end', async () => {
            console.log(`Found ${products.length} products in CSV.`)

            for (const p of products) {
                if (!p.Name) continue

                const normalizedName = normalize(p.Name)
                const existingProduct = existingProducts.find((ep: any) => normalize(ep.name) === normalizedName)

                // Map Categories
                const catRefs = []
                if (p.Categories) {
                    const catNames = p.Categories.split(',').map(s => s.trim())
                    for (const catName of catNames) {
                        const foundCat = existingCategories.find((ec: any) => normalize(ec.title) === normalize(catName))
                        if (foundCat) {
                            catRefs.push({
                                _type: 'reference',
                                _key: foundCat._id,
                                ref: foundCat._id // _ref will be set by sanity client usually, but for array of refs we need object
                            })
                        } else {
                            console.warn(`Category not found: ${catName} for product ${p.Name}`)
                        }
                    }
                }

                const productDataSource = {
                    _type: 'product',
                    name: p.Name,
                    slug: { _type: 'slug', current: generateSlug(p.Slug || p.Name) },
                    price: parseFloat(p.Price || '0'),
                    precioRegular: parseFloat(p['Regular Price'] || '0'),
                    stock: parseInt(p.Stock || '0'),
                    registroInvima: p['Registro INVIMA'],
                    advertencia: p.Advertencia,
                    contraindicaciones: p.Advertencia,
                    beneficios: p.Beneficios,
                    specifications: {
                        width: p.Width,
                        height: p.Height,
                        depth: p.Depth
                    },
                    attributes: parseAttributes(p.Attributes),
                    modoDeUso: createBlockContent(p['Modo de Uso']),
                    description: createBlockContent(p.Description),
                    categories: catRefs.map(c => ({ _type: 'reference', _key: c.ref, _ref: c.ref })),
                }

                try {
                    if (existingProduct) {
                        console.log(`Updating product: ${p.Name}`)
                        await client.patch(existingProduct._id).set(productDataSource).commit()
                    } else {
                        console.log(`Creating product: ${p.Name}`)
                        await client.create(productDataSource)
                    }
                } catch (err) {
                    console.error(`Error processing ${p.Name}:`, err)
                }
            }
            console.log('Sync complete.')
        })
}

main()
