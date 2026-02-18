import { Resend } from 'resend';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { client } from "@/sanity/lib/client";
import { OrderEmail } from '@/components/emails/order-template';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);
const mp = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

export async function POST(req: Request) {
    try {
        const { paymentId, type } = await req.json();

        if (!paymentId) {
            return NextResponse.json({ error: 'Missing paymentId' }, { status: 400 });
        }

        // 1. Fetch Payment Details from MercadoPago
        const payment = new Payment(mp);
        const paymentInfo = await payment.get({ id: paymentId });

        // Extract info
        const status = paymentInfo.status;
        const items = paymentInfo.additional_info?.items || [];
        const payer = paymentInfo.payer;
        const total = paymentInfo.transaction_amount || 0;
        const customerEmail = payer?.email || 'no-email@example.com';
        const customerName = `${payer?.first_name || ''} ${payer?.last_name || ''}`.trim() || 'Cliente';

        // 2. Fetch Admin Email from Sanity
        const globalConfig = await client.fetch(`*[_type == "globalConfig"][0]{ content }`);
        const adminEmail = globalConfig?.content?.contactInfo?.emails?.[0] || 'naturalnutricion@gmail.com';

        // Define email subject and content based on status
        if (status === 'approved') {
            // Send to Customer
            await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL || 'Natural Nutrición <onboarding@resend.dev>',
                to: customerEmail,
                subject: `¡Pedido Confirmado! #${paymentId}`,
                react: <OrderEmail
                    orderId={String(paymentId)}
                    customerName={customerName}
                    items={items.map((i: any) => ({
                        title: i.title,
                        quantity: Number(i.quantity),
                        price: Number(i.unit_price)
                    }))}
                    total={total}
                    status='approved'
                />
            });

            // Send to Admin
            await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL || 'Natural Nutrición <onboarding@resend.dev>',
                to: adminEmail,
                subject: `Nuevo Pedido #${paymentId} - ${customerName}`,
                react: <OrderEmail
                    orderId={String(paymentId)}
                    customerName={customerName}
                    items={items.map((i: any) => ({
                        title: i.title,
                        quantity: Number(i.quantity),
                        price: Number(i.unit_price)
                    }))}
                    total={total}
                    status='approved'
                />
            });
        } else if (status === 'rejected' || status === 'cancelled') {
            // Send to Customer 
            await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL || 'Natural Nutrición <onboarding@resend.dev>',
                to: customerEmail,
                subject: `Problema con tu pedido #${paymentId}`,
                react: <OrderEmail
                    orderId={String(paymentId)}
                    customerName={customerName}
                    items={[]}
                    total={total}
                    status='rejected'
                />
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error sending notification:', error);
        return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
    }
}
