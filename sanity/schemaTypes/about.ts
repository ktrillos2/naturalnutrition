import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'about',
    title: 'Página Nosotros',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Título Principal',
            type: 'string',
            initialValue: 'Nosotros',
            description: 'Título principal de la página (ej. Nosotros)'
        }),
        defineField({
            name: 'description',
            title: 'Descripción Principal',
            type: 'text',
            description: 'Texto introductorio sobre la empresa'
        }),
        defineField({
            name: 'mainImage',
            title: 'Imagen Principal',
            type: 'image',
            options: { hotspot: true }
        }),
        defineField({
            name: 'mission',
            title: 'Misión',
            type: 'object',
            fields: [
                defineField({ name: 'title', title: 'Título Misión', type: 'string', initialValue: 'Nuestra Misión' }),
                defineField({ name: 'description', title: 'Descripción Misión', type: 'text' })
            ]
        }),
        defineField({
            name: 'features',
            title: 'Características (Conoce más)',
            type: 'object',
            fields: [
                defineField({ name: 'title', title: 'Título Sección', type: 'string', initialValue: 'Conoce más' }),
                defineField({ name: 'description', title: 'Descripción Sección', type: 'text' }),
                defineField({
                    name: 'items',
                    title: 'Lista de Características',
                    type: 'array',
                    of: [
                        {
                            type: 'object',
                            fields: [
                                defineField({ name: 'title', title: 'Título', type: 'string' }),
                                defineField({ name: 'description', title: 'Descripción', type: 'text' })
                            ]
                        }
                    ]
                })
            ]
        }),
        defineField({
            name: 'stats',
            title: 'Estadísticas',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({ name: 'value', title: 'Valor (ej. 15+)', type: 'string' }),
                        defineField({ name: 'label', title: 'Etiqueta', type: 'string' })
                    ]
                }
            ]
        })
    ],
    preview: {
        prepare() {
            return {
                title: 'Página Nosotros'
            }
        }
    }
})
