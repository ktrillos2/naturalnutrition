
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

async function main() {
    console.log('Fetching products with images...')
    // We need to expand asset to see originalFilename
    const products = await client.fetch(`*[_type == "product" && defined(images)]{
        _id, 
        name, 
        images[]{
            ...,
            asset->{
                _id,
                originalFilename
            }
        }
    }`)

    console.log(`Found ${products.length} products with images. checking for 'frontal'...`)

    let updatedCount = 0

    for (const p of products) {
        if (!p.images || p.images.length <= 1) continue

        let targetIndex = -1
        let matchType = ""

        // 1. Check for 'frontal'
        for (let i = 0; i < p.images.length; i++) {
            const filename = (p.images[i].asset?.originalFilename || "").toLowerCase()
            if (filename.includes('frontal')) {
                targetIndex = i
                matchType = "frontal"
                break
            }
        }

        // 2. If no frontal, check for 'contenido neto'
        if (targetIndex === -1) {
            for (let i = 0; i < p.images.length; i++) {
                const filename = (p.images[i].asset?.originalFilename || "").toLowerCase()
                if (filename.includes('contenido neto')) {
                    targetIndex = i
                    matchType = "contenido neto"
                    break
                }
            }
        }

        if (targetIndex > 0) {
            console.log(`Updating ${p.name}: moving '${matchType}' image '${p.images[targetIndex].asset.originalFilename}' to position 0`)

            const newImages = [...p.images]
            const [targetImage] = newImages.splice(targetIndex, 1)
            newImages.unshift(targetImage)

            const sanitizedImages = newImages.map((img: any) => ({
                _key: img._key,
                _type: 'image',
                asset: {
                    _type: "reference",
                    _ref: img.asset._id
                },
                crop: img.crop,
                hotspot: img.hotspot
            }))

            await client.patch(p._id).set({ images: sanitizedImages }).commit()
            updatedCount++
        } else if (targetIndex === 0) {
            // Already first
            // console.log(`Skipping ${p.name}: ${matchType} image is already first`)
        }
    }

    console.log(`--- Summary ---`)
    console.log(`Products updated: ${updatedCount}`)
}

main()
