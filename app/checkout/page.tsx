"use client"

import { useState, useMemo } from "react"
import { TopBar } from "@/components/top-bar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { TruckIcon, CheckIcon } from "@/components/icons"
import Link from "next/link"
import { useCart } from "@/components/cart-provider"
import colombiaData from "@/lib/colombia-locations.json"
import { toast } from "sonner"

const steps = [
  { id: 1, name: "Envío", icon: TruckIcon },
  {
    id: 2,
    name: "Pago",
    icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
        />
      </svg>
    ),
  },
  { id: 3, name: "Confirmación", icon: CheckIcon },
]

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const { items: cartItems } = useCart()

  const [selectedDept, setSelectedDept] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [loading, setLoading] = useState(false)

  // Checkout Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    cedula: "",
    address: "",
    phone: "",
    email: "",
  });


  const cities = useMemo(() => {
    const dept = colombiaData.find((d) => d.departamento === selectedDept)
    return dept ? dept.ciudades : []
  }, [selectedDept])

  const shipping = 12000
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
  const total = subtotal + shipping

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({ ...item, quantity: item.quantity || 1 })),
          payer: {
            name: formData.firstName,
            surname: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            cedula: formData.cedula,
          }
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Error al iniciar el pago. Inténtalo de nuevo.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error creating preference:", error);
      toast.error("Error de conexión. Inténtalo de nuevo.");
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex flex-col bg-secondary">
      <TopBar />
      <Header />
      <main className="flex-1 py-8 lg:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Progress */}
          <div className="flex items-center justify-center mb-10">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center gap-2 ${currentStep >= step.id ? "text-primary" : "text-muted-foreground"}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep > step.id
                      ? "bg-primary text-primary-foreground"
                      : currentStep === step.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                      }`}
                  >
                    {currentStep > step.id ? <CheckIcon className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{step.name}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 sm:w-20 h-0.5 mx-2 ${currentStep > step.id ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>

          {currentStep === 3 ? (
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
                    <p className="text-muted-foreground mb-6">Tu pedido ha sido recibido y está siendo procesado.</p>

                    <div className="bg-secondary rounded-lg p-4 mb-6">
                      <p className="text-sm text-muted-foreground mb-1">Número de orden</p>
                      <p className="text-lg font-bold text-primary">#NN-{Math.floor(Math.random() * 10000)}</p>
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
          ) : (
            <div className="grid lg:grid-cols-5 gap-8">
              {/* Form */}
              <div className="lg:col-span-3">
                <div className="bg-card border border-border rounded-xl p-6">
                  {currentStep === 1 && (
                    <div>
                      <h2 className="text-lg font-semibold text-foreground mb-6">Información de Envío</h2>
                      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setCurrentStep(2); }}>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">Nombre</label>
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                              placeholder="Tu nombre"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">Apellido</label>
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                              placeholder="Tu apellido"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1.5">Cédula / documento de identidad</label>
                          <input
                            type="text"
                            name="cedula"
                            value={formData.cedula}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="Número de documento"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1.5">Dirección</label>
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="Calle, número, apartamento"
                          />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">Departamento</label>
                            <select
                              value={selectedDept}
                              onChange={(e) => {
                                setSelectedDept(e.target.value)
                                setSelectedCity("")
                              }}
                              className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-background"
                            >
                              <option value="">Selecciona un departamento</option>
                              {colombiaData.map((d) => (
                                <option key={d.departamento} value={d.departamento}>{d.departamento}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">Ciudad</label>
                            <select
                              value={selectedCity}
                              onChange={(e) => setSelectedCity(e.target.value)}
                              disabled={!selectedDept}
                              className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-background disabled:opacity-50"
                            >
                              <option value="">Selecciona una ciudad</option>
                              {cities.map((c) => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">Teléfono</label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                              placeholder="Tu teléfono"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                              placeholder="tu@email.com"
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors mt-6"
                        >
                          Continuar al Pago
                        </button>
                      </form>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div>
                      <h2 className="text-lg font-semibold text-foreground mb-6">Confirmar Pago</h2>
                      <p className="text-muted-foreground mb-6">Serás redirigido a MercadoPago para completar tu compra de forma segura.</p>

                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="flex-1 py-3 border border-border text-foreground font-medium rounded-lg hover:bg-muted transition-colors"
                          disabled={loading}
                        >
                          Volver
                        </button>
                        <button
                          type="button"
                          onClick={handlePayment}
                          className="flex-1 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center"
                          disabled={loading}
                        >
                          {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            "Pagar con MercadoPago"
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Resumen del Pedido</h3>
                  {cartItems.length > 0 ? (
                    <div className="space-y-4 mb-6">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex gap-3">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground line-clamp-2">{item.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">Cant: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-semibold text-foreground">
                            ${(item.price * (item.quantity || 1)).toLocaleString("es-CO")}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground text-sm">
                      Tu carrito está vacío
                    </div>
                  )}

                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">${subtotal.toLocaleString("es-CO")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Envío</span>
                      <span className="text-foreground">${shipping.toLocaleString("es-CO")}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold pt-2 border-t border-border">
                      <span className="text-foreground">Total</span>
                      <span className="text-primary">${total.toLocaleString("es-CO")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
