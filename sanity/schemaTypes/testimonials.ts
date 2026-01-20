import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'testimonials',
    title: 'Testimonios',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Título',
            type: 'string',
            initialValue: 'Lo que dicen nuestros clientes',
            description: 'Título principal de la sección'
        }),
        defineField({
            name: 'subtitle',
            title: 'Subtítulo',
            type: 'string',
            initialValue: 'Miles de colombianos confían en Natural Nutrition para cuidar su salud y bienestar',
            description: 'Texto descriptivo debajo del título'
        }),
        defineField({
            name: 'items',
            title: 'Testimonios',
            type: 'array',
            description: 'Lista de testimonios',
            of: [
                {
                    type: 'object',
                    title: 'Testimonio',
                    fields: [
                        defineField({ name: 'name', title: 'Nombre', type: 'string' }),
                        defineField({ name: 'location', title: 'Ubicación', type: 'string' }),
                        defineField({ name: 'content', title: 'Comentario', type: 'text', rows: 3 }),
                        defineField({
                            name: 'rating',
                            title: 'Calificación (1-5)',
                            type: 'number',
                            initialValue: 5,
                            validation: Rule => Rule.min(1).max(5)
                        }),
                        defineField({ name: 'product', title: 'Producto Mencionado', type: 'string' }),
                        defineField({ name: 'image', title: 'Foto (Opcional)', type: 'image' })
                    ],
                    preview: {
                        select: {
                            title: 'name',
                            subtitle: 'product'
                        }
                    }
                }
            ]
        })
    ],
    preview: {
        prepare() {
            return {
                title: 'Sección de Testimonios',
                subtitle: 'Gestiona los testimonios de clientes'
            }
        }
    }
})
