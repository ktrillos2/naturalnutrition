import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'history',
    title: 'Historia / Nosotros',
    type: 'document',
    fields: [
        defineField({
            name: 'content',
            title: 'Contenido',
            type: 'object',
            options: { collapsible: false },
            fields: [
                defineField({
                    name: 'badgeStats',
                    title: 'Badge Estadístico (Círculo Flotante)',
                    type: 'object',
                    fields: [
                        defineField({ name: 'value', title: 'Valor (ej. +8)', type: 'string' }),
                        defineField({ name: 'label', title: 'Texto (ej. años de experiencia)', type: 'string' })
                    ]
                }),
                defineField({
                    name: 'smallTitle',
                    title: 'Título Pequeño (Accent)',
                    type: 'string',
                    description: 'Texto pequeño en mayúsculas (ej. NUESTRA HISTORIA)'
                }),
                defineField({
                    name: 'title',
                    title: 'Título Principal',
                    type: 'string',
                    description: 'Título grande principal'
                }),
                defineField({
                    name: 'description',
                    title: 'Descripción',
                    type: 'array',
                    of: [{ type: 'block' }],
                    description: 'Párrafos de descripción'
                }),
                defineField({
                    name: 'quote',
                    title: 'Frase Destacada/Cita',
                    type: 'string',
                    description: 'Frase en el recuadro con borde (ej. "Porque tu salud merece LO MEJOR")'
                }),
                defineField({
                    name: 'cta',
                    title: 'Botón',
                    type: 'object',
                    fields: [
                        defineField({ name: 'label', title: 'Texto del Botón', type: 'string' }),
                        defineField({ name: 'link', title: 'Enlace', type: 'string' })
                    ]
                }),
                defineField({
                    name: 'image',
                    title: 'Imagen Principal',
                    type: 'image',
                    options: { hotspot: true },
                    fields: [
                        defineField({ name: 'alt', title: 'Texto Alternativo', type: 'string' })
                    ]
                })
            ]
        })
    ],
    preview: {
        select: {
            title: 'content.title',
        },
        prepare({ title }) {
            return {
                title: 'Sección Historia',
                subtitle: title || 'Gestiona la sección de historia'
            }
        }
    }
})
