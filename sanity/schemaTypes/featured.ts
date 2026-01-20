import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'featured',
    title: 'Productos Destacados',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Título',
            type: 'string',
            initialValue: 'Productos Destacados',
            description: 'Título de la sección en el Home'
        }),
        defineField({
            name: 'subtitle',
            title: 'Subtítulo',
            type: 'string',
            initialValue: 'Descubre nuestra selección de los productos más populares y mejor valorados por nuestros clientes',
            description: 'Texto descriptivo debajo del título'
        }),
        defineField({
            name: 'products',
            title: 'Seleccionar Productos',
            type: 'array',
            description: 'Selecciona los productos que quieres destacar en esta sección',
            of: [
                {
                    type: 'reference',
                    to: [{ type: 'product' }],
                    options: {
                        // Optional: Filter only published products if strictly needed, 
                        // but standard references usually suffice
                    }
                }
            ]
        })
    ],
    preview: {
        prepare() {
            return {
                title: 'Productos Destacados',
                subtitle: 'Gestiona la lista de productos destacados'
            }
        }
    }
})
