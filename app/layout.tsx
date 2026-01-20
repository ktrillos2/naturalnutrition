import type React from "react"
import type { Metadata, Viewport } from "next"
import { Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { CartProvider } from "@/components/cart-provider"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "Natural Nutrición | Productos Naturales y Suplementos",
  description:
    "Tienda de productos naturales, suplementos dietarios, cosméticos y fitoterapéuticos. Envíos a todo Colombia.",
  keywords: ["productos naturales", "suplementos", "fitoterapéuticos", "cosméticos naturales", "Colombia"],
  generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#00008B",
  width: "device-width",
  initialScale: 1,
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
          {children}
          <Analytics />
        </CartProvider>
      </body>
    </html>
  )
}
