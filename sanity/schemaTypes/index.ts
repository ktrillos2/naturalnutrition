import { type SchemaTypeDefinition } from 'sanity'

import product from './product'
import category from './category'
import hero from './hero'
import globalConfig from './global-config'
import history from './history'
import featured from './featured'
import testimonials from './testimonials'
import productBenefits from './product-benefits'
import about from './about'
import { order } from './order'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, category, hero, globalConfig, history, featured, testimonials, productBenefits, about, order],
}
