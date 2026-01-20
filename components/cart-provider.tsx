"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type CartItem = {
    id: string
    name: string
    price: number
    quantity: number
    image: string
    slug: string
}

interface CartContextType {
    items: CartItem[]
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    addItem: (item: Omit<CartItem, "quantity">) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    cartCount: number
    cartTotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        const saved = localStorage.getItem("cart-storage")
        if (saved) {
            try {
                setItems(JSON.parse(saved))
            } catch (e) {
                console.error("Failed to parse cart storage", e)
            }
        }
    }, [])

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem("cart-storage", JSON.stringify(items))
        }
    }, [items, isMounted])

    const addItem = (newItem: Omit<CartItem, "quantity">) => {
        setItems((current) => {
            const existing = current.find((item) => item.id === newItem.id)
            if (existing) {
                return current.map((item) =>
                    item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
                )
            }
            return [...current, { ...newItem, quantity: 1 }]
        })
        setIsOpen(true)
    }

    const removeItem = (id: string) => {
        setItems((current) => current.filter((item) => item.id !== id))
    }

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) {
            removeItem(id)
            return
        }
        setItems((current) =>
            current.map((item) => (item.id === id ? { ...item, quantity } : item))
        )
    }

    const clearCart = () => setItems([])

    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)
    const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return (
        <CartContext.Provider
            value={{
                items,
                isOpen,
                setIsOpen,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                cartCount,
                cartTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}
