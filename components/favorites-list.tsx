"use client"

import { useFavorites } from "@/components/favorites-provider"
import { ProductCard } from "@/components/product-card"
import Link from "next/link"

export function FavoritesList() {
    const { favorites } = useFavorites()

    if (favorites.length === 0) {
        return (
            <div className="text-center py-16">
                <h2 className="text-2xl font-bold mb-4">No tienes favoritos aún</h2>
                <p className="text-muted-foreground mb-8">
                    Explora nuestra tienda y guarda los productos que más te gusten.
                </p>
                <Link
                    href="/tienda"
                    className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                    Ir a la Tienda
                </Link>
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-foreground">Mis Favoritos</h1>
                <p className="text-muted-foreground">
                    {favorites.length} producto{favorites.length !== 1 ? "s" : ""}
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {favorites.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    )
}
