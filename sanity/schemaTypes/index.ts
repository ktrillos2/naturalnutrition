import { type SchemaTypeDefinition } from 'sanity'

import category from './category'
import product from './product'
import hero from './hero'
import globalConfig from './global-config'
import history from './history'
import featured from './featured'
import testimonials from './testimonials'
import productBenefits from './product-benefits'
import about from './about'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [category, product, hero, globalConfig, history, featured, testimonials, productBenefits, about],
}
