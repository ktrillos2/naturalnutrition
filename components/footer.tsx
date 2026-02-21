import Link from "next/link"
import Image from "next/image"
import { MapPinIcon, PhoneIcon, EnvelopeIcon, FacebookIcon, InstagramIcon, WhatsAppIcon } from "./icons"
import { urlFor } from "@/sanity/lib/image"

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/tienda", label: "Tienda" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
]

interface FooterProps {
  data?: {
    logo?: any
    footerDescription?: string
    contactInfo?: {
      address?: string
      phones?: string[]
      emails?: string[]
      whatsapp?: string
    }
    socialLinks?: { platform: string; url: string }[]
  }
}

export function Footer({ data }: FooterProps) {
  const socials = data?.socialLinks || [];

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return FacebookIcon;
      case 'instagram': return InstagramIcon;
      case 'whatsapp': return WhatsAppIcon;
      default: return FacebookIcon;
    }
  }

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              {data?.logo ? (
                <img
                  src={urlFor(data.logo).url()}
                  alt={data.logo.alt || "Natural Nutrition"}
                  className="h-12 w-auto brightness-0 invert object-contain"
                />
              ) : (
                <Image
                  src="/images/logo.png"
                  alt="Natural Nutrition"
                  width={160}
                  height={53}
                  className="h-12 w-auto brightness-0 invert"
                />
              )}
            </Link>
            <p className="text-sm text-primary-foreground/80 leading-relaxed mb-6">
              {data?.footerDescription || "Tu tienda de confianza para productos naturales, suplementos y fitoterapéuticos de alta calidad."}
            </p>
            <div className="flex items-center gap-4">
              {socials.map((social, idx) => {
                const Icon = getSocialIcon(social.platform);
                return (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                    aria-label={social.platform}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
              {socials.length === 0 && (
                <>
                  {/* Default social links fallback if none provided */}
                  <a href="#" className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center"><FacebookIcon className="w-5 h-5" /></a>
                </>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Menú</h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPinIcon className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span className="text-sm text-primary-foreground/80">{data?.contactInfo?.address || "CRA 28 No. 84-58 Polo"}</span>
              </li>
              <li className="flex items-start gap-3">
                <PhoneIcon className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div className="text-sm text-primary-foreground/80">
                  {data?.contactInfo?.phones?.map(p => <p key={p}>{p}</p>) || (
                    <>
                      <p>350 2138686</p>
                      <p>601 749 8691</p>
                    </>
                  )}
                </div>
              </li>
              <li className="flex items-start gap-3">
                <EnvelopeIcon className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div className="text-sm text-primary-foreground/80">
                  {data?.contactInfo?.emails?.map(e => <p key={e}>{e}</p>) || (
                    <>
                      <p>info@conasanatural.com</p>
                      <p>coordinador@solarvit.com</p>
                    </>
                  )}
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/10 mt-10 pt-8 flex flex-col items-center gap-2">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} Natural Nutrición. Todos los derechos reservados.
          </p>
          <a
            href="https://www.kytcode.lat"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors cursor-pointer"
          >
            Desarrollado por K&T
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  )
}
