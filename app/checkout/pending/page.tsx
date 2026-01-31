"use client"

import { TopBar } from "@/components/top-bar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ClockIcon } from "@/components/icons"
import Link from "next/link"

export default function CheckoutPendingPage() {
    return (
        <div className="min-h-screen flex flex-col bg-secondary">
            <TopBar />
            <Header />
            <main className="flex-1 py-8 lg:py-12 flex items-center justify-center">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
                    <div className="flex justify-center">
                        <div className="w-full max-w-lg">
                            <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
                                <div className="text-center">
                                    <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center">
                                            <ClockIcon className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-bold text-foreground mb-3">Pago Pendiente</h2>
                                    <p className="text-muted-foreground mb-6">Tu pago está siendo procesado.</p>

                                    <div className="space-y-3 mb-8">
                                        <p className="text-sm text-muted-foreground">Te notificaremos vía correo electrónico cuando el pago sea aprobado. No es necesario que realices la compra nuevamente.</p>
                                    </div>

                                    <Link
                                        href="/"
                                        className="inline-flex items-center justify-center w-full px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
                                    >
                                        Volver al Inicio
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
