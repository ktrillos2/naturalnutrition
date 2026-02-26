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
import { urlFor } from "@/sanity/lib/image"
import Image from "next/image"

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
        if (!product || outOfStock) return

        for (let i = 0; i < quantity; i++) {
            addItem({
                id: product.sku || product._id || product.name,
                name: product.name,
                price: product.price,
                image: product.images?.[0] ? urlFor(product.images[0]).quality(80).auto('format').url() : "/placeholder.svg",
                slug: product.slug
            })
        }
    }

    const outOfStock = product.stock !== undefined && product.stock !== null && product.stock <= 0

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : null

    // Ensure arrays exist
    const images = product.images || []
    const benefits = product.benefits || []
    const attributes = product.attributes || []
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
                    <div className="aspect-square rounded-xl overflow-hidden bg-secondary relative">
                        <Image
                            src={images[selectedImage] ? urlFor(images[selectedImage]).quality(90).auto('format').url() : "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    {images.length > 1 && (
                        <div className="flex flex-wrap gap-2">
                            {images.map((image: string, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors relative ${selectedImage === index ? "border-primary" : "border-transparent hover:border-border"
                                        }`}
                                >
                                    <Image
                                        src={image ? urlFor(image).quality(60).auto('format').url() : "/placeholder.svg"}
                                        alt=""
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div>
                    <div className="flex flex-col gap-2 mb-4">
                        <p className="text-sm text-accent font-medium uppercase tracking-wide">{product.category}</p>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">{product.name}</h1>

                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                        <span className={`text-3xl font-bold ${outOfStock ? 'text-muted-foreground' : 'text-primary'}`}>
                            ${product.price?.toLocaleString("es-CO")}
                        </span>
                        {product.originalPrice && (
                            <>
                                <span className="text-lg text-muted-foreground line-through">
                                    ${product.originalPrice.toLocaleString("es-CO")}
                                </span>
                                {!outOfStock && discount && (
                                    <span className="bg-accent text-accent-foreground text-sm font-semibold px-2 py-0.5 rounded">
                                        -{discount}%
                                    </span>
                                )}
                            </>
                        )}
                        {outOfStock && (
                            <span className="bg-gray-700 text-white text-sm font-semibold px-3 py-0.5 rounded-full">
                                Agotado
                            </span>
                        )}
                    </div>
                    {outOfStock && (
                        <p className="text-sm text-destructive font-medium mb-4">
                            Este producto no tiene stock disponible en este momento.
                        </p>
                    )}



                    {/* Quantity & Add to Cart */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className={`flex items-center border rounded-lg ${outOfStock ? 'border-border opacity-40 pointer-events-none' : 'border-border'}`}>
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                disabled={outOfStock}
                                className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors disabled:cursor-not-allowed"
                                aria-label="Reducir cantidad"
                            >
                                <MinusIcon className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-medium">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                disabled={outOfStock}
                                className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors disabled:cursor-not-allowed"
                                aria-label="Aumentar cantidad"
                            >
                                <PlusIcon className="w-4 h-4" />
                            </button>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            disabled={outOfStock}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 font-medium rounded-lg transition-colors ${outOfStock
                                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                                : 'bg-primary text-primary-foreground hover:bg-primary/90'
                                }`}
                        >
                            <ShoppingBagIcon className="w-5 h-5" />
                            {outOfStock ? 'Producto Agotado' : 'Añadir al Carrito'}
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
