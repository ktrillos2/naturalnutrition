const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function seedHistory() {
    try {
        const historyDoc = {
            _id: 'history',
            _type: 'history',
            content: {
                badgeStats: {
                    value: '+8',
                    label: 'años de experiencia'
                },
                smallTitle: 'NUESTRA HISTORIA',
                title: 'Natural Nutrition y su historia',
                description: [
                    {
                        _type: 'block',
                        children: [
                            { _type: 'span', text: 'Natural Nutrition es una compañía ' },
                            { _type: 'span', text: '100% Colombiana', marks: ['strong'] },
                            { _type: 'span', text: ', fundada hace más de 8 años y constituida con el firme propósito de cambiar la vida de los colombianos, a través de la suplementación de alimentos saludables.' }
                        ]
                    },
                    {
                        _type: 'block',
                        children: [
                            { _type: 'span', text: 'Los productos naturales Natural Nutrition son una línea con ' },
                            { _type: 'span', text: 'altísima absorción para el cuerpo', marks: ['strong'] },
                            { _type: 'span', text: ', ideales para no cargar el hígado.' }
                        ]
                    }
                ],
                quote: "Porque tu salud merece LO MEJOR",
                cta: {
                    label: 'Conoce más sobre nosotros',
                    link: '/nosotros'
                }
            }
        };

        const result = await client.createOrReplace(historyDoc);
        console.log('History document created/updated:', result._id);

    } catch (error) {
        console.error('Error seeding history:', error.message);
    }
}

seedHistory();
