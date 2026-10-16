import { Link, useRouter } from '@tanstack/react-router'
import {
  AlertOctagon,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  FileCode,
  Home,
  RefreshCw,
  ShieldAlert,
} from 'lucide-react'
import { useState } from 'react'

interface ErrorBoundaryProps {
  error: unknown
  reset?: () => void
}

export function ErrorBoundaryComponent({ error, reset }: ErrorBoundaryProps) {
  const router = useRouter()
  const [showDetails, setShowDetails] = useState(false)

  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : 'An unexpected application runtime exception occurred.'

  const errorStack = error instanceof Error ? error.stack : null

  const handleRetry = () => {
    if (reset) {
      reset()
    } else {
      router.invalidate()
      window.location.reload()
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center space-y-8">
        {/* Warning Icon Badge */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-rose-400">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Storefront Error Boundary Active</span>
          </div>

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl">
            <AlertOctagon className="h-10 w-10 text-rose-500 animate-pulse" />
          </div>
        </div>

        {/* Narrative description */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Something Went Wrong on This Page
          </h1>
          <p className="text-sm leading-relaxed text-zinc-400 max-w-lg mx-auto">
            Our SSR runtime caught an unhandled exception while loading this studio route. Your
            shopping cart and session data remain safe.
          </p>
        </div>

        {/* Recovery Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleRetry}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-xs font-bold text-black transition hover:bg-amber-400 shadow-lg shadow-amber-500/10 active:scale-[0.99]"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Retry & Reload Page</span>
          </button>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-3 text-xs font-semibold text-white transition hover:bg-zinc-800"
          >
            <Home className="h-4 w-4 text-zinc-400" />
            <span>Return to Safe Homepage</span>
          </Link>
        </div>

        {/* Expandable Technical Diagnostics */}
        <div className="mt-8 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 text-left">
          <button
            type="button"
            onClick={() => setShowDetails((prev) => !prev)}
            className="flex w-full items-center justify-between text-xs font-mono text-zinc-400 hover:text-white transition"
          >
            <span className="flex items-center gap-2">
              <FileCode className="h-4 w-4 text-amber-500" />
              <span>Technical Diagnostics & Stack Trace</span>
            </span>
            {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {showDetails && (
            <div className="mt-4 space-y-3 border-t border-zinc-800 pt-3 text-xs font-mono">
              <div className="rounded-lg bg-zinc-950 p-3 border border-zinc-800/80 text-rose-400 break-words">
                <strong>Error:</strong> {errorMessage}
              </div>
              {errorStack && (
                <pre className="max-h-60 overflow-y-auto rounded-lg bg-zinc-950 p-3 text-[11px] leading-relaxed text-zinc-500 whitespace-pre-wrap">
                  {errorStack}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
