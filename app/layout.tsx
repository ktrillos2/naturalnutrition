import type React from "react"
import type { Metadata, Viewport } from "next"
import { Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { CartProvider } from "@/components/cart-provider"
import { FavoritesProvider } from "@/components/favorites-provider"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "https://naturalnutrition.com.co"),
  title: {
    default: "Natural Nutrición | Productos Naturales y Suplementos",
    template: "%s | Natural Nutrición",
  },
  description:
    "Tienda líder en productos naturales, suplementos dietarios, fitoterapéuticos y cosmética natural en Colombia. Envíos seguros a todo el país.",
  keywords: ["productos naturales", "suplementos", "fitoterapéuticos", "cosméticos naturales", "Colombia", "salud", "bienestar", "vitaminas"],
  authors: [{ name: "Natural Nutrición" }],
  creator: "Natural Nutrición",
  publisher: "Natural Nutrición",
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "/",
    title: "Natural Nutrición | Tu Salud al Natural",
    description: "Descubre nuestra selección de productos naturales y suplementos para tu bienestar.",
    siteName: "Natural Nutrición",
    images: [
      {
        url: "/icon.png", // Next.js auto-generates this route from app/icon.png
        width: 1200,
        height: 630,
        alt: "Natural Nutrición Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Natural Nutrición | Productos Naturales",
    description: "Tienda de productos naturales y suplementos en Colombia.",
    images: ["/icon.png"],
    creator: "@naturalnutricion",
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#00008B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${poppins.className} font-sans antialiased`}>
        <CartProvider>
          <FavoritesProvider>
            {children}
            <Analytics />
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  )
}
