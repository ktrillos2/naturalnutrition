"use client"

import { TopBar } from "@/components/top-bar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { XIcon } from "@/components/icons"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useRef } from "react"

function FailureContent() {
    const searchParams = useSearchParams()
    const paymentId = searchParams.get("payment_id")
    const notificationSent = useRef(false)

    useEffect(() => {
        if (paymentId && !notificationSent.current) {
            notificationSent.current = true
            fetch("/api/notify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId, type: "payment" }),
            }).catch(err => console.error("Error sending notification:", err))
        }
    }, [paymentId])

    return (
        <div className="flex justify-center">
            <div className="w-full max-w-lg">
                <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
                    <div className="text-center">
                        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                                <XIcon className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-3">Pago Rechazado</h2>
                        <p className="text-muted-foreground mb-6">Lo sentimos, tu pago no pudo ser procesado.</p>

                        <div className="space-y-3 mb-8">
                            <p className="text-sm text-muted-foreground">Por favor, intenta nuevamente con otro medio de pago o verifica los datos ingresados.</p>
                        </div>

                        <Link
                            href="/checkout"
                            className="inline-flex items-center justify-center w-full px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Intentar Nuevamente
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function CheckoutFailurePage() {
    return (
        <div className="min-h-screen flex flex-col bg-secondary">
            <TopBar />
            <Header />
            <main className="flex-1 py-8 lg:py-12 flex items-center justify-center">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
                    <Suspense fallback={<div>Cargando...</div>}>
                        <FailureContent />
                    </Suspense>
                </div>
            </main>
            <Footer />
        </div>
    )
}
