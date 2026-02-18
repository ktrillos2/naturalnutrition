import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'product',
    title: 'Product',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
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
            name: 'images',
            title: 'Images',
            type: 'array',
            of: [{ type: 'image', options: { hotspot: true } }],
        }),

        defineField({
            name: 'description',
            title: 'Description',
            type: 'array',
            of: [
                {
                    title: 'Block',
                    type: 'block',
                    styles: [{ title: 'Normal', value: 'normal' }],
                    lists: [],
                },
            ],
        }),
        defineField({
            name: 'price',
            title: 'Price',
            type: 'number',
        }),
        defineField({
            name: 'regularPrice',
            title: 'Regular Price',
            type: 'number',
        }),
        defineField({
            name: 'stock',
            title: 'Stock',
            type: 'number',
        }),
        defineField({
            name: 'categories',
            title: 'Categories',
            type: 'array',
            of: [
                {
                    type: 'reference',
                    to: { type: 'category' },
                },
            ],
        }),
        defineField({
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [{ type: 'string' }],
        }),
        // Specialized fields extracted from description
        defineField({
            name: 'registroInvima',
            title: 'Registro INVIMA',
            type: 'string',
        }),
        defineField({
            name: 'modoDeUso',
            title: 'Modo de Uso',
            type: 'array',
            of: [{ type: 'block' }],
        }),
        defineField({
            name: 'contraindicaciones',
            title: 'Contraindicaciones',
            type: 'text',
        }),
        defineField({
            name: 'beneficios',
            title: 'Beneficios',
            type: 'text',
        }),
        defineField({
            name: 'specifications',
            title: 'Especificaciones',
            type: 'object',
            fields: [
                defineField({ name: 'width', title: 'Ancho', type: 'string' }),
                defineField({ name: 'height', title: 'Alto', type: 'string' }),
                defineField({ name: 'depth', title: 'Profundidad', type: 'string' }),
            ],
        }),
        defineField({
            name: 'attributes',
            title: 'Attributes/Variations',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({ name: 'name', title: 'Attribute Name', type: 'string' }),
                        defineField({ name: 'value', title: 'Value', type: 'string' }),
                    ],
                },
            ],
        }),
    ],
    preview: {
        select: {
            title: 'name',
            media: 'images.0',
        },
        prepare(selection) {
            const { title, media } = selection
            return {
                title: title,
                media: media,
            }
        },
    },
})
