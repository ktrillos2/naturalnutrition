"use client"

import Link from "next/link"
import { ChevronRightIcon, ShieldCheckIcon, TruckIcon, LeafIcon } from "./icons"
import { useEffect, useState } from "react"
import { PortableText } from "next-sanity"
import { urlFor } from "@/sanity/lib/image"
import Image from "next/image"

interface HeroProps {
  data?: {
    badge: string
    title: any[]
    description: string
    primaryCta: { label: string; link: string }
    secondaryCta: { label: string; link: string }
    floatingCard: { text: string; value: string }
    trustBadges: { icon: string; text: string }[]
    image?: any
  }
}

const iconMap: Record<string, any> = {
  ShieldCheckIcon,
  TruckIcon,
  LeafIcon
}

export function HeroSection({ data }: HeroProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (!data) return null;

  /** Marquee keywords for the scrolling bar */
  const marqueeItems = [
    { icon: "🇺🇸", text: "PRODUCTOS AMERICANOS" },
    { icon: "🌿", text: "100% NATURAL" },
    { icon: "✦", text: "INGREDIENTES LIMPIOS" },
    { icon: "⚡", text: "MÁXIMA ENERGÍA" },
    { icon: "💪", text: "POTENCIA NATURAL" },
    { icon: "✨", text: "RECUPERACIÓN RÁPIDA" },
    { icon: "🛡️", text: "REGISTRO INVIMA" },
    { icon: "🚚", text: "ENVÍO NACIONAL" },
  ]

  return (
    <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f0faf5 0%, #e8f5ee 40%, #f5f9f7 100%)' }}>
      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-8 lg:pt-20 lg:pb-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Contenido textual */}
          <div
            className={`order-2 lg:order-1 transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
          >
            {/* Badge superior */}
            <span
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-8 transition-all duration-500 delay-100 ${isVisible ? "opacity-100" : "opacity-0"}`}
              style={{ background: '#e0f2e9', color: '#166534', border: '1px solid #bbf7d0' }}
            >
              <span className="text-base" role="img" aria-label="Bandera de Estados Unidos">🇺🇸</span>
              Productos Americanos 
            </span>

            {/* Título con tipografía mixta */}
            <div
              className={`mb-6 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-[1.05]">
                Tu bienestar{" "}
                <span
                  className="block"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontStyle: "italic", color: '#166534' }}
                >
                  100% natural
                </span>
                <span className="block">en tu cuerpo.</span>
              </h1>
            </div>

            {/* Descripción */}
            <p
              className={`text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-md transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
            >
              {data.description}
            </p>

            {/* CTA + Social Proof */}
            <div
              className={`flex flex-wrap items-center gap-6 mb-6 transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
            >
              <Link
                href={data.primaryCta?.link || '/tienda'}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 font-semibold rounded-full hover:scale-105 transition-all duration-300 group shadow-lg"
                style={{ background: '#00008B', color: 'white' }}
              >
                {data.primaryCta?.label || 'Explorar Línea'}
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </Link>


            </div>

          </div>

          {/* Imagen con elementos decorativos */}
          <div
            className={`order-1 lg:order-2 relative transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
          >
            <div className="relative">
              {/* Card contenedora de imagen */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl bg-white" style={{ border: '1px solid #e5e7eb' }}>
                {data.image ? (
                  <Image
                    src={urlFor(data.image).quality(100).auto('format').url()}
                    alt={data.title?.[0]?.children?.[0]?.text || "Productos naturales americanos - Natural Nutrición"}
                    width={800}
                    height={800}
                    className="w-full h-auto object-cover"
                    priority
                  />
                ) : (
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2025-12-29_17-02-41-removebg-preview-zuZmJTKtERxikfiwaCUtm4t7z7mLg6.png"
                    alt="Productos naturales americanos - Natural Nutrición"
                    className="w-full h-auto object-cover"
                  />
                )}
                {/* Forma decorativa verde en esquina inferior */}
                <div
                  className="absolute bottom-0 right-0 w-24 h-24 sm:w-32 sm:h-32"
                  style={{ background: '#00008B', borderTopLeftRadius: '50%' }}
                />
              </div>

              {/* Rotating circular text badge */}
              <div
                className={`absolute -top-4 -right-4 sm:top-2 sm:-right-6 w-24 h-24 sm:w-28 sm:h-28 transition-all duration-700 delay-500 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
              >
                <svg className="w-full h-full animate-spin-slow" viewBox="0 0 200 200">
                  <defs>
                    <path
                      id="circlePath"
                      d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                    />
                  </defs>
                  <text className="text-[14px] font-semibold uppercase tracking-[5px]" fill="#00008B">
                    <textPath href="#circlePath">
                      • NATURAL • Suplementos Premium • 100% ORGÁNICO •
                    </textPath>
                  </text>
                </svg>
                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg"
                    style={{ background: '#166534', color: 'white' }}
                  >
                    🌿
                  </div>
                </div>
              </div>

              {/* Floating certification badge */}
              <div
                className={`absolute bottom-8 sm:bottom-12 right-4 sm:right-8 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 transition-all duration-700 delay-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
                style={{ background: 'white', border: '1px solid #e5e7eb' }}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#dcfce7' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#166534" className="w-5 h-5">
                    <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Certificación</p>
                  <p className="text-sm font-bold text-foreground">Invima Vigente</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee scrolling bar */}
      <div
        className={`relative overflow-hidden py-4 mt-4 transition-all duration-700 delay-700 ${isVisible ? "opacity-100" : "opacity-0"}`}
        style={{ background: '#00008B' }}
      >
        <div className="flex animate-marquee whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, idx) => (
            <span key={idx} className="inline-flex items-center gap-2 mx-6 sm:mx-8 text-sm sm:text-base font-bold uppercase tracking-wider text-white">
              <span>{item.icon}</span>
              {item.text}
              <span className="mx-4 text-white/40">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
