export interface CatalogCategory {
  id: string
  name: string
  slug: string
  parent_id: string | null
  product_count: number
  is_active: boolean
  children_ids: string[]
  subcategories?: CatalogCategory[]
  parentCategory?: {
    id: string
    name: string
    slug: string
    product_count: number
  }
}

export interface ProductOptionValue {
  index: string
  label: string
}

export interface ProductOption {
  id: string
  attribute_id?: string
  code?: string
  label: string
  values: ProductOptionValue[]
}

export interface ProductChildVariant {
  id: string
  sku: string
  name: string
  price: number
  image?: string
  attributes?: Record<string, string>
}

export interface CatalogProduct {
  id: string
  sku: string
  name: string
  slug: string
  price: number
  special_price: number | null
  image: string
  gallery: string[]
  category_ids: string[]
  type_id?: string
  type?: string
  visibility?: number
  is_visible_individually: boolean
  options: ProductOption[]
  variants?: ProductChildVariant[]
  children?: ProductChildVariant[]
  description: string
  short_description: string
}

// Top 7 Primary active categories in the AMBI catalog
export const TOP_CATEGORY_IDS = ['51', '118', '55', '142', '54', '136', '58']

const TOP_CATEGORIES_STATIC: CatalogCategory[] = [
  {
    id: '51',
    name: 'Tattoo Machines',
    slug: 'tattoo-machines',
    parent_id: '2',
    product_count: 52,
    is_active: true,
    children_ids: ['133', '134'],
    subcategories: [
      {
        id: '133',
        name: 'Wireless Tattoo Machines',
        slug: 'wireless-tattoo-machines',
        parent_id: '51',
        product_count: 43,
        is_active: true,
        children_ids: [],
      },
      {
        id: '134',
        name: 'Rotary tattoo machines',
        slug: 'rotary-tattoo-machines',
        parent_id: '51',
        product_count: 7,
        is_active: true,
        children_ids: ['82', '83', '85'],
      },
    ],
  },
  {
    id: '118',
    name: 'Tattoo Needles',
    slug: 'tattoo-needles',
    parent_id: '2',
    product_count: 4,
    is_active: true,
    children_ids: [],
    subcategories: [],
  },
  {
    id: '55',
    name: 'Tattoo Power Supplies',
    slug: 'tattoo-power-supplies',
    parent_id: '2',
    product_count: 26,
    is_active: true,
    children_ids: ['136', '78'],
    subcategories: [
      {
        id: '136',
        name: 'Wireless Tattoo Battery',
        slug: 'wireless-tattoo-battery',
        parent_id: '55',
        product_count: 22,
        is_active: true,
        children_ids: ['132', '77'],
      },
      {
        id: '78',
        name: 'Tattoo Power Supply',
        slug: 'tattoo-power-supply',
        parent_id: '55',
        product_count: 7,
        is_active: true,
        children_ids: [],
      },
    ],
  },
  {
    id: '142',
    name: 'Tattoo Kits',
    slug: 'tattoo-kits',
    parent_id: '2',
    product_count: 16,
    is_active: true,
    children_ids: [],
    subcategories: [],
  },
  {
    id: '54',
    name: 'Tattoo Grips',
    slug: 'tattoo-grips',
    parent_id: '2',
    product_count: 8,
    is_active: true,
    children_ids: ['137', '135'],
    subcategories: [
      {
        id: '137',
        name: 'Metal Tattoo Grip',
        slug: 'metal-tattoo-grip',
        parent_id: '54',
        product_count: 1,
        is_active: true,
        children_ids: [],
      },
      {
        id: '135',
        name: 'Disposable Tattoo Grip',
        slug: 'disposable-tattoo-grip',
        parent_id: '54',
        product_count: 7,
        is_active: true,
        children_ids: [],
      },
    ],
  },
  {
    id: '136',
    name: 'Wireless Tattoo Battery',
    slug: 'wireless-tattoo-battery',
    parent_id: '55',
    product_count: 22,
    is_active: true,
    children_ids: ['132', '77'],
    subcategories: [],
  },
  {
    id: '58',
    name: 'Tattoo Accessories',
    slug: 'tattoo-accessories',
    parent_id: '2',
    product_count: 11,
    is_active: true,
    children_ids: [],
    subcategories: [],
  },
]

/**
 * Returns the 7 primary storefront categories with their active subcategories
 */
export function getTopCategories(): CatalogCategory[] {
  return TOP_CATEGORIES_STATIC
}

export function getProductEffectivePrice(p: CatalogProduct): number {
  if (p.price && p.price > 0) return p.price
  const childPrices = (p.variants || p.children || [])
    .map((c) => c.price)
    .filter((pr) => pr && pr > 0)
  return childPrices.length > 0 ? Math.min(...childPrices) : 0
}

function stemSearchToken(token: string): string {
  return token
    .replace(/batteries$/i, 'battery')
    .replace(/supplies$/i, 'supply')
    .replace(/accessories$/i, 'accessory')
    .replace(/cartridges$/i, 'cartridge')
    .replace(/needles$/i, 'needle')
    .replace(/machines$/i, 'machine')
    .replace(/grips$/i, 'grip')
    .replace(/kits$/i, 'kit')
    .replace(/pens$/i, 'pen')
}

/**
 * Relevance-ranked product search that prioritizes SKU and product title matches
 * (with singular/plural stemming) before falling back to short_description matches.
 */
export function rankAndFilterProductsByQuery(
  products: CatalogProduct[],
  query: string,
): CatalogProduct[] {
  const q = query.toLowerCase().trim()
  if (!q) return products

  const rawTokens = q.split(/\s+/).filter(Boolean)
  const stemmedTokens = rawTokens.map(stemSearchToken)

  const primaryMatches: { product: CatalogProduct; score: number }[] = []
  const descriptionFallbacks: { product: CatalogProduct; score: number }[] = []

  for (const p of products) {
    const nameLower = p.name.toLowerCase()
    const skuLower = p.sku.toLowerCase()
    const nameAndSku = `${nameLower} ${skuLower}`
    const descLower = (p.short_description || '').toLowerCase()

    let primaryScore = 0
    if (skuLower === q) {
      primaryScore += 200
    } else if (skuLower.startsWith(q)) {
      primaryScore += 140
    } else if (skuLower.includes(q)) {
      primaryScore += 100
    }

    if (nameLower.includes(q)) {
      primaryScore += 110
    } else if (stemmedTokens.every((t) => nameAndSku.includes(t))) {
      primaryScore += 85
    }

    if (primaryScore > 0) {
      const qualityBonus =
        (p.image ? 12 : 0) +
        (p.options && p.options.length > 0 ? 8 : 0) +
        (getProductEffectivePrice(p) > 0 ? 4 : 0)
      primaryMatches.push({ product: p, score: primaryScore + qualityBonus })
      continue
    }

    if (descLower.includes(q) || stemmedTokens.every((t) => descLower.includes(t))) {
      const qualityBonus = (p.image ? 6 : 0) + (p.options && p.options.length > 0 ? 4 : 0)
      descriptionFallbacks.push({ product: p, score: 15 + qualityBonus })
    }
  }

  if (primaryMatches.length > 0) {
    primaryMatches.sort((a, b) => b.score - a.score)
    return primaryMatches.map((m) => m.product)
  }

  descriptionFallbacks.sort((a, b) => b.score - a.score)
  return descriptionFallbacks.map((m) => m.product)
}
