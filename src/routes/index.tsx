import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Code,
  Flame,
  Globe,
  Layers,
  Package,
  Search,
  ShieldCheck,
  Sparkles,
  Truck,
  Zap,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { ProductCard } from '~/components/ProductCard'
import { getFeaturedProducts, getTopCategories } from '~/lib/catalog'

export const Route = createFileRoute('/')({
  head: () => {
    const title = 'Ambition Tattoo Supply | Official Store - Wireless Machines & Cartridges'
    const description =
      'Ambition Tattoo Supply official direct store. Explore industry-leading wireless tattoo machine pens, Revolution cartridges, power supplies, and tattoo kits with direct studio warranty.'
    const siteUrl = 'https://www.ambitiontattoosupply.com'
    const logoUrl = 'https://www.ambitiontattoosupply.com/logo.png'
    const ogImage =
      'https://www.ambitiontattoosupply.com/media/catalog/product/5/1/51xcfzt0wll._sl1000_.jpg'

    // 1. Organization / OnlineStore Schema
    const storeSchema = {
      '@context': 'https://schema.org',
      '@type': 'OnlineStore',
      name: 'Ambition Tattoo Supply',
      alternateName: ['AMBI Tattoo Supply', 'Ambition Tattoo'],
      url: siteUrl,
      logo: logoUrl,
      image: ogImage,
      description,
      currenciesAccepted: 'USD',
      paymentAccepted: 'Credit Card, PayPal, Stripe',
      priceRange: '$$',
      brand: {
        '@type': 'Brand',
        name: 'Ambition Tattoo Supply',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-800-555-AMBI',
        contactType: 'customer support',
        availableLanguage: ['English', 'Chinese', 'Spanish'],
      },
      sameAs: [
        'https://www.instagram.com/ambitiontattoosupply',
        'https://www.facebook.com/ambitiontattoosupply',
        'https://www.youtube.com/@ambitiontattoosupply',
      ],
    }

    // 2. WebSite with Sitelinks Searchbox Schema
    const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Ambition Tattoo Supply',
      url: siteUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${siteUrl}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    }

    // 3. ItemList (Featured Studio Bestsellers)
    const featuredListSchema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Featured Ambition Studio Equipment',
      numberOfItems: 4,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Ambition Storm Wand Wireless Tattoo Machine Pen',
          url: `${siteUrl}/products/ambition-storm-wand-wireless-tattoo-machine-pen`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Ambition Soldier Max Wireless Battery Pen',
          url: `${siteUrl}/products/ambition-soldier-max-wireless-battery-pen`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Ambition Revolution Cartridge Needles',
          url: `${siteUrl}/products/ambition-cartridge-needles`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: 'Ambition Wireless Power Supply Battery Pack',
          url: `${siteUrl}/products/ambition-wireless-power-supply-pack`,
        },
      ],
    }

    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: siteUrl },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: ogImage },
        { property: 'og:site_name', content: 'Ambition Tattoo Supply' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: ogImage },
      ],
      links: [{ rel: 'canonical', href: siteUrl }],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(storeSchema),
        },
        {
          type: 'application/ld+json',
          children: JSON.stringify(websiteSchema),
        },
        {
          type: 'application/ld+json',
          children: JSON.stringify(featuredListSchema),
        },
      ],
    }
  },
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

  // SEO Debug Panel State
  const [showSeoDebug, setShowSeoDebug] = useState(false)
  const [seoTab, setSeoTab] = useState<'store' | 'website' | 'featured'>('store')

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

      {/* Homepage SEO & Google Rich Results Transparency Box */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-zinc-800/80 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-2 text-amber-400">
                <Globe className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Homepage SEO & Google Rich Snippets</span>
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                    Validated Rich Schema
                  </span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Structured data with OnlineStore, WebSite with Sitelinks Searchbox, and Featured ItemList.
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

          {/* Google SERP Search Result Preview Card with Sitelinks & Searchbox */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <Search className="h-3.5 w-3.5 text-amber-500" /> Google SERP Rich Snippet Preview
            </span>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-3 font-sans">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-black text-black">
                    A
                  </span>
                  <span className="text-zinc-300">https://www.ambitiontattoosupply.com</span>
                </div>
                <h4 className="text-base sm:text-lg font-medium text-blue-400 hover:underline cursor-pointer">
                  Ambition Tattoo Supply | Official Store - Wireless Machines &amp; Cartridges
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Ambition Tattoo Supply official direct store. Explore industry-leading wireless tattoo machine pens, Revolution cartridges, power supplies, and tattoo kits with direct studio warranty.
                </p>
              </div>

              {/* Sitelinks Searchbox Simulation */}
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-2 flex items-center gap-2 max-w-md">
                <Search className="h-3.5 w-3.5 text-zinc-500" />
                <span className="text-xs text-zinc-500 font-sans italic">Search ambitiontattoosupply.com...</span>
              </div>

              {/* Sitelinks Navigation Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 border-t border-zinc-900">
                <div className="space-y-0.5">
                  <span className="text-xs font-medium text-blue-400 hover:underline cursor-pointer">
                    Wireless Tattoo Machines
                  </span>
                  <p className="text-[11px] text-zinc-500 line-clamp-1">Soldier Max, Storm Wand, Ninja Pro</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-medium text-blue-400 hover:underline cursor-pointer">
                    Revolution Cartridge Needles
                  </span>
                  <p className="text-[11px] text-zinc-500 line-clamp-1">EO gas sterilized 08/10/12 RL RS</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-medium text-blue-400 hover:underline cursor-pointer">
                    Studio Wholesale Program
                  </span>
                  <p className="text-[11px] text-zinc-500 line-clamp-1">20% tiered equipment discounts</p>
                </div>
              </div>
            </div>
          </div>

          {/* Schema.org Checklist Verification Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
            <div className="flex items-center gap-2 rounded-lg bg-zinc-950/80 border border-zinc-800/80 p-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <div>
                <div className="text-[11px] font-semibold text-white">OnlineStore</div>
                <div className="text-[10px] text-zinc-400">Brand &amp; store profile</div>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-zinc-950/80 border border-zinc-800/80 p-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <div>
                <div className="text-[11px] font-semibold text-white">Sitelinks Searchbox</div>
                <div className="text-[10px] text-zinc-400">SearchAction defined</div>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-zinc-950/80 border border-zinc-800/80 p-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <div>
                <div className="text-[11px] font-semibold text-white">Featured ItemList</div>
                <div className="text-[10px] text-zinc-400">Top studio equipment</div>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-zinc-950/80 border border-zinc-800/80 p-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <div>
                <div className="text-[11px] font-semibold text-white">Canonical Link</div>
                <div className="text-[10px] text-zinc-400">https://ambition...</div>
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
                    onClick={() => setSeoTab('store')}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                      seoTab === 'store'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    OnlineStore
                  </button>
                  <button
                    type="button"
                    onClick={() => setSeoTab('website')}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                      seoTab === 'website'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    WebSite &amp; Sitelinks
                  </button>
                  <button
                    type="button"
                    onClick={() => setSeoTab('featured')}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                      seoTab === 'featured'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Featured ItemList
                  </button>
                </div>
              </div>

              <pre className="max-h-80 overflow-y-auto rounded-xl bg-zinc-950 p-3.5 text-[11px] font-mono text-amber-400/90 border border-zinc-800/80 leading-relaxed">
                {JSON.stringify(
                  seoTab === 'store'
                    ? {
                        '@context': 'https://schema.org',
                        '@type': 'OnlineStore',
                        name: 'Ambition Tattoo Supply',
                        alternateName: ['AMBI Tattoo Supply', 'Ambition Tattoo'],
                        url: 'https://www.ambitiontattoosupply.com',
                        logo: 'https://www.ambitiontattoosupply.com/logo.png',
                        description:
                          'Ambition Tattoo Supply official direct store. Explore industry-leading wireless tattoo machine pens, Revolution cartridges, power supplies, and tattoo kits with direct studio warranty.',
                        currenciesAccepted: 'USD',
                        paymentAccepted: 'Credit Card, PayPal, Stripe',
                        priceRange: '$$',
                        brand: {
                          '@type': 'Brand',
                          name: 'Ambition Tattoo Supply',
                        },
                        sameAs: [
                          'https://www.instagram.com/ambitiontattoosupply',
                          'https://www.facebook.com/ambitiontattoosupply',
                          'https://www.youtube.com/@ambitiontattoosupply',
                        ],
                      }
                    : seoTab === 'website'
                      ? {
                          '@context': 'https://schema.org',
                          '@type': 'WebSite',
                          name: 'Ambition Tattoo Supply',
                          url: 'https://www.ambitiontattoosupply.com',
                          potentialAction: {
                            '@type': 'SearchAction',
                            target: {
                              '@type': 'EntryPoint',
                              urlTemplate:
                                'https://www.ambitiontattoosupply.com/search?q={search_term_string}',
                            },
                            'query-input': 'required name=search_term_string',
                          },
                        }
                      : {
                          '@context': 'https://schema.org',
                          '@type': 'ItemList',
                          name: 'Featured Ambition Studio Equipment',
                          numberOfItems: 4,
                          itemListElement: [
                            {
                              '@type': 'ListItem',
                              position: 1,
                              name: 'Ambition Storm Wand Wireless Tattoo Machine Pen',
                              url: 'https://www.ambitiontattoosupply.com/products/ambition-storm-wand-wireless-tattoo-machine-pen',
                            },
                            {
                              '@type': 'ListItem',
                              position: 2,
                              name: 'Ambition Soldier Max Wireless Battery Pen',
                              url: 'https://www.ambitiontattoosupply.com/products/ambition-soldier-max-wireless-battery-pen',
                            },
                            {
                              '@type': 'ListItem',
                              position: 3,
                              name: 'Ambition Revolution Cartridge Needles',
                              url: 'https://www.ambitiontattoosupply.com/products/ambition-cartridge-needles',
                            },
                            {
                              '@type': 'ListItem',
                              position: 4,
                              name: 'Ambition Wireless Power Supply Battery Pack',
                              url: 'https://www.ambitiontattoosupply.com/products/ambition-wireless-power-supply-pack',
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
      </section>
    </div>
  )
}
