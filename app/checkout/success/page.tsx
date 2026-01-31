"use client"

import { TopBar } from "@/components/top-bar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { TruckIcon, CheckIcon } from "@/components/icons"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function SuccessContent() {
    const searchParams = useSearchParams()
    const paymentId = searchParams.get("payment_id")

    return (
        <div className="flex justify-center">
            <div className="w-full max-w-lg">
                <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
                    <div className="text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                            <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center">
                                <CheckIcon className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-3">¡Pedido Confirmado!</h2>
                        <p className="text-muted-foreground mb-6">Tu pago ha sido acreditado exitosamente.</p>

                        <div className="bg-secondary rounded-lg p-4 mb-6">
                            <p className="text-sm text-muted-foreground mb-1">Referencia de Pago</p>
                            <p className="text-lg font-bold text-primary">{paymentId || `#NN-${Math.floor(Math.random() * 10000)}`}</p>
                        </div>

                        <div className="space-y-3 text-left border-t border-border pt-6 mb-6">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <TruckIcon className="w-5 h-5 text-accent" />
                                <span>Recibirás un correo con los detalles de tu envío</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <CheckIcon className="w-5 h-5 text-accent" />
                                <span>Tiempo estimado de entrega: 3-5 días hábiles</span>
                            </div>
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
    )
}

export default function CheckoutSuccessPage() {
    return (
        <div className="min-h-screen flex flex-col bg-secondary">
            <TopBar />
            <Header />
            <main className="flex-1 py-8 lg:py-12 flex items-center justify-center">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
                    <Suspense fallback={<div>Cargando...</div>}>
                        <SuccessContent />
                    </Suspense>
                </div>
            </main>
            <Footer />
        </div>
    )
}
