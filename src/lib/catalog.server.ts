import catalogData from '~/data/catalog.json'
import {
  type CatalogCategory,
  type CatalogProduct,
  TOP_CATEGORY_IDS,
  getProductEffectivePrice,
} from './catalog'

const rawCategories: Record<string, CatalogCategory> = (catalogData.categories ||
  {}) as unknown as Record<string, CatalogCategory>
const categoryDescendants: Record<string, string[]> =
  (catalogData as { category_descendants?: Record<string, string[]> }).category_descendants || {}
const rawProducts = (catalogData.products || []) as unknown as CatalogProduct[]
const allProducts: CatalogProduct[] = rawProducts.map((p) => ({
  ...p,
  children: p.children || p.variants || [],
  variants: p.variants || p.children || [],
}))

export function getTopCategoriesServer(): CatalogCategory[] {
  const result: CatalogCategory[] = []
  for (const id of TOP_CATEGORY_IDS) {
    const cat = rawCategories[id]
    if (!cat) continue
    const subcategories = (cat.children_ids || [])
      .map((childId) => rawCategories[childId])
      .filter((sub): sub is CatalogCategory => Boolean(sub?.is_active && sub.product_count > 0))
    result.push({
      ...cat,
      subcategories,
    })
  }
  return result
}

export function getCategoryBySlugServer(slug: string): CatalogCategory | undefined {
  const match = Object.values(rawCategories).find(
    (c) => c.slug === slug || c.slug === slug.toLowerCase(),
  )
  if (!match) return undefined

  const subcategories = (match.children_ids || [])
    .map((cid) => rawCategories[cid])
    .filter((sub): sub is CatalogCategory => Boolean(sub?.is_active && sub.product_count > 0))

  return {
    ...match,
    subcategories,
  }
}

export function getAllCategoriesServer(): CatalogCategory[] {
  return Object.values(rawCategories)
}

export function getProductsByCategoryServer(
  categorySlug: string,
  options?: {
    sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'name'
    limit?: number
    offset?: number
  },
): {
  products: CatalogProduct[]
  total: number
  category?: CatalogCategory
} {
  const category = getCategoryBySlugServer(categorySlug)

  let candidateCids: Set<string>
  if (category) {
    const desc = categoryDescendants[category.id] || [category.id]
    candidateCids = new Set(desc)
  } else {
    candidateCids = new Set()
  }

  let matched = allProducts.filter((p) => {
    if (!p.is_visible_individually) return false
    if (candidateCids.size === 0) return true
    return p.category_ids.some((cid) => candidateCids.has(cid))
  })

  if (matched.length === 0 && category) {
    matched = allProducts.filter(
      (p) =>
        p.is_visible_individually && p.name.toLowerCase().includes(category.name.toLowerCase()),
    )
  }

  const sortBy = options?.sortBy || 'featured'
  if (sortBy === 'price-asc') {
    matched.sort((a, b) => getProductEffectivePrice(a) - getProductEffectivePrice(b))
  } else if (sortBy === 'price-desc') {
    matched.sort((a, b) => getProductEffectivePrice(b) - getProductEffectivePrice(a))
  } else if (sortBy === 'name') {
    matched.sort((a, b) => a.name.localeCompare(b.name))
  } else {
    matched.sort((a, b) => {
      const aPrice = getProductEffectivePrice(a)
      const bPrice = getProductEffectivePrice(b)
      const aScore = (a.image ? 10 : 0) + (a.options.length > 0 ? 5 : 0) + (aPrice > 0 ? 2 : 0)
      const bScore = (b.image ? 10 : 0) + (b.options.length > 0 ? 5 : 0) + (bPrice > 0 ? 2 : 0)
      return bScore - aScore
    })
  }

  const offset = options?.offset || 0
  const limit = options?.limit || matched.length

  return {
    products: matched.slice(offset, offset + limit),
    total: matched.length,
    category,
  }
}

export function getProductBySlugServer(slugOrSku: string): CatalogProduct | undefined {
  return (
    allProducts.find((p) => p.slug === slugOrSku) ||
    allProducts.find((p) => p.sku.toLowerCase() === slugOrSku.toLowerCase()) ||
    allProducts.find((p) => p.id === slugOrSku)
  )
}

export function getFeaturedProductsServer(limit = 8, categorySlug?: string): CatalogProduct[] {
  let candidates = allProducts.filter(
    (p) => p.is_visible_individually && p.image && getProductEffectivePrice(p) > 0,
  )

  if (categorySlug && categorySlug !== 'all') {
    const cat = getCategoryBySlugServer(categorySlug)
    if (cat) {
      const desc = categoryDescendants[cat.id] || [cat.id]
      const cidSet = new Set(desc)
      candidates = candidates.filter((p) => p.category_ids.some((cid) => cidSet.has(cid)))
    }
  }

  candidates.sort((a, b) => {
    const aScore = (a.options.length > 0 ? 10 : 0) + (a.gallery.length > 1 ? 5 : 0)
    const bScore = (b.options.length > 0 ? 10 : 0) + (b.gallery.length > 1 ? 5 : 0)
    return bScore - aScore
  })

  return candidates.slice(0, limit)
}

export function searchProductsServer(query: string, limit = 20): CatalogProduct[] {
  if (!query || query.trim() === '') return []
  const q = query.toLowerCase().trim()

  return allProducts
    .filter((p) => {
      if (!p.is_visible_individually) return false
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.short_description.toLowerCase().includes(q)
      )
    })
    .slice(0, limit)
}
