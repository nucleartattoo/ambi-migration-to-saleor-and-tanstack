import { BatteryCharging, Cpu, Crosshair, Layers, ShieldCheck, Sparkles, Zap } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface StudioProductImageProps {
  src?: string | null
  alt: string
  productName?: string
  sku?: string
  className?: string
  imgClassName?: string
  size?: 'sm' | 'md' | 'lg'
  priority?: boolean
}

type HardwareArchetype = 'machine' | 'needle' | 'battery' | 'kit' | 'grip'

function detectArchetype(text: string): HardwareArchetype {
  const lower = text.toLowerCase()
  if (
    lower.includes('needle') ||
    lower.includes('cartridge') ||
    lower.includes('rl') ||
    lower.includes('rs')
  ) {
    return 'needle'
  }
  if (
    lower.includes('battery') ||
    lower.includes('power') ||
    lower.includes('rca') ||
    lower.includes('cord')
  ) {
    return 'battery'
  }
  if (lower.includes('kit') || lower.includes('set') || lower.includes('complete')) {
    return 'kit'
  }
  if (lower.includes('grip') || lower.includes('tip') || lower.includes('tube')) {
    return 'grip'
  }
  return 'machine'
}

const ARCHETYPE_META: Record<
  HardwareArchetype,
  {
    code: string
    spec: string
    material: string
    Icon: typeof Zap
  }
> = {
  machine: {
    code: 'CNC-ROTARY // PEN',
    spec: '4.0MM STROKE - 9000 RPM',
    material: '6061-T6 AIRCRAFT ALUM',
    Icon: Zap,
  },
  needle: {
    code: 'EO-STERILE // MEMBRANE',
    spec: '316L SURGICAL STEEL',
    material: 'ZERO-WOBBLE STABILIZER',
    Icon: Sparkles,
  },
  battery: {
    code: 'LI-ION // POWER PACK',
    spec: '1950MAH - 5.0V TO 12.0V',
    material: 'OLED DIGITAL TELEMETRY',
    Icon: BatteryCharging,
  },
  kit: {
    code: 'PRO STUDIO // SYSTEM',
    spec: 'DUAL BATTERY + CARTRIDGES',
    material: 'FLIGHT CASE READY',
    Icon: Layers,
  },
  grip: {
    code: 'ERGONOMIC // GRIP',
    spec: 'AUTOCLAVE SAFE - 34MM',
    material: 'KNURLED CNC FINISH',
    Icon: ShieldCheck,
  },
}

export function StudioProductImage({
  src,
  alt,
  productName,
  sku,
  className = '',
  imgClassName = '',
  size = 'md',
  priority = false,
}: StudioProductImageProps) {
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null)

  const validSrc = src && src.trim().length > 0 && failedSrc !== src ? src : null
  const isLoaded = Boolean(validSrc && loadedSrc === validSrc)

  // Handle SSR pre-hydration image load completion or failure
  useEffect(() => {
    const imgEl = imgRef.current
    if (!imgEl || !validSrc) return
    if (imgEl.complete) {
      if (imgEl.naturalWidth > 0) {
        setLoadedSrc(validSrc)
      } else {
        setFailedSrc(validSrc)
      }
    }
  }, [validSrc])

  const archetype = detectArchetype(`${productName || ''} ${alt}`)
  const meta = ARCHETYPE_META[archetype]
  const IconComponent = meta.Icon

  return (
    <div className={`relative overflow-hidden select-none ${className}`}>
      {/* Hidden or Active Studio Pedestal Layer when validSrc exists */}
      {validSrc && (
        <div
          className={`studio-pedestal absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-200 ${
            isLoaded ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <img
            ref={imgRef}
            src={validSrc}
            alt={alt}
            onLoad={() => setLoadedSrc(validSrc)}
            onError={() => setFailedSrc(validSrc)}
            loading={priority || size === 'sm' ? 'eager' : undefined}
            decoding="async"
            className={`h-full w-full object-cover ${imgClassName}`}
          />
        </div>
      )}

      {/* Precision CNC Hardware Schematic Base Layer (Visible whenever image is absent, loading, or 404) */}
      {size === 'sm' ? (
        <div className="relative flex h-full w-full items-center justify-center bg-zinc-900 border border-zinc-800 text-amber-400/90">
          <div className="absolute inset-0 bg-hardware-grid opacity-40" />
          <IconComponent className="relative z-10 h-5 w-5 text-amber-400" strokeWidth={1.75} />
        </div>
      ) : (
        <div className="relative flex h-full w-full flex-col justify-between bg-zinc-950 p-4 text-left">
          <div className="pointer-events-none absolute inset-0 bg-hardware-grid opacity-60" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.12),transparent_70%)]" />

          <div className="relative z-0 flex items-center justify-between border-b border-zinc-800/80 pb-2">
            <span className="font-mono text-[9px] font-semibold tracking-widest text-amber-400/90 uppercase">
              {sku ? `SKU // ${sku}` : meta.code}
            </span>
            <Crosshair className="h-3 w-3 text-zinc-600" strokeWidth={1.5} />
          </div>

          <div className="relative z-0 my-auto flex flex-col items-center justify-center py-3">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-amber-500/30 bg-zinc-900/90 shadow-inner">
              <div className="absolute inset-1.5 rounded-full border border-dashed border-zinc-700" />
              <IconComponent className="h-6 w-6 text-amber-400" strokeWidth={1.5} />
            </div>
            <span className="mt-2 font-mono text-[10px] font-medium tracking-wider text-zinc-300 uppercase text-center line-clamp-1 px-2">
              {meta.spec}
            </span>
          </div>

          <div className="relative z-0 flex items-center justify-between border-t border-zinc-800/80 pt-2 font-mono text-[9px] text-zinc-500">
            <span className="truncate">{meta.material}</span>
            <Cpu className="h-3 w-3 text-zinc-600 shrink-0" />
          </div>
        </div>
      )}
    </div>
  )
}
