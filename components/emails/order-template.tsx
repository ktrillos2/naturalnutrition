import * as React from 'react';

interface OrderEmailProps {
    orderId: string;
    orderNumber?: string;
    customerName: string;
    items: Array<{
        title: string;
        quantity: number;
        price: number;
    }>;
    total: number;
    shipping?: number;
    status: 'approved' | 'rejected' | 'pending';
    address?: string;
    city?: string;
    department?: string;
}

/** Color palette matching the Natural Nutrición brand */
const COLORS = {
    primary: '#1a1a1a',
    primaryLight: '#2d2d2d',
    accent: '#2E7D32',
    accentLight: '#E8F5E9',
    warning: '#F57F17',
    warningLight: '#FFF8E1',
    danger: '#C62828',
    dangerLight: '#FFEBEE',
    white: '#ffffff',
    textPrimary: '#1a1a1a',
    textSecondary: '#6b7280',
    textMuted: '#9ca3af',
    bgLight: '#f9fafb',
    border: '#e5e7eb',
    borderLight: '#f3f4f6',
};

const STATUS_CONFIG = {
    pending: {
        color: COLORS.warning,
        bgColor: COLORS.warningLight,
        icon: '⏳',
        title: 'Pedido Recibido — Pendiente de Pago',
        subtitle: 'Tu pedido ha sido registrado y está a la espera del pago.',
        badge: 'PENDIENTE DE PAGO',
    },
    approved: {
        color: COLORS.accent,
        bgColor: COLORS.accentLight,
        icon: '✅',
        title: '¡Pago Confirmado!',
        subtitle: 'Tu pedido ha sido confirmado y está siendo procesado para envío.',
        badge: 'PAGADO',
    },
    rejected: {
        color: COLORS.danger,
        bgColor: COLORS.dangerLight,
        icon: '❌',
        title: 'Problema con tu Pago',
        subtitle: 'No pudimos procesar tu pago. Por favor, intenta nuevamente.',
        badge: 'RECHAZADO',
    },
};

export const OrderEmail: React.FC<OrderEmailProps> = ({
    orderId,
    orderNumber,
    customerName,
    items,
    total,
    shipping,
    status,
    address,
    city,
    department,
}) => {
    const config = STATUS_CONFIG[status];
    const siteUrl = 'https://naturalnutrition.com.co';
    const logoUrl = `${siteUrl}/images/logo.png`;
    const displayRef = orderNumber || `#${orderId}`;

    return (
        <div style={{
            fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
            lineHeight: '1.6',
            color: COLORS.textPrimary,
            backgroundColor: '#f4f4f5',
            margin: 0,
            padding: 0,
        }}>
            {/* Outer wrapper for email centering */}
            <table width="100%" cellPadding={0} cellSpacing={0} style={{ backgroundColor: '#f4f4f5' }}>
                <tbody>
                    <tr>
                        <td align="center" style={{ padding: '30px 15px' }}>
                            {/* Main container */}
                            <table width="600" cellPadding={0} cellSpacing={0} style={{
                                maxWidth: '600px',
                                width: '100%',
                                backgroundColor: COLORS.white,
                                borderRadius: '12px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
                            }}>
                                <tbody>
                                    {/* Header with logo */}
                                    <tr>
                                        <td style={{
                                            backgroundColor: COLORS.primary,
                                            padding: '28px 40px',
                                            textAlign: 'center',
                                        }}>
                                            <a href={siteUrl} style={{ textDecoration: 'none' }}>
                                                <img
                                                    src={logoUrl}
                                                    alt="Natural Nutrición"
                                                    width="180"
                                                    style={{
                                                        maxWidth: '180px',
                                                        height: 'auto',
                                                        display: 'block',
                                                        margin: '0 auto',
                                                    }}
                                                />
                                            </a>
                                        </td>
                                    </tr>

                                    {/* Status banner */}
                                    <tr>
                                        <td style={{
                                            backgroundColor: config.bgColor,
                                            padding: '24px 40px',
                                            textAlign: 'center',
                                            borderBottom: `3px solid ${config.color}`,
                                        }}>
                                            <div style={{ fontSize: '36px', marginBottom: '8px' }}>{config.icon}</div>
                                            <h1 style={{
                                                margin: '0 0 6px 0',
                                                fontSize: '22px',
                                                fontWeight: 700,
                                                color: config.color,
                                            }}>
                                                {config.title}
                                            </h1>
                                            <p style={{
                                                margin: 0,
                                                fontSize: '14px',
                                                color: COLORS.textSecondary,
                                            }}>
                                                {config.subtitle}
                                            </p>
                                        </td>
                                    </tr>

                                    {/* Body content */}
                                    <tr>
                                        <td style={{ padding: '30px 40px' }}>
                                            {/* Greeting */}
                                            <p style={{ margin: '0 0 20px 0', fontSize: '15px' }}>
                                                Hola <strong>{customerName}</strong>,
                                            </p>

                                            {/* Order reference box */}
                                            <table width="100%" cellPadding={0} cellSpacing={0} style={{
                                                backgroundColor: COLORS.bgLight,
                                                borderRadius: '8px',
                                                marginBottom: '24px',
                                            }}>
                                                <tbody>
                                                    <tr>
                                                        <td style={{ padding: '16px 20px' }}>
                                                            <table width="100%" cellPadding={0} cellSpacing={0}>
                                                                <tbody>
                                                                    <tr>
                                                                        <td>
                                                                            <p style={{
                                                                                margin: '0 0 4px 0',
                                                                                fontSize: '11px',
                                                                                textTransform: 'uppercase' as const,
                                                                                letterSpacing: '1px',
                                                                                color: COLORS.textMuted,
                                                                                fontWeight: 600,
                                                                            }}>
                                                                                Referencia del Pedido
                                                                            </p>
                                                                            <p style={{
                                                                                margin: 0,
                                                                                fontSize: '18px',
                                                                                fontWeight: 700,
                                                                                color: COLORS.textPrimary,
                                                                            }}>
                                                                                {displayRef}
                                                                            </p>
                                                                        </td>
                                                                        <td style={{ textAlign: 'right' }}>
                                                                            <span style={{
                                                                                display: 'inline-block',
                                                                                padding: '5px 14px',
                                                                                borderRadius: '20px',
                                                                                backgroundColor: config.color,
                                                                                color: COLORS.white,
                                                                                fontSize: '11px',
                                                                                fontWeight: 700,
                                                                                letterSpacing: '0.5px',
                                                                            }}>
                                                                                {config.badge}
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                            {/* Shipping info (if available) */}
                                            {(address || city || department) && (
                                                <table width="100%" cellPadding={0} cellSpacing={0} style={{
                                                    marginBottom: '24px',
                                                    borderLeft: `3px solid ${COLORS.border}`,
                                                }}>
                                                    <tbody>
                                                        <tr>
                                                            <td style={{ paddingLeft: '16px' }}>
                                                                <p style={{
                                                                    margin: '0 0 6px 0',
                                                                    fontSize: '11px',
                                                                    textTransform: 'uppercase' as const,
                                                                    letterSpacing: '1px',
                                                                    color: COLORS.textMuted,
                                                                    fontWeight: 600,
                                                                }}>
                                                                    📦 Dirección de Envío
                                                                </p>
                                                                {address && (
                                                                    <p style={{ margin: '0 0 2px 0', fontSize: '14px' }}>{address}</p>
                                                                )}
                                                                <p style={{ margin: 0, fontSize: '14px', color: COLORS.textSecondary }}>
                                                                    {[city, department].filter(Boolean).join(', ')}
                                                                </p>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            )}

                                            {/* Products table */}
                                            {items.length > 0 && (
                                                <table width="100%" cellPadding={0} cellSpacing={0} style={{
                                                    marginBottom: '20px',
                                                    borderCollapse: 'collapse',
                                                }}>
                                                    <thead>
                                                        <tr>
                                                            <th style={{
                                                                textAlign: 'left',
                                                                padding: '10px 0',
                                                                color: COLORS.textMuted,
                                                                fontSize: '11px',
                                                                textTransform: 'uppercase' as const,
                                                                letterSpacing: '1px',
                                                                fontWeight: 600,
                                                                borderBottom: `2px solid ${COLORS.border}`,
                                                            }}>
                                                                Producto
                                                            </th>
                                                            <th style={{
                                                                textAlign: 'center',
                                                                padding: '10px 0',
                                                                color: COLORS.textMuted,
                                                                fontSize: '11px',
                                                                textTransform: 'uppercase' as const,
                                                                letterSpacing: '1px',
                                                                fontWeight: 600,
                                                                borderBottom: `2px solid ${COLORS.border}`,
                                                            }}>
                                                                Cant
                                                            </th>
                                                            <th style={{
                                                                textAlign: 'right',
                                                                padding: '10px 0',
                                                                color: COLORS.textMuted,
                                                                fontSize: '11px',
                                                                textTransform: 'uppercase' as const,
                                                                letterSpacing: '1px',
                                                                fontWeight: 600,
                                                                borderBottom: `2px solid ${COLORS.border}`,
                                                            }}>
                                                                Precio
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {items.map((item, index) => (
                                                            <tr key={index}>
                                                                <td style={{
                                                                    padding: '12px 0',
                                                                    fontSize: '14px',
                                                                    fontWeight: 500,
                                                                    borderBottom: `1px solid ${COLORS.borderLight}`,
                                                                }}>
                                                                    {item.title}
                                                                </td>
                                                                <td style={{
                                                                    padding: '12px 0',
                                                                    textAlign: 'center',
                                                                    fontSize: '14px',
                                                                    color: COLORS.textSecondary,
                                                                    borderBottom: `1px solid ${COLORS.borderLight}`,
                                                                }}>
                                                                    {item.quantity}
                                                                </td>
                                                                <td style={{
                                                                    padding: '12px 0',
                                                                    textAlign: 'right',
                                                                    fontSize: '14px',
                                                                    fontWeight: 500,
                                                                    borderBottom: `1px solid ${COLORS.borderLight}`,
                                                                }}>
                                                                    ${(item.price * item.quantity).toLocaleString('es-CO')}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            )}

                                            {/* Totals */}
                                            {(items.length > 0 || total > 0) && (
                                                <table width="100%" cellPadding={0} cellSpacing={0} style={{
                                                    backgroundColor: COLORS.bgLight,
                                                    borderRadius: '8px',
                                                    marginBottom: '24px',
                                                }}>
                                                    <tbody>
                                                        <tr>
                                                            <td style={{ padding: '16px 20px' }}>
                                                                {shipping !== undefined && shipping > 0 && (
                                                                    <table width="100%" cellPadding={0} cellSpacing={0}>
                                                                        <tbody>
                                                                            <tr>
                                                                                <td style={{ fontSize: '14px', color: COLORS.textSecondary, paddingBottom: '8px' }}>
                                                                                    Envío
                                                                                </td>
                                                                                <td style={{ fontSize: '14px', textAlign: 'right', paddingBottom: '8px' }}>
                                                                                    ${shipping.toLocaleString('es-CO')}
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                )}
                                                                {shipping === 0 && (
                                                                    <table width="100%" cellPadding={0} cellSpacing={0}>
                                                                        <tbody>
                                                                            <tr>
                                                                                <td style={{ fontSize: '14px', color: COLORS.textSecondary, paddingBottom: '8px' }}>
                                                                                    Envío
                                                                                </td>
                                                                                <td style={{ fontSize: '14px', textAlign: 'right', color: COLORS.accent, fontWeight: 600, paddingBottom: '8px' }}>
                                                                                    ¡GRATIS!
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                )}
                                                                <table width="100%" cellPadding={0} cellSpacing={0} style={{
                                                                    borderTop: shipping !== undefined ? `1px solid ${COLORS.border}` : 'none',
                                                                }}>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td style={{
                                                                                fontSize: '16px',
                                                                                fontWeight: 700,
                                                                                paddingTop: shipping !== undefined ? '10px' : '0',
                                                                            }}>
                                                                                TOTAL
                                                                            </td>
                                                                            <td style={{
                                                                                fontSize: '20px',
                                                                                fontWeight: 700,
                                                                                textAlign: 'right',
                                                                                color: config.color,
                                                                                paddingTop: shipping !== undefined ? '10px' : '0',
                                                                            }}>
                                                                                ${total.toLocaleString('es-CO')}
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            )}

                                            {/* Status-specific message */}
                                            {status === 'pending' && (
                                                <table width="100%" cellPadding={0} cellSpacing={0} style={{
                                                    backgroundColor: COLORS.warningLight,
                                                    borderRadius: '8px',
                                                    borderLeft: `4px solid ${COLORS.warning}`,
                                                    marginBottom: '24px',
                                                }}>
                                                    <tbody>
                                                        <tr>
                                                            <td style={{ padding: '16px 20px' }}>
                                                                <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600, color: COLORS.warning }}>
                                                                    Esperando confirmación de pago
                                                                </p>
                                                                <p style={{ margin: 0, fontSize: '13px', color: COLORS.textSecondary }}>
                                                                    Te notificaremos por correo cuando el pago sea procesado. No es necesario que realices la compra nuevamente.
                                                                </p>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            )}

                                            {status === 'approved' && (
                                                <table width="100%" cellPadding={0} cellSpacing={0} style={{
                                                    backgroundColor: COLORS.accentLight,
                                                    borderRadius: '8px',
                                                    borderLeft: `4px solid ${COLORS.accent}`,
                                                    marginBottom: '24px',
                                                }}>
                                                    <tbody>
                                                        <tr>
                                                            <td style={{ padding: '16px 20px' }}>
                                                                <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600, color: COLORS.accent }}>
                                                                    Tu pedido está en camino
                                                                </p>
                                                                <p style={{ margin: 0, fontSize: '13px', color: COLORS.textSecondary }}>
                                                                    Tiempo estimado de entrega: 3-5 días hábiles. Recibirás información de seguimiento pronto.
                                                                </p>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            )}

                                            {status === 'rejected' && (
                                                <table width="100%" cellPadding={0} cellSpacing={0} style={{
                                                    backgroundColor: COLORS.dangerLight,
                                                    borderRadius: '8px',
                                                    borderLeft: `4px solid ${COLORS.danger}`,
                                                    marginBottom: '24px',
                                                }}>
                                                    <tbody>
                                                        <tr>
                                                            <td style={{ padding: '16px 20px' }}>
                                                                <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600, color: COLORS.danger }}>
                                                                    ¿Necesitas ayuda?
                                                                </p>
                                                                <p style={{ margin: 0, fontSize: '13px', color: COLORS.textSecondary }}>
                                                                    Puedes intentar nuevamente con otro medio de pago o contactarnos para asistencia personalizada.
                                                                </p>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            )}

                                            {/* CTA Button */}
                                            <table width="100%" cellPadding={0} cellSpacing={0}>
                                                <tbody>
                                                    <tr>
                                                        <td align="center" style={{ paddingBottom: '10px' }}>
                                                            <a
                                                                href={status === 'rejected' ? `${siteUrl}/checkout` : siteUrl}
                                                                style={{
                                                                    display: 'inline-block',
                                                                    padding: '14px 36px',
                                                                    backgroundColor: COLORS.primary,
                                                                    color: COLORS.white,
                                                                    textDecoration: 'none',
                                                                    borderRadius: '8px',
                                                                    fontSize: '14px',
                                                                    fontWeight: 600,
                                                                    letterSpacing: '0.3px',
                                                                }}
                                                            >
                                                                {status === 'rejected' ? 'Intentar Nuevamente' : 'Visitar Nuestra Tienda'}
                                                            </a>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>

                                    {/* Footer */}
                                    <tr>
                                        <td style={{
                                            backgroundColor: COLORS.primary,
                                            padding: '24px 40px',
                                            textAlign: 'center',
                                        }}>
                                            <p style={{
                                                margin: '0 0 8px 0',
                                                fontSize: '12px',
                                                color: 'rgba(255,255,255,0.7)',
                                            }}>
                                                Si tienes alguna pregunta, responde a este correo o visita nuestro sitio web.
                                            </p>
                                            <p style={{
                                                margin: '0 0 12px 0',
                                                fontSize: '12px',
                                                color: 'rgba(255,255,255,0.5)',
                                            }}>
                                                © {new Date().getFullYear()} Natural Nutrición. Todos los derechos reservados.
                                            </p>
                                            <p style={{
                                                margin: 0,
                                                fontSize: '11px',
                                                color: 'rgba(255,255,255,0.4)',
                                            }}>
                                                Desarrollado por{' '}
                                                <a
                                                    href="https://www.kytcode.lat"
                                                    style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}
                                                >
                                                    K&T
                                                </a>{' '}
                                                ♥
                                            </p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
