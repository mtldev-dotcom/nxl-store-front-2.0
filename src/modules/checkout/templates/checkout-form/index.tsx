import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods, checkStripeConfiguration } from "@lib/data/payment"
import { HttpTypes } from "@medusajs/types"
import Addresses from "@modules/checkout/components/addresses"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"

export default async function CheckoutForm({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) {
  if (!cart) {
    return null
  }

  // Enhanced debugging for checkout form
  console.log("🚀 [Checkout Debug] Initializing checkout form")
  console.log("🔍 [Checkout Debug] Cart ID:", cart.id)
  console.log("🔍 [Checkout Debug] Cart region:", cart.region?.id)
  console.log("🔍 [Checkout Debug] Cart currency:", cart.currency_code)
  console.log("🔍 [Checkout Debug] Cart total:", cart.total)

  // Check Stripe configuration
  await checkStripeConfiguration()

  const shippingMethods = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")

  console.log("🔍 [Checkout Debug] Shipping methods found:", !!shippingMethods)
  console.log("🔍 [Checkout Debug] Payment methods found:", !!paymentMethods)

  if (shippingMethods) {
    console.log("✅ [Checkout Debug] Shipping methods count:", shippingMethods.length)
  }

  if (paymentMethods) {
    console.log("✅ [Checkout Debug] Payment methods count:", paymentMethods.length)
    console.log("✅ [Checkout Debug] Available payment methods:", paymentMethods.map(p => p.id))
  } else {
    console.log("❌ [Checkout Debug] No payment methods available - this will prevent checkout")
  }

  // Modified condition: Don't break checkout if payment methods are missing
  // Instead, show a helpful message
  if (!shippingMethods) {
    console.log("❌ [Checkout Debug] No shipping methods available - checkout cannot proceed")
    return (
      <div className="bg-nxl-black/80 backdrop-blur-sm border border-red-500/50 rounded-xl p-6 shadow-xl">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-400 mb-4">Checkout Configuration Issue</h2>
          <p className="text-nxl-ivory/80 mb-4">
            No shipping methods are available for your region. Please check your backend configuration.
          </p>
          <div className="text-left bg-nxl-black/40 border border-nxl-gold/30 rounded-lg p-4 text-sm text-nxl-ivory/70">
            <p className="font-semibold text-nxl-gold mb-2">Debug Information:</p>
            <p>• Cart Region: {cart.region?.id || 'Not set'}</p>
            <p>• Check your Medusa backend shipping configuration</p>
          </div>
        </div>
      </div>
    )
  }

  // Show payment methods debug info even if empty
  if (!paymentMethods || paymentMethods.length === 0) {
    console.log("⚠️ [Checkout Debug] Proceeding with checkout despite missing payment methods")
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-40 gap-y-8">
        {/* Left Column: Checkout Steps */}
        <div className="relative">
          {/* Progress Indicator */}
          <div className="mb-8 p-4 bg-gradient-to-r from-nxl-gold/10 to-nxl-gold/5 border border-nxl-gold/30 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-3xl font-bold text-nxl-gold font-display">Checkout</h1>
              <div className="text-sm text-nxl-ivory/70">
                Secure checkout powered by Stripe
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-nxl-ivory/80">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>256-bit SSL encryption</span>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span>PCI DSS compliant</span>
            </div>
          </div>

          {/* Debug Panel (only show in development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
              <details className="text-sm">
                <summary className="font-semibold text-yellow-400 cursor-pointer mb-2">
                  🔧 Debug Information (Development Only)
                </summary>
                <div className="space-y-1 text-yellow-200/80">
                  <p>• Cart ID: {cart.id}</p>
                  <p>• Region: {cart.region?.id || 'Not set'}</p>
                  <p>• Currency: {cart.currency_code}</p>
                  <p>• Shipping Methods: {shippingMethods?.length || 0}</p>
                  <p>• Payment Methods: {paymentMethods?.length || 0}</p>
                  {paymentMethods && paymentMethods.length > 0 && (
                    <p>• Available: {paymentMethods.map(p => p.id).join(', ')}</p>
                  )}
                  {(!paymentMethods || paymentMethods.length === 0) && (
                    <p className="text-red-400">• ⚠️ No payment methods configured</p>
                  )}
                </div>
              </details>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:sticky lg:top-8 lg:h-fit">
          <div className="bg-nxl-black/60 backdrop-blur-sm border border-nxl-gold/30 rounded-xl p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-nxl-gold mb-4 font-display">Order Summary</h2>
            <div className="space-y-3 text-nxl-ivory/80">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${((cart?.subtotal || 0) / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${((cart?.shipping_total || 0) / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${((cart?.tax_total || 0) / 100).toFixed(2)}</span>
              </div>
              <div className="border-t border-nxl-gold/30 pt-3">
                <div className="flex justify-between text-lg font-semibold text-nxl-gold">
                  <span>Total</span>
                  <span>${((cart?.total || 0) / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Steps */}
      <div className="space-y-6">
        <Addresses cart={cart} customer={customer} />
        <Shipping cart={cart} availableShippingMethods={shippingMethods} />
        <Payment cart={cart} availablePaymentMethods={paymentMethods || []} />
        <Review cart={cart} />
      </div>

      {/* Mobile: Sticky Bottom Actions - Only show for active steps */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 safe-bottom">
        <div className="bg-gradient-to-t from-nxl-black via-nxl-black/95 to-transparent p-4 backdrop-blur-lg border-t border-nxl-gold/20">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-nxl-ivory/70">
              Step 1 of 4: Address Information
            </div>
            <div className="text-sm font-semibold text-nxl-gold">
              ${((cart?.total || 0) / 100).toFixed(2)}
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex-1 py-3 px-4 bg-nxl-black/60 border border-nxl-gold/30 text-nxl-ivory rounded-lg font-medium hover:bg-nxl-gold/10 transition-all duration-300">
              Back to Cart
            </button>
            <button className="flex-1 py-3 px-4 bg-nxl-gold text-nxl-black rounded-lg font-semibold hover:bg-nxl-gold/90 transition-all duration-300">
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
