const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function seedProductBenefits() {
    try {
        const doc = {
            _id: 'productBenefits',
            _type: 'productBenefits',
            badge: 'Por qué elegirnos',
            title: 'Beneficios productos Natural Nutrition',
            subtitle: 'Descubre por qué miles de colombianos confían en nuestros productos para mejorar su calidad de vida',
            cta: {
                label: 'Conoce más',
                link: '/tienda'
            },
            benefits: [
                {
                    title: "Los mejores productos naturales",
                    description: "Trabajamos con los mejores productos naturales para garantizar tu bienestar.",
                    icon: "Leaf",
                    _key: 'b1'
                },
                {
                    title: "Combinaciones únicas",
                    description: "Encuentra combinaciones de productos que te harán sentir mejor que nunca.",
                    icon: "Zap",
                    _key: 'b2'
                },
                {
                    title: "Alta absorción",
                    description: "Los productos son de alta absorción para el cuerpo humano.",
                    icon: "CheckCircle",
                    _key: 'b3'
                },
                {
                    title: "Protección integral",
                    description: "Protegen tu salud, cuidan tu organismo de manera natural.",
                    icon: "Shield",
                    _key: 'b4'
                },
                {
                    title: "Fortalecimiento corporal",
                    description: "Fortalece tu cuerpo con ingredientes necesarios para su desarrollo.",
                    icon: "Heart",
                    _key: 'b5'
                },
                {
                    title: "Fórmulas 100% naturales",
                    description: "Importados y con fórmulas 100% naturales que tu cuerpo agradecerá.",
                    icon: "Award",
                    _key: 'b6'
                },
            ]
        };

        const result = await client.createOrReplace(doc);
        console.log('Product Benefits document created/updated:', result._id);

    } catch (error) {
        console.error('Error seeding product benefits:', error.message);
    }
}

seedProductBenefits();
