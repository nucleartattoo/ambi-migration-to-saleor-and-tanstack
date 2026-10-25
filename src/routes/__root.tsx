import type { QueryClient } from '@tanstack/react-query'
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { ErrorBoundaryComponent } from '~/components/ErrorBoundary'
import { Footer } from '~/components/Footer'
import { Header } from '~/components/Header'
import { NotFoundComponent } from '~/components/NotFound'
import styles from '~/styles.css?url'

interface RootContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RootContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Ambition Tattoo Supply | Official Store - Wireless Machines & Cartridges' },
      {
        name: 'description',
        content:
          'Ambition Tattoo Supply Official Store. Precision CNC wireless tattoo machines, battery power supplies, surgical cartridge needles, and professional studio equipment.',
      },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap',
      },
      { rel: 'stylesheet', href: styles },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorBoundaryComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <div className="flex min-h-[100dvh] flex-col bg-zinc-950 text-zinc-100">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="bg-zinc-950 antialiased selection:bg-amber-400 selection:text-black">
        {children}
        <Scripts />
      </body>
    </html>
  )
}
