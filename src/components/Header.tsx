import { Link, useNavigate } from '@tanstack/react-router'
import {
  ChevronRight,
  Command,
  Menu,
  Search,
  ShoppingBag,
  Sparkles,
  User,
  X,
  Zap,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { StudioProductImage } from '~/components/StudioProductImage'
import { useCart } from '~/lib/cart'
import { type CatalogProduct, getProductEffectivePrice, getTopCategories } from '~/lib/catalog'
import { searchCatalogProducts } from '~/lib/catalog.functions'
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

  // ⌘K / Ctrl+K keyboard shortcut (instant toggle, no animation on keyboard actions)
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
    let active = true
    if (searchQuery.trim().length > 1) {
      searchCatalogProducts({ data: { query: searchQuery, limit: 8 } })
        .then((results) => {
          if (!active) return
          setSearchResults(results)
          setSelectedIndex(results.length > 0 ? 0 : -1)
        })
        .catch(() => {
          if (!active) return
          setSearchResults([])
          setSelectedIndex(-1)
        })
    } else {
      setSearchResults([])
      setSelectedIndex(-1)
    }
    return () => {
      active = false
    }
  }, [searchQuery])

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 20)
    } else {
      setSelectedIndex(-1)
    }
  }, [searchOpen])

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
      <header className="sticky top-0 z-40 h-16 w-full border-b border-zinc-800/90 bg-zinc-950/90 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Identity & Primary Desktop Navigation */}
          <div className="flex items-center gap-4 lg:gap-8">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="btn-tactile lg:hidden rounded-md border border-zinc-800 bg-zinc-900 p-2 text-zinc-300 hover:border-zinc-700 hover:text-white"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="h-4 w-4" />
            </button>

            <Link to="/" className="group flex items-center gap-2.5 text-white focus:outline-none">
              <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-amber-400 font-display text-base font-bold text-black transition-transform duration-150 group-hover:bg-amber-300">
                A
              </span>
              <div className="flex flex-col">
                <span className="font-display text-base font-bold tracking-wider leading-none text-white">
                  AMBITION
                </span>
                <span className="mt-0.5 whitespace-nowrap font-mono text-[9px] tracking-[0.12em] text-zinc-500 uppercase sm:tracking-[0.2em]">
                  STUDIO HARDWARE
                </span>
              </div>
            </Link>

            {/* Single-line Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-6 pl-2 border-l border-zinc-800/80">
              {topCategories.slice(0, 5).map((category) => (
                <Link
                  key={category.id}
                  to="/categories/$slug"
                  params={{ slug: category.slug }}
                  className="whitespace-nowrap font-sans text-xs font-medium tracking-wide text-zinc-400 transition-colors hover:text-white"
                  activeProps={{ className: 'text-amber-400 font-semibold' }}
                >
                  {category.name.replace(/^Tattoo\s+/i, '')}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Command Search Trigger */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="btn-tactile hidden sm:flex items-center gap-3 rounded-md border border-zinc-800 bg-zinc-900/90 px-3 py-1.5 text-xs text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
              aria-label="Quick search"
            >
              <Search className="h-3.5 w-3.5 text-amber-400" />
              <span>Search equipment...</span>
              <kbd className="rounded-sm border border-zinc-700/80 bg-zinc-950 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">
                ⌘K
              </kbd>
            </button>

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="btn-tactile sm:hidden rounded-md border border-zinc-800 bg-zinc-900 p-2 text-zinc-300 hover:text-white"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>

            <Link
              to="/account"
              className="btn-tactile flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/80 px-2.5 py-1.5 text-xs font-medium text-zinc-300 hover:border-zinc-700 hover:text-white"
              aria-label="Account"
            >
              <User className="h-4 w-4 text-zinc-400" />
              <span className="hidden xl:inline">Studio Portal</span>
            </Link>

            <Link
              to="/cart"
              className="btn-tactile relative flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:border-amber-500/50"
            >
              <ShoppingBag className="h-4 w-4 text-amber-400" />
              <span className="hidden sm:inline">Cart</span>
              <span
                className={`rounded-sm px-1.5 py-0.5 font-mono text-[10px] font-bold leading-none ${
                  totalItems > 0 ? 'bg-amber-400 text-black' : 'bg-zinc-800 text-zinc-400'
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
          <button
            type="button"
            className="fixed inset-0 h-full w-full bg-black/80 backdrop-blur-xs cursor-default"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu backdrop"
          />

          <div className="fixed inset-y-0 left-0 z-10 flex w-full max-w-xs flex-col justify-between overflow-y-auto border-r border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 text-white"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-amber-400 font-display text-sm font-bold text-black">
                    A
                  </span>
                  <span className="font-display text-base font-bold tracking-wider">AMBITION</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-tactile rounded-md border border-zinc-800 p-1.5 text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Mobile Quick Search */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  setSearchOpen(true)
                }}
                className="btn-tactile flex w-full items-center justify-between rounded-md border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-xs text-zinc-400 hover:border-zinc-700 hover:text-white"
              >
                <div className="flex items-center gap-2.5">
                  <Search className="h-4 w-4 text-amber-400" />
                  <span>Search equipment catalog...</span>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-600" />
              </button>

              {/* Category Links */}
              <div>
                <h4 className="mb-2.5 font-mono text-[10px] font-semibold tracking-widest text-zinc-500 uppercase">
                  Hardware Catalog
                </h4>
                <div className="space-y-1">
                  {topCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      to="/categories/$slug"
                      params={{ slug: cat.slug }}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between rounded-md px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-900 hover:text-amber-400"
                    >
                      <span>{cat.name}</span>
                      <span className="font-mono text-[10px] text-zinc-500">
                        {cat.product_count}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Studio Portal Links */}
              <div>
                <h4 className="mb-2.5 font-mono text-[10px] font-semibold tracking-widest text-zinc-500 uppercase">
                  Studio Account
                </h4>
                <div className="space-y-1">
                  <Link
                    to="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white"
                  >
                    <User className="h-4 w-4 text-zinc-500" />
                    <span>My Studio Account</span>
                  </Link>
                  <Link
                    to="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-md px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white"
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="h-4 w-4 text-amber-400" />
                      <span>Shopping Cart</span>
                    </div>
                    {totalItems > 0 && (
                      <span className="rounded-sm bg-amber-400 px-1.5 py-0.5 font-mono text-[10px] font-bold text-black">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/saleor"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-xs font-medium text-zinc-400 hover:bg-zinc-900 hover:text-amber-400"
                  >
                    <Zap className="h-4 w-4 text-amber-400" />
                    <span>API & Telemetry Workbench</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-zinc-800 pt-4 font-mono text-[10px] text-zinc-500">
              <p className="font-semibold text-zinc-300">AMBITION OFFICIAL STORE</p>
              <p className="mt-0.5">DIRECT CNC STUDIO EQUIPMENT</p>
            </div>
          </div>
        </div>
      )}

      {/* Instant Command Search Modal (No open animation per keyboard shortcut UX guidelines) */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-16 sm:pt-24">
          <button
            type="button"
            className="fixed inset-0 h-full w-full bg-black/80 backdrop-blur-xs cursor-default"
            onClick={() => {
              setSearchOpen(false)
              setSearchQuery('')
            }}
            aria-label="Close search backdrop"
          />
          <section
            className="relative z-10 w-full max-w-2xl rounded-md border border-zinc-800 bg-zinc-950 p-5 shadow-2xl"
            aria-label="Product Search Dialog"
          >
            <div className="flex items-center justify-between gap-2 border-b border-zinc-800 pb-3.5">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <Search className="h-4 w-4 shrink-0 text-amber-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search Ambition machines, cartridges, batteries, or SKU..."
                  className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
                />
                {searchQuery.trim().length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      inputRef.current?.focus()
                    }}
                    className="rounded-sm p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
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
                className="shrink-0 rounded-sm p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="mt-2.5 flex items-center justify-between px-1 font-mono text-[11px] text-zinc-400">
                <span>
                  FOUND <strong className="text-amber-400">{searchResults.length}</strong> MATCHES
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] text-zinc-500">
                  <span>NAVIGATE</span>
                  <kbd className="rounded-sm border border-zinc-800 bg-zinc-900 px-1 py-0.5 text-zinc-400">
                    ↑↓
                  </kbd>
                  <span>OPEN</span>
                  <kbd className="rounded-sm border border-zinc-800 bg-zinc-900 px-1 py-0.5 text-zinc-400">
                    ↵
                  </kbd>
                </span>
              </div>
            )}

            <div className="mt-3 max-h-96 space-y-1.5 overflow-y-auto">
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
                      className={`flex items-center justify-between gap-4 rounded-md border p-2.5 transition-colors ${
                        isSelected
                          ? 'border-amber-400/80 bg-zinc-900'
                          : 'border-zinc-800/70 bg-zinc-950 hover:border-zinc-700 hover:bg-zinc-900/60'
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <StudioProductImage
                          src={product.image}
                          alt={product.name}
                          productName={product.name}
                          sku={product.sku}
                          size="sm"
                          className="h-11 w-11 shrink-0 rounded-sm"
                        />
                        <div className="min-w-0">
                          <h4 className="truncate font-display text-xs font-semibold text-white">
                            {product.name}
                          </h4>
                          <span className="font-mono text-[10px] text-zinc-500">
                            SKU: {product.sku}
                          </span>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="whitespace-nowrap font-mono text-xs font-bold text-amber-400">
                          {hasVariants && (
                            <span className="mr-1 font-sans text-[10px] font-normal text-zinc-500">
                              From
                            </span>
                          )}
                          {formatPrice(effectivePrice)}
                        </span>
                        {isSelected && (
                          <span className="hidden sm:inline-flex items-center rounded-sm border border-amber-400/40 bg-amber-400/15 px-1.5 py-0.5 font-mono text-[9px] font-bold text-amber-300">
                            ↵ OPEN
                          </span>
                        )}
                      </div>
                    </Link>
                  )
                })
              ) : searchQuery.trim().length > 1 ? (
                <div className="py-8 text-center font-mono text-xs text-zinc-500">
                  No matching studio equipment found.
                </div>
              ) : (
                <div className="px-2 py-4">
                  <div className="mb-4 flex flex-col items-center gap-2 text-center text-xs text-zinc-500">
                    <Command className="h-5 w-5 text-zinc-600" />
                    <span>Search across 1,049 rotary machines, needles, and battery packs.</span>
                  </div>

                  <div className="border-t border-zinc-800/80 pt-3">
                    <div className="mb-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                      <Sparkles className="h-3 w-3 text-amber-400" />
                      <span>Quick Hardware Filters</span>
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
                          className="btn-tactile rounded-sm border border-zinc-800 bg-zinc-900 px-2.5 py-1 font-mono text-[11px] text-zinc-300 hover:border-amber-400/60 hover:text-amber-400"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  )
}
