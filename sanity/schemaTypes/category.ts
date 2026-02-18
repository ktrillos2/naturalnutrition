import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'category',
    title: 'Categorías',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Nombre',
            type: 'string',
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 96,
            },
        }),
        defineField({
            name: 'description',
            title: 'Descripción',
            type: 'text',
        }),
        defineField({
            name: 'icon',
            title: 'Icono',
            type: 'string',
            description: 'Nombre del icono (opcional)',
        }),
    ],
})
