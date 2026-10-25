import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { StudioProductImage } from '~/components/StudioProductImage'
import { type CatalogProduct, getProductEffectivePrice } from '~/lib/catalog'
import type { Product } from '~/lib/saleor/types'
import { formatPrice } from '~/lib/utils'

interface ProductCardProps {
  product: CatalogProduct | Product
}

export function ProductCard({ product }: ProductCardProps) {
  const isCatalogProduct = 'gallery' in product

  const name = product.name
  const slug = product.slug
  const sku = isCatalogProduct ? product.sku : product.id.slice(0, 6)
  const rawImage = isCatalogProduct ? product.image : product.thumbnail?.url
  const categoryName = isCatalogProduct ? undefined : product.category?.name
  const effectivePrice = isCatalogProduct
    ? getProductEffectivePrice(product)
    : product.pricing?.priceRange?.start?.gross?.amount || 0
  const variantCount = isCatalogProduct ? product.variants?.length || 0 : 0
  const hasRange = isCatalogProduct && (!product.price || product.price === 0) && variantCount > 0

  return (
    <Link
      to="/products/$slug"
      params={{ slug }}
      className="group btn-tactile relative flex flex-col overflow-hidden rounded-md border border-zinc-800/90 bg-zinc-900/50 transition-colors hover:border-amber-500/50 hover:bg-zinc-900"
    >
      {/* Top Studio Pedestal Image Well (Zero overlaid pills per design guidelines) */}
      <div className="relative aspect-square w-full overflow-hidden border-b border-zinc-800/80">
        <StudioProductImage
          src={rawImage}
          alt={name}
          productName={name}
          sku={sku}
          priority
          className="h-full w-full"
        />
      </div>

      {/* Hardware Telemetry & Pricing */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <div className="flex items-center justify-between gap-2 font-mono text-[10px] tracking-wider text-zinc-500 uppercase">
            <span className="truncate">{categoryName || `SKU // ${sku}`}</span>
            <span className="shrink-0 text-amber-400">
              {variantCount > 1 ? `${variantCount} SPECS` : 'IN STOCK'}
            </span>
          </div>

          <h3 className="mt-1.5 line-clamp-2 font-display text-sm font-semibold leading-snug text-zinc-100 transition-colors group-hover:text-amber-400">
            {name}
          </h3>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-zinc-800/80 pt-3">
          <div className="flex items-baseline gap-1.5 whitespace-nowrap">
            {hasRange && effectivePrice > 0 && (
              <span className="font-mono text-[10px] font-medium text-zinc-500 uppercase">
                From
              </span>
            )}
            <span className="font-mono text-sm font-bold tracking-tight text-white">
              {effectivePrice > 0 ? formatPrice(effectivePrice) : 'Inquire'}
            </span>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-sm border border-zinc-700/80 bg-zinc-800/80 px-2 py-1 font-mono text-[10px] font-semibold text-zinc-200 transition-colors group-hover:border-amber-400 group-hover:bg-amber-400 group-hover:text-black">
            <span>Inspect</span>
            <ArrowUpRight className="h-3 w-3" strokeWidth={2} />
          </span>
        </div>
      </div>
    </Link>
  )
}
