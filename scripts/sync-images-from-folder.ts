
import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { basename } from 'path'

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_TOKEN || process.env.NEXT_PUBLIC_SANITY_TOKEN

if (!projectId || !dataset || !token) {
    console.error('Missing Sanity configuration.')
    process.exit(1)
}

const client = createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    token, // We need write token
    useCdn: false,
})

const FOTOS_DIR = path.join(process.cwd(), 'fotos')

function normalize(str: string) {
    if (!str) return ""
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
}

async function uploadImage(filePath: string) {
    try {
        const fileStream = fs.createReadStream(filePath)
        const asset = await client.assets.upload('image', fileStream, {
            filename: basename(filePath)
        })
        return asset
    } catch (error) {
        console.error(`Error uploading ${filePath}:`, error)
        return null
    }
}

async function main() {
    if (!fs.existsSync(FOTOS_DIR)) {
        console.error(`Directory ${FOTOS_DIR} does not exist.`)
        process.exit(1)
    }

    // Fetch all products
    console.log('Fetching existing products...')
    const products = await client.fetch(`*[_type == "product"]{_id, name}`)
    console.log(`Found ${products.length} products.`)

    const folders = fs.readdirSync(FOTOS_DIR).filter(item => {
        return fs.statSync(path.join(FOTOS_DIR, item)).isDirectory()
    })

    console.log(`Found ${folders.length} product folders in 'fotos'.`)

    for (const folderName of folders) {
        const normalizedFolderName = normalize(folderName)

        // Find matching product
        const product = products.find((p: any) => normalize(p.name) === normalizedFolderName)

        if (!product) {
            console.warn(`No product found for folder: ${folderName}`)
            continue
        }

        console.log(`Processing folder: ${folderName} -> Product: ${product.name}`)

        const folderPath = path.join(FOTOS_DIR, folderName)
        const files = fs.readdirSync(folderPath).filter(file => {
            const ext = path.extname(file).toLowerCase()
            return ['.png', '.jpg', '.jpeg', '.webp'].includes(ext)
        })

        if (files.length === 0) {
            console.log(`No images found in ${folderName}, skipping.`)
            continue
        }

        const uploadedImages = []

        // Upload images
        for (const file of files) {
            console.log(`  Uploading ${file}...`)
            const asset = await uploadImage(path.join(folderPath, file))
            if (asset) {
                uploadedImages.push({
                    asset,
                    filename: file
                })
            }
        }

        if (uploadedImages.length === 0) continue

        // Sort images
        // Priority 1: Frontal
        // Priority 2: Contenido Neto (only if no Frontal is deemed 'main' by user logic, but user said: 
        // "if there is one with frontal, it goes first. if no frontal but content net, that is first")

        let sortedImages = [...uploadedImages]

        const frontalIndex = sortedImages.findIndex(img => img.filename.toLowerCase().includes('frontal'))

        if (frontalIndex > -1) {
            const [frontal] = sortedImages.splice(frontalIndex, 1)
            sortedImages.unshift(frontal)
        } else {
            // No frontal, check for contenido neto
            const contentIndex = sortedImages.findIndex(img => img.filename.toLowerCase().includes('contenido neto'))
            if (contentIndex > -1) {
                const [content] = sortedImages.splice(contentIndex, 1)
                sortedImages.unshift(content)
            }
        }

        // Prepare patch
        const imagesPatch = sortedImages.map(img => ({
            _key: Math.random().toString(36).substring(7),
            _type: 'image',
            asset: {
                _type: "reference",
                _ref: img.asset._id
            }
        }))

        // Update product (replace images)
        try {
            await client.patch(product._id).set({ images: imagesPatch }).commit()
            console.log(`  Updated product ${product.name} with ${imagesPatch.length} images.`)
        } catch (err) {
            console.error(`  Error updating product ${product.name}:`, err)
        }
    }
}

main()
