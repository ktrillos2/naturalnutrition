"use client"

import { TopBar } from "@/components/top-bar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon } from "@/components/icons"

import { useState } from 'react'
import { Toaster, toast } from 'sonner'

function ContactForm({ formTitle }: { formTitle?: string }) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const data = {
      name: formData.get('nombre'),
      email: formData.get('email'),
      phone: formData.get('telefono'),
      message: formData.get('mensaje'),
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success('Mensaje enviado correctamente. Te contactaremos pronto.')
        event.currentTarget.reset()
      } else {
        toast.error('Hubo un error al enviar el mensaje. Por favor intenta nuevamente.')
      }
    } catch (error) {
      toast.error('Error de conexión. Verifica tu internet.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Toaster position="top-center" />
      <h2 className="text-2xl font-bold text-foreground mb-6">{formTitle || 'Envíanos un Mensaje'}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-foreground mb-2">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              required
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-foreground mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Tu teléfono"
            />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder="tu@email.com"
          />
        </div>
        <div>
          <label htmlFor="mensaje" className="block text-sm font-medium text-foreground mb-2">
            Mensaje
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            rows={5}
            required
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            placeholder="Escribe tu mensaje aquí..."
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Enviando...' : 'Enviar Mensaje'}
        </button>
      </form>
    </div>
  )
}

export default function ContactClientPage({ globalConfig }: { globalConfig: any }) {
  const { contactInfo, contactPage } = globalConfig || {}

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar message={globalConfig?.topBarMessage} />
      <Header logo={globalConfig?.logo} />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">{contactPage?.title || 'Contacto'}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {contactPage?.description || 'Estamos aquí para ayudarte. Contáctanos y resolveremos todas tus dudas sobre nuestros productos naturales.'}
            </p>
          </div>
        </section>

        {/* Contact Info & Form */}
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">{contactPage?.infoTitle || 'Información de Contacto'}</h2>
                <div className="space-y-6">
                  {contactInfo?.address && (
                    <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                        <MapPinIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Dirección</h3>
                        <p className="text-muted-foreground">{contactInfo.address}</p>
                      </div>
                    </div>
                  )}

                  {contactInfo?.phones && contactInfo.phones.length > 0 && (
                    <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                        <PhoneIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Teléfonos</h3>
                        {contactInfo.phones.map((phone: string, i: number) => (
                          <p key={i} className="text-muted-foreground">{phone}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {contactInfo?.emails && contactInfo.emails.length > 0 && (
                    <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                        <EnvelopeIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Correo Electrónico</h3>
                        {contactInfo.emails.map((email: string, i: number) => (
                          <p key={i} className="text-muted-foreground">{email}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {contactInfo?.openingHours && contactInfo.openingHours.length > 0 && (
                    <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                        <ClockIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Horario de Atención</h3>
                        {contactInfo.openingHours.map((hour: string, i: number) => (
                          <p key={i} className="text-muted-foreground">{hour}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Form */}
              <ContactForm formTitle={contactPage?.formTitle} />
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-8 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="bg-background rounded-xl overflow-hidden shadow-sm border border-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.5252287377!2d-74.0561!3d4.6829!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwNDAnNTguNCJOIDc0wrAwMyczNi4wIlc!5e0!3m2!1ses!2sco!4v1620000000000!5m2!1ses!2sco"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Natural Nutrition"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer data={globalConfig} />
      <WhatsAppButton />
    </div>
  )
}
