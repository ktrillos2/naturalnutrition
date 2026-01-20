"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react"
import { urlFor } from "@/sanity/lib/image"
import { PortableText } from "next-sanity"

interface HistoryProps {
  data?: {
    badgeStats?: { value: string; label: string }
    smallTitle?: string
    title?: string
    description?: any[]
    quote?: string
    cta?: { label: string; link: string }
    image?: any
  }
}

export function HistorySection({ data }: HistoryProps) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  if (!data) return null;

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Imagen - Animación desde la izquierda */}
          <div
            className={`relative transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20"}`}
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl group">
              {data.image ? (
                <img
                  src={urlFor(data.image).url()}
                  alt={data.image.alt || "Nuestra Historia"}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">Sin Imagen</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            {/* Badge decorativo - Animación flotante y escala */}
            {data.badgeStats && (
              <div
                className={`absolute -bottom-6 -right-6 bg-primary text-primary-foreground rounded-full w-32 h-32 flex flex-col items-center justify-center shadow-lg animate-float transition-all duration-700 delay-500 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
              >
                <span className="text-3xl font-bold">{data.badgeStats.value}</span>
                <span className="text-sm text-center px-2 leading-tight">{data.badgeStats.label}</span>
              </div>
            )}
          </div>

          {/* Contenido - Animación desde la derecha */}
          <div
            className={`space-y-6 transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"}`}
          >
            <div>
              <span
                className={`text-accent font-semibold text-sm uppercase tracking-wider inline-block transition-all duration-500 delay-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
              >
                {data.smallTitle}
              </span>
              <h2
                className={`text-3xl md:text-4xl font-bold text-primary mt-2 transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
              >
                {data.title}
              </h2>
            </div>

            <div
              className={`text-muted-foreground text-lg leading-relaxed transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
            >
              {data.description && (
                <PortableText
                  value={data.description}
                  components={{
                    marks: {
                      strong: ({ children }) => <strong className="text-foreground font-bold">{children}</strong>
                    },
                    block: {
                      normal: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>
                    }
                  }}
                />
              )}
            </div>

            {data.quote && (
              <div
                className={`bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6 border-l-4 border-accent hover:shadow-lg transition-all duration-500 delay-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
              >
                <p className="text-xl font-semibold text-primary italic">"{data.quote}"</p>
              </div>
            )}

            {data.cta && (
              <Button
                asChild
                size="lg"
                className={`bg-accent hover:bg-accent/90 text-accent-foreground hover:scale-105 transition-all duration-500 delay-800 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
              >
                <Link href={data.cta.link}>{data.cta.label}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
