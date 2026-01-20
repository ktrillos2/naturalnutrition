import type { StructureResolver } from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Inicio')
        .child(
          S.list()
            .title('Inicio')
            .items([
              S.listItem()
                .title('Hero')
                .child(
                  S.document()
                    .schemaType('hero')
                    .documentId('hero')
                    .title('Hero')
                ),
              S.listItem()
                .title('Historia')
                .child(
                  S.document()
                    .schemaType('history')
                    .documentId('history')
                    .title('Historia')
                ),
              S.listItem()
                .title('Productos Destacados')
                .child(
                  S.document()
                    .schemaType('featured')
                    .documentId('featured')
                    .title('Productos Destacados')
                ),
              S.listItem()
                .title('Testimonios')
                .child(
                  S.document()
                    .schemaType('testimonials')
                    .documentId('testimonials')
                    .title('Testimonios')
                ),
              S.listItem()
                .title('Beneficios del Producto')
                .child(
                  S.document()
                    .schemaType('productBenefits')
                    .documentId('productBenefits')
                    .title('Beneficios del Producto')
                ),
            ])
        ),
      S.listItem()
        .title('Nosotros')
        .child(
          S.document()
            .schemaType('about')
            .documentId('about')
            .title('Nosotros')
        ),
      S.listItem()
        .title('Configuración Global')
        .child(
          S.document()
            .schemaType('globalConfig')
            .documentId('globalConfig')
            .title('Configuración Global')
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => {
          const id = item.getId();
          return id && !['hero', 'history', 'featured', 'testimonials', 'productBenefits', 'about', 'globalConfig', 'home'].includes(id)
        }
      ),
    ])
