"use client"

import { WhatsAppIcon } from "./icons"

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/573502138686?text=Hola,%20me%20gustaría%20obtener%20información%20sobre%20sus%20productos."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#20BD5A] transition-colors hover:scale-110 transform duration-200"
      aria-label="Contactar por WhatsApp"
    >
      <WhatsAppIcon className="w-7 h-7" />
    </a>
  )
}
