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
                    name: 'badge',
                    title: 'Badge Text',
                    type: 'string',
                    description: 'Texto del badge (ej. "100% Natural y Orgánico")',
                }),
                defineField({
                    name: 'title',
                    title: 'Título',
                    type: 'array',
                    of: [{ type: 'block' }],
                    description: 'Título principal. Usa negrita para resaltar en color.',
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
                    name: 'secondaryCta',
                    title: 'Botón Secundario',
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
                    name: 'floatingCard',
                    title: 'Tarjeta Flotante',
                    type: 'object',
                    fields: [
                        defineField({ name: 'text', type: 'string', title: 'Texto Pequeño' }),
                        defineField({ name: 'value', type: 'string', title: 'Valor Grande ({ej. +500)' }),
                    ]
                }),
                defineField({
                    name: 'trustBadges',
                    title: 'Íconos de Confianza',
                    type: 'array',
                    of: [
                        {
                            type: 'object',
                            fields: [
                                defineField({ name: 'icon', type: 'string', title: 'Nombre del Ícono (ej. ShieldCheckIcon)' }),
                                defineField({ name: 'text', type: 'string', title: 'Texto' }),
                            ]
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
                })
            ],
        }),
    ],
    preview: {
        select: {
            title: 'content.badge', // Using badge as title proxy since title is PortableText
        },
        prepare(selection) {
            return {
                title: 'Sección Principal (Hero)',
                subtitle: 'Gestiona la sección principal del home'
            }
        }
    }
})
