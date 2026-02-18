import { MercadoPagoConfig, Preference } from "mercadopago";
import { NextResponse } from "next/server";

// Initialize client inside the handler or use a lazy getter to ensure env vars are populated
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

        const host = req.headers.get("host");
        const protocol = req.headers.get("x-forwarded-proto") || "http";
        const baseUrl = process.env.NEXT_PUBLIC_URL
            ? process.env.NEXT_PUBLIC_URL.replace(/\/$/, "")
            : `${protocol}://${host}`;

        console.log("Creating Mercado Pago preference. Base URL:", baseUrl);

        const body = {
            items: items.map((item: any) => ({
                id: item.id,
                title: item.name,
                quantity: item.quantity,
                unit_price: Number(item.price),
                currency_id: "COP",
                picture_url: item.image,
            })),
            payer: {
                name: payer?.name || "Test",
                surname: payer?.surname || "User",
                email: payer?.email || "test_user_66867768@testuser.com", // Valid test email for Mercado Pago sandbox
                phone: {
                    area_code: "57",
                    number: payer?.phone || "3123456789",
                },
                identification: {
                    type: "CC",
                    number: payer?.cedula || "123456789",
                },
            },
            backUrls: {
                success: `${baseUrl}/checkout/success`,
                failure: `${baseUrl}/checkout/failure`,
                pending: `${baseUrl}/checkout/pending`,
            },
            autoReturn: "approved",
            binary_mode: true,
        };

        console.log("Preference body:", JSON.stringify(body, null, 2));

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
