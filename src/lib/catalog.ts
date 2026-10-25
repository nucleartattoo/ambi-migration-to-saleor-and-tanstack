export interface CatalogCategory {
  id: string
  name: string
  slug: string
  parent_id: string | null
  product_count: number
  is_active: boolean
  children_ids: string[]
  subcategories?: CatalogCategory[]
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
    product_count: 43,
    is_active: true,
    children_ids: ['133', '134'],
    subcategories: [
      {
        id: '133',
        name: 'Wireless Tattoo Machines',
        slug: 'wireless-tattoo-machines',
        parent_id: '51',
        product_count: 36,
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
    product_count: 21,
    is_active: true,
    children_ids: ['136', '78'],
    subcategories: [
      {
        id: '136',
        name: 'Wireless Tattoo Battery',
        slug: 'wireless-tattoo-battery',
        parent_id: '55',
        product_count: 14,
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
    product_count: 15,
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
    product_count: 14,
    is_active: true,
    children_ids: ['132', '77'],
    subcategories: [],
  },
  {
    id: '58',
    name: 'Tattoo Accessories',
    slug: 'tattoo-accessories',
    parent_id: '2',
    product_count: 9,
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
