import * as React from 'react';

interface ContactEmailProps {
    name: string;
    email: string;
    phone?: string;
    message: string;
}

export const ContactEmail: React.FC<ContactEmailProps> = ({
    name,
    email,
    phone,
    message,
}) => (
    <div style={{ fontFamily: 'sans-serif', lineHeight: '1.5', color: '#1a1a1a' }}>
        <div style={{ backgroundColor: '#00008B', padding: '20px', textAlign: 'center' }}>
            <h1 style={{ color: '#ffffff', margin: 0 }}>Nuevo Mensaje de Contacto</h1>
        </div>

        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <p>Has recibido un nuevo mensaje a través del formulario de contacto:</p>

            <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                <p><strong>Nombre:</strong> {name}</p>
                <p><strong>Email:</strong> {email}</p>
                {phone && <p><strong>Teléfono:</strong> {phone}</p>}
                <hr style={{ borderColor: '#e5e7eb', margin: '15px 0' }} />
                <p><strong>Mensaje:</strong></p>
                <p style={{ whiteSpace: 'pre-wrap' }}>{message}</p>
            </div>

            <div style={{ textAlign: 'center', marginTop: '40px', borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
                <p style={{ fontSize: '12px', color: '#9ca3af' }}>
                    Este mensaje fue enviado desde el sitio web de Natural Nutrición.
                </p>
            </div>
        </div>
    </div>
);
