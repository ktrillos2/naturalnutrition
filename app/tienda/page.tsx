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

export const dynamic = "force-dynamic"

export default async function TiendaPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const params = await Promise.resolve(searchParams) // Handle potentially async params
  const currentPage = Number(params?.page) || 1
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
                    <div className="flex justify-center items-center gap-2">
                      {/* Prev Button */}
                      {currentPage > 1 ? (
                        <Link
                          href={`/tienda?page=${currentPage - 1}`}
                          className="flex items-center justify-center w-10 h-10 border border-border rounded-lg hover:bg-muted transition-colors"
                          aria-label="Página anterior"
                        >
                          <ChevronLeftIcon className="w-4 h-4" />
                        </Link>
                      ) : (
                        <span className="flex items-center justify-center w-10 h-10 border border-border rounded-lg opacity-50 cursor-not-allowed">
                          <ChevronLeftIcon className="w-4 h-4" />
                        </span>
                      )}

                      {/* Page Numbers */}
                      {(() => {
                        const pages = [];
                        const maxVisiblePages = 5;

                        if (totalPages <= maxVisiblePages) {
                          // Show all pages if total is small
                          for (let i = 1; i <= totalPages; i++) {
                            pages.push(i);
                          }
                        } else {
                          // More pages than we want to show, handle truncation
                          if (currentPage <= 3) {
                            // Close to beginning: 1, 2, 3, ..., N
                            pages.push(1, 2, 3, '...', totalPages);
                          } else if (currentPage >= totalPages - 2) {
                            // Close to end: 1, ..., N-2, N-1, N
                            pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
                          } else {
                            // Middle: 1, ..., C-1, C, C+1, ..., N
                            pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
                          }
                        }

                        return pages.map((page, index) => (
                          typeof page === 'number' ? (
                            <Link
                              key={index}
                              href={`/tienda?page=${page}`}
                              className={`flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                ? "bg-primary text-primary-foreground"
                                : "border border-border hover:bg-muted"
                                }`}
                            >
                              {page}
                            </Link>
                          ) : (
                            <span key={index} className="flex items-center justify-center w-10 h-10 text-muted-foreground">
                              ...
                            </span>
                          )
                        ));
                      })()}

                      {/* Next Button */}
                      {currentPage < totalPages ? (
                        <Link
                          href={`/tienda?page=${currentPage + 1}`}
                          className="flex items-center justify-center w-10 h-10 border border-border rounded-lg hover:bg-muted transition-colors"
                          aria-label="Página siguiente"
                        >
                          <ChevronRightIcon className="w-4 h-4" />
                        </Link>
                      ) : (
                        <span className="flex items-center justify-center w-10 h-10 border border-border rounded-lg opacity-50 cursor-not-allowed">
                          <ChevronRightIcon className="w-4 h-4" />
                        </span>
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
