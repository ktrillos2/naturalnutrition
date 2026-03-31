import { Resend } from 'resend';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { client } from "@/sanity/lib/client";
import { OrderEmail } from '@/components/emails/order-template';
import { NextResponse } from 'next/server';
import { render } from '@react-email/render';
import { createClient } from 'next-sanity';

const resend = new Resend(process.env.RESEND_API_KEY);
const mp = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

/** Write client for updating orders in Sanity */
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
        const orderNumber = (paymentInfo as any).metadata?.order_number || '';

        // 2. Fetch Admin Email from Sanity
        const globalConfig = await client.fetch(`*[_type == "globalConfig"][0]{ content }`);
        const adminEmail = globalConfig?.content?.notificationEmail || 'ntrlnutrition@gmail.com';

        // 3. Fetch existing order data for email (shipping, address info)
        let orderData: any = null;
        if (orderNumber) {
            orderData = await writeClient.fetch(
                `*[_type == "order" && orderNumber == $orderNumber][0]`,
                { orderNumber }
            );
        }

        const customerPhoneData = orderData?.phone || payer?.phone?.number || '';
        const customerDocumentData = payer?.identification?.number ? `${payer.identification.type || 'CC'} ${payer.identification.number}` : '';
        const ciudadExpedicionData = orderData?.ciudadExpedicion || (paymentInfo as any).metadata?.ciudad_expedicion || (paymentInfo as any).metadata?.ciudadExpedicion || '';

        // 4. Process based on payment status
        if (status === 'approved') {
            // Update existing order to paid
            try {
                if (orderData) {
                    await writeClient.patch(orderData._id)
                        .set({
                            status: 'paid',
                            paymentId: String(paymentId),
                        })
                        .commit();
                    console.log(`Order ${orderNumber} updated to status: paid`);
                } else {
                    // Fallback: create order if not found (backward compatibility)
                    console.warn(`Order ${orderNumber || 'unknown'} not found in Sanity, creating new one`);
                    const customerPhone = payer?.phone?.number || '';
                    const customerDocumentNum = payer?.identification?.number ? `${payer.identification.type || 'CC'} ${payer.identification.number}` : "";
                    const ciudadExpedicion = (paymentInfo as any).metadata?.ciudadExpedicion || (paymentInfo as any).metadata?.ciudad_expedicion || '';

                    await writeClient.create({
                        _type: 'order',
                        orderNumber: orderNumber || `MP-${paymentId}`,
                        customerName,
                        email: customerEmail,
                        phone: customerPhone,
                        cedula: customerDocumentNum,
                        ciudadExpedicion,
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
                    console.log(`Fallback order created in Sanity`);
                }
            } catch (orderErr) {
                console.error('Error updating/creating order in Sanity:', orderErr);
            }

            // Send confirmation emails
            const adminApprovedHtml = await render(<OrderEmail
                orderId={String(paymentId)}
                orderNumber={orderNumber || undefined}
                customerName={customerName}
                items={items.map((i: any) => ({
                    title: i.title,
                    quantity: Number(i.quantity),
                    price: Number(i.unit_price)
                }))}
                total={total}
                shipping={orderData?.shipping}
                status='approved'
                address={orderData?.address}
                city={orderData?.city}
                department={orderData?.department}
                isAdmin={true}
                customerEmail={customerEmail}
                customerPhone={customerPhoneData}
                customerDocument={customerDocumentData}
                ciudadExpedicion={ciudadExpedicionData}
            />);

            const customerApprovedHtml = await render(<OrderEmail
                orderId={String(paymentId)}
                orderNumber={orderNumber || undefined}
                customerName={customerName}
                items={items.map((i: any) => ({
                    title: i.title,
                    quantity: Number(i.quantity),
                    price: Number(i.unit_price)
                }))}
                total={total}
                shipping={orderData?.shipping}
                status='approved'
                address={orderData?.address}
                city={orderData?.city}
                department={orderData?.department}
                isAdmin={false}
            />);

            await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL || 'Natural Nutrición <onboarding@resend.dev>',
                to: customerEmail,
                subject: `✅ ¡Pedido Confirmado! ${orderNumber || `#${paymentId}`}`,
                html: customerApprovedHtml
            });

            await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL || 'Natural Nutrición <onboarding@resend.dev>',
                to: adminEmail,
                subject: `✅ Pedido Pagado ${orderNumber || `#${paymentId}`} - ${customerName}`,
                html: adminApprovedHtml
            });

        } else if (status === 'rejected' || status === 'cancelled') {
            // Update existing order to cancelled
            if (orderData) {
                try {
                    await writeClient.patch(orderData._id)
                        .set({
                            status: 'cancelled',
                            paymentId: String(paymentId),
                        })
                        .commit();
                    console.log(`Order ${orderNumber} updated to status: cancelled`);
                } catch (cancelErr) {
                    console.error('Error cancelling order in Sanity:', cancelErr);
                }
            }

            const adminRejectedHtml = await render(<OrderEmail
                orderId={String(paymentId)}
                orderNumber={orderNumber || undefined}
                customerName={customerName}
                items={items.map((i: any) => ({
                    title: i.title,
                    quantity: Number(i.quantity),
                    price: Number(i.unit_price)
                }))}
                total={total}
                status='rejected'
                isAdmin={true}
                customerEmail={customerEmail}
                customerPhone={customerPhoneData}
                customerDocument={customerDocumentData}
                ciudadExpedicion={ciudadExpedicionData}
            />);

            const customerRejectedHtml = await render(<OrderEmail
                orderId={String(paymentId)}
                orderNumber={orderNumber || undefined}
                customerName={customerName}
                items={items.map((i: any) => ({
                    title: i.title,
                    quantity: Number(i.quantity),
                    price: Number(i.unit_price)
                }))}
                total={total}
                status='rejected'
                isAdmin={false}
            />);

            await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL || 'Natural Nutrición <onboarding@resend.dev>',
                to: customerEmail,
                subject: `❌ Problema con tu pedido ${orderNumber || `#${paymentId}`}`,
                html: customerRejectedHtml
            });

            await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL || 'Natural Nutrición <onboarding@resend.dev>',
                to: adminEmail,
                subject: `❌ Pago Rechazado ${orderNumber || `#${paymentId}`} - ${customerName}`,
                html: adminRejectedHtml
            });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error sending notification:', error);
        return NextResponse.json({ error: 'Failed to send notification', details: error.message }, { status: 500 });
    }
}
