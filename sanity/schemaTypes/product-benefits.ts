import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'productBenefits',
    title: 'Beneficios del Producto',
    type: 'document',
    fields: [
        defineField({
            name: 'badge',
            title: 'Badge/Etiqueta',
            type: 'string',
            initialValue: 'Por qué elegirnos',
            description: 'Texto pequeño encima del título'
        }),
        defineField({
            name: 'title',
            title: 'Título',
            type: 'string',
            initialValue: 'Beneficios productos Natural Nutrition',
            description: 'Título principal de la sección'
        }),
        defineField({
            name: 'subtitle',
            title: 'Subtítulo',
            type: 'string',
            initialValue: 'Descubre por qué miles de colombianos confían en nuestros productos para mejorar su calidad de vida',
            description: 'Texto descriptivo debajo del título'
        }),
        defineField({
            name: 'cta',
            title: 'Botón CTA',
            type: 'object',
            fields: [
                defineField({ name: 'label', title: 'Texto del Botón', type: 'string', initialValue: 'Conoce más' }),
                defineField({ name: 'link', title: 'Enlace', type: 'string', initialValue: '/tienda' })
            ]
        }),
        defineField({
            name: 'benefits',
            title: 'Lista de Beneficios',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({ name: 'title', title: 'Título', type: 'string' }),
                        defineField({ name: 'description', title: 'Descripción', type: 'text' }),
                        defineField({
                            name: 'icon',
                            title: 'Nombre del Icono',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Check Circle', value: 'CheckCircle' },
                                    { title: 'Leaf', value: 'Leaf' },
                                    { title: 'Shield', value: 'Shield' },
                                    { title: 'Heart', value: 'Heart' },
                                    { title: 'Zap', value: 'Zap' },
                                    { title: 'Award', value: 'Award' }
                                ]
                            }
                        })
                    ],
                    preview: {
                        select: {
                            title: 'title',
                            subtitle: 'icon'
                        }
                    }
                }
            ]
        })
    ],
    preview: {
        prepare() {
            return {
                title: 'Sección de Beneficios del Producto'
            }
        }
    }
})
