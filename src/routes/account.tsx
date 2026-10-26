import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import {
  Building2,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
  Truck,
  User,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { StudioProductImage } from '~/components/StudioProductImage'
import { cartStore } from '~/lib/cart'
import { formatPrice } from '~/lib/utils'

export const Route = createFileRoute('/account')({
  head: () => ({
    meta: [
      { title: 'Studio Partner Account | Ambition Tattoo Supply Official Store' },
      {
        name: 'description',
        content:
          'Manage your Ambition Tattoo Supply studio wholesale account, live order tracking, and delivery addresses.',
      },
      { name: 'robots', content: 'noindex, nofollow, noarchive' },
    ],
    links: [{ rel: 'canonical', href: 'https://www.ambitiontattoosupply.com/account' }],
  }),
  component: AccountPage,
})

interface OrderItem {
  id: string
  sku?: string
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

interface StudioAddress {
  id: string
  badge: string
  title: string
  recipient: string
  street: string
  cityStateZip: string
  phone: string
  isDefault: boolean
}

const INITIAL_ADDRESSES: StudioAddress[] = [
  {
    id: 'addr-1',
    badge: 'DEFAULT SHIPPING & INVOICE',
    title: 'Black Lotus Tattoo Atelier',
    recipient: 'Attn: Marcus Vance (Master Artist)',
    street: '742 Evergreen Terrace, Suite 204',
    cityStateZip: 'Los Angeles, CA 90028, United States',
    phone: '+1 (555) 019-2834',
    isDefault: true,
  },
  {
    id: 'addr-2',
    badge: 'CONVENTION & GUEST SPOT',
    title: 'Golden State Tattoo Expo',
    recipient: 'Booth #402 - Marcus Vance',
    street: '300 E Green St (Pasadena Convention Center)',
    cityStateZip: 'Pasadena, CA 91101, United States',
    phone: '+1 (555) 019-2834',
    isDefault: false,
  },
]

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
        id: '1437__Color:Black|Stroke:4.2mm',
        sku: 'AB-soldier-max',
        name: 'Ambition Soldier Max Wireless Tattoo Machine Pen',
        image: 'https://www.ambitiontattoosupply.com/media/catalog/product/s/o/soldier10.jpg',
        quantity: 1,
        price: 149.99,
        options: [
          { label: 'Color', value: 'Matte Black' },
          { label: 'Stroke', value: '4.2mm Direct Drive' },
        ],
        slug: 'ambition-soldier-max-wireless-tattoo-machine-pen',
      },
      {
        id: '660__0801RL',
        sku: 'AB-JPZ',
        name: 'Ambition Premium Tattoo Cartridge Needles (Box of 20)',
        image:
          'https://www.ambitiontattoosupply.com/media/catalog/product/5/1/51xcfzt0wll._sl1000_.jpg',
        quantity: 2,
        price: 13.0,
        options: [
          { label: 'Type', value: '0801 Round Liner' },
          { label: 'Taper', value: 'Long Taper' },
        ],
        slug: 'ambition-premium-tattoo-cartridge-needles',
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

  // Addresses state
  const [addresses, setAddresses] = useState<StudioAddress[]>(INITIAL_ADDRESSES)
  const [editingAddress, setEditingAddress] = useState<StudioAddress | null>(null)
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [addressForm, setAddressForm] = useState({
    badge: 'GUEST SPOT / STUDIO',
    title: '',
    recipient: '',
    street: '',
    cityStateZip: '',
    phone: '+1 (555) 019-2834',
  })

  // Load orders from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('ambi_orders_history_v1')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setOrders([...parsed, ...INITIAL_STUDIO_ORDERS])
          return
        }
      }
      setOrders(INITIAL_STUDIO_ORDERS)
    } catch {
      setOrders(INITIAL_STUDIO_ORDERS)
    }
  }, [])

  // Close tracking modal on Escape key
  useEffect(() => {
    if (!trackingModalOrder) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setTrackingModalOrder(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [trackingModalOrder])

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 4000)
  }

  const handleReorder = (order: SavedOrder) => {
    for (const item of order.items) {
      cartStore.addItem(
        {
          productId: item.id.split('__')[0] || item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          sku: item.sku || item.id.split('__')[0] || item.id,
          slug: item.slug || 'ambition-storm-wand-wireless-tattoo-machine-pen',
          options: item.options || [],
        },
        item.quantity,
      )
    }
    router.navigate({ to: '/cart' })
  }

  const handleSetDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
        badge: a.id === id ? 'DEFAULT SHIPPING & INVOICE' : 'CONVENTION & GUEST SPOT',
      })),
    )
  }

  const handleStartEditAddress = (addr: StudioAddress) => {
    setEditingAddress(addr)
    setIsAddingAddress(false)
    setAddressForm({
      badge: addr.badge,
      title: addr.title,
      recipient: addr.recipient,
      street: addr.street,
      cityStateZip: addr.cityStateZip,
      phone: addr.phone,
    })
  }

  const handleStartAddAddress = () => {
    setEditingAddress(null)
    setIsAddingAddress(true)
    setAddressForm({
      badge: 'STUDIO BRANCH / GUEST SPOT',
      title: '',
      recipient: 'Attn: Marcus Vance',
      street: '',
      cityStateZip: 'Los Angeles, CA 90028, United States',
      phone: '+1 (555) 019-2834',
    })
  }

  const handleSaveAddressForm = (e: React.FormEvent) => {
    e.preventDefault()
    if (!addressForm.title.trim() || !addressForm.street.trim()) return

    if (editingAddress) {
      setAddresses((prev) =>
        prev.map((a) =>
          a.id === editingAddress.id
            ? {
                ...a,
                title: addressForm.title.trim(),
                recipient: addressForm.recipient.trim(),
                street: addressForm.street.trim(),
                cityStateZip: addressForm.cityStateZip.trim(),
                phone: addressForm.phone.trim(),
              }
            : a,
        ),
      )
      setEditingAddress(null)
    } else {
      const newAddr: StudioAddress = {
        id: `addr-${Date.now()}`,
        badge: addressForm.badge || 'STUDIO BRANCH',
        title: addressForm.title.trim(),
        recipient: addressForm.recipient.trim(),
        street: addressForm.street.trim(),
        cityStateZip: addressForm.cityStateZip.trim(),
        phone: addressForm.phone.trim(),
        isDefault: false,
      }
      setAddresses((prev) => [...prev, newAddr])
      setIsAddingAddress(false)
    }
  }

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Account Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
            <span className="whitespace-nowrap font-mono text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 shrink-0" /> Verified Studio Pro Account
            </span>
            <span className="hidden sm:inline text-zinc-600">•</span>
            <span className="whitespace-nowrap text-[11px] font-mono text-zinc-400">
              ID: SLR-CUST-8839120
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Customer Account & Studio Portal
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage your AMBI studio orders, delivery logistics, addresses, and wholesale
            credentials.
          </p>
        </div>

        {/* Wholesale Tier Badge */}
        <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-3 flex items-center gap-3 self-start sm:self-auto">
          <div className="rounded-sm bg-amber-400/20 p-2 text-amber-400">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
              Wholesale Partner
            </span>
            <span className="text-xs font-semibold text-white">
              Tier 2 Studio Discount (20% Off)
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Navigation Tabs */}
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => setTab('orders')}
            className={`btn-tactile flex w-full items-center justify-between rounded-sm px-4 py-3 text-xs font-semibold transition ${
              tab === 'orders'
                ? 'bg-amber-400 text-black font-bold'
                : 'text-zinc-400 bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Package className="h-4 w-4" /> Order History
            </span>
            <span
              className={`rounded-sm px-2 py-0.5 font-mono text-[10px] font-bold ${
                tab === 'orders' ? 'bg-black/20 text-black' : 'bg-zinc-800 text-zinc-300'
              }`}
            >
              {orders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTab('profile')}
            className={`btn-tactile flex w-full items-center gap-2.5 rounded-sm px-4 py-3 text-xs font-semibold transition ${
              tab === 'profile'
                ? 'bg-amber-400 text-black font-bold'
                : 'text-zinc-400 bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 hover:text-white'
            }`}
          >
            <User className="h-4 w-4" /> Studio Profile & Tax
          </button>

          <button
            type="button"
            onClick={() => setTab('addresses')}
            className={`btn-tactile flex w-full items-center justify-between rounded-sm px-4 py-3 text-xs font-semibold transition ${
              tab === 'addresses'
                ? 'bg-amber-400 text-black font-bold'
                : 'text-zinc-400 bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4" /> Saved Addresses
            </span>
            <span
              className={`rounded-sm px-2 py-0.5 font-mono text-[10px] font-bold ${
                tab === 'addresses' ? 'bg-black/20 text-black' : 'bg-zinc-800 text-zinc-300'
              }`}
            >
              {addresses.length}
            </span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* TAB 1: ORDER HISTORY */}
          {tab === 'orders' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-base font-bold text-white">
                    Purchase & Dispatch History
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Real-time status synchronized with Saleor GraphQL backend.
                  </p>
                </div>
                <span className="text-xs text-zinc-500 font-mono">
                  SHOWING {orders.length} {orders.length === 1 ? 'ORDER' : 'ORDERS'}
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="rounded-md border border-zinc-800 bg-zinc-900/40 p-12 text-center space-y-3">
                  <Package className="mx-auto h-8 w-8 text-zinc-600" />
                  <h4 className="font-display text-sm font-semibold text-white">
                    No active orders found
                  </h4>
                  <p className="text-xs text-zinc-500">
                    When you complete purchases, full tracking details and receipts will appear
                    here.
                  </p>
                  <Link
                    to="/categories/$slug"
                    params={{ slug: 'tattoo-machines' }}
                    className="btn-tactile inline-block mt-2 rounded-sm bg-amber-400 px-5 py-2 font-mono text-xs font-bold uppercase text-black hover:bg-amber-300"
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
                        className="rounded-md border border-zinc-800 bg-zinc-900/40 p-5 space-y-4 transition hover:border-zinc-700"
                      >
                        {/* Order Card Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-zinc-800/80 pb-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-mono font-bold text-amber-400">
                                {order.orderId}
                              </span>
                              <span className="text-zinc-600">•</span>
                              <span className="text-xs text-zinc-400 flex items-center gap-1 font-mono">
                                <Clock className="h-3 w-3" /> {order.createdAt}
                              </span>
                            </div>
                            <p className="text-[11px] font-mono text-zinc-500 break-all">
                              Saleor Session ID: {order.saleorSessionId || 'Checkout:427542'}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-auto">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-sm px-2.5 py-0.5 font-mono text-xs font-semibold ${
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
                          {order.items.map((item, iIndex) => {
                            const itemSlug =
                              item.slug === 'ambition-cartridge-needles'
                                ? 'ambition-premium-tattoo-cartridge-needles'
                                : item.slug || 'ambition-storm-wand-wireless-tattoo-machine-pen'

                            return (
                              <div
                                key={`${item.id}-${iIndex}`}
                                className="flex items-center justify-between gap-4 py-1.5"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <Link
                                    to="/products/$slug"
                                    params={{ slug: itemSlug }}
                                    className="h-12 w-12 shrink-0 overflow-hidden rounded-sm border border-zinc-800 hover:border-amber-400/50 transition"
                                  >
                                    <StudioProductImage
                                      src={item.image}
                                      alt={item.name}
                                      productName={item.name}
                                      sku={item.sku || item.id.split('__')[0]}
                                      size="sm"
                                      className="h-full w-full"
                                    />
                                  </Link>
                                  <div className="min-w-0">
                                    <Link
                                      to="/products/$slug"
                                      params={{ slug: itemSlug }}
                                      className="block text-xs font-semibold text-white truncate hover:text-amber-400 transition"
                                    >
                                      {item.name}
                                    </Link>
                                    <p className="text-[11px] text-zinc-400">
                                      Qty:{' '}
                                      <strong className="text-zinc-200 font-mono">
                                        {item.quantity}
                                      </strong>{' '}
                                      × <span className="font-mono">{formatPrice(item.price)}</span>
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
                            )
                          })}
                        </div>

                        {/* Tracking and Actions Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-zinc-800/80 text-xs">
                          <div className="flex items-center gap-2 text-zinc-400 flex-wrap">
                            <span className="flex items-center gap-1.5">
                              <Truck className="h-3.5 w-3.5 text-amber-400" />
                              <strong className="text-zinc-300">Tracking:</strong>
                            </span>
                            <code className="text-zinc-200 font-mono bg-zinc-950 border border-zinc-800 px-2 py-0.5 rounded-sm text-[11px]">
                              {order.trackingNumber}
                            </code>
                          </div>

                          <div className="flex flex-wrap items-center gap-2.5">
                            <div className="text-right mr-2">
                              <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                                Total Paid:
                              </span>
                              <strong className="text-sm font-mono font-bold text-amber-400">
                                {formatPrice(order.total)}
                              </strong>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                setSelectedOrderDetails(isExpanded ? null : order.orderId)
                              }
                              className="btn-tactile rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-1.5 font-mono text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
                            >
                              {isExpanded ? 'Hide Details' : 'Order Details'}
                            </button>

                            <button
                              type="button"
                              onClick={() => setTrackingModalOrder(order)}
                              className="btn-tactile rounded-sm border border-zinc-700 bg-zinc-800 px-3 py-1.5 font-mono text-xs font-medium text-zinc-200 hover:bg-zinc-700 hover:text-white transition"
                            >
                              Track Package
                            </button>

                            <button
                              type="button"
                              onClick={() => handleReorder(order)}
                              className="btn-tactile rounded-sm bg-amber-400 px-3 py-1.5 font-mono text-xs font-bold text-black hover:bg-amber-300 transition flex items-center gap-1"
                            >
                              <RefreshCw className="h-3 w-3" /> Reorder
                            </button>
                          </div>
                        </div>

                        {/* Collapsible Details Drawer */}
                        {isExpanded && (
                          <div className="rounded-sm bg-zinc-950/90 p-4 border border-zinc-800/80 mt-3 text-xs space-y-2 text-zinc-400">
                            <div className="flex justify-between gap-4">
                              <span className="font-mono text-zinc-500">SHIPPING METHOD:</span>
                              <strong className="text-white text-right">
                                {order.shippingMethod}
                              </strong>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="font-mono text-zinc-500">PAYMENT GATEWAY:</span>
                              <strong className="text-white text-right">
                                {order.paymentMethod}
                              </strong>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="font-mono text-zinc-500">DELIVERY ADDRESS:</span>
                              <span className="text-white text-right max-w-sm">
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
            <div className="rounded-md border border-zinc-800 bg-zinc-900/40 p-6 space-y-6">
              <div>
                <h2 className="font-display text-base font-bold text-white">
                  Studio Profile & Credentials
                </h2>
                <p className="text-xs text-zinc-400">
                  Update professional atelier details and B2B wholesale tax identification.
                </p>
              </div>

              {profileSaved && (
                <div className="rounded-sm border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-400 flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  <span>Studio profile & wholesale tax settings updated successfully!</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="font-mono text-[11px] uppercase text-zinc-400 block mb-1">
                      Lead Artist / Account Holder
                    </label>
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                      className="w-full rounded-sm border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[11px] uppercase text-zinc-400 block mb-1">
                      Primary Studio Email
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full rounded-sm border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[11px] uppercase text-zinc-400 block mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full rounded-sm border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[11px] uppercase text-zinc-400 block mb-1">
                      Tattoo Studio / Atelier Name
                    </label>
                    <input
                      type="text"
                      value={profileData.studioName}
                      onChange={(e) =>
                        setProfileData({ ...profileData, studioName: e.target.value })
                      }
                      className="w-full rounded-sm border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[11px] uppercase text-zinc-400 block mb-1">
                      State Tattoo License / Permit Number
                    </label>
                    <input
                      type="text"
                      value={profileData.licenseNumber}
                      onChange={(e) =>
                        setProfileData({ ...profileData, licenseNumber: e.target.value })
                      }
                      className="w-full rounded-sm border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-xs text-white focus:border-amber-400 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[11px] uppercase text-zinc-400 block mb-1">
                      B2B Resale Tax Exemption ID
                    </label>
                    <input
                      type="text"
                      value={profileData.taxExemptId}
                      onChange={(e) =>
                        setProfileData({ ...profileData, taxExemptId: e.target.value })
                      }
                      className="w-full rounded-sm border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-xs text-white focus:border-amber-400 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="btn-tactile rounded-sm bg-amber-400 px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-black hover:bg-amber-300 transition"
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
                  <h2 className="font-display text-base font-bold text-white">
                    Saved Studio Addresses
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Manage default dispatch locations and guest spot destinations.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleStartAddAddress}
                  className="btn-tactile rounded-sm bg-zinc-800 border border-zinc-700 px-3 py-1.5 font-mono text-xs font-semibold text-white hover:bg-zinc-700 transition flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5 text-amber-400" /> Add Address
                </button>
              </div>

              {(isAddingAddress || editingAddress) && (
                <form
                  onSubmit={handleSaveAddressForm}
                  className="rounded-md border border-amber-400/40 bg-zinc-900/80 p-5 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <h3 className="font-display text-sm font-bold text-white">
                      {editingAddress
                        ? `Edit Address: ${editingAddress.title}`
                        : 'Add New Studio Address'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingAddress(false)
                        setEditingAddress(null)
                      }}
                      className="text-zinc-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-mono text-[11px] uppercase text-zinc-400 block mb-1">
                        Studio / Venue Name
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.title}
                        onChange={(e) => setAddressForm({ ...addressForm, title: e.target.value })}
                        placeholder="e.g. Neon Needle Studio"
                        className="w-full rounded-sm border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[11px] uppercase text-zinc-400 block mb-1">
                        Recipient / Booth Line
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.recipient}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, recipient: e.target.value })
                        }
                        placeholder="Attn: Marcus Vance"
                        className="w-full rounded-sm border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[11px] uppercase text-zinc-400 block mb-1">
                        Street Address & Suite
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.street}
                        onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                        placeholder="1200 Sunset Blvd, Suite 10"
                        className="w-full rounded-sm border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[11px] uppercase text-zinc-400 block mb-1">
                        City, State, Postal Code & Country
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.cityStateZip}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, cityStateZip: e.target.value })
                        }
                        className="w-full rounded-sm border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingAddress(false)
                        setEditingAddress(null)
                      }}
                      className="btn-tactile rounded-sm border border-zinc-700 px-4 py-1.5 font-mono text-xs text-zinc-300 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-tactile rounded-sm bg-amber-400 px-4 py-1.5 font-mono text-xs font-bold text-black hover:bg-amber-300"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`rounded-md border p-5 space-y-3 relative ${
                      addr.isDefault
                        ? 'border-amber-400/40 bg-zinc-900/50'
                        : 'border-zinc-800 bg-zinc-900/30'
                    }`}
                  >
                    <span
                      className={`inline-block rounded-sm px-2.5 py-0.5 font-mono text-[10px] font-bold border ${
                        addr.isDefault
                          ? 'bg-amber-400/10 text-amber-400 border-amber-400/30'
                          : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                      }`}
                    >
                      {addr.badge}
                    </span>
                    <div className="space-y-1 pt-1">
                      <h4 className="font-display text-sm font-bold text-white">{addr.title}</h4>
                      <p className="text-xs text-zinc-300">{addr.recipient}</p>
                      <p className="text-xs text-zinc-400">{addr.street}</p>
                      <p className="text-xs text-zinc-400">{addr.cityStateZip}</p>
                      <p className="text-[11px] font-mono text-zinc-500 pt-1">
                        Phone: {addr.phone}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleStartEditAddress(addr)}
                          className="font-mono text-xs font-semibold text-amber-400 hover:text-amber-300 transition"
                        >
                          Edit Address
                        </button>
                        {!addr.isDefault && (
                          <>
                            <span className="text-zinc-600">•</span>
                            <button
                              type="button"
                              onClick={() => handleSetDefaultAddress(addr.id)}
                              className="font-mono text-xs font-semibold text-zinc-400 hover:text-white transition"
                            >
                              Set as Default
                            </button>
                          </>
                        )}
                      </div>
                      {!addr.isDefault && (
                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-zinc-500 hover:text-rose-400 transition p-1"
                          aria-label="Delete address"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TRACKING MODAL */}
      {trackingModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close tracking modal backdrop"
            className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-default"
            onClick={() => setTrackingModalOrder(null)}
          />
          <div className="relative z-10 w-full max-w-lg rounded-md border border-zinc-800 bg-zinc-950 p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  Live Dispatch Logistics
                </span>
                <h3 className="font-display text-lg font-bold text-white">
                  Tracking {trackingModalOrder.trackingNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setTrackingModalOrder(null)}
                aria-label="Close tracking modal"
                className="rounded-sm p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Stepper Timeline */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-sm bg-emerald-400 text-black">
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
                <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-sm bg-zinc-800 text-emerald-400 border border-zinc-700">
                  <Truck className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Departed AMBI Main Warehouse</h4>
                  <p className="text-[11px] text-zinc-400">
                    Packed & Dispatched with 256-bit Saleor Order Verification
                  </p>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    Yesterday, 04:15 PM PST
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setTrackingModalOrder(null)}
                className="btn-tactile rounded-sm bg-amber-400 px-5 py-2 font-mono text-xs font-bold uppercase text-black hover:bg-amber-300"
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
