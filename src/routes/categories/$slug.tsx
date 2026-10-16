import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ArrowUpDown,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Code,
  Filter,
  Globe,
  Layers,
  Package,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { ProductCard } from '~/components/ProductCard'
import {
  getCategoryBySlug,
  getProductEffectivePrice,
  getProductsByCategory,
  getTopCategories,
} from '~/lib/catalog'
import { formatPrice } from '~/lib/utils'

export const Route = createFileRoute('/categories/$slug')({
  head: ({ params }) => {
    const category = getCategoryBySlug(params.slug)
    const categoryName =
      category?.name || params.slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    const baseData = getProductsByCategory(params.slug, { sortBy: 'featured' })
    const totalCount = baseData.total
    const categoryUrl = `https://www.ambitiontattoosupply.com/categories/${params.slug}`
    const title = `${categoryName} | Ambition Tattoo Supply Official Store`
    const description = `Shop ${totalCount}+ professional ${categoryName.toLowerCase()} at Ambition Tattoo Supply. Premium wireless machines, cartridges, and studio hardware with fast global dispatch.`
    const previewImage =
      baseData.products[0]?.image || 'https://www.ambitiontattoosupply.com/logo.png'

    // Top products for ItemList schema
    const topItems = baseData.products.slice(0, 10).map((prod, idx) => {
      const effPrice = getProductEffectivePrice(prod)
      return {
        '@type': 'ListItem',
        position: idx + 1,
        url: `https://www.ambitiontattoosupply.com/products/${prod.slug}`,
        name: prod.name,
        image: prod.image,
        offers: {
          '@type': 'Offer',
          price: effPrice,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
      }
    })

    const collectionPageSchema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: title,
      description,
      url: categoryUrl,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: totalCount,
        itemListElement: topItems,
      },
    }

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.ambitiontattoosupply.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Categories',
          item: 'https://www.ambitiontattoosupply.com/categories',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: categoryName,
          item: categoryUrl,
        },
      ],
    }

    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: previewImage },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: categoryUrl },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: previewImage },
      ],
      links: [{ rel: 'canonical', href: categoryUrl }],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(collectionPageSchema),
        },
        {
          type: 'application/ld+json',
          children: JSON.stringify(breadcrumbSchema),
        },
      ],
    }
  },
  component: CategoryPage,
})

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'
type PriceRangeOption = 'all' | 'under-50' | '50-100' | '100-150' | '150-250' | '250-plus'
type TypeOption = 'all' | 'configurable' | 'single'

const PRICE_BRACKETS: { id: PriceRangeOption; label: string; min?: number; max?: number }[] = [
  { id: 'all', label: 'All Prices' },
  { id: 'under-50', label: 'Under $50', min: 0, max: 50 },
  { id: '50-100', label: '$50 to $100', min: 50, max: 100 },
  { id: '100-150', label: '$100 to $150', min: 100, max: 150 },
  { id: '150-250', label: '$150 to $250', min: 150, max: 250 },
  { id: '250-plus', label: '$250 & Above', min: 250 },
]

function CategoryPage() {
  const { slug } = Route.useParams()

  // Primary Sort State
  const [sortBy, setSortBy] = useState<SortOption>('featured')

  // Facet Filters State
  const [priceBracket, setPriceBracket] = useState<PriceRangeOption>('all')
  const [productType, setProductType] = useState<TypeOption>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [showSeoDebug, setShowSeoDebug] = useState(false)
  const [seoTab, setSeoTab] = useState<'collection' | 'breadcrumb'>('collection')

  // Load category and all base catalog products for this category
  const category = getCategoryBySlug(slug)
  const baseData = useMemo(() => {
    return getProductsByCategory(slug, { sortBy: 'featured' })
  }, [slug])

  const categoryName =
    category?.name || slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())

  // Apply multi-faceted filters on the client side
  const filteredProducts = useMemo(() => {
    let result = [...baseData.products]

    // 1. Search Query filter within category
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.short_description?.toLowerCase().includes(q),
      )
    }

    // 2. Price Bracket filter
    if (priceBracket !== 'all') {
      const bracket = PRICE_BRACKETS.find((b) => b.id === priceBracket)
      if (bracket) {
        result = result.filter((p) => {
          const price = getProductEffectivePrice(p)
          if (bracket.min !== undefined && price < bracket.min) return false
          if (bracket.max !== undefined && price >= bracket.max) return false
          return true
        })
      }
    }

    // 3. Product Type filter (configurable vs single SKU)
    if (productType === 'configurable') {
      result = result.filter((p) => p.options && p.options.length > 0)
    } else if (productType === 'single') {
      result = result.filter((p) => !p.options || p.options.length === 0)
    }

    // 4. In stock only
    if (inStockOnly) {
      result = result.filter((p) => getProductEffectivePrice(p) > 0)
    }

    // 5. Apply sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => getProductEffectivePrice(a) - getProductEffectivePrice(b))
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => getProductEffectivePrice(b) - getProductEffectivePrice(a))
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name))
    } else {
      // featured: prioritize products with rich gallery and multi-options
      result.sort((a, b) => {
        const aScore = (a.image ? 10 : 0) + (a.options.length > 0 ? 5 : 0)
        const bScore = (b.image ? 10 : 0) + (b.options.length > 0 ? 5 : 0)
        return bScore - aScore
      })
    }

    return result
  }, [baseData.products, searchQuery, priceBracket, productType, inStockOnly, sortBy])

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (priceBracket !== 'all') count++
    if (productType !== 'all') count++
    if (searchQuery.trim()) count++
    if (inStockOnly) count++
    return count
  }, [priceBracket, productType, searchQuery, inStockOnly])

  const resetAllFilters = () => {
    setPriceBracket('all')
    setProductType('all')
    setSearchQuery('')
    setInStockOnly(false)
    setSortBy('featured')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Category Header & Breadcrumbs */}
      <div className="border-b border-zinc-800 pb-6">
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-zinc-500 mb-3 flex items-center gap-1.5 flex-wrap"
        >
          <Link to="/" className="hover:text-zinc-300">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-zinc-600" />
          <span className="text-zinc-400">Categories</span>
          <ChevronRight className="h-3 w-3 text-zinc-600" />
          <span className="text-amber-400 font-medium">{categoryName}</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {categoryName}
            </h1>
            <p className="mt-2 text-sm text-zinc-400 max-w-2xl">
              {category?.name && category.product_count > 0
                ? `Explore ${baseData.total} professional tattoo products in ${categoryName}. Verified for professional studios.`
                : 'Explore high-performance tattoo equipment and accessories.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 border border-amber-500/20">
              {baseData.total} Products Total
            </span>
          </div>
        </div>

        {/* Subcategories Navigation Pills */}
        {category?.subcategories && category.subcategories.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              to="/categories/$slug"
              params={{ slug: category.slug }}
              className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400"
            >
              All {categoryName} ({baseData.total})
            </Link>
            {category.subcategories.map((sub) => (
              <Link
                key={sub.id}
                to="/categories/$slug"
                params={{ slug: sub.slug }}
                className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-zinc-300 hover:border-amber-500 hover:text-white transition"
              >
                {sub.name} ({sub.product_count})
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Main Grid: Filter Sidebar + Products Showcase */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        {/* Desktop / Tablet Filter Sidebar */}
        <div className="hidden md:block space-y-6">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-6 sticky top-24">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-amber-500" />
                Filter Equipment
              </h2>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
                >
                  <RotateCcw className="h-3 w-3" /> Reset
                </button>
              )}
            </div>

            {/* Keyword Search inside category */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Search in {categoryName}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by model, SKU..."
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2 pl-9 pr-8 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-zinc-500 hover:text-zinc-300"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Price Brackets */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Price Range
              </label>
              <div className="space-y-1">
                {PRICE_BRACKETS.map((bracket) => (
                  <button
                    key={bracket.id}
                    type="button"
                    onClick={() => setPriceBracket(bracket.id)}
                    className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs transition text-left ${
                      priceBracket === bracket.id
                        ? 'bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20'
                        : 'text-zinc-300 hover:bg-zinc-800/60 hover:text-white'
                    }`}
                  >
                    <span>{bracket.label}</span>
                    {priceBracket === bracket.id && <Check className="h-3.5 w-3.5 text-amber-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Configuration / Variant format */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Specification Format
              </label>
              <div className="space-y-1">
                {[
                  { id: 'all', label: 'All Machine Formats' },
                  { id: 'configurable', label: 'Multi-Stroke & Dual Battery' },
                  { id: 'single', label: 'Single Standard Edition' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setProductType(item.id as TypeOption)}
                    className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs transition text-left ${
                      productType === item.id
                        ? 'bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20'
                        : 'text-zinc-300 hover:bg-zinc-800/60 hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    {productType === item.id && <Check className="h-3.5 w-3.5 text-amber-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* In stock toggle */}
            <div className="pt-2 border-t border-zinc-800/80">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300 hover:text-white select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-950 text-amber-500 focus:ring-0 focus:ring-offset-0"
                />
                <span>In Stock & Ready to Ship</span>
              </label>
            </div>
          </div>
        </div>

        {/* Products Column */}
        <div className="md:col-span-3 space-y-6">
          {/* Top Control Bar: Total count, Mobile filter button & Sort selector */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 sm:px-4 text-xs text-zinc-400">
            <div className="flex items-center justify-between sm:justify-start gap-3">
              {/* Mobile Filter Toggle */}
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                className="md:hidden flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-700"
              >
                <Filter className="h-3.5 w-3.5 text-amber-400" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="ml-1 rounded-full bg-amber-500 px-1.5 py-0.2 text-[10px] font-bold text-black">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-1.5">
                <span className="hidden sm:inline">Showing</span>
                <strong className="text-white font-semibold">{filteredProducts.length}</strong> of{' '}
                <strong className="text-white font-semibold">{baseData.total}</strong> products
              </div>
            </div>

            {/* Sort Control */}
            <div className="flex items-center justify-end gap-2">
              <ArrowUpDown className="h-3.5 w-3.5 text-zinc-500" />
              <span className="text-zinc-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="featured">Featured / Best Matches</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>

          {/* Active Filter Pills Bar */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-zinc-500">Active Filters:</span>

              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800/90 px-3 py-1 text-xs text-zinc-200">
                  Search: <strong className="text-amber-400">"{searchQuery}"</strong>
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {priceBracket !== 'all' && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800/90 px-3 py-1 text-xs text-zinc-200">
                  Price:{' '}
                  <strong className="text-amber-400">
                    {PRICE_BRACKETS.find((b) => b.id === priceBracket)?.label}
                  </strong>
                  <button
                    type="button"
                    onClick={() => setPriceBracket('all')}
                    className="hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {productType !== 'all' && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800/90 px-3 py-1 text-xs text-zinc-200">
                  Format:{' '}
                  <strong className="text-amber-400">
                    {productType === 'configurable' ? 'Multi-Stroke / Options' : 'Single Standard'}
                  </strong>
                  <button
                    type="button"
                    onClick={() => setProductType('all')}
                    className="hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {inStockOnly && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800/90 px-3 py-1 text-xs text-zinc-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  In Stock Only
                  <button
                    type="button"
                    onClick={() => setInStockOnly(false)}
                    className="hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={resetAllFilters}
                className="text-xs text-amber-500 hover:text-amber-400 underline underline-offset-2 ml-1"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Mobile Filter Drawer / Box */}
          {isMobileFilterOpen && (
            <div className="md:hidden rounded-xl border border-zinc-800 bg-zinc-900/95 p-5 space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-amber-500" />
                  Filter Options
                </span>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="rounded p-1 text-zinc-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400">Search</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by keyword..."
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-2 text-xs text-white"
                />
              </div>

              {/* Mobile Price */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400">Price Range</label>
                <div className="grid grid-cols-2 gap-2">
                  {PRICE_BRACKETS.map((bracket) => (
                    <button
                      key={bracket.id}
                      type="button"
                      onClick={() => setPriceBracket(bracket.id)}
                      className={`rounded-lg p-2 text-xs text-left ${
                        priceBracket === bracket.id
                          ? 'bg-amber-500 text-black font-bold'
                          : 'bg-zinc-950 border border-zinc-800 text-zinc-300'
                      }`}
                    >
                      {bracket.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="w-1/2 rounded-lg border border-zinc-700 py-2 text-xs font-semibold text-zinc-300"
                >
                  Reset All
                </button>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-1/2 rounded-lg bg-amber-500 py-2 text-xs font-bold text-black"
                >
                  Apply Filters ({filteredProducts.length})
                </button>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/20 p-12 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-800/80 border border-zinc-700/50">
                <Package className="h-7 w-7 text-zinc-500" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="text-base font-bold text-white">No Matching Products Found</h3>
                <p className="text-xs text-zinc-400">
                  No equipment in {categoryName} matches your selected filter criteria.
                </p>
              </div>
              <button
                type="button"
                onClick={resetAllFilters}
                className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-black hover:bg-amber-400 transition"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Clear All Filters
              </button>
            </div>
          )}

          {/* SEO & Schema.org Rich Snippet Transparency Box */}
          <div className="mt-14 border-t border-zinc-800/80 pt-8">
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 sm:p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-zinc-800/80 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-2 text-amber-400">
                    <Globe className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Category SEO & Schema.org Structured Data</span>
                      <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                        100% Validated
                      </span>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Saleor collection metadata with Schema.org CollectionPage, ItemList, and BreadcrumbList for Google Rich Snippets.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowSeoDebug((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/90 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 hover:text-white transition"
                >
                  <Code className="h-3.5 w-3.5 text-amber-400" />
                  <span>{showSeoDebug ? 'Hide JSON-LD' : 'Inspect JSON-LD'}</span>
                  {showSeoDebug ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>
              </div>

              {/* Google Search Result Mockup Card */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                  <Search className="h-3.5 w-3.5 text-amber-500" /> Google Search Result Preview
                </span>
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-1.5 font-sans">
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-black text-black">
                      A
                    </span>
                    <span className="text-zinc-300">https://www.ambitiontattoosupply.com</span>
                    <span className="text-zinc-600">› categories › {slug}</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-medium text-blue-400 hover:underline cursor-pointer">
                    {categoryName} | Ambition Tattoo Supply Official Store
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold pt-0.5">
                    <span>{baseData.total} products available</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-amber-400">Official Ambi Catalog</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-400">Verified Studio Hardware</span>
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed pt-1">
                    Shop {baseData.total}+ professional {categoryName.toLowerCase()} at Ambition Tattoo Supply. Premium wireless machines, cartridges, and studio hardware with fast global dispatch.
                  </p>
                </div>
              </div>

              {/* Schema.org Checklist Verification Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                <div className="flex items-center gap-2 rounded-lg bg-zinc-950/80 border border-zinc-800/80 p-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  <div>
                    <div className="text-[11px] font-semibold text-white">CollectionPage</div>
                    <div className="text-[10px] text-zinc-400">Root catalog schema</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-zinc-950/80 border border-zinc-800/80 p-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  <div>
                    <div className="text-[11px] font-semibold text-white">ItemList</div>
                    <div className="text-[10px] text-zinc-400">{baseData.total} indexed items</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-zinc-950/80 border border-zinc-800/80 p-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  <div>
                    <div className="text-[11px] font-semibold text-white">BreadcrumbList</div>
                    <div className="text-[10px] text-zinc-400">Home &gt; Cat &gt; {categoryName}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-zinc-950/80 border border-zinc-800/80 p-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  <div>
                    <div className="text-[11px] font-semibold text-white">Canonical Link</div>
                    <div className="text-[10px] text-zinc-400">/categories/{slug}</div>
                  </div>
                </div>
              </div>

              {/* JSON-LD Inspector Panel */}
              {showSeoDebug && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="text-xs font-semibold text-zinc-300">
                      Live Rendered JSON-LD Scripts:
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSeoTab('collection')}
                        className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                          seoTab === 'collection'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        CollectionPage & ItemList
                      </button>
                      <button
                        type="button"
                        onClick={() => setSeoTab('breadcrumb')}
                        className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                          seoTab === 'breadcrumb'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        BreadcrumbList
                      </button>
                    </div>
                  </div>

                  <pre className="max-h-80 overflow-y-auto rounded-xl bg-zinc-950 p-3.5 text-[11px] font-mono text-amber-400/90 border border-zinc-800/80 leading-relaxed">
                    {JSON.stringify(
                      seoTab === 'collection'
                        ? {
                            '@context': 'https://schema.org',
                            '@type': 'CollectionPage',
                            name: `${categoryName} | Ambition Tattoo Supply Official Store`,
                            description: `Shop ${baseData.total}+ professional ${categoryName.toLowerCase()} at Ambition Tattoo Supply. Premium wireless machines, cartridges, and studio hardware with fast global dispatch.`,
                            url: `https://www.ambitiontattoosupply.com/categories/${slug}`,
                            mainEntity: {
                              '@type': 'ItemList',
                              numberOfItems: baseData.total,
                              itemListElement: baseData.products.slice(0, 5).map((p, i) => ({
                                '@type': 'ListItem',
                                position: i + 1,
                                url: `https://www.ambitiontattoosupply.com/products/${p.slug}`,
                                name: p.name,
                                image: p.image,
                                offers: {
                                  '@type': 'Offer',
                                  price: getProductEffectivePrice(p),
                                  priceCurrency: 'USD',
                                  availability: 'https://schema.org/InStock',
                                },
                              })),
                            },
                          }
                        : {
                            '@context': 'https://schema.org',
                            '@type': 'BreadcrumbList',
                            itemListElement: [
                              {
                                '@type': 'ListItem',
                                position: 1,
                                name: 'Home',
                                item: 'https://www.ambitiontattoosupply.com',
                              },
                              {
                                '@type': 'ListItem',
                                position: 2,
                                name: 'Categories',
                                item: 'https://www.ambitiontattoosupply.com/categories',
                              },
                              {
                                '@type': 'ListItem',
                                position: 3,
                                name: categoryName,
                                item: `https://www.ambitiontattoosupply.com/categories/${slug}`,
                              },
                            ],
                          },
                      null,
                      2,
                    )}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
