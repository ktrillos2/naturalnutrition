"use client"

import { useEffect, useRef, useState } from "react"

interface DistributorBenefit {
    title: string
    description: string
}

interface DistributorProps {
    data?: {
        badgeText?: string
        headingLine1?: string
        headingAccent?: string
        description?: string
        ctaLabel?: string
        ctaLink?: string
        benefits?: DistributorBenefit[]
    }
}

/** Sección de distribuidores / aliados — estilo dark premium con accordion */
export function DistributorSection({ data }: DistributorProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [openIndex, setOpenIndex] = useState(0)
    const sectionRef = useRef<HTMLElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.15 }
        )
        if (sectionRef.current) observer.observe(sectionRef.current)
        return () => observer.disconnect()
    }, [])

    /** Fallback benefits if Sanity data is not available */
    const benefits: DistributorBenefit[] = data?.benefits?.length ? data.benefits : [
        {
            title: "Márgenes Competitivos",
            description: "Garantizamos una estructura de costos sólida y diseñada en un mercado creciente para maximizar tu rentabilidad mes a mes. Sin letra pequeña."
        },
        {
            title: "Catálogo Exclusivo",
            description: "Acceso a nuestro catálogo completo de productos americanos 100% naturales con disponibilidad garantizada y actualizaciones constantes."
        },
        {
            title: "Acompañamiento",
            description: "Capacitación personalizada, material de marketing profesional y soporte dedicado para impulsar tu negocio desde el día uno."
        },
        {
            title: "Escalabilidad",
            description: "Un mercado en expansión con consumidores cada vez más conscientes de su salud. Crece con nosotros sin límites."
        }
    ]

    const badgeText = data?.badgeText || '🤝 Partners Program'
    const headingLine1 = data?.headingLine1 || 'Crecimiento'
    const headingAccent = data?.headingAccent || 'asegurado.'
    const description = data?.description || 'Únete a nuestra red de distribución. Accede a productos americanos de alta rotación y un mercado global en expansión.'
    const ctaLabel = data?.ctaLabel || 'Iniciar solicitud'
    const ctaLink = data?.ctaLink || 'https://wa.me/573502138686?text=Hola%2C%20quiero%20ser%20distribuidor%20de%20Natural%20Nutrici%C3%B3n'

    return (
        <section
            ref={sectionRef}
            id="distribuidores"
            className="relative overflow-hidden py-20 lg:py-28 bg-primary"
        >
            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 pointer-events-none opacity-15"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }}
                aria-hidden="true"
            />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                    {/* Lado izquierdo — Heading + CTA */}
                    <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
                        {/* Badge */}
                        <span
                            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest mb-8 transition-all duration-500 delay-100 ${isVisible ? "opacity-100" : "opacity-0"}`}
                            style={{ background: '#6CAEbb', color: 'white' }}
                        >
                            {badgeText}
                        </span>

                        {/* Heading */}
                        <h2
                            className={`text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] mb-6 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
                            style={{ color: 'white' }}
                        >
                            {headingLine1}{" "}
                            <span
                                className="block"
                                style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontStyle: "italic", color: '#6CAEbb' }}
                            >
                                {headingAccent}
                            </span>
                        </h2>

                        {/* Descripción */}
                        <p
                            className={`text-sm sm:text-base leading-relaxed mb-10 max-w-sm transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
                            style={{ color: 'rgba(255,255,255,0.55)' }}
                        >
                            {description}
                        </p>

                        {/* CTA */}
                        <a
                            href={ctaLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-3 px-7 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider hover:scale-105 transition-all duration-300 group ${isVisible ? "opacity-100" : "opacity-0"}`}
                            style={{
                                background: 'transparent',
                                color: 'white',
                                border: '2px solid rgba(255,255,255,0.3)',
                            }}
                        >
                            {ctaLabel}
                            <span
                                className="w-8 h-8 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform"
                                style={{ background: '#6CAEbb', color: 'white' }}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                                </svg>
                            </span>
                        </a>
                    </div>

                    {/* Lado derecho — Accordion de beneficios */}
                    <div
                        className={`transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
                    >
                        {benefits.map((benefit, idx) => {
                            const isOpen = openIndex === idx
                            const number = String(idx + 1).padStart(2, '0')
                            return (
                                <div
                                    key={idx}
                                    className="border-b transition-all duration-300"
                                    style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                                >
                                    <button
                                        onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                                        className="w-full flex items-center gap-4 sm:gap-6 py-6 text-left group cursor-pointer"
                                        aria-expanded={isOpen}
                                    >
                                        {/* Number */}
                                        <span
                                            className="text-sm font-bold shrink-0"
                                            style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontStyle: "italic", color: '#6CAEbb' }}
                                        >
                                            {number}
                                        </span>

                                        {/* Title */}
                                        <span
                                            className="flex-1 text-lg sm:text-xl font-bold transition-colors"
                                            style={{ color: isOpen ? 'white' : 'rgba(255,255,255,0.7)' }}
                                        >
                                            {benefit.title}
                                        </span>

                                        {/* Toggle icon */}
                                        <span
                                            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-lg font-bold transition-all duration-300"
                                            style={{
                                                background: isOpen ? '#6CAEbb' : 'transparent',
                                                color: isOpen ? 'white' : 'rgba(255,255,255,0.5)',
                                                border: isOpen ? 'none' : '1px solid rgba(255,255,255,0.2)'
                                            }}
                                        >
                                            {isOpen ? "×" : "+"}
                                        </span>
                                    </button>

                                    {/* Expandable content */}
                                    <div
                                        className="overflow-hidden transition-all duration-400 ease-in-out"
                                        style={{
                                            maxHeight: isOpen ? '200px' : '0',
                                            opacity: isOpen ? 1 : 0,
                                        }}
                                    >
                                        <p
                                            className="pb-6 pl-10 sm:pl-14 pr-12 text-sm leading-relaxed"
                                            style={{ color: 'rgba(255,255,255,0.5)' }}
                                        >
                                            {benefit.description}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}
