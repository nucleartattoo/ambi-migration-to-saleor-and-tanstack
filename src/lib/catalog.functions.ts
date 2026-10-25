import { createServerFn } from '@tanstack/react-start'
import {
  getFeaturedProductsServer,
  getProductBySlugServer,
  getProductsByCategoryServer,
  getTopCategoriesServer,
  searchProductsServer,
} from './catalog.server'

export const fetchHomeCatalogData = createServerFn({ method: 'GET' }).handler(async () => {
  return {
    topCategories: getTopCategoriesServer(),
    featuredByTab: {
      all: getFeaturedProductsServer(8),
      'tattoo-machines': getFeaturedProductsServer(8, 'tattoo-machines'),
      'tattoo-needles': getFeaturedProductsServer(8, 'tattoo-needles'),
      'tattoo-power-supplies': getFeaturedProductsServer(8, 'tattoo-power-supplies'),
    },
  }
})

export const fetchCategoryPageData = createServerFn({ method: 'GET' })
  .validator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const res = getProductsByCategoryServer(data.slug, { sortBy: 'featured' })
    return {
      products: res.products,
      total: res.total,
      category: res.category ?? null,
    }
  })

export const fetchProductBySlug = createServerFn({ method: 'GET' })
  .validator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    return getProductBySlugServer(data.slug) ?? null
  })

export const searchCatalogProducts = createServerFn({ method: 'GET' })
  .validator((data: { query: string; limit?: number }) => data)
  .handler(async ({ data }) => {
    return searchProductsServer(data.query, data.limit ?? 8)
  })
