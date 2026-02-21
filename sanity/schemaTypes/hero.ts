import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'hero',
    title: 'Hero',
    type: 'document',
    fields: [
        defineField({
            name: 'content',
            title: 'Contenido',
            type: 'object',
            options: {
                collapsible: false,
            },
            fields: [
                defineField({
                    name: 'headingLine1',
                    title: 'Título - Línea 1',
                    type: 'string',
                    description: 'Primera línea del heading (ej. "Tu bienestar")',
                }),
                defineField({
                    name: 'headingAccent',
                    title: 'Título - Línea Cursiva',
                    type: 'string',
                    description: 'Línea en cursiva destacada (ej. "100% natural")',
                }),
                defineField({
                    name: 'headingLine2',
                    title: 'Título - Línea 3',
                    type: 'string',
                    description: 'Tercera línea del heading (ej. "en tu cuerpo.")',
                }),
                defineField({
                    name: 'description',
                    title: 'Descripción',
                    type: 'text',
                    rows: 3,
                }),
                defineField({
                    name: 'primaryCta',
                    title: 'Botón Principal',
                    type: 'object',
                    fields: [
                        defineField({ name: 'label', type: 'string', title: 'Texto' }),
                        defineField({ name: 'link', type: 'string', title: 'Enlace' }),
                    ],
                }),
                defineField({
                    name: 'image',
                    title: 'Imagen Hero',
                    type: 'image',
                    options: { hotspot: true },
                    fields: [
                        defineField({
                            name: 'alt',
                            type: 'string',
                            title: 'Texto Alternativo',
                        }),
                    ],
                }),
                defineField({
                    name: 'certificationLabel',
                    title: 'Certificación - Etiqueta',
                    type: 'string',
                    description: 'Etiqueta pequeña (ej. "Certificación")',
                }),
                defineField({
                    name: 'certificationValue',
                    title: 'Certificación - Valor',
                    type: 'string',
                    description: 'Valor principal (ej. "Invima Vigente")',
                }),
                defineField({
                    name: 'marqueeItems',
                    title: 'Items del Marquee',
                    description: 'Textos que aparecen en la barra scrolling inferior',
                    type: 'array',
                    of: [
                        {
                            type: 'object',
                            fields: [
                                defineField({ name: 'icon', type: 'string', title: 'Ícono/Emoji' }),
                                defineField({ name: 'text', type: 'string', title: 'Texto' }),
                            ],
                            preview: {
                                select: { title: 'text', subtitle: 'icon' }
                            }
                        }
                    ]
                }),
                defineField({
                    name: 'benefits',
                    title: 'Beneficios (Sección Inferior)',
                    description: 'Sección con íconos grandes debajo del Hero',
                    type: 'array',
                    of: [
                        {
                            type: 'object',
                            fields: [
                                defineField({
                                    name: 'icon',
                                    type: 'string',
                                    title: 'Nombre del Ícono',
                                    description: 'Puede ser: TruckIcon, ShieldCheckIcon, LeafIcon, PhoneIcon',
                                    options: {
                                        list: [
                                            { title: 'Camión (Envíos)', value: 'TruckIcon' },
                                            { title: 'Escudo (Seguridad)', value: 'ShieldCheckIcon' },
                                            { title: 'Hoja (Natural)', value: 'LeafIcon' },
                                            { title: 'Teléfono (Soporte)', value: 'PhoneIcon' }
                                        ]
                                    }
                                }),
                                defineField({ name: 'title', type: 'string', title: 'Título' }),
                                defineField({ name: 'description', type: 'text', title: 'Descripción', rows: 2 }),
                            ],
                            preview: {
                                select: {
                                    title: 'title',
                                    subtitle: 'description'
                                }
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
                title: 'Sección Principal (Hero)',
                subtitle: 'Gestiona la sección principal del home'
            }
        }
    }
})
