"use client"

import Link from "next/link"
import { ShoppingBagIcon, HeartIcon, EyeIcon } from "./icons"
import { useCart } from "@/components/cart-provider"
import { useFavorites } from "@/components/favorites-provider"
import { urlFor } from "@/sanity/lib/image"
import Image from "next/image"

interface Product {
  id: number | string
  name: string
  price: number
  originalPrice?: number
  image: any
  badge?: string
  slug?: string
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()
  const isFav = isFavorite(String(product.id))

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  const productLink = product.slug ? `/producto/${product.slug}` : `/producto/${product.id}`

  const handleAddToCart = () => {
    addItem({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.image,
      slug: product.slug || String(product.id)
    })
  }

  return (
    <div className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <Link href={productLink}>
          {typeof product.image === 'string' ? (
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <Image
              src={product.image ? urlFor(product.image).quality(80).auto('format').url() : "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}
        </Link>

        {/* Badge */}
        {discount && (
          <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-semibold px-2 py-1 rounded">
            -{discount}%
          </span>
        )}

        {/* Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.preventDefault()
              toggleFavorite({
                id: String(product.id),
                name: product.name,
                price: product.price,
                originalPrice: product.originalPrice,
                image: product.image,
                slug: product.slug || String(product.id)
              })
            }}
            className={`w-9 h-9 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors shadow-sm ${isFav
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-card/90 text-foreground hover:text-primary hover:bg-card"
              }`}
            aria-label={isFav ? "Eliminar de favoritos" : "Añadir a favoritos"}
          >
            <HeartIcon className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
          </button>
          <Link
            href={productLink}
            className="w-9 h-9 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center text-foreground hover:text-primary hover:bg-card transition-colors shadow-sm"
            aria-label="Ver detalles"
          >
            <EyeIcon className="w-4 h-4" />
          </Link>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-0 left-0 right-0 bg-primary text-primary-foreground py-3 flex items-center justify-center gap-2 text-sm font-medium translate-y-full group-hover:translate-y-0 transition-transform duration-300 cursor-pointer"
        >
          <ShoppingBagIcon className="w-4 h-4" />
          Añadir al Carrito
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <Link href={productLink}>
          <h3 className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary">${product.price.toLocaleString("es-CO")}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.originalPrice.toLocaleString("es-CO")}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
