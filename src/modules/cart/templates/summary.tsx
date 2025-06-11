"use client"

import { Button, Heading, Text } from "@medusajs/ui"

import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
  dictionary: any
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

function getFreeShippingProgress(cartTotal: number) {
  const freeShippingThreshold = 10000 // $100 in cents
  const progress = Math.min((cartTotal / freeShippingThreshold) * 100, 100)
  const remaining = Math.max(freeShippingThreshold - cartTotal, 0)
  
  return {
    progress,
    remaining,
    qualified: cartTotal >= freeShippingThreshold
  }
}

const Summary = ({ cart, dictionary }: SummaryProps) => {
  const step = getCheckoutStep(cart)
  const cartTotal = cart?.total || 0
  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
  const shippingProgress = getFreeShippingProgress(cartTotal)

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex items-center justify-between">
        <Heading level="h2" className="text-[2rem] leading-[2.75rem] text-nxl-gold font-serif">
          {dictionary.cart.summary}
        </Heading>
        <div className="flex items-center gap-2 text-sm text-nxl-ivory/75">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span className="font-medium">
            {itemCount} {itemCount === 1 ? dictionary.cart.item : dictionary.cart.items}
          </span>
        </div>
      </div>

      {/* Enhanced Free Shipping Progress */}
      {!shippingProgress.qualified && (
        <div className="bg-gradient-to-r from-nxl-gold/8 to-nxl-gold/5 border border-nxl-gold/30 rounded-lg p-4 transition-all duration-300 hover:border-nxl-gold/40">
          <div className="flex items-center justify-between mb-2">
            <Text className="text-sm font-semibold text-nxl-gold">
              {dictionary.cart.freeShippingProgress}
            </Text>
            <Text className="text-xs text-nxl-ivory font-medium">
              ${(shippingProgress.remaining / 100).toFixed(2)} {dictionary.cart.freeShippingRemaining}
            </Text>
          </div>
          <div className="w-full bg-nxl-black/60 rounded-full h-2.5 mb-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-nxl-gold to-nxl-gold/80 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${shippingProgress.progress}%` }}
            />
          </div>
          <Text className="text-xs text-nxl-ivory font-light">
            {dictionary.cart.freeShippingAddMore.replace('{amount}', `$${(shippingProgress.remaining / 100).toFixed(2)}`)}
          </Text>
        </div>
      )}

      {shippingProgress.qualified && (
        <div className="bg-gradient-to-r from-green-500/15 to-emerald-500/10 border border-green-500/30 rounded-lg p-4 flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <Text className="text-sm font-semibold text-green-400">
              {dictionary.cart.freeShippingQualified}
            </Text>
          </div>
        </div>
      )}

      <DiscountCode cart={cart} />
      
      <Divider />
      
      <CartTotals totals={cart} />

      {/* Enhanced Security badges */}
      <div className="flex items-center justify-center gap-4 py-3 border-t border-nxl-gold/25">
        <div className="flex items-center gap-2 text-xs text-nxl-ivory/70">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="font-medium">{dictionary.cart.trustIndicators.secureCheckout}</span>
        </div>
        <div className="w-px h-4 bg-nxl-gold/25" />
        <div className="flex items-center gap-2 text-xs text-nxl-ivory/70">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">{dictionary.cart.trustIndicators.sslProtected}</span>
        </div>
      </div>

      <LocalizedClientLink
        href={"/checkout?step=" + step}
        data-testid="checkout-button"
      >
        <Button className="w-full h-12 bg-nxl-gold text-nxl-black border border-nxl-gold hover:bg-nxl-gold/90 transition-all duration-300 font-semibold text-base rounded-lg shadow-lg hover:shadow-xl">
          <div className="flex items-center justify-center gap-2">
            <span>{dictionary.cart.secureCheckout}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </Button>
      </LocalizedClientLink>

      {/* Additional info */}
      <div className="text-center">
        <Text className="text-xs text-nxl-ivory/55 font-light">
          {dictionary.cart.trustIndicators.estimatedDelivery}
        </Text>
      </div>
    </div>
  )
}

export default Summary
