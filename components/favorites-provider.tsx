"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type FavoriteItem = {
    id: string
    name: string
    price: number
    originalPrice?: number
    image: string
    slug: string
}

interface FavoritesContextType {
    favorites: FavoriteItem[]
    addFavorite: (item: FavoriteItem) => void
    removeFavorite: (id: string) => void
    isFavorite: (id: string) => boolean
    toggleFavorite: (item: FavoriteItem) => void
    favoritesCount: number
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
    const [favorites, setFavorites] = useState<FavoriteItem[]>([])
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        const saved = localStorage.getItem("favorites-storage")
        if (saved) {
            try {
                setFavorites(JSON.parse(saved))
            } catch (e) {
                console.error("Failed to parse favorites storage", e)
            }
        }
    }, [])

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem("favorites-storage", JSON.stringify(favorites))
        }
    }, [favorites, isMounted])

    const addFavorite = (newItem: FavoriteItem) => {
        setFavorites((current) => {
            const existing = current.find((item) => item.id === newItem.id)
            if (existing) return current
            return [...current, newItem]
        })
    }

    const removeFavorite = (id: string) => {
        setFavorites((current) => current.filter((item) => item.id !== id))
    }

    const isFavorite = (id: string) => {
        return favorites.some((item) => item.id === id)
    }

    const toggleFavorite = (item: FavoriteItem) => {
        if (isFavorite(item.id)) {
            removeFavorite(item.id)
        } else {
            addFavorite(item)
        }
    }

    const favoritesCount = favorites.length

    return (
        <FavoritesContext.Provider
            value={{
                favorites,
                addFavorite,
                removeFavorite,
                isFavorite,
                toggleFavorite,
                favoritesCount,
            }}
        >
            {children}
        </FavoritesContext.Provider>
    )
}

export function useFavorites() {
    const context = useContext(FavoritesContext)
    if (context === undefined) {
        throw new Error("useFavorites must be used within a FavoritesProvider")
    }
    return context
}
