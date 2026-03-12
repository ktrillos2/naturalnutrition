import type React from "react"
import type { Metadata, Viewport } from "next"
import { Poppins, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import "./globals.css"
import { CartProvider } from "@/components/cart-provider"
import { FavoritesProvider } from "@/components/favorites-provider"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
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
      <head>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1477849313995139');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img height="1" width="1" style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1477849313995139&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body className={`${poppins.className} ${playfair.variable} font-sans antialiased`}>
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
