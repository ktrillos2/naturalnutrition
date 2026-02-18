
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

if (!token) {
    console.error('Missing SANITY_API_TOKEN.')
    process.exit(1)
}

const client = createClient({
    projectId,
    dataset,
    useCdn: false,
    apiVersion: '2024-01-01',
    token,
})

function normalize(str: string) {
    if (!str) return ""
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
}

async function main() {
    console.log('Fetching all products...')
    const products = await client.fetch(`*[_type == "product"]{_id, name, _createdAt}`)

    console.log(`Found ${products.length} products total. Checking for duplicates...`)

    const groups: { [key: string]: any[] } = {}

    for (const p of products) {
        const normName = normalize(p.name)
        if (!groups[normName]) {
            groups[normName] = []
        }
        groups[normName].push(p)
    }

    let duplicatesFound = 0
    let productsDeleted = 0

    for (const name in groups) {
        const group = groups[name]
        if (group.length > 1) {
            duplicatesFound++
            // Sort by createdAt ascending (oldest first)
            group.sort((a, b) => new Date(a._createdAt).getTime() - new Date(b._createdAt).getTime())

            const keep = group[0]
            const remove = group.slice(1)

            console.log(`Duplicate found for "${name}": ${group.length} items.`)
            console.log(`  Keeping: ${keep.name} (ID: ${keep._id}, Created: ${keep._createdAt})`)

            for (const p of remove) {
                console.log(`  Deleting: ${p.name} (ID: ${p._id}, Created: ${p._createdAt})`)
                await client.delete(p._id)
                productsDeleted++
            }
        }
    }

    console.log('--- Summary ---')
    console.log(`Duplicates groups found: ${duplicatesFound}`)
    console.log(`Products deleted: ${productsDeleted}`)
}

main()
