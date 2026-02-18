
import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_TOKEN || process.env.NEXT_PUBLIC_SANITY_TOKEN

const client = createClient({
    projectId,
    dataset,
    useCdn: false,
    apiVersion: '2024-01-01',
    token,
})

async function main() {
    console.log('Fetching product slugs...')
    const products = await client.fetch(`*[_type == "product"]{name, slug}`)

    console.log(`Found ${products.length} products.`)
    products.forEach((p: any) => {
        console.log(`Name: ${p.name} -> Slug: ${p.slug?.current}`)
    })
}

main()
