import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'distributor',
    title: 'Sección Distribuidores',
    type: 'document',
    fields: [
        defineField({
            name: 'content',
            title: 'Contenido',
            type: 'object',
            options: { collapsible: false },
            fields: [
                defineField({
                    name: 'badgeText',
                    title: 'Texto del Badge',
                    type: 'string',
                    description: 'Texto del badge superior (ej. "🤝 Partners Program")',
                }),
                defineField({
                    name: 'headingLine1',
                    title: 'Título - Línea 1',
                    type: 'string',
                    description: 'Primera línea del heading (ej. "Crecimiento")',
                }),
                defineField({
                    name: 'headingAccent',
                    title: 'Título - Línea Cursiva',
                    type: 'string',
                    description: 'Línea en cursiva con acento (ej. "asegurado.")',
                }),
                defineField({
                    name: 'description',
                    title: 'Descripción',
                    type: 'text',
                    rows: 3,
                    description: 'Párrafo descriptivo debajo del título',
                }),
                defineField({
                    name: 'ctaLabel',
                    title: 'Texto del Botón',
                    type: 'string',
                    description: 'Texto del CTA (ej. "Iniciar solicitud")',
                }),
                defineField({
                    name: 'ctaLink',
                    title: 'Enlace del Botón',
                    type: 'url',
                    description: 'URL del botón CTA (ej. link de WhatsApp)',
                    validation: (Rule) => Rule.uri({ allowRelative: true }),
                }),
                defineField({
                    name: 'benefits',
                    title: 'Beneficios',
                    description: 'Lista de beneficios del accordion',
                    type: 'array',
                    of: [
                        {
                            type: 'object',
                            fields: [
                                defineField({ name: 'title', type: 'string', title: 'Título' }),
                                defineField({ name: 'description', type: 'text', title: 'Descripción', rows: 3 }),
                            ],
                            preview: {
                                select: { title: 'title', subtitle: 'description' }
                            }
                        }
                    ]
                }),
            ],
        }),
    ],
    preview: {
        prepare() {
            return {
                title: 'Sección Distribuidores',
                subtitle: 'Gestiona la sección de aliados/distribuidores'
            }
        }
    }
})
