import { Resend } from 'resend';
import { client } from "@/sanity/lib/client";
import { ContactEmail } from '@/components/emails/contact-template';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { name, email, phone, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Fetch Admin Email from Sanity
        const globalConfig = await client.fetch(`*[_type == "globalConfig"][0]{ content }`);
        const adminEmail = globalConfig?.content?.contactInfo?.emails?.[0] || 'naturalnutricion@gmail.com';

        // Send Email to Admin
        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'Natural Nutrición <onboarding@resend.dev>',
            to: adminEmail,
            subject: `Nuevo Mensaje de Contacto - ${name}`,
            replyTo: email,
            react: <ContactEmail
                name={name}
                email={email}
                phone={phone}
                message={message}
            />
        });

        if (error) {
            console.error("Resend error:", error);
            return NextResponse.json({ error }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Error sending contact email:', error);
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
