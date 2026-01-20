const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function seedTestimonials() {
    try {
        const testimonialsDoc = {
            _id: 'testimonials',
            _type: 'testimonials',
            title: 'Lo que dicen nuestros clientes',
            subtitle: 'Miles de colombianos confían en Natural Nutrition para cuidar su salud y bienestar',
            items: [
                {
                    name: "María García",
                    location: "Bogotá",
                    rating: 5,
                    content: "Desde que empecé a tomar los suplementos de Natural Nutrition, mi energía ha mejorado notablemente. Los productos son de excelente calidad y se nota que son naturales.",
                    product: "Colágeno Hidrolizado",
                    _key: 't1'
                },
                {
                    name: "Carlos Rodríguez",
                    location: "Medellín",
                    rating: 5,
                    content: "Excelente servicio y productos de primera calidad. He probado varias marcas pero Natural Nutrition es definitivamente la mejor opción para mi salud.",
                    product: "Omega 3",
                    _key: 't2'
                },
                {
                    name: "Ana Martínez",
                    location: "Cali",
                    rating: 5,
                    content: "Los productos tienen registro INVIMA lo cual me da mucha confianza. Además, la absorción es muy buena y no me causan ninguna molestia estomacal.",
                    product: "Vitamina D3",
                    _key: 't3'
                },
                {
                    name: "Jorge Hernández",
                    location: "Barranquilla",
                    rating: 5,
                    content: "Mi médico me recomendó suplementarme y elegí Natural Nutrition. Estoy muy satisfecho con los resultados y el precio es muy accesible.",
                    product: "Magnesio + Zinc",
                    _key: 't4'
                },
                {
                    name: "Laura Pérez",
                    location: "Cartagena",
                    rating: 5,
                    content: "Llevo más de un año comprando en Natural Nutrition. La calidad es consistente y siempre encuentro lo que necesito para mi bienestar.",
                    product: "Multivitamínico",
                    _key: 't5'
                },
            ]
        };

        const result = await client.createOrReplace(testimonialsDoc);
        console.log('Testimonials document created/updated:', result._id);

    } catch (error) {
        console.error('Error seeding testimonials:', error.message);
    }
}

seedTestimonials();
