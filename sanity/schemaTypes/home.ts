import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'home',
    title: 'Inicio',
    type: 'document',
    fields: [
        defineField({
            name: 'hero',
            title: 'Sección Principal',
            type: 'object',
            options: {
                collapsible: true,
                collapsed: false,
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
                        defineField({ name: 'value', type: 'string', title: 'Valor Grande (ej. +500)' }),
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
                })
            ],
        }),
    ],
})
