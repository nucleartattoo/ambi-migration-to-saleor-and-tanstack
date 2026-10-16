import { Link } from '@tanstack/react-router'
import {
  AlertTriangle,
  ArrowRight,
  Compass,
  FileQuestion,
  Home,
  Package,
  Search,
  Sparkles,
  Zap,
} from 'lucide-react'

export function NotFoundComponent() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center space-y-8">
        {/* Glow badge & Code */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <Compass className="h-3.5 w-3.5 animate-spin" />
            <span>Studio Equipment Navigator</span>
          </div>

          <div className="relative">
            <h1 className="text-8xl sm:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-zinc-200 via-zinc-400 to-zinc-700 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl sm:text-2xl font-bold text-amber-400 bg-zinc-950/80 px-4 py-1 rounded-full border border-zinc-800">
                Page Not Found
              </span>
            </div>
          </div>
        </div>

        {/* Narrative description */}
        <div className="space-y-3 max-w-xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Looking for Official Ambition Supplies?
          </h2>
          <p className="text-sm leading-relaxed text-zinc-400">
            The studio route, catalog collection, or product URL you requested has been relocated,
            discontinued, or does not exist in the migrated Saleor catalog.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-xs font-bold text-black transition hover:bg-amber-400 shadow-lg shadow-amber-500/10 active:scale-[0.99]"
          >
            <Home className="h-4 w-4" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            to="/categories/$slug"
            params={{ slug: 'tattoo-machines' }}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-3 text-xs font-semibold text-white transition hover:bg-zinc-800 hover:border-zinc-600"
          >
            <Zap className="h-4 w-4 text-amber-400" />
            <span>Browse Machines</span>
          </Link>

          <Link
            to="/categories/$slug"
            params={{ slug: 'tattoo-needles' }}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-6 py-3 text-xs font-medium text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
          >
            <Package className="h-4 w-4 text-zinc-400" />
            <span>Needle Cartridges</span>
          </Link>
        </div>

        {/* Popular Categories Card */}
        <div className="mt-12 rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 sm:p-8 backdrop-blur-sm text-left">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Popular Studio Catalog Categories
              </h3>
            </div>
            <span className="text-xs text-zinc-500 font-mono">1,049 Products Available</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              {
                name: 'Wireless Tattoo Machines',
                slug: 'tattoo-machines',
                count: '52 items',
                desc: 'Soldier Max, Storm Wand, Ninja Pro',
              },
              {
                name: 'Cartridge Needles',
                slug: 'tattoo-needles',
                count: '4 items',
                desc: 'Revolution 08/10/12 RL, RS, RM',
              },
              {
                name: 'Tattoo Power Supplies',
                slug: 'tattoo-power-supplies',
                count: '21 items',
                desc: 'Wireless batteries, foot pedals',
              },
              {
                name: 'Tattoo Kits Complete',
                slug: 'tattoo-kits',
                count: '15 items',
                desc: 'Full studio setups with needles & inks',
              },
              {
                name: 'Disposable & Metal Grips',
                slug: 'tattoo-grips',
                count: '8 items',
                desc: 'Ergonomic silicone & aluminum grips',
              },
              {
                name: 'Saleor GraphQL Status',
                slug: '/saleor',
                isSpecial: true,
                count: 'Live Backend',
                desc: 'API health and introspection status',
              },
            ].map((cat) =>
              cat.isSpecial ? (
                <Link
                  key={cat.name}
                  to="/saleor"
                  className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 hover:border-amber-500/50 hover:bg-amber-500/10 transition group"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-amber-400">
                    <span>{cat.name}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-400">{cat.desc}</p>
                </Link>
              ) : (
                <Link
                  key={cat.name}
                  to="/categories/$slug"
                  params={{ slug: cat.slug }}
                  className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3.5 hover:border-zinc-700 hover:bg-zinc-800/40 transition group"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-white group-hover:text-amber-400 transition">
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">{cat.count}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-400 truncate">{cat.desc}</p>
                </Link>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
