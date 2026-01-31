import { defineField, defineType } from "sanity";

export const order = defineType({
    name: "order",
    title: "Pedidos",
    type: "document",
    fields: [
        defineField({
            name: "orderNumber",
            title: "Número de Orden",
            type: "string",
        }),
        defineField({
            name: "customerName",
            title: "Cliente",
            type: "string",
        }),
        defineField({
            name: "email",
            title: "Email",
            type: "string",
        }),
        defineField({
            name: "phone",
            title: "Teléfono",
            type: "string",
        }),
        defineField({
            name: "items",
            title: "Productos",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        { name: "productId", title: "ID Producto", type: "string" },
                        { name: "name", title: "Nombre", type: "string" },
                        { name: "quantity", title: "Cantidad", type: "number" },
                        { name: "price", title: "Precio", type: "number" },
                    ],
                },
            ],
        }),
        defineField({
            name: "totalPrice",
            title: "Total",
            type: "number",
        }),
        defineField({
            name: "status",
            title: "Estado",
            type: "string",
            options: {
                list: [
                    { title: "Pendiente de Pago", value: "pending" },
                    { title: "Pagado", value: "paid" },
                    { title: "Cancelado", value: "cancelled" },
                ],
                layout: "radio", // Optional: defines how the options are displayed
            },
            initialValue: "pending",
        }),
        defineField({
            name: "paymentId",
            title: "ID Pago MercadoPago",
            type: "string",
        }),
        defineField({
            name: "createdAt",
            title: "Fecha de Creación",
            type: "datetime",
            initialValue: () => new Date().toISOString(),
        }),
    ],
    preview: {
        select: {
            title: "orderNumber",
            subtitle: "customerName",
            status: "status",
        },
        prepare({ title, subtitle, status }) {
            const statusMap: Record<string, string> = {
                pending: "Pendiente",
                paid: "Pagado",
                cancelled: "Cancelado"
            }
            return {
                title: title || "Sin Número",
                subtitle: `${subtitle} - ${statusMap[status] || status}`,
            };
        },
    },
});
