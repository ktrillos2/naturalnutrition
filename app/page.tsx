import { TopBar } from "@/components/top-bar"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { BenefitsSection } from "@/components/benefits-section"
import { FeaturedProducts } from "@/components/featured-products"
import { HistorySection } from "@/components/history-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ProductBenefitsSection } from "@/components/product-benefits-section"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { client } from "@/sanity/lib/client"

async function getData() {
  const hero = await client.fetch(`*[_type == "hero"][0]{ content, "benefits": content.benefits }`)
  const history = await client.fetch(`*[_type == "history"][0]{ content }`)
  const featured = await client.fetch(`
    *[_type == "featured"][0]{
      title,
      subtitle,
      products[]->{
        _id,
        name,
        slug,
        price,
        "image": images[0].asset->url,
        "category": categories[0]->title
      }
    }
  `)
  const testimonials = await client.fetch(`*[_type == "testimonials"][0]{ content }`)
  const productBenefits = await client.fetch(`*[_type == "productBenefits"][0]`)
  const globalConfig = await client.fetch(`*[_type == "globalConfig"][0]{ content }`)
  return { hero: hero?.content, history: history?.content, featured, testimonials, productBenefits, globalConfig: globalConfig?.content }
}

export default async function HomePage() {
  const { hero, history, featured, testimonials, productBenefits, globalConfig } = await getData()

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar message={globalConfig?.topBarMessage} />
      <Header logo={globalConfig?.logo} />
      <main className="flex-1">
        <HeroSection data={hero} />
        <BenefitsSection data={hero?.benefits} />
        <HistorySection data={history} />
        <FeaturedProducts data={featured} />
        <TestimonialsSection data={testimonials} />
        <ProductBenefitsSection data={productBenefits} />
      </main>
      <Footer data={globalConfig?.content} />
      <WhatsAppButton />
    </div>
  )
}
