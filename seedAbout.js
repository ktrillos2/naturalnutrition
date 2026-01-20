const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function seedAbout() {
    try {
        const doc = {
            _id: 'about',
            _type: 'about',
            title: 'Nosotros',
            description: 'Somos una empresa constituida en Colombia desde diciembre de 2009. Nos dedicamos a la comercialización y distribución de productos naturales, importados para el cuidado de la salud como: suplementos, vitaminas, minerales, fitoterapéuticos y belleza.',
            // mainImage would ideally be uploaded here, but user can do it in Studio or we assume existing asset if possible.
            // For now, we skip image upload in seed or link if we had an assetId.
            mission: {
                title: 'Nuestra Misión',
                description: 'Satisfacer las necesidades de salud y bienestar del país. Suministramos productos naturales, con niveles de calidad, ambientales y de seguridad requeridos.'
            },
            features: {
                title: 'Conoce más',
                description: 'Descubre por qué somos tu mejor opción para productos naturales de calidad.',
                items: [
                    { title: 'Productos Importados', description: 'Encuentra los mejores productos importados a excelentes precios.', _key: 'f1' },
                    { title: 'Registro Sanitario', description: 'Todos nuestros productos cuentan con registro sanitario Invima.', _key: 'f2' },
                    { title: 'Composiciones Únicas', description: 'Disfruta de composiciones únicas que te brindan una gran variedad en los productos.', _key: 'f3' },
                    { title: 'Ingredientes Naturales', description: 'Utilizamos ingredientes naturales que le aportan a tu cuerpo salud y nutrición.', _key: 'f4' },
                ]
            },
            stats: [
                { value: '15+', label: 'Años de experiencia', _key: 's1' },
                { value: '500+', label: 'Productos disponibles', _key: 's2' },
                { value: '100%', label: 'Registro Invima', _key: 's3' },
                { value: '10K+', label: 'Clientes satisfechos', _key: 's4' },
            ]
        };

        const result = await client.createOrReplace(doc);
        console.log('About page document created/updated:', result._id);

    } catch (error) {
        console.error('Error seeding about page:', error.message);
    }
}

seedAbout();
