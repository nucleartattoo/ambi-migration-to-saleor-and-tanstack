import type { QueryClient } from '@tanstack/react-query'
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { CategoryNav } from '~/components/CategoryNav'
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
      { title: 'Ambition Tattoo Supply | Professional Wireless Machines & Needles' },
      {
        name: 'description',
        content:
          'Ambition Tattoo Supply Official Store. Premium wireless tattoo machines, battery power supplies, cartridge needles, and professional studio equipment.',
      },
    ],
    links: [{ rel: 'stylesheet', href: styles }],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorBoundaryComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
        <Header />
        <CategoryNav />
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
      <body className="bg-zinc-950 antialiased selection:bg-amber-500 selection:text-black">
        {children}
        <Scripts />
      </body>
    </html>
  )
}
