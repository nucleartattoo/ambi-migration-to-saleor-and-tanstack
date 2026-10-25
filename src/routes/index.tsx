import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Code,
  ShieldCheck,
  Truck,
  Zap,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { ProductCard } from '~/components/ProductCard'
import { StudioProductImage } from '~/components/StudioProductImage'
import { fetchHomeCatalogData } from '~/lib/catalog.functions'

export const Route = createFileRoute('/')({
  loader: () => fetchHomeCatalogData(),
  head: () => {
    const title = 'Ambition Tattoo Supply | Official Store - Wireless Machines & Cartridges'
    const description =
      'Ambition Tattoo Supply official direct store. Explore industry-leading wireless tattoo machine pens, Revolution cartridges, power supplies, and tattoo kits with direct studio warranty.'
    const siteUrl = 'https://www.ambitiontattoosupply.com'
    const logoUrl = 'https://www.ambitiontattoosupply.com/logo.png'
    const ogImage =
      'https://www.ambitiontattoosupply.com/media/catalog/product/5/1/51xcfzt0wll._sl1000_.jpg'

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

    const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Ambition Tattoo Supply',
      url: siteUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${siteUrl}/?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    }

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
          name: 'Ambition Soldier Max Wireless Tattoo Machine Pen',
          url: `${siteUrl}/products/ambition-soldier-max-wireless-tattoo-machine-pen`,
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
          name: 'Ambition Soldier Max Wireless Battery',
          url: `${siteUrl}/products/ambition-soldier-max-wireless-battery`,
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
  specs: Array<{ label: string; value: string }>
  sku: string
  image: string
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-machines',
    tag: 'CNC Direct Drive Series',
    title: 'Precision CNC',
    highlight: 'Wireless Rotary Pens',
    description:
      'Custom coreless motors with 4.0mm stroke and dual hot-swap lithium battery packs for 8-hour studio sessions.',
    primaryCtaText: 'Shop Machines',
    primaryCtaLink: '/categories/tattoo-machines',
    secondaryCtaText: 'Inspect Storm Wand',
    secondaryCtaLink: '/products/ambition-storm-wand-wireless-tattoo-machine-pen',
    specs: [
      { label: 'STROKE', value: '4.0MM' },
      { label: 'MOTOR', value: '9000 RPM' },
      { label: 'BATTERY', value: '1950MAH' },
    ],
    sku: 'STORM-WAND',
    image:
      'https://www.ambitiontattoosupply.com/media/catalog/product/5/1/51xcfzt0wll._sl1000_.jpg',
  },
  {
    id: 'slide-soldier',
    tag: 'Brushless Flagship',
    title: 'High-Torque CNC',
    highlight: 'Soldier Series Pens',
    description:
      'Carved from 6061-T6 aircraft aluminum with digital OLED voltage telemetry and zero-vibration shaft bearings.',
    primaryCtaText: 'Explore Soldier',
    primaryCtaLink: '/categories/wireless-tattoo-machines',
    secondaryCtaText: 'View Cartridges',
    secondaryCtaLink: '/categories/tattoo-needles',
    specs: [
      { label: 'CHASSIS', value: '6061-T6' },
      { label: 'WEIGHT', value: '210G' },
      { label: 'RUNTIME', value: '6-8 HRS' },
    ],
    sku: 'SOLDIER-PRO',
    image: 'https://www.ambitiontattoosupply.com/media/catalog/product/s/o/soldier10.jpg',
  },
  {
    id: 'slide-wholesale',
    tag: 'Pro Studio Supply',
    title: 'Surgical Grade',
    highlight: 'Cartridge Systems',
    description:
      'EO gas sterilized 316L medical steel cartridges with high-tension safety membranes and wholesale studio pricing.',
    primaryCtaText: 'Shop Needles',
    primaryCtaLink: '/categories/tattoo-needles',
    secondaryCtaText: 'Studio Portal',
    secondaryCtaLink: '/account',
    specs: [
      { label: 'STEEL', value: '316L MED' },
      { label: 'STERILE', value: 'EO GAS' },
      { label: 'STUDIO', value: '20% OFF' },
    ],
    sku: 'REV-NEEDLE',
    image: 'https://www.ambitiontattoosupply.com/media/catalog/product/s/o/soldier8.jpg',
  },
]

function HomePage() {
  const { topCategories, featuredByTab } = Route.useLoaderData()

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'tattoo-machines' | 'tattoo-needles' | 'tattoo-power-supplies'
  >('all')
  const [showSeoDebug, setShowSeoDebug] = useState(false)
  const [seoTab, setSeoTab] = useState<'store' | 'website' | 'featured'>('store')

  const currentSlide = HERO_SLIDES[currentSlideIndex]

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [isPaused])

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length)
  }

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
  }

  const featuredProducts = featuredByTab[activeFilter] || featuredByTab.all

  return (
    <div className="space-y-20">
      {/* Section 1: Asymmetric Split Hero + Architectural Spec Strip */}
      <section
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative overflow-hidden border-b border-zinc-800/90 bg-zinc-950 pt-10 pb-14 lg:pt-14 lg:pb-16"
      >
        <div className="pointer-events-none absolute inset-0 bg-hardware-grid opacity-50" />
        <div className="pointer-events-none absolute top-0 right-1/4 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left Column: Strictly 4 Text Elements (Eyebrow, Headline, Subtext <= 20 words, CTAs) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-sm border border-amber-400/30 bg-amber-400/10 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-widest text-amber-300">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                <span>{currentSlide.tag}</span>
              </div>

              <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl xl:text-5xl leading-[1.08]">
                {currentSlide.title} <br />
                <span className="text-amber-400">{currentSlide.highlight}</span>
              </h1>

              <p className="max-w-lg text-sm leading-relaxed text-zinc-300 sm:text-base">
                {currentSlide.description}
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  to={currentSlide.primaryCtaLink}
                  className="btn-tactile inline-flex items-center gap-2.5 rounded-md bg-amber-400 px-6 py-3.5 font-display text-xs font-bold uppercase tracking-wider text-black hover:bg-amber-300"
                >
                  <span>{currentSlide.primaryCtaText}</span>
                  <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
                </Link>

                <Link
                  to={currentSlide.secondaryCtaLink}
                  className="btn-tactile inline-flex items-center rounded-md border border-zinc-700 bg-zinc-900/90 px-6 py-3.5 font-display text-xs font-semibold uppercase tracking-wider text-zinc-100 hover:border-zinc-500 hover:bg-zinc-800"
                >
                  {currentSlide.secondaryCtaText}
                </Link>
              </div>

              {/* Mechanical Slide Switcher */}
              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center gap-2">
                  {HERO_SLIDES.map((slide, idx) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`h-1.5 rounded-sm transition-all duration-200 ${
                        idx === currentSlideIndex
                          ? 'w-10 bg-amber-400'
                          : 'w-3 bg-zinc-800 hover:bg-zinc-600'
                      }`}
                      aria-label={`Select hero slide ${idx + 1}`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={prevSlide}
                    className="btn-tactile flex h-8 w-8 items-center justify-center rounded-sm border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-white"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    className="btn-tactile flex h-8 w-8 items-center justify-center rounded-sm border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-white"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Calibrated Studio Pedestal Showcase + Hardware Telemetry HUD */}
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-md border border-zinc-800 bg-zinc-900/90 shadow-2xl">
                <div className="aspect-[4/3] sm:aspect-square w-full">
                  <StudioProductImage
                    key={currentSlide.image}
                    src={currentSlide.image}
                    alt={`${currentSlide.title} ${currentSlide.highlight}`}
                    productName={currentSlide.highlight}
                    sku={currentSlide.sku}
                    size="lg"
                    priority
                    className="h-full w-full"
                  />
                </div>

                {/* Hardware Telemetry Readout */}
                <div className="grid grid-cols-3 divide-x divide-zinc-800 border-t border-zinc-800 bg-zinc-950">
                  {currentSlide.specs.map((spec) => (
                    <div key={spec.label} className="px-3 py-2.5">
                      <div className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase">
                        {spec.label}
                      </div>
                      <div className="mt-0.5 font-mono text-xs font-bold text-zinc-100 truncate">
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Architectural Hairline Guarantee Strip (No generic card containers) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 divide-y divide-zinc-800/90 rounded-md border border-zinc-800/90 bg-zinc-900/30 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          <div className="flex items-start gap-3.5 p-5">
            <Truck className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" strokeWidth={1.75} />
            <div>
              <h2 className="font-display text-sm font-semibold text-white">
                Global Airfreight Dispatch
              </h2>
              <p className="mt-0.5 text-xs text-zinc-400">
                Tracked studio delivery on orders over $99
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3.5 p-5">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" strokeWidth={1.75} />
            <div>
              <h2 className="font-display text-sm font-semibold text-white">
                EO Gas Sterilized Needles
              </h2>
              <p className="mt-0.5 text-xs text-zinc-400">
                Medical-grade 316L steel with safety membrane
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3.5 p-5">
            <Award className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" strokeWidth={1.75} />
            <div>
              <h2 className="font-display text-sm font-semibold text-white">
                1-Year Direct Warranty
              </h2>
              <p className="mt-0.5 text-xs text-zinc-400">
                Factory motor and battery replacement coverage
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3.5 p-5">
            <Zap className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" strokeWidth={1.75} />
            <div>
              <h2 className="font-display text-sm font-semibold text-white">
                Studio Wholesale Tiers
              </h2>
              <p className="mt-0.5 text-xs text-zinc-400">
                20% B2B partner discount with code SALEOR20
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Featured Studio Equipment Catalog */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-800/90 pb-5">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Featured Studio Equipment
            </h2>
            <p className="mt-1 text-xs text-zinc-400">
              Flagship wireless rotary pens, sterilized needle cartridges, and high-capacity battery
              packs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: 'all', label: 'All Units' },
                { id: 'tattoo-machines', label: 'Machines' },
                { id: 'tattoo-needles', label: 'Cartridges' },
                { id: 'tattoo-power-supplies', label: 'Power Packs' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`btn-tactile whitespace-nowrap rounded-sm px-3 py-1.5 font-mono text-xs font-semibold transition-colors ${
                  activeFilter === tab.id
                    ? 'bg-amber-400 text-black'
                    : 'border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Section 4: Asymmetric Bento Hardware Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-zinc-800/90 pb-5">
          <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Hardware Architecture by Category
          </h2>
          <p className="mt-1 text-xs text-zinc-400">
            Browse 7 primary studio equipment divisions engineered for professional tattoo artists.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {topCategories.map((cat, idx) => {
            const isFeaturedTile = idx === 0
            return (
              <Link
                key={cat.id}
                to="/categories/$slug"
                params={{ slug: cat.slug }}
                className={`group btn-tactile relative flex flex-col justify-between overflow-hidden rounded-md border p-6 transition-colors ${
                  isFeaturedTile
                    ? 'sm:col-span-2 border-amber-500/40 bg-gradient-to-br from-zinc-900 via-zinc-900 to-amber-500/10 hover:border-amber-400'
                    : 'border-zinc-800/90 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="text-amber-400 uppercase">
                      {isFeaturedTile ? 'FLAGSHIP DIVISION' : `CAT // 0${idx + 1}`}
                    </span>
                    <span className="rounded-sm border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-zinc-400">
                      {cat.product_count} SKUs
                    </span>
                  </div>

                  <h3
                    className={`mt-3 font-display font-bold text-white transition-colors group-hover:text-amber-400 ${
                      isFeaturedTile ? 'text-xl sm:text-2xl' : 'text-base'
                    }`}
                  >
                    {cat.name}
                  </h3>

                  {cat.subcategories && cat.subcategories.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {cat.subcategories.map((sub) => (
                        <span
                          key={sub.id}
                          className="rounded-sm border border-zinc-800 bg-zinc-950/80 px-2 py-0.5 font-mono text-[10px] text-zinc-400"
                        >
                          {sub.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-xs text-zinc-500">
                      Direct factory supply with studio QC verification.
                    </p>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-zinc-800/70 pt-3 font-mono text-xs font-semibold text-zinc-300 group-hover:text-amber-400">
                  <span>Open Catalog</span>
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Discreet Collapsible Search Engine & Schema.org Telemetry Drawer */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-md border border-zinc-800/80 bg-zinc-950 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-mono font-semibold text-zinc-300">
                  SCHEMA.ORG JSON-LD TELEMETRY
                </span>
                <span className="font-mono text-[10px] text-zinc-500">
                  (OnlineStore + WebSite SearchAction + Featured ItemList)
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowSeoDebug((prev) => !prev)}
              className="btn-tactile inline-flex items-center gap-1.5 self-start sm:self-auto rounded-sm border border-zinc-800 bg-zinc-900 px-3 py-1.5 font-mono text-[11px] font-medium text-zinc-300 hover:border-zinc-700 hover:text-white"
            >
              <Code className="h-3.5 w-3.5 text-amber-400" />
              <span>{showSeoDebug ? 'Hide Schema Inspector' : 'Inspect JSON-LD'}</span>
              {showSeoDebug ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>
          </div>

          {showSeoDebug && (
            <div className="mt-4 space-y-3 border-t border-zinc-800 pt-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-zinc-400">
                  Live SSR Head JSON-LD Payload:
                </span>
                <div className="flex items-center gap-1.5">
                  {(
                    [
                      { id: 'store', label: 'OnlineStore' },
                      { id: 'website', label: 'WebSite SearchAction' },
                      { id: 'featured', label: 'Featured ItemList' },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSeoTab(item.id)}
                      className={`rounded-sm px-2.5 py-1 font-mono text-[11px] font-medium ${
                        seoTab === item.id
                          ? 'bg-amber-400 text-black'
                          : 'border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <pre className="max-h-64 overflow-x-auto rounded-sm border border-zinc-800 bg-zinc-900/70 p-3.5 font-mono text-[11px] text-amber-300 leading-relaxed">
                {seoTab === 'store'
                  ? JSON.stringify(
                      {
                        '@context': 'https://schema.org',
                        '@type': 'OnlineStore',
                        name: 'Ambition Tattoo Supply',
                        url: 'https://www.ambitiontattoosupply.com',
                        currenciesAccepted: 'USD',
                        priceRange: '$$',
                      },
                      null,
                      2,
                    )
                  : seoTab === 'website'
                    ? JSON.stringify(
                        {
                          '@context': 'https://schema.org',
                          '@type': 'WebSite',
                          name: 'Ambition Tattoo Supply',
                          url: 'https://www.ambitiontattoosupply.com',
                          potentialAction: {
                            '@type': 'SearchAction',
                            target: 'https://www.ambitiontattoosupply.com/?q={search_term_string}',
                            'query-input': 'required name=search_term_string',
                          },
                        },
                        null,
                        2,
                      )
                    : JSON.stringify(
                        {
                          '@context': 'https://schema.org',
                          '@type': 'ItemList',
                          name: 'Featured Ambition Studio Equipment',
                          numberOfItems: 4,
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
