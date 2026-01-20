"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircleIcon } from "@/components/icons"
import { LeafIcon, ShieldIcon, HeartIcon, ZapIcon, AwardIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { urlFor } from "@/sanity/lib/image"

const iconMap: Record<string, any> = {
  CheckCircle: CheckCircleIcon,
  Leaf: LeafIcon,
  Shield: ShieldIcon,
  Heart: HeartIcon,
  Zap: ZapIcon,
  Award: AwardIcon
}

interface ProductBenefitsProps {
  data?: {
    badge: string
    title: string
    subtitle: string
    cta: {
      label: string
      link: string
    }
    benefits: {
      title: string
      description: string
      icon: string
      _key: string
    }[]
  }
}

export function ProductBenefitsSection({ data }: ProductBenefitsProps) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  if (!data) return null;

  const benefits = data.benefits || [];

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-gradient-to-br from-secondary via-background to-secondary relative overflow-hidden"
    >
      {/* Decorative elements - Colores actualizados */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse-soft" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse-soft" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header - Colores con mejor contraste */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">{data.badge}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mt-2 mb-4">
            {data.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {data.subtitle}
          </p>
        </div>

        {/* Benefits Grid - Nuevo diseño de tarjetas con mejor contraste */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit, index) => {
            const IconComponent = iconMap[benefit.icon] || CheckCircleIcon;
            return (
              <div
                key={benefit._key || index}
                className={`bg-white rounded-xl p-6 border border-border shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
                <div className="mt-4 h-1 w-0 group-hover:w-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500" />
              </div>
            )
          })}
        </div>

        {/* CTA - Botón con mejor contraste y animación */}
        {data.cta && (
          <div
            className={`text-center transition-all duration-700 delay-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Link href={data.cta.link}>{data.cta.label}</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
