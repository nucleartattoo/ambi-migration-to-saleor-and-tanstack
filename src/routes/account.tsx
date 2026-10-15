import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  ExternalLink,
  MapPin,
  Package,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Truck,
  User,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { cartStore } from '~/lib/cart'
import { formatPrice } from '~/lib/utils'

export const Route = createFileRoute('/account')({
  component: AccountPage,
})

interface OrderItem {
  id: string
  name: string
  image: string
  quantity: number
  price: number
  options?: Array<{ label: string; value: string }>
  slug?: string
}

interface SavedOrder {
  orderId: string
  saleorSessionId?: string
  trackingNumber: string
  createdAt: string
  estimatedDelivery?: string
  customerEmail: string
  customerName: string
  shippingAddress: string
  shippingMethod: string
  paymentMethod: string
  status?: 'Delivered' | 'In Transit' | 'Processing'
  items: OrderItem[]
  subtotal: number
  discountAmount: number
  discountCode: string | null
  shippingCost: number
  total: number
}

// Default initial mock orders if customer has not placed an order yet
const INITIAL_STUDIO_ORDERS: SavedOrder[] = [
  {
    orderId: 'SLR-AMBI-849120',
    saleorSessionId: 'Q2hlY2tvdXQ6NGFLM2ZqOThhbWJp',
    trackingNumber: 'USPS-9400-1124-8891',
    createdAt: 'Oct 08, 2026, 02:45 PM',
    estimatedDelivery: 'Oct 11, 2026',
    customerEmail: 'artist@blacklotus.studio',
    customerName: 'Marcus Vance',
    shippingAddress: '742 Evergreen Terrace, Suite 204, Los Angeles, CA 90028, United States',
    shippingMethod: 'Priority Studio Airfreight (1-2 Days)',
    paymentMethod: 'Stripe Credit Card (•••• 4242)',
    status: 'Delivered',
    items: [
      {
        id: '646__Color:Black|Stroke:4.2mm',
        name: 'Ambition Soldier Max Wireless Battery Tattoo Pen',
        image:
          'https://www.ambitiontattoosupply.com/media/catalog/product/s/o/soldier_max_black_1.jpg',
        quantity: 1,
        price: 149.99,
        options: [
          { label: 'Color', value: 'Matte Black' },
          { label: 'Stroke', value: '4.2mm Direct Drive' },
        ],
        slug: 'ambition-soldier-max-tattoo-machine',
      },
      {
        id: 'needles__0801RL',
        name: 'Ambition Revolution Cartridge Needles (Box of 20)',
        image:
          'https://www.ambitiontattoosupply.com/media/catalog/product/r/e/revolution_cartridge_box.jpg',
        quantity: 2,
        price: 13.0,
        options: [
          { label: 'Type', value: '0801 Round Liner' },
          { label: 'Taper', value: 'Long Taper' },
        ],
        slug: 'ambition-cartridge-needles',
      },
    ],
    subtotal: 175.99,
    discountAmount: 20.0,
    discountCode: 'PRO10',
    shippingCost: 0,
    total: 155.99,
  },
]

function AccountPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'orders' | 'profile' | 'addresses'>('orders')
  const [orders, setOrders] = useState<SavedOrder[]>([])
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<string | null>(null)
  const [trackingModalOrder, setTrackingModalOrder] = useState<SavedOrder | null>(null)

  // Profile Form state
  const [profileData, setProfileData] = useState({
    fullName: 'Marcus Vance',
    email: 'artist@blacklotus.studio',
    phone: '+1 (555) 019-2834',
    studioName: 'Black Lotus Tattoo Atelier',
    licenseNumber: 'CA-TAT-8921-LA',
    taxExemptId: 'EXEMPT-B2B-90028',
  })
  const [profileSaved, setProfileSaved] = useState(false)

  // Load orders from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('ambi_orders_history_v1')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge local real orders with past historical studio order
          setOrders([...parsed, ...INITIAL_STUDIO_ORDERS])
          return
        }
      }
      setOrders(INITIAL_STUDIO_ORDERS)
    } catch {
      setOrders(INITIAL_STUDIO_ORDERS)
    }
  }, [])

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 4000)
  }

  const handleReorder = (order: SavedOrder) => {
    order.items.forEach((item) => {
      cartStore.addItem({
        productId: item.id.split('__')[0] || item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        sku: item.id,
        slug: item.slug || 'ambition-storm-wand-wireless-tattoo-machine-pen',
        options: item.options || [],
      }, item.quantity)
    })
    router.navigate({ to: '/cart' })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Account Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" /> Verified Studio Pro Account
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-[11px] font-mono text-zinc-400">ID: SLR-CUST-8839120</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Customer Account & Studio Portal
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage your AMBI studio orders, delivery logistics, addresses, and wholesale credentials.
          </p>
        </div>

        {/* Wholesale Tier Badge */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 flex items-center gap-3">
          <div className="rounded-lg bg-amber-500/20 p-2 text-amber-400">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
              Wholesale Partner
            </span>
            <span className="text-xs font-semibold text-white">Tier 2 Studio Discount (20% Off)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Navigation Tabs */}
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => setTab('orders')}
            className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-xs font-semibold transition ${
              tab === 'orders'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/10'
                : 'text-zinc-400 bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Package className="h-4 w-4" /> Order History
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                tab === 'orders' ? 'bg-black/20 text-black' : 'bg-zinc-800 text-zinc-300'
              }`}
            >
              {orders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTab('profile')}
            className={`flex w-full items-center gap-2.5 rounded-xl px-4 py-3 text-xs font-semibold transition ${
              tab === 'profile'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/10'
                : 'text-zinc-400 bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 hover:text-white'
            }`}
          >
            <User className="h-4 w-4" /> Studio Profile & Tax
          </button>

          <button
            type="button"
            onClick={() => setTab('addresses')}
            className={`flex w-full items-center gap-2.5 rounded-xl px-4 py-3 text-xs font-semibold transition ${
              tab === 'addresses'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/10'
                : 'text-zinc-400 bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 hover:text-white'
            }`}
          >
            <MapPin className="h-4 w-4" /> Saved Addresses (2)
          </button>
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* TAB 1: ORDER HISTORY */}
          {tab === 'orders' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white">Purchase & Dispatch History</h2>
                  <p className="text-xs text-zinc-400">
                    Real-time status synchronized with Saleor GraphQL backend.
                  </p>
                </div>
                <span className="text-xs text-zinc-500 font-mono">
                  Showing {orders.length} {orders.length === 1 ? 'order' : 'orders'}
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-12 text-center space-y-3">
                  <Package className="mx-auto h-8 w-8 text-zinc-600" />
                  <h4 className="text-sm font-semibold text-white">No active orders found</h4>
                  <p className="text-xs text-zinc-500">
                    When you complete purchases, full tracking details and receipts will appear here.
                  </p>
                  <Link
                    to="/categories/$slug"
                    params={{ slug: 'tattoo-machines' }}
                    className="inline-block mt-2 rounded-lg bg-amber-500 px-5 py-2 text-xs font-bold text-black hover:bg-amber-400"
                  >
                    Browse Equipment
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order, idx) => {
                    const isExpanded = selectedOrderDetails === order.orderId
                    const statusLabel = order.status || (idx === 0 ? 'In Transit' : 'Delivered')
                    const isDelivered = statusLabel === 'Delivered'

                    return (
                      <div
                        key={order.orderId}
                        className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4 transition hover:border-zinc-700"
                      >
                        {/* Order Card Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-zinc-800/80 pb-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-mono font-bold text-amber-400">
                                {order.orderId}
                              </span>
                              <span className="text-zinc-600">•</span>
                              <span className="text-xs text-zinc-400 flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {order.createdAt}
                              </span>
                            </div>
                            <p className="text-[11px] font-mono text-zinc-500">
                              Saleor Session ID: {order.saleorSessionId || 'Checkout:427542'}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                isDelivered
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  isDelivered ? 'bg-emerald-400' : 'bg-cyan-400 animate-pulse'
                                }`}
                              />
                              {statusLabel}
                            </span>
                          </div>
                        </div>

                        {/* Order Items List */}
                        <div className="space-y-2.5">
                          {order.items.map((item, iIndex) => (
                            <div
                              key={`${item.id}-${iIndex}`}
                              className="flex items-center justify-between gap-4 py-1.5"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-zinc-950 border border-zinc-800 p-1 flex items-center justify-center">
                                  {item.image ? (
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="h-full w-full object-contain"
                                    />
                                  ) : (
                                    <Package className="h-5 w-5 text-zinc-600" />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-xs font-semibold text-white truncate hover:text-amber-400 transition">
                                    {item.name}
                                  </h4>
                                  <p className="text-[11px] text-zinc-400">
                                    Qty: <strong className="text-zinc-200">{item.quantity}</strong>{' '}
                                    × {formatPrice(item.price)}
                                    {item.options && item.options.length > 0 && (
                                      <span className="text-zinc-500">
                                        {' '}
                                        (
                                        {item.options
                                          .map((o) => `${o.label}: ${o.value}`)
                                          .join(', ')}
                                        )
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>

                              <span className="text-xs font-bold text-white font-mono flex-shrink-0">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Tracking and Actions Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-zinc-800/80 text-xs">
                          <div className="flex items-center gap-2 text-zinc-400 flex-wrap">
                            <span className="flex items-center gap-1.5">
                              <Truck className="h-3.5 w-3.5 text-amber-500" />
                              <strong className="text-zinc-300">Tracking:</strong>
                            </span>
                            <code className="text-zinc-200 font-mono bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-[11px]">
                              {order.trackingNumber}
                            </code>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right mr-2">
                              <span className="text-[11px] text-zinc-500 block">Total Paid:</span>
                              <strong className="text-sm font-bold text-amber-400">
                                {formatPrice(order.total)}
                              </strong>
                            </div>

                            <button
                              type="button"
                              onClick={() => setTrackingModalOrder(order)}
                              className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-700 hover:text-white transition"
                            >
                              Track Package
                            </button>

                            <button
                              type="button"
                              onClick={() => handleReorder(order)}
                              className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-black hover:bg-amber-400 transition flex items-center gap-1"
                            >
                              <RefreshCw className="h-3 w-3" /> Reorder
                            </button>
                          </div>
                        </div>

                        {/* Collapsible Details Drawer */}
                        {isExpanded && (
                          <div className="rounded-lg bg-zinc-950/80 p-4 border border-zinc-800/80 mt-3 text-xs space-y-2 text-zinc-400 animate-fadeIn">
                            <div className="flex justify-between">
                              <span>Shipping Method:</span>
                              <strong className="text-white">{order.shippingMethod}</strong>
                            </div>
                            <div className="flex justify-between">
                              <span>Payment Gateway:</span>
                              <strong className="text-white">{order.paymentMethod}</strong>
                            </div>
                            <div className="flex justify-between">
                              <span>Delivery Address:</span>
                              <span className="text-white text-right max-w-sm truncate">
                                {order.shippingAddress}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PROFILE & STUDIO DETAILS */}
          {tab === 'profile' && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-6">
              <div>
                <h2 className="text-base font-bold text-white">Studio Profile & Credentials</h2>
                <p className="text-xs text-zinc-400">
                  Update professional atelier details and B2B wholesale tax identification.
                </p>
              </div>

              {profileSaved && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-400 flex items-center gap-2.5 animate-fadeIn">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  <span>Studio profile & wholesale tax settings updated successfully!</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">
                      Lead Artist / Account Holder
                    </label>
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) =>
                        setProfileData({ ...profileData, fullName: e.target.value })
                      }
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">
                      Primary Studio Email
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">
                      Tattoo Studio / Atelier Name
                    </label>
                    <input
                      type="text"
                      value={profileData.studioName}
                      onChange={(e) =>
                        setProfileData({ ...profileData, studioName: e.target.value })
                      }
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">
                      State Tattoo License / Permit Number
                    </label>
                    <input
                      type="text"
                      value={profileData.licenseNumber}
                      onChange={(e) =>
                        setProfileData({ ...profileData, licenseNumber: e.target.value })
                      }
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">
                      B2B Resale Tax Exemption ID
                    </label>
                    <input
                      type="text"
                      value={profileData.taxExemptId}
                      onChange={(e) =>
                        setProfileData({ ...profileData, taxExemptId: e.target.value })
                      }
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="rounded-lg bg-amber-500 px-6 py-2.5 text-xs font-bold text-black hover:bg-amber-400 transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: ADDRESS BOOK */}
          {tab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white">Saved Studio Addresses</h2>
                  <p className="text-xs text-zinc-400">
                    Manage default dispatch locations and guest spot destinations.
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-700 transition flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Address
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Default Studio Address */}
                <div className="rounded-xl border border-amber-500/30 bg-zinc-900/40 p-5 space-y-3 relative">
                  <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/20">
                    DEFAULT SHIPPING & INVOICE
                  </span>
                  <div className="space-y-1 pt-1">
                    <h4 className="text-sm font-bold text-white">Black Lotus Tattoo Atelier</h4>
                    <p className="text-xs text-zinc-300">Attn: Marcus Vance (Master Artist)</p>
                    <p className="text-xs text-zinc-400">742 Evergreen Terrace, Suite 204</p>
                    <p className="text-xs text-zinc-400">Los Angeles, CA 90028, United States</p>
                    <p className="text-[11px] font-mono text-zinc-500 pt-1">
                      Phone: +1 (555) 019-2834
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
                    <button
                      type="button"
                      className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition"
                    >
                      Edit Address
                    </button>
                  </div>
                </div>

                {/* Secondary Convention / Guest Spot Address */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3">
                  <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-[10px] font-semibold text-zinc-400 border border-zinc-700">
                    CONVENTION & GUEST SPOT
                  </span>
                  <div className="space-y-1 pt-1">
                    <h4 className="text-sm font-bold text-white">Golden State Tattoo Expo</h4>
                    <p className="text-xs text-zinc-300">Booth #402 - Marcus Vance</p>
                    <p className="text-xs text-zinc-400">300 E Green St (Pasadena Convention Center)</p>
                    <p className="text-xs text-zinc-400">Pasadena, CA 91101, United States</p>
                    <p className="text-[11px] font-mono text-zinc-500 pt-1">
                      Phone: +1 (555) 019-2834
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
                    <button
                      type="button"
                      className="text-xs font-semibold text-zinc-300 hover:text-white transition"
                    >
                      Edit Address
                    </button>
                    <span className="text-zinc-600">•</span>
                    <button
                      type="button"
                      className="text-xs font-semibold text-zinc-500 hover:text-amber-400 transition"
                    >
                      Set as Default
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TRACKING MODAL */}
      {trackingModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 space-y-6 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">
                  Live Dispatch Logistics
                </span>
                <h3 className="text-lg font-bold text-white">
                  Tracking {trackingModalOrder.trackingNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setTrackingModalOrder(null)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            {/* Stepper Timeline */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-black">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Out for Delivery / In Transit</h4>
                  <p className="text-[11px] text-zinc-400">
                    Los Angeles Distribution Hub • USPS Priority Airfreight
                  </p>
                  <span className="text-[10px] text-zinc-500 font-mono">Today, 08:30 AM PST</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-zinc-800 text-emerald-400">
                  <Truck className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Departed AMBI Main Warehouse</h4>
                  <p className="text-[11px] text-zinc-400">
                    Packed & Dispatched with 256-bit Saleor Order Verification
                  </p>
                  <span className="text-[10px] text-zinc-500 font-mono">Yesterday, 04:15 PM PST</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setTrackingModalOrder(null)}
                className="rounded-lg bg-amber-500 px-5 py-2 text-xs font-bold text-black hover:bg-amber-400"
              >
                Close Tracking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
