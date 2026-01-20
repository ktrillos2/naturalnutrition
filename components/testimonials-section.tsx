"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from "@/components/icons"
import { urlFor } from "@/sanity/lib/image"

interface TestimonialsProps {
  data?: {
    title: string
    subtitle: string
    items: {
      name: string
      location: string
      rating: number
      content: string
      product: string
      image?: any
      _key: string
    }[]
  }
}

export function TestimonialsSection({ data }: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const testimonials = data?.items || []

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

  useEffect(() => {
    if (!isAutoPlaying || testimonials.length === 0) return

    const interval = setInterval(() => {
      handleSlideChange((currentIndex + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, currentIndex, testimonials.length])

  const handleSlideChange = (newIndex: number) => {
    if (testimonials.length === 0) return
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentIndex(newIndex)
      setIsAnimating(false)
    }, 200)
  }

  const goToPrevious = () => {
    if (testimonials.length === 0) return
    setIsAutoPlaying(false)
    handleSlideChange((currentIndex - 1 + testimonials.length) % testimonials.length)
  }

  const goToNext = () => {
    if (testimonials.length === 0) return
    setIsAutoPlaying(false)
    handleSlideChange((currentIndex + 1) % testimonials.length)
  }

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false)
    handleSlideChange(index)
  }

  if (!data || testimonials.length === 0) return null

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-gradient-to-b from-secondary/50 to-background overflow-hidden"
    >
      <div className="container mx-auto px-4">
        {/* Header - Animaciones agregadas */}
        <div
          className={`text-center mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">Testimonios</span>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mt-2 mb-4">{data.title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {data.subtitle}
          </p>
        </div>

        {/* Testimonial Carousel - Animación escala */}
        <div
          className={`relative max-w-4xl mx-auto transition-all duration-700 delay-300 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        >
          {/* Navigation Buttons - Hover mejorado */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-accent hover:text-white hover:scale-110 transition-all duration-300"
            aria-label="Anterior testimonio"
          >
            <ChevronLeftIcon className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-accent hover:text-white hover:scale-110 transition-all duration-300"
            aria-label="Siguiente testimonio"
          >
            <ChevronRightIcon className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Testimonial Card - Animación de transición */}
          <div
            className={`bg-white rounded-2xl shadow-xl p-8 md:p-12 relative overflow-hidden transition-all duration-300 ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
          >
            {/* Quote decoration */}
            <div className="absolute top-4 left-4 text-8xl text-accent/10 font-serif leading-none">"</div>

            <div className="relative z-10">
              {/* Stars - Animación de estrellas */}
              <div className="flex gap-1 mb-6 justify-center">
                {[...Array(testimonials[currentIndex].rating || 5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-pulse-soft"
                  />
                ))}
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-lg md:text-xl text-foreground text-center mb-8 leading-relaxed">
                "{testimonials[currentIndex].content}"
              </blockquote>

              {/* Author Info - Hover en avatar */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xl font-bold mb-3 hover:scale-110 transition-transform duration-300 shadow-lg overflow-hidden">
                  {testimonials[currentIndex].image ? (
                    <img
                      src={urlFor(testimonials[currentIndex].image).url()}
                      alt={testimonials[currentIndex].name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    testimonials[currentIndex].name.charAt(0)
                  )}
                </div>
                <p className="font-semibold text-primary">{testimonials[currentIndex].name}</p>
                <p className="text-sm text-muted-foreground">{testimonials[currentIndex].location}</p>
                <span className="mt-2 text-xs bg-accent/10 text-accent px-3 py-1 rounded-full hover:bg-accent hover:text-white transition-colors duration-300">
                  {testimonials[currentIndex].product}
                </span>
              </div>
            </div>
          </div>

          {/* Dots Navigation - Hover mejorado */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-3 rounded-full transition-all duration-300 hover:bg-accent ${index === currentIndex ? "bg-accent w-8" : "bg-accent/30 w-3 hover:w-5"
                  }`}
                aria-label={`Ir al testimonio ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
