import * as React from 'react';

interface OrderEmailProps {
    orderId: string;
    customerName: string;
    items: Array<{
        title: string;
        quantity: number;
        price: number;
    }>;
    total: number;
    status: 'approved' | 'rejected' | 'pending';
}

export const OrderEmail: React.FC<OrderEmailProps> = ({
    orderId,
    customerName,
    items,
    total,
    status,
}) => {
    const isApproved = status === 'approved';
    const title = isApproved ? '¡Gracias por tu compra!' : 'Actualización de tu pedido';
    const color = isApproved ? '#00008B' : '#dc2626'; // Primary Blue or Red

    return (
        <div style={{ fontFamily: 'sans-serif', lineHeight: '1.5', color: '#1a1a1a' }}>
            <div style={{ backgroundColor: color, padding: '20px', textAlign: 'center' }}>
                <h1 style={{ color: '#ffffff', margin: 0 }}>Natural Nutrición</h1>
            </div>

            <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
                <h2 style={{ color: color }}>{title}</h2>
                <p>Hola <strong>{customerName}</strong>,</p>

                {isApproved ? (
                    <p>Tu pedido ha sido confirmado y está siendo procesado. A continuación encontrarás los detalles:</p>
                ) : (
                    <p>Hubo un problema con el pago de tu pedido. El estado actual es: <strong>{status}</strong>.</p>
                )}

                <div style={{ backgroundColor: '#f9fafb', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                    <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#6b7280' }}>REFERENCIA DEL PEDIDO</p>
                    <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>#{orderId}</p>
                </div>

                {isApproved && items.length > 0 && (
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <th style={{ textAlign: 'left', padding: '10px 0', color: '#6b7280', fontSize: '12px' }}>PRODUCTO</th>
                                <th style={{ textAlign: 'right', padding: '10px 0', color: '#6b7280', fontSize: '12px' }}>PRECIO</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '10px 0' }}>
                                        <div style={{ fontWeight: 500 }}>{item.title}</div>
                                        <div style={{ fontSize: '12px', color: '#6b7280' }}>Cant: {item.quantity}</div>
                                    </td>
                                    <td style={{ textAlign: 'right', padding: '10px 0' }}>
                                        ${(item.price * item.quantity).toLocaleString('es-CO')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td style={{ paddingTop: '15px', fontWeight: 'bold' }}>TOTAL</td>
                                <td style={{ paddingTop: '15px', textAlign: 'right', fontWeight: 'bold', fontSize: '18px', color: color }}>
                                    ${total.toLocaleString('es-CO')}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                )}

                <div style={{ textAlign: 'center', marginTop: '40px', borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
                    <p style={{ fontSize: '12px', color: '#9ca3af' }}>
                        Si tienes alguna pregunta, responde a este correo o contáctanos a través de nuestro sitio web.
                    </p>
                    <p style={{ fontSize: '12px', color: '#9ca3af' }}>
                        © {new Date().getFullYear()} Natural Nutrición. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
};
