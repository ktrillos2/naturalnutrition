import { TopBar } from "@/components/top-bar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { ProductCard } from "@/components/product-card"
import { client } from "@/sanity/lib/client"
import { ProductClient } from "@/components/product-client"

async function getProduct(slug: string) {
  return await client.fetch(`*[_type == "product" && slug.current == $slug][0] {
    name,
    price,
    "originalPrice": originalPrice,
    "sku": coalesce(sku, "N/A"),
    "images": images[].asset->url,
    description,
    benefits,
    "details": coalesce(details, {}),
    "attributes": attributes,
    "modoDeUso": modoDeUso,
    "contraindicaciones": contraindicaciones,
    "beneficios": beneficios,
    "specifications": specifications,
    "tags": tags
  }`, { slug })
}

async function getRelatedProducts(currentId: string) {
  return await client.fetch(`*[_type == "product" && _id != $currentId][0...4] {
        "id": _id,
        name,
        "slug": slug.current,
        price,
        "originalPrice": originalPrice,
        "image": images[0].asset->url
    }`, { currentId })
}

async function getFeaturedProducts() {
  return await client.fetch(`*[_type == "product"][0...4] {
        "id": _id,
        name,
        "slug": slug.current,
        price,
        "originalPrice": originalPrice,
        "image": images[0].asset->url
    }`)
}

async function getGlobalConfig() {
  return await client.fetch(`*[_type == "globalConfig"][0]{ content }`)
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  // Await params if using newer Next.js patterns, or just destructure safely
  const resolvedParams = await Promise.resolve(params); // Graceful handling for both sync/async params
  const { slug } = resolvedParams;

  if (!slug) {
    return <div>Invalid Product URL</div>
  }

  // Fetch product first to get category
  const product = await getProduct(slug)

  // Fetch related products and global config
  const [relatedProducts, globalConfigWrapper] = await Promise.all([
    product ? getRelatedProducts(product._id || "") : [],
    getGlobalConfig()
  ])

  const globalConfig = globalConfigWrapper?.content

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopBar message={globalConfig?.topBarMessage} />
        <Header logo={globalConfig?.logo} />
        <main className="flex-1 py-12 text-center">
          <h1 className="text-2xl font-bold">Producto no encontrado</h1>
          <p className="text-muted-foreground mt-2">Lo sentimos, el producto que buscas no existe.</p>
          <a href="/tienda" className="inline-block mt-4 text-primary hover:underline">Volver a la tienda</a>
        </main>
        <Footer data={globalConfig} />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar message={globalConfig?.topBarMessage} />
      <Header logo={globalConfig?.logo} />
      <main className="flex-1 py-8 lg:py-12">
        <ProductClient product={product} featuredProducts={relatedProducts} />
      </main>
      <Footer data={globalConfig} />
      <WhatsAppButton />
    </div>
  )
}
