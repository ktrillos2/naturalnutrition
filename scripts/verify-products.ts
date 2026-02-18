
import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_TOKEN || process.env.NEXT_PUBLIC_SANITY_TOKEN

if (!projectId || !dataset) {
    console.error('Missing Sanity configuration.')
    process.exit(1)
}

const client = createClient({
    projectId,
    dataset,
    useCdn: false,
    apiVersion: '2024-01-01',
    token,
})

async function main() {
    console.log('Verifying products...')
    // Check a specific product that was updated/created
    // e.g. "Biotina + Zinc 60 softgels" or "Calmagzinc + Vitamina D 60 Tab"
    // We'll search by name
    const nameToFind = "Biotina + Zinc 60 softgels"
    const result = await client.fetch(`*[_type == "product" && name == $name][0]`, { name: nameToFind })

    if (result) {
        console.log(`Product found: ${result.name}`)
        console.log(`Price: ${result.price}`)
        console.log(`Updated at: ${result._updatedAt}`)
    } else {
        console.error(`Product not found: ${nameToFind}`)
    }

    // Check count
    const count = await client.fetch(`count(*[_type == "product"])`)
    console.log(`Total products now: ${count}`)

    // Check categories
    const categories = await client.fetch(`*[_type == "category"]{title}`)
    console.log('Available categories:', categories.map((c: any) => c.title).join(', '))
}

main()
