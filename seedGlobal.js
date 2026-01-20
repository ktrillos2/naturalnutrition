const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function seedGlobal() {
    try {
        const globalDoc = {
            _id: 'globalConfig',
            _type: 'globalConfig',
            content: {
                topBarMessage: 'Envíos a todo el país - Compra segura',
                footerDescription: 'Natural Nutrition es tu aliado en salud y bienestar, ofreciendo productos naturales de la más alta calidad.',
                contactInfo: {
                    address: 'CRA 28 No. 84-58 Polo, Bogotá, Colombia',
                    phones: ['350 2138686', '601 749 8691'],
                    emails: ['info@conasanatural.com', 'coordinador@solarvit.com'],
                    whatsapp: 'https://wa.me/573502138686',
                    openingHours: [
                        'Lunes a Viernes: 8:00 AM - 6:00 PM',
                        'Sábados: 9:00 AM - 2:00 PM'
                    ]
                },
                contactPage: {
                    title: 'Contacto',
                    description: 'Estamos aquí para ayudarte. Contáctanos y resolveremos todas tus dudas sobre nuestros productos naturales.',
                    infoTitle: 'Información de Contacto',
                    formTitle: 'Envíanos un Mensaje'
                },
                socialLinks: [
                    { platform: 'Facebook', url: 'https://facebook.com', _key: 'fb' },
                    { platform: 'Instagram', url: 'https://instagram.com', _key: 'ig' },
                    { platform: 'WhatsApp', url: 'https://wa.me/573502138686', _key: 'wa' },
                ]
            }
        };

        const result = await client.createOrReplace(globalDoc);
        console.log('Global configuration created/updated:', result._id);

    } catch (error) {
        console.error('Error seeding global config:', error.message);
    }
}

seedGlobal();
