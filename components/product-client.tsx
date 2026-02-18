"use client"

import { useState } from "react"
import {
    ShoppingBagIcon,
    HeartIcon,
    MinusIcon,
    PlusIcon,
    ChevronDownIcon,
    TruckIcon,
    ShieldCheckIcon,
    CheckIcon,
} from "@/components/icons"
import { ProductCard } from "@/components/product-card"
import { useCart } from "@/components/cart-provider"
import { useFavorites } from "@/components/favorites-provider"
import { PortableText } from "@portabletext/react"

export function ProductClient({ product, featuredProducts }: { product: any; featuredProducts: any[] }) {
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [openSection, setOpenSection] = useState<string | null>("description")
    const { addItem } = useCart()
    const { toggleFavorite, isFavorite } = useFavorites()
    const isFav = isFavorite(product.sku || product._id || product.name)

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section)
    }

    const handleAddToCart = () => {
        if (!product) return

        // Add item multiple times based on quantity
        // Simple implementation: loop. Better implementation: update context to support adding quantity.
        // My context addItem adds 1 if exists, or creates new.
        // I should update context or just loop here.
        // Context `addItem` logic: "if existing... quantity + 1"
        // Let's modify context to accept quantity or just call it N times.
        // Or better, checking context implementation...
        // Context: `return [...current, { ...newItem, quantity: 1 }]` or `quantity: item.quantity + 1`
        // It increments by 1. I should probably update `addItem` to take quantity, but for now I will loop or call updateQuantity after adding.
        // Actually, let's just make it simple for the user and call addItem `quantity` times or modify context. 
        // Modifying context is cleaner but I can't do it in this turn easily without context switch.
        // I will just add it once and then update quantity if possible, or loop.
        // Actually, let's just loop for now, it's safe enough for small quantities.

        // wait, I can just use a helper.
        // Let's try to add it once, then immediately update quantity if it was a new item.
        // But `addItem` doesn't return ID or reference easily.
        // Okay, I'll update `components/cart-provider.tsx` in a future step if needed, but for now I'll just call addItem 'quantity' times.

        for (let i = 0; i < quantity; i++) {
            addItem({
                id: product.sku || product._id || product.name, // Use SKU or ID
                name: product.name,
                price: product.price,
                image: product.images?.[0] || "/placeholder.svg", // Use first image
                slug: product.slug
            })
        }
    }

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : null

    // Ensure arrays exist
    const images = product.images || []
    const benefits = product.benefits || []
    const attributes = product.attributes || []
    const tags = product.tags || []
    const specifications = product.specifications || {}

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* Breadcrumb ... (unchanged) */}
            <nav className="text-sm text-muted-foreground mb-6">
                <ol className="flex items-center gap-2">
                    <li>
                        <a href="/" className="hover:text-primary transition-colors">
                            Inicio
                        </a>
                    </li>
                    <li>/</li>
                    <li>
                        <a href="/tienda" className="hover:text-primary transition-colors">
                            Tienda
                        </a>
                    </li>
                    <li>/</li>
                    <li className="text-foreground">{product.name}</li>
                </ol>
            </nav>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Gallery */}
                <div className="space-y-4 lg:sticky lg:top-24 h-fit">
                    <div className="aspect-square rounded-xl overflow-hidden bg-secondary">
                        <img
                            src={images[selectedImage] || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {images.length > 1 && (
                        <div className="flex flex-wrap gap-2">
                            {images.map((image: string, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index ? "border-primary" : "border-transparent hover:border-border"
                                        }`}
                                >
                                    <img src={image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div>
                    <div className="flex flex-col gap-2 mb-4">
                        <p className="text-sm text-accent font-medium uppercase tracking-wide">{product.category}</p>
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag: string, index: number) => (
                                    <span key={index} className="px-2.5 py-0.5 bg-muted rounded-full text-xs font-medium text-muted-foreground">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">{product.name}</h1>

                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl font-bold text-primary">${product.price?.toLocaleString("es-CO")}</span>
                        {product.originalPrice && (
                            <>
                                <span className="text-lg text-muted-foreground line-through">
                                    ${product.originalPrice.toLocaleString("es-CO")}
                                </span>
                                <span className="bg-accent text-accent-foreground text-sm font-semibold px-2 py-0.5 rounded">
                                    -{discount}%
                                </span>
                            </>
                        )}
                    </div>



                    {/* Quantity & Add to Cart */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center border border-border rounded-lg">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
                            >
                                <MinusIcon className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-medium">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
                            >
                                <PlusIcon className="w-4 h-4" />
                            </button>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            <ShoppingBagIcon className="w-5 h-5" />
                            Añadir al Carrito
                        </button>
                        <button
                            onClick={() => toggleFavorite({
                                id: product.sku || product._id || product.name,
                                name: product.name,
                                price: product.price,
                                originalPrice: product.originalPrice,
                                image: product.images?.[0] || "/placeholder.svg",
                                slug: product.slug
                            })}
                            className={`w-12 h-12 flex items-center justify-center border rounded-lg transition-colors ${isFav
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-border hover:bg-muted hover:border-accent"}`}
                            aria-label={isFav ? "Eliminar de favoritos" : "Añadir a favoritos"}
                        >
                            <HeartIcon className={`w-5 h-5 ${isFav ? "fill-current" : ""}`} />
                        </button>
                    </div>

                    {/* Trust badges (unchanged) */}
                    <div className="flex items-center gap-6 pb-6 border-b border-border mb-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <TruckIcon className="w-5 h-5 text-accent" />
                            <span>Envío nacional</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <ShieldCheckIcon className="w-5 h-5 text-accent" />
                            <span>INVIMA</span>
                        </div>
                    </div>

                    {/* Accordion (unchanged) */}
                    <div className="space-y-2">
                        {/* Description */}
                        <div className="border border-border rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleSection("description")}
                                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/50 transition-colors"
                            >
                                <span className="font-medium text-foreground">Descripción</span>
                                <ChevronDownIcon
                                    className={`w-5 h-5 text-muted-foreground transition-transform ${openSection === "description" ? "rotate-180" : ""}`}
                                />
                            </button>
                            {openSection === "description" && (
                                <div className="px-4 pb-4">
                                    <div className="text-sm text-muted-foreground leading-relaxed mb-4">
                                        {Array.isArray(product.description) ? (
                                            <PortableText value={product.description} />
                                        ) : (
                                            <p>{product.description}</p>
                                        )}
                                    </div>
                                    {product.beneficios && (
                                        <div className="mb-4">
                                            <h4 className="text-sm font-medium text-foreground mb-2">Más Beneficios:</h4>
                                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{product.beneficios}</p>
                                        </div>
                                    )}
                                    {benefits.length > 0 && (
                                        <>
                                            <h4 className="text-sm font-medium text-foreground mb-2">Puntos Clave:</h4>
                                            <ul className="space-y-1.5">
                                                {benefits.map((benefit: string, index: number) => (
                                                    <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <CheckIcon className="w-4 h-4 text-accent shrink-0" />
                                                        {benefit}
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Technical Details */}
                        <div className="border border-border rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleSection("details")}
                                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/50 transition-colors"
                            >
                                <span className="font-medium text-foreground">Detalles Técnicos</span>
                                <ChevronDownIcon
                                    className={`w-5 h-5 text-muted-foreground transition-transform ${openSection === "details" ? "rotate-180" : ""}`}
                                />
                            </button>
                            {openSection === "details" && (
                                <div className="px-4 pb-4">
                                    <table className="w-full text-sm">
                                        <tbody className="divide-y divide-border">
                                            {specifications.width && (
                                                <tr>
                                                    <td className="py-2.5 text-muted-foreground">Ancho</td>
                                                    <td className="py-2.5 text-foreground text-right">{specifications.width}</td>
                                                </tr>
                                            )}
                                            {specifications.height && (
                                                <tr>
                                                    <td className="py-2.5 text-muted-foreground">Alto</td>
                                                    <td className="py-2.5 text-foreground text-right">{specifications.height}</td>
                                                </tr>
                                            )}
                                            {specifications.depth && (
                                                <tr>
                                                    <td className="py-2.5 text-muted-foreground">Profundidad</td>
                                                    <td className="py-2.5 text-foreground text-right">{specifications.depth}</td>
                                                </tr>
                                            )}
                                            {product.registroInvima && (
                                                <tr>
                                                    <td className="py-2.5 text-muted-foreground">Registro INVIMA</td>
                                                    <td className="py-2.5 text-foreground text-right">{product.registroInvima}</td>
                                                </tr>
                                            )}
                                            {attributes.map((attr: any, idx: number) => (
                                                <tr key={idx}>
                                                    <td className="py-2.5 text-muted-foreground">{attr.name}</td>
                                                    <td className="py-2.5 text-foreground text-right">{attr.value}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Usage */}
                        <div className="border border-border rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleSection("usage")}
                                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/50 transition-colors"
                            >
                                <span className="font-medium text-foreground">Modo de Uso</span>
                                <ChevronDownIcon
                                    className={`w-5 h-5 text-muted-foreground transition-transform ${openSection === "usage" ? "rotate-180" : ""}`}
                                />
                            </button>
                            {openSection === "usage" && (
                                <div className="px-4 pb-4">
                                    <div className="text-sm text-muted-foreground leading-relaxed mb-4">
                                        {product.modoDeUso ? (
                                            Array.isArray(product.modoDeUso) ? <PortableText value={product.modoDeUso} /> : <p>{product.modoDeUso}</p>
                                        ) : (
                                            <p>Consulte el empaque para instrucciones detalladas.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Contraindicaciones */}
                        <div className="border border-border rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleSection("contraindicaciones")}
                                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/50 transition-colors"
                            >
                                <span className="font-medium text-foreground">Contraindicaciones</span>
                                <ChevronDownIcon
                                    className={`w-5 h-5 text-muted-foreground transition-transform ${openSection === "contraindicaciones" ? "rotate-180" : ""}`}
                                />
                            </button>
                            {openSection === "contraindicaciones" && (
                                <div className="px-4 pb-4">
                                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                                        {product.contraindicaciones || "No se han especificado contraindicaciones. En caso de duda, consulte a su médico."}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <section className="mt-16 pt-12 border-t border-border">
                <div className="text-center mb-10">
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Productos Relacionados</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        También te pueden interesar estos productos
                    </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    {featuredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>
        </div>
    )
}
