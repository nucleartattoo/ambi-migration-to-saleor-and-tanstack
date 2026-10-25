import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const BASE_URL = 'https://www.ambitiontattoosupply.com'
const catalogPath = join(process.cwd(), 'src/data/catalog.json')
const sitemapPath = join(process.cwd(), 'public/sitemap.xml')

const catalog = JSON.parse(readFileSync(catalogPath, 'utf-8'))

const urls = []
const today = new Date().toISOString().split('T')[0]

// 1. Static Root Routes
urls.push({
  loc: `${BASE_URL}/`,
  lastmod: today,
  changefreq: 'daily',
  priority: '1.0',
})

// 2. Active Categories with products
const categories = Object.values(catalog.categories || {}).filter(
  (c) => c.is_active && c.product_count > 0 && c.slug,
)

// Sort descending by product count
categories.sort((a, b) => (b.product_count || 0) - (a.product_count || 0))

for (const cat of categories) {
  urls.push({
    loc: `${BASE_URL}/categories/${cat.slug}`,
    lastmod: today,
    changefreq: 'daily',
    priority: cat.product_count > 10 ? '0.9' : '0.8',
  })
}

// 3. Products (only individually visible storefront products)
const products = (catalog.products || []).filter(
  (p) => p.slug && p.is_visible_individually && p.status !== 2,
)

for (const prod of products) {
  urls.push({
    loc: `${BASE_URL}/products/${prod.slug}`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.8',
  })
}

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`

writeFileSync(sitemapPath, sitemapXml.trim(), 'utf-8')
console.log(`✅ Generated ${urls.length} URLs in ${sitemapPath}`)
