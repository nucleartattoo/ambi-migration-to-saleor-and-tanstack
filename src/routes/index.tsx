import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ArrowRight,
  Award,
  ChevronLeft,
  ChevronRight,
  Flame,
  Layers,
  Package,
  ShieldCheck,
  Sparkles,
  Truck,
  Zap,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { ProductCard } from '~/components/ProductCard'
import { getFeaturedProducts, getTopCategories } from '~/lib/catalog'

export const Route = createFileRoute('/')({
  component: HomePage,
})

interface HeroSlide {
  id: string
  tag: string
  title: string
  highlight: string
  description: string
  primaryCtaText: string
  primaryCtaLink: string
  secondaryCtaText: string
  secondaryCtaLink: string
  badgeText: string
  image: string
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-machines',
    tag: 'Direct Drive Flagship',
    title: 'Precision Engineered',
    highlight: 'Wireless Tattoo Machines',
    description:
      'Powered by custom coreless motors, 4.0mm & 4.2mm stroke options, and interchangeable dual battery systems for uninterrupted studio sessions.',
    primaryCtaText: 'Shop Wireless Machines',
    primaryCtaLink: '/categories/tattoo-machines',
    secondaryCtaText: 'Explore Storm Wand',
    secondaryCtaLink: '/products/ambition-storm-wand-wireless-tattoo-machine-pen',
    badgeText: '1950mAh Capacity • 6-8h Run Time',
    image:
      'https://www.ambitiontattoosupply.com/media/catalog/product/5/1/51xcfzt0wll._sl1000_.jpg',
  },
  {
    id: 'slide-needles',
    tag: 'Medical Grade 316 Steel',
    title: 'Ultra-Sharp & Stable',
    highlight: 'Revolution Cartridge Needles',
    description:
      'Engineered with high-elasticity safety membrane, transparent medical housing, and micro-stabilizer ribs for sharp linework and solid color packing.',
    primaryCtaText: 'Browse Needle Cartridges',
    primaryCtaLink: '/categories/tattoo-needles',
    secondaryCtaText: 'View Bestselling RL / RS',
    secondaryCtaLink: '/products/ambition-cartridge-needles',
    badgeText: '100% EO Gas Sterilized • Zero Wobble',
    image:
      'https://www.ambitiontattoosupply.com/media/catalog/product/8/1/81r1g-f_zjl._sl1500_.jpg',
  },
  {
    id: 'slide-wholesale',
    tag: 'Saleor B2B Commerce',
    title: 'Official Tattoo Studio',
    highlight: 'Wholesale Partner Program',
    description:
      'Unlock wholesale tiered pricing, 20% studio equipment discounts, net-30 terms, and dedicated dispatch via Saleor headless GraphQL engine.',
    primaryCtaText: 'Access Studio Portal',
    primaryCtaLink: '/account',
    secondaryCtaText: 'View Wholesale Tier',
    secondaryCtaLink: '/account',
    badgeText: '20% Off Equipment • Express Dispatch',
    image:
      'https://www.ambitiontattoosupply.com/media/catalog/product/6/1/61x0xsq_mvl._sl1000_.jpg',
  },
]

function HomePage() {
  const topCategories = getTopCategories()

  // Carousel State
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Featured Category Filter state
  const [activeFilter, setActiveFilter] = useState<string>('all')

  const currentSlide = HERO_SLIDES[currentSlideIndex]

  // Auto-play carousel every 5.5 seconds unless hovered
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 5500)
    return () => clearInterval(timer)
  }, [isPaused])

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length)
  }

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
  }

  // Get filtered featured products
  const featuredProducts = getFeaturedProducts(
    8,
    activeFilter === 'all' ? undefined : activeFilter,
  )

  return (
    <div className="space-y-16">
      {/* Hero Carousel Section */}
      <section
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative overflow-hidden border-b border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 py-12 sm:py-16 lg:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-400">
                  <Zap className="h-3.5 w-3.5" /> {currentSlide.tag}
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Saleor GraphQL Synced
                </span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight">
                {currentSlide.title} <br />
                <span className="text-amber-400">{currentSlide.highlight}</span>
              </h1>

              <p className="text-sm leading-relaxed text-zinc-300 sm:text-base max-w-xl">
                {currentSlide.description}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to={currentSlide.primaryCtaLink}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 text-xs font-bold text-black transition hover:bg-amber-400 shadow-lg shadow-amber-500/10 active:scale-[0.99]"
                >
                  <span>{currentSlide.primaryCtaText}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to={currentSlide.secondaryCtaLink}
                  className="inline-flex items-center rounded-xl border border-zinc-700 bg-zinc-900/80 px-6 py-3.5 text-xs font-semibold text-zinc-200 transition hover:bg-zinc-800 hover:text-white"
                >
                  {currentSlide.secondaryCtaText}
                </Link>
              </div>

              {/* Slide feature highlights */}
              <div className="pt-4 flex items-center gap-3 text-xs text-zinc-400">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-zinc-300 font-mono text-[11px]">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" /> {currentSlide.badgeText}
                </span>
              </div>
            </div>

            {/* Right Visual Image Box */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative aspect-square w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 flex items-center justify-center shadow-2xl shadow-black/80 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 via-transparent to-amber-500/10 opacity-60" />

                <img
                  key={currentSlide.image}
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="relative z-10 h-full w-full object-contain p-4 transition-all duration-700 group-hover:scale-105 animate-fadeIn"
                />

                <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between rounded-xl bg-zinc-900/90 border border-zinc-800/90 px-4 py-2.5 backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-semibold text-white">In Stock • Official Supply</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                    Slide {currentSlideIndex + 1} of {HERO_SLIDES.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Navigation Arrows & Dots */}
          <div className="mt-10 flex items-center justify-between border-t border-zinc-800/80 pt-6">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {HERO_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentSlideIndex
                      ? 'w-8 bg-amber-500'
                      : 'w-2.5 bg-zinc-700 hover:bg-zinc-500'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Prev / Next Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevSlide}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800 hover:text-white transition"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800 hover:text-white transition"
                aria-label="Next slide"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-4 rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-4">
            <Truck className="h-8 w-8 text-amber-400" />
            <div>
              <h4 className="text-sm font-semibold text-white">Global Express Shipping</h4>
              <p className="text-xs text-zinc-400">Fast delivery with tracking</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-4">
            <ShieldCheck className="h-8 w-8 text-amber-400" />
            <div>
              <h4 className="text-sm font-semibold text-white">100% Tested & Verified</h4>
              <p className="text-xs text-zinc-400">Strict studio QC standards</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-4">
            <Award className="h-8 w-8 text-amber-400" />
            <div>
              <h4 className="text-sm font-semibold text-white">1-Year Machine Warranty</h4>
              <p className="text-xs text-zinc-400">Direct factory warranty support</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-4">
            <Zap className="h-8 w-8 text-amber-400" />
            <div>
              <h4 className="text-sm font-semibold text-white">Wholesale & Pro Discounts</h4>
              <p className="text-xs text-zinc-400">Tiered pricing for studios</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products with Category Tabs */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                <Flame className="h-4 w-4" /> Studio Favorites
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Featured Studio Equipment
            </h2>
            <p className="mt-1 text-xs text-zinc-400">
              High-performance wireless pens and verified cartridge supplies from authentic AMBI catalog.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Picks' },
              { id: 'tattoo-machines', label: 'Wireless Machines' },
              { id: 'tattoo-needles', label: 'Cartridge Needles' },
              { id: 'tattoo-power-supplies', label: 'Batteries & Power' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
                  activeFilter === tab.id
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/10'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Products Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Browse By Category</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Explore our complete collection of 72 studio categories
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {topCategories.map((cat) => (
            <Link
              key={cat.id}
              to="/categories/$slug"
              params={{ slug: cat.slug }}
              className="group flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 transition hover:border-amber-500/50 hover:bg-zinc-800/60"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
                    Category
                  </span>
                  <span className="text-[11px] font-medium text-zinc-500">
                    {cat.product_count} items
                  </span>
                </div>
                <h3 className="mt-2 text-base font-bold text-white group-hover:text-amber-400">
                  {cat.name}
                </h3>
                {cat.subcategories && cat.subcategories.length > 0 && (
                  <p className="mt-2 text-xs text-zinc-500 line-clamp-1">
                    {cat.subcategories.map((s) => s.name).join(', ')}
                  </p>
                )}
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-medium text-zinc-400 group-hover:text-white">
                <span>View Products</span>
                <ChevronRight className="h-3 w-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
