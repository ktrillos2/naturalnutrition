import { Resend } from 'resend';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { client } from "@/sanity/lib/client";
import { OrderEmail } from '@/components/emails/order-template';
import { NextResponse } from 'next/server';
import { render } from '@react-email/render';
import { createClient } from 'next-sanity';

const resend = new Resend(process.env.RESEND_API_KEY);
const mp = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

// Write client for creating orders in Sanity
const writeClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion: '2024-01-01',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN!,
});

export async function POST(req: Request) {
    try {
        const { paymentId, type } = await req.json();

        if (!paymentId) {
            return NextResponse.json({ error: 'Missing paymentId' }, { status: 400 });
        }

        // 1. Fetch Payment Details from MercadoPago
        const payment = new Payment(mp);
        const paymentInfo = await payment.get({ id: paymentId });

        const status = paymentInfo.status;
        const items = paymentInfo.additional_info?.items || [];
        const payer = paymentInfo.payer;
        const total = paymentInfo.transaction_amount || 0;
        const customerEmail = payer?.email || 'no-email@example.com';
        const customerName = `${payer?.first_name || ''} ${payer?.last_name || ''}`.trim() || 'Cliente';
        const customerPhone = payer?.phone?.number || '';

        // 2. Fetch Admin Email from Sanity
        const globalConfig = await client.fetch(`*[_type == "globalConfig"][0]{ content }`);
        const adminEmail = globalConfig?.content?.contactInfo?.emails?.[0] || 'naturalnutricion@gmail.com';

        // 3. Create Order in Sanity (on approved payments)
        if (status === 'approved') {
            try {
                await writeClient.create({
                    _type: 'order',
                    orderNumber: `MP-${paymentId}`,
                    customerName,
                    email: customerEmail,
                    phone: customerPhone,
                    items: items.map((i: any) => ({
                        _type: 'object',
                        _key: `item-${i.id || Math.random().toString(36).slice(2)}`,
                        productId: i.id || 'N/A',
                        name: i.title,
                        quantity: Number(i.quantity),
                        price: Number(i.unit_price),
                    })),
                    totalPrice: total,
                    status: 'paid',
                    paymentId: String(paymentId),
                    createdAt: new Date().toISOString(),
                });
                console.log(`Order MP-${paymentId} created in Sanity`);
            } catch (orderErr) {
                console.error('Error creating order in Sanity:', orderErr);
            }

            // 4. Send emails
            const approvedHtml = await render(<OrderEmail
                orderId={String(paymentId)}
                customerName={customerName}
                items={items.map((i: any) => ({
                    title: i.title,
                    quantity: Number(i.quantity),
                    price: Number(i.unit_price)
                }))}
                total={total}
                status='approved'
            />);

            await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL || 'Natural Nutrición <onboarding@resend.dev>',
                to: customerEmail,
                subject: `¡Pedido Confirmado! #${paymentId}`,
                html: approvedHtml
            });

            await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL || 'Natural Nutrición <onboarding@resend.dev>',
                to: adminEmail,
                subject: `Nuevo Pedido #${paymentId} - ${customerName}`,
                html: approvedHtml
            });
        } else if (status === 'rejected' || status === 'cancelled') {
            const rejectedHtml = await render(<OrderEmail
                orderId={String(paymentId)}
                customerName={customerName}
                items={[]}
                total={total}
                status='rejected'
            />);

            await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL || 'Natural Nutrición <onboarding@resend.dev>',
                to: customerEmail,
                subject: `Problema con tu pedido #${paymentId}`,
                html: rejectedHtml
            });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error sending notification:', error);
        return NextResponse.json({ error: 'Failed to send notification', details: error.message }, { status: 500 });
    }
}
