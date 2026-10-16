import { Link, useNavigate } from '@tanstack/react-router'
import {
  ArrowRight,
  ChevronRight,
  Command,
  CornerDownLeft,
  Flame,
  Menu,
  Package,
  Search,
  ShoppingBag,
  Sparkles,
  User,
  X,
  Zap,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useCart } from '~/lib/cart'
import {
  type CatalogProduct,
  getProductEffectivePrice,
  getTopCategories,
  searchProducts,
} from '~/lib/catalog'
import { formatPrice } from '~/lib/utils'

const QUICK_SEARCH_TAGS = [
  'Storm Wand',
  'Soldier',
  'Cartridge Needles',
  'Wireless Battery',
  'Ninja Pro',
  'Disposable Grips',
]

export function Header() {
  const topCategories = getTopCategories()
  const { totalItems } = useCart()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<CatalogProduct[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  // ⌘K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      } else if (e.key === 'Escape') {
        setSearchOpen(false)
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      setSearchResults(searchProducts(searchQuery, 8))
      setSelectedIndex(0)
    } else {
      setSearchResults([])
      setSelectedIndex(-1)
    }
  }, [searchQuery])

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 60)
    } else {
      setSelectedIndex(-1)
    }
  }, [searchOpen])

  // Handle keyboard navigation inside search modal
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (searchResults.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % searchResults.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length)
    } else if (e.key === 'Enter' && selectedIndex >= 0 && selectedIndex < searchResults.length) {
      e.preventDefault()
      const target = searchResults[selectedIndex]
      setSearchOpen(false)
      setSearchQuery('')
      navigate({
        to: '/products/$slug',
        params: { slug: target.slug },
      })
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo & Mobile Trigger */}
          <div className="flex items-center gap-4 lg:gap-8">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link
              to="/"
              className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white group"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-br from-amber-400 to-amber-600 font-black text-black shadow-sm group-hover:scale-105 transition-transform">
                A
              </span>
              <span className="tracking-wider">AMBITION</span>
            </Link>

            {/* Desktop Top Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {topCategories.slice(0, 5).map((category) => (
                <Link
                  key={category.id}
                  to="/categories/$slug"
                  params={{ slug: category.slug }}
                  className="text-xs font-semibold uppercase tracking-wider text-zinc-300 transition-colors hover:text-amber-400"
                  activeProps={{ className: 'text-amber-400 font-bold' }}
                >
                  {category.name}
                </Link>
              ))}

              <Link
                to="/saleor"
                className="flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 hover:bg-amber-500/20 hover:border-amber-400 transition"
                activeProps={{ className: 'border-amber-400 bg-amber-500/25 text-white' }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Saleor GraphQL
              </Link>
            </nav>
          </div>

          {/* Action icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search quick button */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3.5 py-1.5 text-xs text-zinc-400 hover:border-zinc-700 hover:text-white transition"
              aria-label="Quick search"
            >
              <Search className="h-3.5 w-3.5 text-amber-500" />
              <span>Search products...</span>
              <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">
                ⌘K
              </kbd>
            </button>

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="sm:hidden rounded-full p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              to="/account"
              className="rounded-full p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Link>

            <Link
              to="/cart"
              className="relative flex items-center gap-2 rounded-full bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-zinc-700"
            >
              <ShoppingBag className="h-4 w-4 text-amber-400" />
              <span className="hidden sm:inline">Cart</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[11px] font-bold transition ${
                  totalItems > 0 ? 'bg-amber-500 text-black shadow-sm' : 'bg-zinc-700 text-zinc-300'
                }`}
              >
                {totalItems}
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            onKeyDown={() => setMobileMenuOpen(false)}
            role="button"
            tabIndex={0}
            aria-label="Close menu backdrop"
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-zinc-950 border-r border-zinc-800 p-6 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-lg font-bold text-white"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded bg-amber-500 font-black text-black">
                    A
                  </span>
                  <span>AMBITION</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Quick Search */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  setSearchOpen(true)
                }}
                className="w-full flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-2.5 text-xs text-zinc-400 hover:border-zinc-700 hover:text-white"
              >
                <div className="flex items-center gap-2.5">
                  <Search className="h-4 w-4 text-amber-500" />
                  <span>Search professional products...</span>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-600" />
              </button>

              {/* Category Links */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-3">
                  Catalog Categories
                </h4>
                <div className="space-y-1">
                  {topCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      to="/categories/$slug"
                      params={{ slug: cat.slug }}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-900 hover:text-amber-400 transition"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {cat.product_count}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Quick Pages */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-3">
                  Studio Portal
                </h4>
                <div className="space-y-1">
                  <Link
                    to="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white transition"
                  >
                    <User className="h-4 w-4 text-zinc-500" />
                    <span>My Studio Account</span>
                  </Link>
                  <Link
                    to="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white transition"
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="h-4 w-4 text-amber-400" />
                      <span>Shopping Cart</span>
                    </div>
                    {totalItems > 0 && (
                      <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-black">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/saleor"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-amber-400 hover:bg-amber-500/10 transition"
                  >
                    <Zap className="h-4 w-4 text-amber-400" />
                    <span>Saleor Backend Status</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="border-t border-zinc-800 pt-4 mt-6 text-xs text-zinc-500 space-y-1">
              <p className="font-semibold text-zinc-400">AMBITION Official Supply</p>
              <p className="text-[11px]">Powered by Saleor GraphQL & TanStack Start SSR</p>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Search Modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-sm transition-opacity"
          onClick={() => {
            setSearchOpen(false)
            setSearchQuery('')
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setSearchOpen(false)
              setSearchQuery('')
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Close search backdrop"
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            role="region"
            aria-label="Product Search Dialog"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 gap-2">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Search className="h-5 w-5 text-amber-500 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search authentic Ambition products by name, SKU (e.g. Storm, Soldier, Grip, Cartridge)..."
                  className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
                />
                {searchQuery.trim().length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      inputRef.current?.focus()
                    }}
                    className="rounded-full p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
                    aria-label="Clear input"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false)
                  setSearchQuery('')
                }}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white transition flex-shrink-0"
                aria-label="Close search"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Status bar */}
            {searchResults.length > 0 && (
              <div className="mt-2.5 flex items-center justify-between px-1 text-[11px] text-zinc-400">
                <span>
                  Found <strong className="text-amber-400">{searchResults.length}</strong> matching products
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-zinc-500 font-mono text-[10px]">
                  <span>Navigate with</span>
                  <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1 py-0.2 text-zinc-400">↑</kbd>
                  <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1 py-0.2 text-zinc-400">↓</kbd>
                  <span>Select with</span>
                  <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1 py-0.2 text-zinc-400">↵ Enter</kbd>
                </span>
              </div>
            )}

            {/* Results */}
            <div className="mt-3 max-h-96 overflow-y-auto space-y-2">
              {searchResults.length > 0 ? (
                searchResults.map((product, idx) => {
                  const effectivePrice = getProductEffectivePrice(product)
                  const hasVariants =
                    (product.options && product.options.length > 0) ||
                    (product.children && product.children.length > 0)
                  const isSelected = idx === selectedIndex

                  return (
                    <Link
                      key={product.id}
                      to="/products/$slug"
                      params={{ slug: product.slug }}
                      onClick={() => {
                        setSearchOpen(false)
                        setSearchQuery('')
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between gap-4 rounded-xl border p-3 transition ${
                        isSelected
                          ? 'border-amber-500 bg-zinc-800/90 shadow-md ring-1 ring-amber-500/30'
                          : 'border-zinc-800/80 bg-zinc-950/60 hover:border-amber-500/50 hover:bg-zinc-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-contain p-1"
                            />
                          ) : (
                            <Package className="h-5 w-5 text-zinc-600" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-white truncate">
                            {product.name}
                          </h4>
                          <span className="text-[10px] text-zinc-400 font-mono">
                            SKU: {product.sku}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs font-bold text-amber-400 whitespace-nowrap">
                          {hasVariants && <span className="text-[10px] font-normal text-zinc-400 mr-0.5">From </span>}
                          {formatPrice(effectivePrice)}
                        </span>
                        {isSelected && (
                          <span className="hidden sm:inline-flex items-center gap-0.5 rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-mono font-bold text-amber-400 border border-amber-500/30">
                            ↵ View
                          </span>
                        )}
                      </div>
                    </Link>
                  )
                })
              ) : searchQuery.trim().length > 1 ? (
                <div className="py-8 text-center text-xs text-zinc-500">
                  No matching products found in the catalog.
                </div>
              ) : (
                <div className="py-5 px-2">
                  <div className="text-center text-xs text-zinc-500 flex flex-col items-center gap-2 mb-4">
                    <Command className="h-6 w-6 text-zinc-600" />
                    <span>Type at least 2 characters to search across all 1,049 products.</span>
                  </div>

                  {/* Popular quick searches */}
                  <div className="border-t border-zinc-800/80 pt-3">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-400 mb-2">
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                      <span>Popular Studio Searches:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_SEARCH_TAGS.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            setSearchQuery(tag)
                            inputRef.current?.focus()
                          }}
                          className="rounded-lg border border-zinc-800 bg-zinc-950/80 px-2.5 py-1 text-[11px] font-medium text-zinc-300 hover:border-amber-500/50 hover:bg-zinc-800 hover:text-amber-400 transition"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
                    <span>Press <kbd className="font-mono text-zinc-400 bg-zinc-800 px-1 py-0.5 rounded border border-zinc-700">Esc</kbd> or click outside to dismiss.</span>
                    <span className="font-mono">Ambition x Saleor</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
