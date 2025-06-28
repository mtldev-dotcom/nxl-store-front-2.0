"use client"

import { Heading } from "@medusajs/ui"
import { ShieldCheck, CheckCircleSolid, CreditCard, Clock } from "@medusajs/icons"
import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import { useTranslation } from "@lib/context/translation-context"
import { formatPriceWithSmallCurrency } from "@lib/util/money"
import { useEffect, useState } from "react"
import { HttpTypes } from "@medusajs/types"

interface EnhancedCheckoutSummaryProps {
  cart: HttpTypes.StoreCart
}

const EnhancedCheckoutSummary = ({ cart }: EnhancedCheckoutSummaryProps) => {
  const { translate } = useTranslation()
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<any>(null)
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Track selected shipping method changes
  useEffect(() => {
    if (cart?.shipping_methods && cart.shipping_methods.length > 0) {
      setSelectedShippingMethod(cart.shipping_methods[0])
    }
  }, [cart?.shipping_methods])

  // Calculate shipping cost dynamically
  const shippingCost = selectedShippingMethod?.amount || cart?.shipping_total || 0
  const formattedShipping = formatPriceWithSmallCurrency({
    amount: shippingCost,
    currency_code: cart?.currency_code || 'CAD'
  })

  // Format other prices
  const formattedSubtotal = formatPriceWithSmallCurrency({
    amount: cart?.subtotal || 0,
    currency_code: cart?.currency_code || 'CAD'
  })

  const formattedTax = formatPriceWithSmallCurrency({
    amount: cart?.tax_total || 0,
    currency_code: cart?.currency_code || 'CAD'
  })

  const formattedTotal = formatPriceWithSmallCurrency({
    amount: cart?.total || 0,
    currency_code: cart?.currency_code || 'CAD'
  })

  const formattedDiscount = cart?.discount_total ? formatPriceWithSmallCurrency({
    amount: cart.discount_total,
    currency_code: cart?.currency_code || 'CAD'
  }) : null

  const itemCount = cart?.items?.length || 0
  const totalQuantity = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0

  // Simple SVG icons
  const TruckIcon = () => (
    <svg className="w-4 h-4 text-nxl-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0v10l-8 4-8-4V7m16 0L12 11 4 7" />
    </svg>
  )

  const ShieldIcon = () => (
    <svg className="w-4 h-4 text-nxl-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  )

  return (
    <div className="bg-gradient-to-br from-nxl-black/95 to-nxl-navy/90 backdrop-blur-md border border-nxl-gold/30 rounded-2xl shadow-2xl overflow-hidden">
      {/* Mobile Header - Collapsible */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full p-4 flex items-center justify-between hover:bg-nxl-gold/5 transition-colors duration-200"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-nxl-gold/20 flex items-center justify-center border border-nxl-gold/30">
              <ShieldCheck className="w-5 h-5 text-nxl-gold" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-nxl-gold font-display text-left">
                {translate("checkout", "orderSummary", "Order Summary")}
              </h2>
              <p className="text-sm text-nxl-ivory/70 text-left">
                {itemCount} {itemCount === 1 ? translate("cart", "item", "item") : translate("cart", "items", "items")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xl font-bold text-nxl-gold">
                {formattedTotal.price}
              </div>
              <div className="text-xs text-nxl-ivory/60">
                {formattedTotal.currency}
              </div>
            </div>
            <svg
              className={`w-5 h-5 text-nxl-gold transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block p-6 border-b border-nxl-gold/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-nxl-gold/20 flex items-center justify-center border border-nxl-gold/30">
            <ShieldCheck className="w-6 h-6 text-nxl-gold" />
          </div>
          <div>
            <Heading level="h2" className="text-2xl font-bold text-nxl-gold font-display">
              {translate("checkout", "inYourCart", "In Your Cart")}
            </Heading>
            <p className="text-nxl-ivory/70">
              {itemCount} {itemCount === 1 ? translate("cart", "item", "item") : translate("cart", "items", "items")} • {totalQuantity} {translate("cart", "quantity", "quantity")}
            </p>
          </div>
        </div>
      </div>

      {/* Content - Collapsible on mobile */}
      <div className={`${isCollapsed ? 'hidden' : 'block'} lg:block`}>
        <div className="p-4 lg:p-6 space-y-6">

          {/* Cart Items */}
          <div>
            <ItemsPreviewTemplate cart={cart} />
          </div>

          {/* Discount Code */}
          <div>
            <DiscountCode cart={cart as any} />
          </div>

          <Divider className="border-nxl-gold/20" />

          {/* Enhanced Pricing Breakdown */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-nxl-gold mb-4 font-display">
              {translate("checkout", "orderSummary", "Order Summary")}
            </h3>

            {/* Subtotal */}
            <div className="flex items-center justify-between py-2">
              <span className="text-nxl-ivory/80 font-medium">
                {translate("cart", "subtotal", "Subtotal")}
              </span>
              <div className="text-right">
                <div className="text-nxl-ivory font-semibold inline-flex items-baseline gap-1">
                  <span>{formattedSubtotal.price}</span>
                  <span className="text-xs text-nxl-ivory/60">({formattedSubtotal.currency})</span>
                </div>
              </div>
            </div>

            {/* Discount */}
            {formattedDiscount && (
              <div className="flex items-center justify-between py-2">
                <span className="text-green-400 font-medium">
                  {translate("cart", "discount", "Discount")}
                </span>
                <div className="text-right">
                  <div className="text-green-400 font-semibold inline-flex items-baseline gap-1">
                    <span>-{formattedDiscount.price}</span>
                    <span className="text-xs text-green-400/60">({formattedDiscount.currency})</span>
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic Shipping */}
            <div className="flex items-center justify-between py-2 bg-nxl-gold/5 -mx-2 px-2 rounded-lg">
              <div className="flex items-center gap-2">
                <TruckIcon />
                <span className="text-nxl-gold font-medium">
                  {translate("checkout", "delivery.title", "Delivery")}
                </span>
                {selectedShippingMethod && (
                  <span className="text-xs text-nxl-ivory/60 ml-1">
                    ({selectedShippingMethod.name})
                  </span>
                )}
              </div>
              <div className="text-right">
                {selectedShippingMethod ? (
                  <div className="text-nxl-gold font-semibold inline-flex items-baseline gap-1">
                    <span>{formattedShipping.price}</span>
                    <span className="text-xs text-nxl-gold/60">({formattedShipping.currency})</span>
                  </div>
                ) : (
                  <span className="text-nxl-ivory/70 text-sm italic">
                    {translate("cart", "shippingCalculatedAtCheckout", "Calculated at checkout")}
                  </span>
                )}
              </div>
            </div>

            {/* Tax */}
            {cart?.tax_total > 0 && (
              <div className="flex items-center justify-between py-2">
                <span className="text-nxl-ivory/80 font-medium">
                  {translate("cart", "tax", "Tax")}
                </span>
                <div className="text-right">
                  <div className="text-nxl-ivory font-semibold inline-flex items-baseline gap-1">
                    <span>{formattedTax.price}</span>
                    <span className="text-xs text-nxl-ivory/60">({formattedTax.currency})</span>
                  </div>
                </div>
              </div>
            )}

            <Divider className="border-nxl-gold/30" />

            {/* Total */}
            <div className="flex items-center justify-between py-3 bg-gradient-to-r from-nxl-gold/10 to-nxl-gold/5 -mx-2 px-2 rounded-lg">
              <span className="text-xl font-bold text-nxl-gold font-display">
                {translate("cart", "total", "Total")}
              </span>
              <div className="text-right">
                <div className="text-2xl font-bold text-nxl-gold inline-flex items-baseline gap-1">
                  <span>{formattedTotal.price}</span>
                  <span className="text-sm text-nxl-gold/70">({formattedTotal.currency})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Trust Signals */}
          <div className="space-y-3 pt-4 border-t border-nxl-gold/20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              <div className="flex items-center gap-3 text-sm text-nxl-ivory/80 p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                <ShieldCheck className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="font-medium">{translate("checkout", "trustSignals.secureCheckout", "Secure Checkout")}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-nxl-ivory/80 p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <Clock className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="font-medium">{translate("cart", "trustIndicators.estimatedDelivery", "Estimated delivery: 3-5 business days")}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-nxl-ivory/80 p-2 bg-nxl-gold/10 rounded-lg border border-nxl-gold/20">
                <ShieldIcon />
                <span className="font-medium">{translate("checkout", "trustSignals.sslProtected", "SSL Protected")}</span>
              </div>
            </div>
          </div>

          {/* Mobile Checkout Progress */}
          <div className="lg:hidden pt-4 border-t border-nxl-gold/20">
            <div className="text-center">
              <p className="text-xs text-nxl-ivory/60 mb-2">
                {translate("checkout", "trustSignals.encryptedPayment", "256-bit Encrypted Payment")}
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-nxl-ivory/70">
                <CreditCard className="w-4 h-4" />
                <span>{translate("checkout", "payment.acceptedCards", "We accept all major credit cards")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnhancedCheckoutSummary
