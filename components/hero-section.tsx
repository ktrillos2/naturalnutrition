"use client"

import Link from "next/link"
import { ChevronRightIcon, ShieldCheckIcon, TruckIcon, LeafIcon } from "./icons"
import { useEffect, useState } from "react"
import { PortableText } from "next-sanity"

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

// Map icon names to components
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

  return (
    <section className="relative bg-secondary overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content - Animaciones agregadas */}
          <div
            className={`order-2 lg:order-1 transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
          >
            <span
              className={`inline-flex items-center gap-2 text-accent text-sm font-medium mb-4 transition-all duration-500 delay-100 ${isVisible ? "opacity-100" : "opacity-0"}`}
            >
              <LeafIcon className="w-4 h-4 animate-pulse-soft" />
              {data.badge}
            </span>
            <div
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight text-balance mb-6 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
            >
              <PortableText
                value={data.title}
                components={{
                  block: {
                    normal: ({ children }) => <h1 className="leading-tight">{children}</h1>
                  },
                  marks: {
                    strong: ({ children }) => <span className="text-primary">{children}</span>
                  }
                }}
              />
            </div>
            <p
              className={`text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
            >
              {data.description}
            </p>
            <div
              className={`flex flex-col sm:flex-row gap-4 mb-10 transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
            >
              <Link
                href={data.primaryCta?.link || '/tienda'}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 hover:scale-105 transition-all duration-300 group"
              >
                {data.primaryCta?.label || 'Ver Productos'}
                <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href={data.secondaryCta?.link || '/tienda'}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border text-foreground font-medium rounded-lg hover:bg-muted hover:scale-105 transition-all duration-300"
              >
                {data.secondaryCta?.label || 'Explorar Categorías'}
              </Link>
            </div>

            {/* Trust Badges - Animaciones agregadas */}
            <div
              className={`flex flex-wrap gap-6 transition-all duration-700 delay-500 ${isVisible ? "opacity-100" : "opacity-0"}`}
            >
              {data.trustBadges?.map((badge, idx) => {
                const Icon = iconMap[badge.icon] || ShieldCheckIcon;
                return (
                  <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <Icon className="w-5 h-5 text-accent" />
                    <span>{badge.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Image - Animaciones agregadas */}
          <div
            className={`order-1 lg:order-2 relative transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-500">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2025-12-29_17-02-41-removebg-preview-zuZmJTKtERxikfiwaCUtm4t7z7mLg6.png"
                alt="Productos naturales Natural Nutrición"
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
            {/* Floating Card - Animación flotante */}
            <div
              className={`absolute -bottom-4 -left-4 bg-card p-4 rounded-xl shadow-lg border border-border hidden sm:block animate-float transition-all duration-700 delay-500 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
            >
              <p className="text-xs text-muted-foreground mb-1">{data.floatingCard?.text}</p>
              <p className="text-2xl font-bold text-primary">{data.floatingCard?.value}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
