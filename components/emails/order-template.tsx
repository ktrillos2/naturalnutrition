import * as React from 'react';
import {
    Html,
    Head,
    Body,
    Container,
    Section,
    Text,
    Img,
    Row,
    Column,
    Link,
    Hr,
} from '@react-email/components';

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

const COLORS = {
    primary: '#1a1a1a',
    accent: '#2E7D32',
    accentLight: '#E8F5E9',
    warning: '#1a1a1a', // using neutral for pending to look more premium
    warningLight: '#f3f4f6',
    danger: '#C62828',
    dangerLight: '#FFEBEE',
    white: '#ffffff',
    textPrimary: '#1a1a1a',
    textSecondary: '#6b7280',
    textMuted: '#9ca3af',
    bgLight: '#f9fafb',
    border: '#e5e7eb',
};

const STATUS_CONFIG = {
    pending: {
        color: COLORS.warning,
        bgColor: COLORS.warningLight,
        icon: '⏳',
        title: 'Pedido Recibido',
        subtitle: 'Tu pedido ha sido registrado y está a la espera del pago.',
        badge: 'PENDIENTE',
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
        <Html>
            <Head>
                <style>{`
                    @media only screen and (max-width: 600px) {
                        .container {
                            width: 100% !important;
                            padding: 0 10px !important;
                        }
                        .content {
                            padding: 20px 15px !important;
                        }
                        .header {
                            padding: 20px !important;
                        }
                        .product-title {
                            font-size: 13px !important;
                        }
                        .product-price {
                            font-size: 13px !important;
                        }
                        .totals {
                            font-size: 16px !important;
                        }
                    }
                `}</style>
            </Head>
            <Body style={main}>
                <Container style={container} className="container">

                    {/* Header */}
                    <Section style={header} className="header">
                        <Link href={siteUrl}>
                            <Img src={logoUrl} width="160" alt="Natural Nutrición" style={logo} />
                        </Link>
                    </Section>

                    {/* Status Banner */}
                    <Section style={{ ...statusBanner, backgroundColor: config.bgColor, borderBottom: `3px solid ${config.color}` }} className="content">
                        <Text style={statusIcon}>{config.icon}</Text>
                        <Text style={{ ...statusTitle, color: config.color }}>{config.title}</Text>
                        <Text style={statusSubtitle}>{config.subtitle}</Text>
                    </Section>

                    {/* Content */}
                    <Section style={contentContainer} className="content">
                        <Text style={greeting}>Hola <strong>{customerName}</strong>,</Text>

                        {/* Order Ref */}
                        <Section style={refBox}>
                            <Row>
                                <Column>
                                    <Text style={refLabel}>Referencia del Pedido</Text>
                                    <Text style={refNumber}>{displayRef}</Text>
                                </Column>
                                <Column align="right">
                                    <Text style={{ ...badge, backgroundColor: config.color }}>{config.badge}</Text>
                                </Column>
                            </Row>
                        </Section>

                        {/* Shipping */}
                        {(address || city || department) && (
                            <Section style={shippingBox}>
                                <Text style={shippingLabel}>📦 Dirección de Envío</Text>
                                {address && <Text style={shippingText}>{address}</Text>}
                                <Text style={shippingTextMuted}>{[city, department].filter(Boolean).join(', ')}</Text>
                            </Section>
                        )}

                        {/* Items Table */}
                        {items.length > 0 && (
                            <Section style={tableContainer}>
                                <Row style={tableHeaderRow}>
                                    <Column style={colProduct}><Text style={tableHeader}>Producto</Text></Column>
                                    <Column style={colQty}><Text style={{ ...tableHeader, textAlign: 'center' }}>Cant</Text></Column>
                                    <Column style={colPrice}><Text style={{ ...tableHeader, textAlign: 'right' }}>Precio</Text></Column>
                                </Row>

                                {items.map((item, index) => (
                                    <Row key={index} style={tableRow}>
                                        <Column style={colProduct}>
                                            <Text style={productTitle} className="product-title">{item.title}</Text>
                                        </Column>
                                        <Column style={colQty}>
                                            <Text style={productQty}>{item.quantity}</Text>
                                        </Column>
                                        <Column style={colPrice}>
                                            <Text style={productPrice} className="product-price">${(item.price * item.quantity).toLocaleString('es-CO')}</Text>
                                        </Column>
                                    </Row>
                                ))}
                            </Section>
                        )}

                        {/* Totals Box */}
                        {(items.length > 0 || total > 0) && (
                            <Section style={totalsBox}>
                                {shipping !== undefined && shipping > 0 && (
                                    <Row style={totalRow}>
                                        <Column><Text style={subtotalLabel}>Envío</Text></Column>
                                        <Column align="right"><Text style={subtotalValue}>${shipping.toLocaleString('es-CO')}</Text></Column>
                                    </Row>
                                )}
                                {shipping === 0 && (
                                    <Row style={totalRow}>
                                        <Column><Text style={subtotalLabel}>Envío</Text></Column>
                                        <Column align="right"><Text style={freeShipping}>¡GRATIS!</Text></Column>
                                    </Row>
                                )}

                                <Hr style={hr} />

                                <Row>
                                    <Column><Text style={totalLabel}>TOTAL</Text></Column>
                                    <Column align="right">
                                        <Text style={{ ...totalValue, color: config.color }} className="totals">
                                            ${total.toLocaleString('es-CO')}
                                        </Text>
                                    </Column>
                                </Row>
                            </Section>
                        )}

                        {/* Status Messages */}
                        {status === 'pending' && (
                            <Section style={{ ...messageBox, backgroundColor: COLORS.warningLight, borderLeftColor: COLORS.warning }}>
                                <Text style={{ ...messageTitle, color: COLORS.warning }}>Esperando confirmación de pago</Text>
                                <Text style={messageText}>Te notificaremos cuando el pago sea procesado. No es necesario realizar la compra nuevamente.</Text>
                            </Section>
                        )}

                        {status === 'approved' && (
                            <Section style={{ ...messageBox, backgroundColor: COLORS.accentLight, borderLeftColor: COLORS.accent }}>
                                <Text style={{ ...messageTitle, color: COLORS.accent }}>Tu pedido está en camino</Text>
                                <Text style={messageText}>Tiempo estimado de entrega: 3-5 días hábiles. Recibirás información de seguimiento pronto.</Text>
                            </Section>
                        )}

                        {status === 'rejected' && (
                            <Section style={{ ...messageBox, backgroundColor: COLORS.dangerLight, borderLeftColor: COLORS.danger }}>
                                <Text style={{ ...messageTitle, color: COLORS.danger }}>¿Necesitas ayuda?</Text>
                                <Text style={messageText}>Puedes intentar con otro medio de pago o contactarnos para asistencia.</Text>
                            </Section>
                        )}

                        {/* CTA Button */}
                        <Section style={{ textAlign: 'center', marginTop: '30px', paddingBottom: '10px' }}>
                            <Link href={status === 'rejected' ? `${siteUrl}/checkout` : siteUrl} style={button}>
                                {status === 'rejected' ? 'Intentar Nuevamente' : 'Visitar Nuestra Tienda'}
                            </Link>
                        </Section>
                    </Section>

                    {/* Footer */}
                    <Section style={footer}>
                        <Text style={footerText}>Si tienes alguna pregunta, responde a este correo o visita nuestra web.</Text>
                        <Text style={footerTextMut}>{`© ${new Date().getFullYear()} Natural Nutrición. Todos los derechos reservados.`}</Text>
                        <Text style={footerBranding}>
                            Desarrollado por <Link href="https://www.kytcode.lat" style={footerLink}>K&T</Link> ♥
                        </Text>
                    </Section>

                </Container>
            </Body>
        </Html>
    );
};

// Styles
const main = {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    backgroundColor: '#f4f4f5',
    margin: 0,
    padding: '20px 0',
};

const container = {
    backgroundColor: COLORS.white,
    maxWidth: '600px',
    margin: '0 auto',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
};

const header = {
    backgroundColor: COLORS.primary,
    padding: '30px 40px',
    textAlign: 'center' as const,
};

const logo = {
    margin: '0 auto',
    display: 'block',
};

const statusBanner = {
    padding: '24px 40px',
    textAlign: 'center' as const,
};

const statusIcon = {
    fontSize: '32px',
    margin: '0 0 10px 0',
    lineHeight: 1,
};

const statusTitle = {
    fontSize: '20px',
    fontWeight: 700,
    margin: '0 0 8px 0',
};

const statusSubtitle = {
    fontSize: '14px',
    color: COLORS.textSecondary,
    margin: 0,
};

const contentContainer = {
    padding: '32px 40px',
};

const greeting = {
    fontSize: '15px',
    color: COLORS.textPrimary,
    margin: '0 0 24px 0',
};

const refBox = {
    backgroundColor: COLORS.bgLight,
    borderRadius: '8px',
    padding: '16px 20px',
    marginBottom: '24px',
};

const refLabel = {
    fontSize: '11px',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    color: COLORS.textMuted,
    fontWeight: 700,
    margin: '0 0 4px 0',
};

const refNumber = {
    fontSize: '18px',
    fontWeight: 700,
    color: COLORS.textPrimary,
    margin: 0,
};

const badge = {
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: '20px',
    color: COLORS.white,
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.5px',
    margin: 0,
    marginTop: '6px',
};

const shippingBox = {
    marginBottom: '24px',
    borderLeft: `3px solid ${COLORS.border}`,
    paddingLeft: '16px',
};

const shippingLabel = {
    fontSize: '11px',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    color: COLORS.textMuted,
    fontWeight: 700,
    margin: '0 0 6px 0',
};

const shippingText = {
    fontSize: '14px',
    color: COLORS.textPrimary,
    margin: '0 0 2px 0',
};

const shippingTextMuted = {
    fontSize: '14px',
    color: COLORS.textSecondary,
    margin: 0,
};

const tableContainer = {
    marginBottom: '24px',
};

const tableHeaderRow = {
    borderBottom: `2px solid ${COLORS.border}`,
};

const colProduct = { width: '60%' };
const colQty = { width: '15%', textAlign: 'center' as const };
const colPrice = { width: '25%', textAlign: 'right' as const };

const tableHeader = {
    color: COLORS.textMuted,
    fontSize: '11px',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    fontWeight: 700,
    padding: '12px 0',
    margin: 0,
};

const tableRow = {
    borderBottom: `1px solid ${COLORS.border}`,
};

const productTitle = {
    fontSize: '14px',
    fontWeight: 500,
    color: COLORS.textPrimary,
    padding: '14px 0',
    margin: 0,
};

const productQty = {
    fontSize: '14px',
    color: COLORS.textSecondary,
    padding: '14px 0',
    margin: 0,
};

const productPrice = {
    fontSize: '14px',
    fontWeight: 600,
    color: COLORS.textPrimary,
    padding: '14px 0',
    margin: 0,
};

const totalsBox = {
    backgroundColor: COLORS.bgLight,
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '24px',
};

const totalRow = {
    marginBottom: '8px',
};

const subtotalLabel = {
    fontSize: '14px',
    color: COLORS.textSecondary,
    margin: 0,
};

const subtotalValue = {
    fontSize: '14px',
    color: COLORS.textPrimary,
    margin: 0,
};

const freeShipping = {
    fontSize: '13px',
    fontWeight: 700,
    color: COLORS.accent,
    margin: 0,
};

const hr = {
    borderColor: COLORS.border,
    margin: '12px 0',
};

const totalLabel = {
    fontSize: '15px',
    fontWeight: 700,
    margin: 0,
    color: COLORS.textPrimary,
};

const totalValue = {
    fontSize: '20px',
    fontWeight: 800,
    margin: 0,
};

const messageBox = {
    borderRadius: '8px',
    borderLeftWidth: '4px',
    borderLeftStyle: 'solid' as const,
    padding: '16px 20px',
    marginBottom: '24px',
};

const messageTitle = {
    fontSize: '14px',
    fontWeight: 700,
    margin: '0 0 6px 0',
};

const messageText = {
    fontSize: '13.5px',
    color: COLORS.textSecondary,
    lineHeight: '1.5',
    margin: 0,
};

const button = {
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    padding: '14px 32px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    textDecoration: 'none',
    display: 'inline-block',
};

const footer = {
    backgroundColor: COLORS.primary,
    padding: '30px 40px',
    textAlign: 'center' as const,
};

const footerText = {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.8)',
    margin: '0 0 12px 0',
};

const footerTextMut = {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.5)',
    margin: '0 0 14px 0',
};

const footerBranding = {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.4)',
    margin: 0,
};

const footerLink = {
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'underline',
};
