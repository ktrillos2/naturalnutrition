import { MercadoPagoConfig, Preference } from "mercadopago";
import { NextResponse } from "next/server";

const getMPClient = () => {
    const token = process.env.MP_ACCESS_TOKEN;
    if (!token) {
        throw new Error("MP_ACCESS_TOKEN is not defined in environment variables");
    }
    return new MercadoPagoConfig({ accessToken: token });
};

export async function POST(req: Request) {
    try {
        const { items, payer } = await req.json();

        const client = getMPClient();
        const preference = new Preference(client);

        // Lógica de URL base (Está perfecta para Vercel)
        const host = req.headers.get("host");
        const protocol = req.headers.get("x-forwarded-proto") || "http";
        const baseUrl = process.env.NEXT_PUBLIC_URL
            ? process.env.NEXT_PUBLIC_URL.replace(/\/$/, "")
            : `${protocol}://${host}`;

        const body = {
            items: items.map((item: any) => ({
                id: item.id,
                title: item.name,
                quantity: Number(item.quantity),
                unit_price: Number(item.price),
                currency_id: "COP",
                picture_url: item.image,
            })),
            payer: {
                name: payer?.name || "Usuario",
                surname: payer?.surname || "K&T",
                // EN PRODUCCIÓN: Intenta usar el email real del cliente siempre que sea posible.
                email: payer?.email || "cliente@email.com", 
                phone: {
                    area_code: "57",
                    number: payer?.phone || "3000000000",
                },
                identification: {
                    type: "CC",
                    number: payer?.cedula || "123456789",
                },
            },
            // --- CORRECCIÓN AQUÍ ---
            back_urls: {  // snake_case
                success: `${baseUrl}/checkout/success`,
                failure: `${baseUrl}/checkout/failure`,
                pending: `${baseUrl}/checkout/pending`,
            },
            auto_return: "approved", // snake_case
            // -----------------------
            
            // binary_mode: true fuerza a que el pago sea aprobado o rechazado de inmediato.
            // Útil si no quieres manejar estados "pendientes" (ej. Efecty/Pago en efectivo).
            binary_mode: true, 
        };

        const result = await preference.create({ body });

        return NextResponse.json({ url: result.init_point });
    } catch (error) {
        console.error("Error creating preference:", error);
        return NextResponse.json(
            { error: "Error creating preference" },
            { status: 500 }
        );
    }
}