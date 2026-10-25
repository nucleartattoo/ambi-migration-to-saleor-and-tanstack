import { Link } from '@tanstack/react-router'
import { ShieldCheck, Terminal, Truck, Zap } from 'lucide-react'
import { getTopCategories } from '~/lib/catalog'

export function Footer() {
  const topCategories = getTopCategories()

  return (
    <footer className="mt-24 border-t border-zinc-800/90 bg-zinc-950 text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5 text-white">
              <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-amber-400 font-display text-sm font-bold text-black">
                A
              </span>
              <span className="font-display text-lg font-bold tracking-wider">AMBITION</span>
            </div>
            <p className="max-w-sm text-xs leading-relaxed text-zinc-400">
              Precision CNC wireless tattoo machines, coreless direct-drive rotary systems, EO gas
              sterilized needle cartridges, and high-capacity studio power supplies.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 font-mono text-[10px] text-zinc-500">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-400" /> 1-YR FACTORY WARRANTY
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-amber-400" /> DIRECT GLOBAL DISPATCH
              </span>
            </div>
          </div>

          {/* Hardware Catalog */}
          <div className="md:col-span-4">
            <h4 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-zinc-200">
              Hardware Catalog
            </h4>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
              {topCategories.map((c) => (
                <li key={c.id}>
                  <Link
                    to="/categories/$slug"
                    params={{ slug: c.slug }}
                    className="transition-colors hover:text-amber-400"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Studio Portal & Support */}
          <div className="md:col-span-3">
            <h4 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-zinc-200">
              Studio Portal
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link to="/account" className="transition-colors hover:text-white">
                  Studio Partner Account
                </Link>
              </li>
              <li>
                <Link to="/cart" className="transition-colors hover:text-white">
                  Equipment Cart
                </Link>
              </li>
              <li>
                <Link to="/checkout" className="transition-colors hover:text-white">
                  Express Checkout
                </Link>
              </li>
              <li>
                <Link
                  to="/saleor"
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] text-zinc-500 transition-colors hover:text-amber-400"
                >
                  <Terminal className="h-3 w-3 text-amber-400" />
                  <span>GraphQL API Telemetry</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-900 pt-6 font-mono text-[11px] text-zinc-500">
          <p>© {new Date().getFullYear()} AMBITION TATTOO SUPPLY. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-4">
            <a href="/sitemap.xml" className="hover:text-zinc-300 transition-colors">
              SITEMAP.XML
            </a>
            <a href="/robots.txt" className="hover:text-zinc-300 transition-colors">
              ROBOTS.TXT
            </a>
            <Link
              to="/saleor"
              className="inline-flex items-center gap-1 text-zinc-400 hover:text-amber-400 transition-colors"
            >
              <Zap className="h-3 w-3 text-amber-400" />
              <span>SALEOR 3.23 ENGINE</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
