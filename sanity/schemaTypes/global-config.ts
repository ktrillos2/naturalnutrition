import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'globalConfig',
    title: 'Configuración Global',
    type: 'document',
    fields: [
        defineField({
            name: 'content',
            title: 'Contenido',
            type: 'object',
            options: { collapsible: false },
            fields: [
                defineField({
                    name: 'logo',
                    title: 'Logo',
                    type: 'image',
                    options: { hotspot: true },
                    fields: [
                        defineField({ name: 'alt', title: 'Texto Alternativo', type: 'string' })
                    ]
                }),
                defineField({
                    name: 'topBarMessage',
                    title: 'Mensaje Barra Superior',
                    type: 'string',
                    description: 'Texto que aparece en la barra superior (ej. Envíos a todo el país...)'
                }),
                defineField({
                    name: 'footerDescription',
                    title: 'Descripción Footer',
                    type: 'text',
                    rows: 3
                }),
                defineField({
                    name: 'contactInfo',
                    title: 'Información de Contacto',
                    type: 'object',
                    fields: [
                        defineField({ name: 'address', title: 'Dirección', type: 'string' }),
                        defineField({ name: 'phones', title: 'Teléfonos', type: 'array', of: [{ type: 'string' }] }),
                        defineField({ name: 'emails', title: 'Correos Electrónicos', type: 'array', of: [{ type: 'string' }] }),
                        defineField({ name: 'whatsapp', title: 'WhatsApp (Link)', type: 'url' }),
                        defineField({
                            name: 'openingHours',
                            title: 'Horario de Atención',
                            type: 'array',
                            of: [{ type: 'string' }],
                            initialValue: ['Lunes a Viernes: 8:00 AM - 6:00 PM', 'Sábados: 9:00 AM - 2:00 PM']
                        }),
                        defineField({ name: 'mapUrl', title: 'URL del Mapa (Google Maps Embed)', type: 'string', description: 'URL para embeber el mapa (src de iframe)' })
                    ]
                }),
                defineField({
                    name: 'contactPage',
                    title: 'Página de Contacto',
                    type: 'object',
                    fields: [
                        defineField({ name: 'title', title: 'Título Principal', type: 'string', initialValue: 'Contacto' }),
                        defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 3 }),
                        defineField({ name: 'infoTitle', title: 'Título Información', type: 'string', initialValue: 'Información de Contacto' }),
                        defineField({ name: 'formTitle', title: 'Título Formulario', type: 'string', initialValue: 'Envíanos un Mensaje' }),
                    ]
                }),
                defineField({
                    name: 'socialLinks',
                    title: 'Redes Sociales',
                    type: 'array',
                    of: [
                        {
                            type: 'object',
                            fields: [
                                defineField({ name: 'platform', title: 'Plataforma', type: 'string', options: { list: ['Facebook', 'Instagram', 'WhatsApp'] } }),
                                defineField({ name: 'url', title: 'Enlace URL', type: 'url' })
                            ]
                        }
                    ]
                })
            ]
        })
    ],
    preview: {
        prepare() {
            return {
                title: 'Configuración Global',
                subtitle: 'Logo, Contacto, Redes Sociales'
            }
        }
    }
})
