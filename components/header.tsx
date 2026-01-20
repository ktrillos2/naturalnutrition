"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { SearchIcon, UserIcon, ShoppingBagIcon, XIcon, Bars3Icon } from "./icons"
import { CartDrawer } from "./cart-drawer"
import { MobileMenu } from "./mobile-menu"
import { urlFor } from "@/sanity/lib/image"
import { useCart } from "@/components/cart-provider"
import { client } from "@/sanity/lib/client"

interface Product {
  _id: string
  name: string
  slug: string
  price: number
  image: string
}

interface HeaderProps {
  logo?: any
}

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/tienda", label: "Tienda" },
  { href: "/nosotros", "label": "Nosotros" },
  { href: "/contacto", label: "Contacto" },
]

export function Header({ logo }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  const { cartCount, isOpen: isCartOpen, setIsOpen: setIsCartOpen } = useCart()

  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await client.fetch(`*[_type == "product"]{
            _id,
            name,
            "slug": slug.current,
            price,
            "image": images[0].asset->url
        }`)
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products for search:", error)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filteredResults =
    searchQuery.length > 0
      ? products.filter((p) => {
        const terms = searchQuery.toLowerCase().trim().split(/\s+/)
        const productName = p.name.toLowerCase()
        return terms.every(term => productName.includes(term))
      })
      : []

  return (
    <>
      <header
        className={`sticky top-0 z-40 bg-background transition-shadow duration-300 ${isScrolled ? "shadow-md" : "shadow-sm"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-foreground hover:text-primary transition-colors"
              aria-label="Abrir menú"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center">
              {logo ? (
                <img
                  src={urlFor(logo).url()}
                  alt={logo.alt || "Natural Nutrition"}
                  className="h-10 sm:h-12 lg:h-14 w-auto object-contain"
                />
              ) : (
                <Image
                  src="/images/logo.png"
                  alt="Natural Nutrition"
                  width={180}
                  height={60}
                  className="h-10 sm:h-12 lg:h-14 w-auto"
                  priority
                />
              )}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Tools */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search */}
              <div ref={searchRef} className="relative">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 text-foreground hover:text-primary transition-colors"
                  aria-label="Buscar"
                >
                  {isSearchOpen ? <XIcon className="w-5 h-5" /> : <SearchIcon className="w-5 h-5" />}
                </button>

                {isSearchOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-background border border-border rounded-lg shadow-xl overflow-hidden">
                    <div className="p-3">
                      <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value)
                          setShowResults(true)
                        }}
                        className="w-full px-4 py-2.5 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        autoFocus
                      />
                    </div>

                    {showResults && filteredResults.length > 0 && (
                      <div className="border-t border-border max-h-64 overflow-y-auto">
                        {filteredResults.map((product) => (
                          <Link
                            key={product._id}
                            href={`/producto/${product.slug}`}
                            className="flex items-center gap-3 p-3 hover:bg-muted transition-colors"
                            onClick={() => {
                              setIsSearchOpen(false)
                              setSearchQuery("")
                            }}
                          >
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-md"
                            />
                            <div>
                              <p className="text-sm font-medium text-foreground">{product.name}</p>
                              <p className="text-sm text-accent font-semibold">
                                ${product.price.toLocaleString("es-CO")}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>


              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2 text-foreground hover:text-primary transition-colors relative"
                aria-label="Carrito de compras"
              >
                <ShoppingBagIcon className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-accent-foreground text-[10px] font-semibold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} links={navLinks} />
    </>
  )
}
