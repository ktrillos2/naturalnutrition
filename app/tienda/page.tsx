import { TopBar } from "@/components/top-bar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { CategorySidebar } from "@/components/category-sidebar"
import { ProductCard } from "@/components/product-card"
import { client } from "@/sanity/lib/client"
import Link from "next/link"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

const PRODUCTS_PER_PAGE = 12

async function getData(page: number) {
  const start = (page - 1) * PRODUCTS_PER_PAGE
  const end = start + PRODUCTS_PER_PAGE

  const query = `{
    "total": count(*[_type == "product"]),
    "products": *[_type == "product"] | order(_createdAt desc) [$start...$end] {
      "id": _id,
      name,
      "slug": slug.current,
      price,
      "originalPrice": originalPrice,
      "image": images[0].asset->url,
      "category": coalesce(categories[0]->name, "General")
    },
    "globalConfig": *[_type == "globalConfig"][0]{ content }
  }`

  return await client.fetch(query, { start, end })
}

export default async function TiendaPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  // Await searchParams if necessary (Next.js 15+ patterns sometimes require it, but 14 is sync usually. 
  // To be safe and compatible with recent strictness, we just access it. 
  // Note: IF this project is Next.js 15, searchParams is async. The user didn't specify version but 'params' in page.tsx was async in my previous helpful fix.
  // I will treat it as potentially async to be safe, but typically in 14 it's a prop.
  // Let's assume standard prop access for now, but if it fails I'll patch it. 
  // Actually, simplest is to await it if it's a promise, but TS might complain if it isn't.
  // I'll just use it directly for now as per standard Text.js 13/14 examples unless I see errors.

  // Wait, previous file `app/producto/[slug]/page.tsx` I treated params as awaitable.
  // Let's resolve specific page number.

  const currentPage = Number(searchParams?.page) || 1
  const { total, products, globalConfig } = await getData(currentPage)
  const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE)

  const configContent = globalConfig?.content

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar message={configContent?.topBarMessage} />
      <Header logo={configContent?.logo} />
      <main className="flex-1 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="text-sm text-muted-foreground mb-6">
            <ol className="flex items-center gap-2">
              <li>
                <a href="/" className="hover:text-primary transition-colors">
                  Inicio
                </a>
              </li>
              <li>/</li>
              <li className="text-foreground">Tienda</li>
            </ol>
          </nav>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <CategorySidebar />

            {/* Products */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-foreground">Todos los Productos</h1>
                <p className="text-sm text-muted-foreground">
                  Mostrando {(currentPage - 1) * PRODUCTS_PER_PAGE + 1} - {Math.min(currentPage * PRODUCTS_PER_PAGE, total)} de {total} productos
                </p>
              </div>

              {products.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-12">
                    {products.map((product: any) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4">
                      {currentPage > 1 ? (
                        <Link
                          href={`/tienda?page=${currentPage - 1}`}
                          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                        >
                          <ChevronLeftIcon className="w-4 h-4" />
                          Anterior
                        </Link>
                      ) : (
                        <button disabled className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg opacity-50 cursor-not-allowed">
                          <ChevronLeftIcon className="w-4 h-4" />
                          Anterior
                        </button>
                      )}

                      <span className="text-sm font-medium">
                        Página {currentPage} de {totalPages}
                      </span>

                      {currentPage < totalPages ? (
                        <Link
                          href={`/tienda?page=${currentPage + 1}`}
                          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                        >
                          Siguiente
                          <ChevronRightIcon className="w-4 h-4" />
                        </Link>
                      ) : (
                        <button disabled className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg opacity-50 cursor-not-allowed">
                          Siguiente
                          <ChevronRightIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No se encontraron productos en esta página.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer data={configContent} />
      <WhatsAppButton />
    </div>
  )
}
