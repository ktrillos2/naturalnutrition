import { MercadoPagoConfig, Preference } from "mercadopago";
import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { client as readClient } from "@/sanity/lib/client";
import { Resend } from "resend";
import { OrderEmail } from "@/components/emails/order-template";
import { render } from "@react-email/render";

const resend = new Resend(process.env.RESEND_API_KEY);

const getMPClient = () => {
    const token = process.env.MP_ACCESS_TOKEN;
    if (!token) {
        throw new Error("MP_ACCESS_TOKEN is not defined in environment variables");
    }
    return new MercadoPagoConfig({ accessToken: token });
};

/** Sanity write client for creating orders */
const writeClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion: "2024-01-01",
    useCdn: false,
    token: process.env.SANITY_API_TOKEN!,
});

/** Generate a unique order number */
const generateOrderNumber = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `NN-${timestamp}-${random}`;
};

export async function POST(req: Request) {
    try {
        const { items, payer, shipping: shippingData } = await req.json();

        const client = getMPClient();
        const preference = new Preference(client);

        // Generate unique order number
        const orderNumber = generateOrderNumber();

        // Calculate total
        const customerName = `${payer?.name || ""} ${payer?.surname || ""}`.trim() || "Cliente";
        const customerEmail = payer?.email || "";
        const itemsTotal = items.reduce(
            (sum: number, item: any) => sum + Number(item.price) * Number(item.quantity || 1),
            0
        );
        const shippingCost = Number(shippingData?.cost || 0);
        const totalPrice = itemsTotal + shippingCost;

        // 1. Create the order in Sanity with PENDING status
        try {
            await writeClient.create({
                _type: "order",
                orderNumber,
                customerName,
                email: customerEmail,
                phone: payer?.phone || "",
                ciudadExpedicion: payer?.ciudadExpedicion || "",
                address: shippingData?.address || "",
                department: shippingData?.department || "",
                city: shippingData?.city || "",
                shipping: shippingCost,
                items: items.map((item: any) => ({
                    _type: "object",
                    _key: `item-${item.id || Math.random().toString(36).slice(2)}`,
                    productId: item.id || "N/A",
                    name: item.name,
                    quantity: Number(item.quantity || 1),
                    price: Number(item.price),
                })),
                totalPrice,
                status: "pending",
                paymentId: "",
                createdAt: new Date().toISOString(),
            });
            console.log(`Order ${orderNumber} created in Sanity with status: pending`);
        } catch (orderErr) {
            console.error("Error creating order in Sanity:", orderErr);
            return NextResponse.json(
                { error: "Error creating order" },
                { status: 500 }
            );
        }

        // 2. Send pending notification email to admin
        try {
            const globalConfig = await readClient.fetch(`*[_type == "globalConfig"][0]{ content }`);
            const adminEmail = globalConfig?.content?.notificationEmail || "ntrlnutrition@gmail.com";

            const adminHtml = await render(<OrderEmail
                orderId=""
                orderNumber={orderNumber}
                customerName={customerName}
                items={
                    items.map((item: any) => ({
                        title: item.name,
                        quantity: Number(item.quantity || 1),
                        price: Number(item.price),
                    }))
                }
                total={totalPrice}
                shipping={shippingCost}
                status="pending"
                address={shippingData?.address || ""}
                city={shippingData?.city || ""}
                department={shippingData?.department || ""}
                isAdmin={true}
                customerEmail={customerEmail}
                customerPhone={payer?.phone || ""}
                customerDocument={payer?.cedula ? `CC ${payer.cedula}` : ""}
                ciudadExpedicion={payer?.ciudadExpedicion || ""}
            />);

            const customerHtml = await render(<OrderEmail
                orderId=""
                orderNumber={orderNumber}
                customerName={customerName}
                items={
                    items.map((item: any) => ({
                        title: item.name,
                        quantity: Number(item.quantity || 1),
                        price: Number(item.price),
                    }))
                }
                total={totalPrice}
                shipping={shippingCost}
                status="pending"
                address={shippingData?.address || ""}
                city={shippingData?.city || ""}
                department={shippingData?.department || ""}
                isAdmin={false}
            />);

            // Send to admin (notification email)
            await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL || "Natural Nutrición <onboarding@resend.dev>",
                to: adminEmail,
                subject: `🕐 Nuevo Pedido Pendiente ${orderNumber} - ${customerName}`,
                html: adminHtml,
            });

            // Send to customer if email is provided
            if (customerEmail) {
                await resend.emails.send({
                    from: process.env.RESEND_FROM_EMAIL || "Natural Nutrición <onboarding@resend.dev>",
                    to: customerEmail,
                    subject: `Tu pedido ${orderNumber} ha sido recibido`,
                    html: customerHtml,
                });
            }

            console.log(`Pending notification sent for order ${orderNumber}`);
        } catch (emailErr) {
            // Don't block the checkout if email fails
            console.error("Error sending pending notification email:", emailErr);
        }

        // 3. Create MercadoPago preference with order reference in metadata
        const host = req.headers.get("host");
        const protocol = req.headers.get("x-forwarded-proto") || "http";
        const baseUrl = process.env.NEXT_PUBLIC_URL
            ? process.env.NEXT_PUBLIC_URL.replace(/\/$/, "")
            : host
                ? `${protocol}://${host}`
                : "http://localhost:3000";

        const body = {
            items: items.map((item: any) => ({
                id: item.id,
                title: item.name,
                quantity: Number(item.quantity || 1),
                unit_price: Number(item.price),
                currency_id: "COP",
                picture_url: typeof item.image === "string" ? item.image : null,
            })),
            payer: {
                name: payer?.name || "Usuario",
                surname: payer?.surname || "K&T",
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
            back_urls: {
                success: `${baseUrl}/checkout/success`,
                failure: `${baseUrl}/checkout/failure`,
                pending: `${baseUrl}/checkout/pending`,
            },
            auto_return: "approved",
            // binary_mode desactivado para permitir pagos en efectivo (pendientes)
            binary_mode: false,
            metadata: {
                order_number: orderNumber,
                ciudadExpedicion: payer?.ciudadExpedicion || "",
            },
        };

        const result = await preference.create({ body });

        return NextResponse.json({ url: result.init_point, orderNumber });
    } catch (error) {
        console.error("Error creating preference:", error);
        return NextResponse.json(
            { error: "Error creating preference" },
            { status: 500 }
        );
    }
}