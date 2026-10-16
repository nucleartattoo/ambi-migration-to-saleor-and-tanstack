import { Link, createFileRoute } from '@tanstack/react-router'
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Code,
  Globe,
  Maximize2,
  Package,
  RotateCcw,
  Search,
  Shield,
  ShoppingBag,
  Sparkles,
  Truck,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useCart } from '~/lib/cart'
import {
  type CatalogProduct,
  type ProductChildVariant,
  getProductBySlug,
  getProductEffectivePrice,
} from '~/lib/catalog'
import { formatPrice, stripHtml } from '~/lib/utils'

function findMatchingChild(
  product: CatalogProduct,
  selectedLabels: string[],
): ProductChildVariant | null {
  if (!product.children || product.children.length === 0) return null
  let bestChild: ProductChildVariant = product.children[0]
  let maxScore = -1

  for (const child of product.children) {
    let score = 0
    const haystack = `${child.name} ${child.sku}`.toLowerCase()

    for (const label of selectedLabels) {
      const clean = label.toLowerCase().trim()
      if (!clean) continue
      if (haystack.includes(clean)) {
        score += 100 + clean.length
      } else {
        const words = clean.split(/[\s\-_]+/).filter((w) => w.length > 1)
        for (const word of words) {
          if (haystack.includes(word)) {
            score += 10
          }
        }
      }
    }

    if (score > maxScore) {
      maxScore = score
      bestChild = child
    }
  }

  return bestChild
}

function getColorHex(label: string): string | null {
  const l = label.toLowerCase()
  if (l.includes('black')) return '#18181b'
  if (l.includes('rose red') || l.includes('rose')) return '#f43f5e'
  if (l.includes('red')) return '#ef4444'
  if (l.includes('silver') || l.includes('grey') || l.includes('gray')) return '#cbd5e1'
  if (l.includes('gold') || l.includes('golden') || l.includes('champagne')) return '#f59e0b'
  if (l.includes('blue')) return '#3b82f6'
  if (l.includes('green')) return '#10b981'
  if (l.includes('pink')) return '#ec4899'
  if (l.includes('purple')) return '#8b5cf6'
  return null
}

export const Route = createFileRoute('/products/$slug')({
  head: ({ params }) => {
    const product = getProductBySlug(params.slug)
    if (!product) {
      return {
        meta: [{ title: 'Product Not Found | AMBI Tattoo Supply' }],
      }
    }
    const title = `${product.name} | AMBI Professional Tattoo Supply`
    const cleanShortDesc = stripHtml(product.short_description || '')
    const description =
      cleanShortDesc ||
      `Buy authentic ${product.name} (SKU: ${product.sku}) at AMBI Official Store with 24-hour dispatch and full warranty.`
    const effectivePrice = getProductEffectivePrice(product)
    const childPrices = (product.children || []).map((c) => c.price).filter((p) => p > 0)
    const productUrl = `https://www.ambitiontattoosupply.com/products/${product.slug}`

    const offersData =
      childPrices.length > 1
        ? {
            '@type': 'AggregateOffer',
            priceCurrency: 'USD',
            lowPrice: Math.min(...childPrices),
            highPrice: Math.max(...childPrices),
            offerCount: childPrices.length,
            availability: 'https://schema.org/InStock',
            itemCondition: 'https://schema.org/NewCondition',
            url: productUrl,
          }
        : {
            '@type': 'Offer',
            price: effectivePrice,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            itemCondition: 'https://schema.org/NewCondition',
            url: productUrl,
          }

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      image: product.gallery.length > 0 ? product.gallery : [product.image],
      description,
      sku: product.sku,
      brand: {
        '@type': 'Brand',
        name: 'Ambition Tattoo Supply',
      },
      category: 'Professional Tattoo Equipment',
      offers: offersData,
    }

    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: product.image },
        { property: 'og:type', content: 'product' },
        { property: 'og:url', content: productUrl },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: product.image },
      ],
      links: [{ rel: 'canonical', href: productUrl }],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(structuredData),
        },
      ],
    }
  },
  component: ProductDetailPage,
})

function ProductDetailPage() {
  const { slug } = Route.useParams()
  const product = getProductBySlug(slug)

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center space-y-4">
        <AlertCircle className="mx-auto h-12 w-12 text-zinc-600" />
        <h1 className="text-2xl font-bold text-white">Product Not Found</h1>
        <p className="text-sm text-zinc-400">
          The requested tattoo equipment could not be found in the AMBI catalog.
        </p>
        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex rounded-lg bg-amber-500 px-6 py-2.5 text-xs font-bold text-black hover:bg-amber-400"
          >
            Return to Storefront
          </Link>
        </div>
      </div>
    )
  }

  // Comprehensive Gallery Images: Merges product image, gallery array and child variants with deduplication
  const galleryImages = useMemo(() => {
    const list: string[] = []
    if (product.image) list.push(product.image)
    if (product.gallery && product.gallery.length > 0) list.push(...product.gallery)
    if (product.children && product.children.length > 0) {
      product.children.forEach((c) => {
        if (c.image) list.push(c.image)
      })
    }
    const unique = Array.from(new Set(list.filter(Boolean)))
    return unique.length > 0 ? unique : product.image ? [product.image] : []
  }, [product])

  const [activeImage, setActiveImage] = useState<string | null>(galleryImages[0] || null)

  // Carousel & Zoom states
  const activeImageIndex = useMemo(() => {
    const idx = galleryImages.findIndex((img) => img === activeImage)
    return idx >= 0 ? idx : 0
  }, [galleryImages, activeImage])

  const [isHoverZoom, setIsHoverZoom] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxZoom, setLightboxZoom] = useState(1)
  const [showSeoDebug, setShowSeoDebug] = useState(false)
  const imageContainerRef = useRef<HTMLDivElement>(null)

  const handlePrevImage = useCallback(() => {
    if (galleryImages.length <= 1) return
    const prevIdx = (activeImageIndex - 1 + galleryImages.length) % galleryImages.length
    setActiveImage(galleryImages[prevIdx])
  }, [activeImageIndex, galleryImages])

  const handleNextImage = useCallback(() => {
    if (galleryImages.length <= 1) return
    const nextIdx = (activeImageIndex + 1) % galleryImages.length
    setActiveImage(galleryImages[nextIdx])
  }, [activeImageIndex, galleryImages])

  // Mouse move handler for interactive zoom lens
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return
    const rect = imageContainerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100))
    setZoomPos({ x, y })
  }

  // Keyboard navigation for carousel & lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLightboxOpen) {
        setIsLightboxOpen(false)
        setLightboxZoom(1)
      } else if (e.key === 'ArrowLeft') {
        handlePrevImage()
      } else if (e.key === 'ArrowRight') {
        handleNextImage()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLightboxOpen, handlePrevImage, handleNextImage])

  // Variant selections: option_id -> selected_value_index
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    for (const opt of product.options) {
      if (opt.values.length > 0) {
        initial[opt.id] = opt.values[0].index
      }
    }
    return initial
  })

  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [toastItem, setToastItem] = useState<{
    name: string
    variantLabel: string
    price: number
    quantity: number
    image: string
  } | null>(null)

  // Reset state when navigating to a new product
  useEffect(() => {
    if (product) {
      setActiveImage(galleryImages[0] || null)
      const initial: Record<string, string> = {}
      for (const opt of product.options) {
        if (opt.values.length > 0) {
          initial[opt.id] = opt.values[0].index
        }
      }
      setSelectedOptions(initial)
      setQuantity(1)
      setToastItem(null)
    }
  }, [product, galleryImages])

  // Collect labels from current selections
  const selectedLabels = product.options
    .map((opt) => {
      const chosenValIndex = selectedOptions[opt.id]
      const chosenVal = opt.values.find((v) => v.index === chosenValIndex)
      return chosenVal ? chosenVal.label : ''
    })
    .filter(Boolean)

  // Dynamically resolve matched child variant
  const matchedChild = findMatchingChild(product, selectedLabels)

  // Auto-switch main image when option changes and a matching child variant image is present
  useEffect(() => {
    if (matchedChild?.image) {
      setActiveImage(matchedChild.image)
    }
  }, [matchedChild?.id, matchedChild?.image])

  const fallbackChildPrice =
    (product.children || product.variants || []).find((c) => c.price > 0)?.price || 0
  const currentPrice =
    matchedChild?.price && matchedChild.price > 0
      ? matchedChild.price
      : product.price > 0
        ? product.price
        : fallbackChildPrice
  const currentSku = matchedChild?.sku || product.sku
  const currentVariantName = matchedChild?.name || product.name

  const handleOptionChange = (optionId: string, valueIndex: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionId]: valueIndex,
    }))
  }

  const handleAddToCart = () => {
    const formattedOptions = product.options.map((opt) => {
      const chosenValIndex = selectedOptions[opt.id]
      const chosenVal = opt.values.find((v) => v.index === chosenValIndex)
      return {
        label: opt.label,
        value: chosenVal ? chosenVal.label : chosenValIndex || 'Standard',
      }
    })

    const chosenImage = activeImage || product.image

    addItem(
      {
        productId: product.id,
        name: currentVariantName,
        slug: product.slug,
        sku: currentSku,
        image: chosenImage,
        price: currentPrice,
        options: formattedOptions,
      },
      quantity,
    )

    // Trigger visual toast
    setToastItem({
      name: currentVariantName,
      variantLabel: formattedOptions.map((o) => o.value).join(' / '),
      price: currentPrice,
      quantity,
      image: chosenImage,
    })

    setTimeout(() => {
      setToastItem(null)
    }, 4500)
  }

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Toast Notification Alert */}
      {toastItem && (
        <aside
          aria-label="Added to cart notification"
          className="fixed bottom-6 right-6 z-50 flex max-w-md items-center gap-4 rounded-2xl border border-amber-500/40 bg-zinc-900/95 p-4 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300"
        >
          <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 p-1 flex items-center justify-center">
            {toastItem.image ? (
              <img
                src={toastItem.image}
                alt={toastItem.name}
                className="h-full w-full object-contain"
              />
            ) : (
              <Package className="h-6 w-6 text-zinc-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <Check className="h-3.5 w-3.5" /> Added to your Cart
            </div>
            <p className="text-xs font-bold text-white truncate mt-0.5">{toastItem.name}</p>
            {toastItem.variantLabel && (
              <p className="text-[11px] text-zinc-400 truncate">{toastItem.variantLabel}</p>
            )}
            <div className="mt-1 flex items-center gap-3">
              <span className="text-xs font-bold text-amber-400">
                {toastItem.quantity} × {formatPrice(toastItem.price)}
              </span>
              <Link
                to="/cart"
                className="inline-flex items-center gap-1 text-xs font-bold text-white hover:text-amber-400 underline decoration-amber-500/50 underline-offset-2 transition"
              >
                View Cart <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setToastItem(null)}
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </aside>
      )}

      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="text-xs text-zinc-500 flex items-center gap-1.5 flex-wrap"
      >
        <Link to="/" className="hover:text-zinc-300">
          Home
        </Link>
        <ChevronRight className="h-3 w-3 text-zinc-600" />
        <Link
          to="/categories/$slug"
          params={{ slug: 'tattoo-machines' }}
          className="hover:text-zinc-300"
        >
          Catalog
        </Link>
        <ChevronRight className="h-3 w-3 text-zinc-600" />
        <span className="text-amber-400 font-medium truncate max-w-sm">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Media Gallery with Carousel, Hover Pan-Zoom, and Lightbox Modal */}
        <div className="space-y-4">
          <div
            ref={imageContainerRef}
            onMouseEnter={() => setIsHoverZoom(true)}
            onMouseLeave={() => setIsHoverZoom(false)}
            onMouseMove={handleMouseMove}
            onClick={() => setIsLightboxOpen(true)}
            className="group relative aspect-square overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6 flex items-center justify-center cursor-zoom-in select-none shadow-xl shadow-black/40"
          >
            {activeImage ? (
              <img
                src={activeImage}
                alt={product.name}
                style={
                  isHoverZoom
                    ? {
                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                        transform: 'scale(2)',
                      }
                    : { transform: 'scale(1)' }
                }
                className="max-h-full max-w-full object-contain transition-transform duration-150 ease-out"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-zinc-600 gap-2">
                <Package className="h-16 w-16 text-zinc-700" />
                <span className="text-xs text-zinc-500">AMBI Professional Equipment</span>
              </div>
            )}

            {/* Badge */}
            {product.type === 'configurable' && (
              <span className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-zinc-900/90 px-3 py-1 text-[11px] font-semibold text-amber-400 border border-amber-500/20 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" /> Configurable Multi-Variant
              </span>
            )}

            {/* Lightbox / Zoom hint button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsLightboxOpen(true)
              }}
              className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900/80 border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 transition backdrop-blur-sm"
              title="Click to zoom & fullscreen"
              aria-label="Enlarge image"
            >
              <Maximize2 className="h-4 w-4" />
            </button>

            {/* Previous & Next Carousel Chevrons */}
            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePrevImage()
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900/80 border border-zinc-700/80 text-zinc-300 hover:text-white hover:bg-zinc-800 hover:scale-105 active:scale-95 transition backdrop-blur-sm opacity-80 sm:opacity-0 group-hover:opacity-100"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNextImage()
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900/80 border border-zinc-700/80 text-zinc-300 hover:text-white hover:bg-zinc-800 hover:scale-105 active:scale-95 transition backdrop-blur-sm opacity-80 sm:opacity-0 group-hover:opacity-100"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Image Counter & Hover hint */}
            {galleryImages.length > 0 && (
              <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
                <span className="rounded-md bg-zinc-900/80 border border-zinc-800 px-2.5 py-1 text-[11px] font-mono text-zinc-300 backdrop-blur-sm">
                  {activeImageIndex + 1} / {galleryImages.length}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-zinc-400 bg-zinc-900/80 border border-zinc-800 px-2 py-0.5 rounded backdrop-blur-sm">
                  <ZoomIn className="h-3 w-3 text-amber-500" /> Hover to zoom • Click for fullscreen
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {galleryImages.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {galleryImages.map((imgUrl, idx) => (
                <button
                  type="button"
                  key={imgUrl}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`relative aspect-square overflow-hidden rounded-xl border p-1 bg-zinc-950 transition ${
                    activeImage === imgUrl
                      ? 'border-amber-500 ring-2 ring-amber-500/50'
                      : 'border-zinc-800 hover:border-zinc-700 opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`View slide ${idx + 1}`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.name} view ${idx + 1}`}
                    className="h-full w-full object-contain"
                  />
                  {activeImage === imgUrl && (
                    <span className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Purchase Info & Variant Selector */}
        <div className="flex flex-col space-y-6">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                In Stock • Ready to Dispatch
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-xs font-mono text-zinc-300 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
                SKU: {currentSku}
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-[11px] text-zinc-500 font-medium">
                Default Warehouse
              </span>
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {product.name}
            </h1>

            {product.short_description && (
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                {stripHtml(product.short_description)}
              </p>
            )}

            <div className="mt-5 flex items-baseline gap-4">
              <span className="text-3xl font-extrabold text-white">
                {formatPrice(currentPrice)}
              </span>
              {currentPrice > 0 && (
                <>
                  <span className="text-sm text-zinc-500 line-through">
                    {formatPrice(currentPrice * 1.25)}
                  </span>
                  <span className="rounded bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-400 border border-amber-500/20">
                    Studio Wholesale Rate
                  </span>
                </>
              )}
            </div>
          </div>

          <hr className="border-zinc-800" />

          {/* Real Configurable Options with Dynamic Price & Color Swatches */}
          {product.options && product.options.length > 0 && (
            <div className="space-y-5">
              {product.options.map((opt) => {
                const selectedVal = selectedOptions[opt.id]
                const selectedLabel =
                  opt.values.find((v) => v.index === selectedVal)?.label || selectedVal
                const isColorAttr = opt.label.toLowerCase().includes('color')

                return (
                  <div key={opt.id}>
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                        {opt.label}:{' '}
                        <span className="text-amber-400 font-bold">{selectedLabel}</span>
                      </label>
                    </div>

                    <div className="mt-2.5 flex flex-wrap gap-2.5">
                      {opt.values.map((v) => {
                        const isSelected = selectedVal === v.index
                        const colorHex = isColorAttr ? getColorHex(v.label) : null

                        return (
                          <button
                            key={v.index}
                            type="button"
                            onClick={() => handleOptionChange(opt.id, v.index)}
                            className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium transition ${
                              isSelected
                                ? 'border-amber-500 bg-amber-500/15 text-white ring-1 ring-amber-500/50 shadow-sm'
                                : 'border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800'
                            }`}
                          >
                            {colorHex && (
                              <span
                                className="h-3.5 w-3.5 rounded-full border border-white/20 shadow-xs flex-shrink-0"
                                style={{ backgroundColor: colorHex }}
                              />
                            )}
                            <span>{v.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Quantity Counter & Add to Cart */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="flex items-center rounded-xl border border-zinc-800 bg-zinc-900/80 p-1 w-fit">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="h-9 w-9 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="w-12 text-center text-sm font-semibold text-white">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="h-9 w-9 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3.5 px-6 text-sm font-bold bg-amber-500 text-black hover:bg-amber-400 active:scale-[0.99] transition shadow-lg shadow-amber-500/10 cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Add to Cart • {formatPrice(currentPrice * quantity)}</span>
            </button>
          </div>

          {/* Studio Guarantee Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-800/80 text-center">
            <div className="flex flex-col items-center gap-1.5 text-[11px] text-zinc-400">
              <Truck className="h-4 w-4 text-amber-500" />
              <span>Ships in 24 Hours</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 text-[11px] text-zinc-400">
              <Shield className="h-4 w-4 text-amber-500" />
              <span>1-Year Official Warranty</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 text-[11px] text-zinc-400">
              <RotateCcw className="h-4 w-4 text-amber-500" />
              <span>30-Day Hassle Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description & Technical Specs */}
      {product.description && (
        <div className="border-t border-zinc-800 pt-10 space-y-4">
          <h2 className="text-xl font-bold text-white">Product Description & Studio Specs</h2>
          <div
            className="prose prose-invert prose-amber max-w-none text-sm text-zinc-300 leading-relaxed overflow-hidden"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      )}

      {/* SEO & Schema.org Rich Snippet Transparency Box */}
      <div className="border-t border-zinc-800/80 pt-8">
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-zinc-800/80 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-2 text-amber-400">
                <Globe className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Google Rich Snippets & Schema.org Structured Data</span>
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                    100% Validated
                  </span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Saleor headless catalog metadata formatted for Google Merchant & Schema.org Product Rich Results.
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
                <span className="text-zinc-600">› products › {product.slug}</span>
              </div>
              <h4 className="text-base sm:text-lg font-medium text-blue-400 hover:underline cursor-pointer">
                {product.name} | AMBI Professional Tattoo Supply
              </h4>
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold pt-0.5">
                <span>In stock</span>
                <span className="text-zinc-600">•</span>
                <span className="text-amber-400 font-bold">
                  {product.children && product.children.length > 1
                    ? `From ${formatPrice(currentPrice)}`
                    : formatPrice(currentPrice)}
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-400">Brand: Ambition Tattoo Supply</span>
              </div>
              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed pt-1">
                {stripHtml(product.short_description || product.description || '')}
              </p>
            </div>
          </div>

          {/* Schema.org Checklist Verification Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
            <div className="flex items-center gap-2 rounded-lg bg-zinc-950/80 border border-zinc-800/80 p-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <div>
                <div className="text-[11px] font-semibold text-white">Schema @type</div>
                <div className="text-[10px] text-zinc-400 font-mono">Product</div>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-zinc-950/80 border border-zinc-800/80 p-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <div>
                <div className="text-[11px] font-semibold text-white">Pricing Model</div>
                <div className="text-[10px] text-zinc-400 font-mono">
                  {product.children && product.children.length > 1 ? 'AggregateOffer' : 'Single Offer'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-zinc-950/80 border border-zinc-800/80 p-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <div>
                <div className="text-[11px] font-semibold text-white">Stock Status</div>
                <div className="text-[10px] text-zinc-400 font-mono">schema.org/InStock</div>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-zinc-950/80 border border-zinc-800/80 p-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <div>
                <div className="text-[11px] font-semibold text-white">Gallery Assets</div>
                <div className="text-[10px] text-zinc-400 font-mono">{galleryImages.length} High-Res Images</div>
              </div>
            </div>
          </div>

          {/* Expandable JSON-LD Code Block */}
          {showSeoDebug && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800 pb-2">
                <span className="font-mono text-[11px] text-amber-400 flex items-center gap-1.5">
                  <Code className="h-3.5 w-3.5" /> application/ld+json (Live DOM Script)
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">Google Search Console Ready</span>
              </div>
              <pre className="max-h-72 overflow-y-auto text-[11px] font-mono leading-relaxed text-zinc-300 p-2 bg-zinc-900/60 rounded-lg">
                {JSON.stringify(
                  {
                    '@context': 'https://schema.org',
                    '@type': 'Product',
                    name: product.name,
                    image: galleryImages,
                    description: stripHtml(product.short_description || product.description || ''),
                    sku: currentSku,
                    brand: {
                      '@type': 'Brand',
                      name: 'Ambition Tattoo Supply',
                    },
                    category: 'Professional Tattoo Equipment',
                    offers:
                      product.children && product.children.length > 1
                        ? {
                            '@type': 'AggregateOffer',
                            priceCurrency: 'USD',
                            lowPrice: Math.min(
                              ...(product.children.map((c) => c.price).filter((p) => p > 0) || [currentPrice]),
                            ),
                            highPrice: Math.max(
                              ...(product.children.map((c) => c.price).filter((p) => p > 0) || [currentPrice]),
                            ),
                            offerCount: product.children.length,
                            availability: 'https://schema.org/InStock',
                            itemCondition: 'https://schema.org/NewCondition',
                            url: `https://www.ambitiontattoosupply.com/products/${product.slug}`,
                          }
                        : {
                            '@type': 'Offer',
                            price: currentPrice,
                            priceCurrency: 'USD',
                            availability: 'https://schema.org/InStock',
                            itemCondition: 'https://schema.org/NewCondition',
                            url: `https://www.ambitiontattoosupply.com/products/${product.slug}`,
                          },
                  },
                  null,
                  2,
                )}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && activeImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-xl animate-in fade-in duration-200"
        >
          {/* Header Controls */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <span className="hidden sm:inline text-sm font-bold text-white truncate max-w-xs md:max-w-md">
                {product.name}
              </span>
              <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-mono text-zinc-300 whitespace-nowrap">
                {activeImageIndex + 1} / {galleryImages.length}
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Zoom In/Out Controls */}
              <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-900/90 p-0.5">
                <button
                  type="button"
                  onClick={() => setLightboxZoom((z) => Math.max(1, z - 0.5))}
                  disabled={lightboxZoom <= 1}
                  className="p-1 sm:p-1.5 text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400"
                  title="Zoom Out (-)"
                  aria-label="Zoom Out"
                >
                  <ZoomOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
                <span className="px-1.5 sm:px-2 text-[11px] sm:text-xs font-mono font-semibold text-amber-400 min-w-11 sm:min-w-14 text-center">
                  {Math.round(lightboxZoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setLightboxZoom((z) => Math.min(2.5, z + 0.5))}
                  disabled={lightboxZoom >= 2.5}
                  className="p-1 sm:p-1.5 text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400"
                  title="Zoom In (+)"
                  aria-label="Zoom In"
                >
                  <ZoomIn className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>

              {lightboxZoom > 1 && (
                <button
                  type="button"
                  onClick={() => setLightboxZoom(1)}
                  className="hidden sm:inline-block rounded-lg border border-zinc-800 bg-zinc-900/90 px-2 py-1 text-xs text-zinc-300 hover:text-white"
                >
                  Reset
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsLightboxOpen(false)
                  setLightboxZoom(1)
                }}
                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/90 text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
                aria-label="Close lightbox"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>

          {/* Main Stage Viewport */}
          <div className="relative flex-1 overflow-auto flex items-center justify-center p-2 sm:p-4 select-none">
            {/* Prev/Next Buttons */}
            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/80 text-white hover:bg-amber-500 hover:text-black transition shadow-2xl active:scale-95"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/80 text-white hover:bg-amber-500 hover:text-black transition shadow-2xl active:scale-95"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </>
            )}

            <div
              className="flex items-center justify-center transition-transform duration-200 ease-out cursor-grab active:cursor-grabbing max-h-full max-w-full"
              style={{ transform: `scale(${lightboxZoom})` }}
            >
              <img
                src={activeImage}
                alt={product.name}
                className="max-h-[65vh] sm:max-h-[70vh] max-w-[85vw] object-contain drop-shadow-2xl rounded-lg"
              />
            </div>
          </div>

          {/* Bottom Thumbnails Strip */}
          {galleryImages.length > 1 && (
            <div className="border-t border-zinc-800/80 bg-zinc-950/80 p-2 sm:p-4">
              <div className="mx-auto flex max-w-xl items-center justify-center gap-2 sm:gap-3 overflow-x-auto pb-1">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    type="button"
                    key={imgUrl}
                    onClick={() => {
                      setActiveImage(imgUrl)
                      setLightboxZoom(1)
                    }}
                    className={`h-11 w-11 sm:h-14 sm:w-14 flex-shrink-0 overflow-hidden rounded-lg border p-1 bg-zinc-900 transition ${
                      activeImage === imgUrl
                        ? 'border-amber-500 ring-2 ring-amber-500/50 scale-105'
                        : 'border-zinc-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="h-full w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
