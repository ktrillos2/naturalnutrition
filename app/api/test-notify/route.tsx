import { Resend } from 'resend';
import { render } from '@react-email/render';
import { OrderEmail } from '@/components/emails/order-template';
import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { client } from "@/sanity/lib/client";

const resend = new Resend(process.env.RESEND_API_KEY);

const writeClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion: '2024-01-01',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN!,
});

export async function GET() {
    try {
        const globalConfig = await client.fetch(`*[_type == "globalConfig"][0]{ content }`);
        const adminEmail = globalConfig?.content?.contactInfo?.emails?.[0] || 'naturalnutricion@gmail.com';

        const testItems = [
            { title: "Calcio Magnesio y Zinc + Vitamina D3", quantity: 1, price: 57500 },
            { title: "Producto de Prueba 2", quantity: 2, price: 15000 }
        ];
        const total = 87500;
        const testPaymentId = "TEST-1344834209";

        // 1. Create Order in Sanity
        const order = await writeClient.create({
            _type: 'order',
            orderNumber: `MP-${testPaymentId}`,
            customerName: "Keyner Steban Trillos Useche",
            email: adminEmail,
            phone: "3123123131",
            items: testItems.map((i, idx) => ({
                _type: 'object',
                _key: `item-${idx}`,
                productId: `test-${idx}`,
                name: i.title,
                quantity: i.quantity,
                price: i.price,
            })),
            totalPrice: total,
            status: 'paid',
            paymentId: testPaymentId,
            createdAt: new Date().toISOString(),
        });
        console.log('Order created in Sanity:', order._id);

        // 2. Render and send email
        const html = await render(
            <OrderEmail
                orderId={testPaymentId}
                customerName="Keyner Steban Trillos Useche"
                items={testItems}
                total={total}
                status='approved'
            />
        );

        const emailResult = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'Natural Nutrición <onboarding@resend.dev>',
            to: adminEmail,
            subject: `🔔 Prueba - Pedido Confirmado #${testPaymentId}`,
            html
        });

        return NextResponse.json({
            success: true,
            sanityOrderId: order._id,
            emailSentTo: adminEmail,
            emailResult,
        });
    } catch (error: any) {
        console.error('Test notification error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
