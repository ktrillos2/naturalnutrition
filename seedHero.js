const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function seedHero() {
    try {
        const heroDoc = {
            _id: 'hero',
            _type: 'hero',
            content: {
                badge: '100% Natural y Orgánico',
                title: [
                    {
                        _type: 'block',
                        style: 'normal',
                        children: [
                            { _type: 'span', text: 'Tu bienestar comienza con lo ' },
                            {
                                _type: 'span',
                                text: 'natural',
                                marks: ['strong']
                            }
                        ]
                    }
                ],
                description: 'Descubre nuestra selección de productos naturales, suplementos dietarios y fitoterapéuticos de la más alta calidad para una vida más saludable.',
                primaryCta: {
                    label: 'Ver Productos',
                    link: '/tienda'
                },
                secondaryCta: {
                    label: 'Explorar Categorías',
                    link: '/tienda'
                },
                floatingCard: {
                    text: 'Productos disponibles',
                    value: '+500'
                },
                trustBadges: [
                    { icon: 'ShieldCheckIcon', text: 'Registro INVIMA' },
                    { icon: 'TruckIcon', text: 'Envío Nacional' },
                    { icon: 'LeafIcon', text: '100% Natural' }
                ],
                benefits: [
                    {
                        icon: 'TruckIcon',
                        title: 'Envío a Todo el País',
                        description: 'Entregas rápidas y seguras a cualquier parte de Colombia'
                    },
                    {
                        icon: 'ShieldCheckIcon',
                        title: 'Registro INVIMA',
                        description: 'Todos nuestros productos cuentan con los permisos sanitarios requeridos'
                    },
                    {
                        icon: 'LeafIcon',
                        title: '100% Natural',
                        description: 'Productos de origen natural sin químicos ni aditivos artificiales'
                    },
                    {
                        icon: 'PhoneIcon',
                        title: 'Atención Personalizada',
                        description: 'Asesoría profesional para elegir los productos ideales para ti'
                    }
                ]
            }
        };

        const result = await client.createOrReplace(heroDoc);
        console.log('Hero document created/updated:', result._id);

        // Optional: Delete old 'home' document if exists to clean up
        try {
            await client.delete('home');
            console.log('Cleaned up old home document');
        } catch (e) { /* ignore */ }

    } catch (error) {
        console.error('Error seeding hero:', error.message);
    }
}

seedHero();
