import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
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

  const shippingMethods = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")

  if (!shippingMethods || !paymentMethods) {
    return null
  }

  return (
    <div className="w-full space-y-6">
      {/* Enhanced Step Indicator for Desktop */}
      <div className="hidden lg:block bg-nxl-black/60 backdrop-blur-sm border border-nxl-gold/30 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-nxl-gold font-display">
            Secure Checkout
          </h1>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-nxl-gold text-nxl-black flex items-center justify-center text-xs font-bold">
                1
              </div>
              <span className="text-sm text-nxl-ivory">Address</span>
            </div>
            <div className="w-8 h-px bg-nxl-gold/30" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-nxl-gold/20 border border-nxl-gold/30 text-nxl-gold flex items-center justify-center text-xs font-bold">
                2
              </div>
              <span className="text-sm text-nxl-ivory/60">Delivery</span>
            </div>
            <div className="w-8 h-px bg-nxl-gold/30" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-nxl-gold/20 border border-nxl-gold/30 text-nxl-gold flex items-center justify-center text-xs font-bold">
                3
              </div>
              <span className="text-sm text-nxl-ivory/60">Payment</span>
            </div>
            <div className="w-8 h-px bg-nxl-gold/30" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-nxl-gold/20 border border-nxl-gold/30 text-nxl-gold flex items-center justify-center text-xs font-bold">
                4
              </div>
              <span className="text-sm text-nxl-ivory/60">Review</span>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Steps */}
      <div className="space-y-6">
        <Addresses cart={cart} customer={customer} />
        <Shipping cart={cart} availableShippingMethods={shippingMethods} />
        <Payment cart={cart} availablePaymentMethods={paymentMethods} />
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
