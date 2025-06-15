"use client"

import { Heading } from "@medusajs/ui"
import { ShieldCheck, CheckCircleSolid, CreditCard } from "@medusajs/icons"
import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import { useTranslation } from "@lib/context/translation-context"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  const { translate } = useTranslation()

  return (
    <div className="sticky top-0 flex flex-col-reverse small:flex-col gap-y-8 py-8 small:py-0">
      <div className="w-full bg-gradient-to-br from-nxl-black/95 to-nxl-navy/90 backdrop-blur-sm border border-nxl-gold/30 rounded-xl p-6 shadow-2xl">
        <Divider className="my-6 small:hidden border-nxl-gold/20" />
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-nxl-gold/20 flex items-center justify-center border border-nxl-gold/30">
            <ShieldCheck className="w-5 h-5 text-nxl-gold" />
          </div>
          <Heading
            level="h2"
            className="text-2xl font-bold text-nxl-gold font-display"
          >
            {translate("checkout", "inYourCart")}
          </Heading>
        </div>
        
        <Divider className="my-6 border-nxl-gold/20" />
        
        {/* Cart Items */}
        <div className="mb-6">
          <ItemsPreviewTemplate cart={cart} />
        </div>
        
        {/* Discount Code */}
        <div className="mb-6">
          <DiscountCode cart={cart} />
        </div>
        
        <Divider className="my-6 border-nxl-gold/20" />
        
        {/* Cart Totals */}
        <div className="mb-6">
          <CartTotals totals={cart} />
        </div>
        
        {/* Trust Signals */}
        <div className="space-y-3 pt-4 border-t border-nxl-gold/20">
          <div className="flex items-center gap-3 text-sm text-nxl-ivory/80">
            <ShieldCheck className="w-4 h-4 text-green-400" />
            <span>Secure Checkout</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-nxl-ivory/80">
            <CheckCircleSolid className="w-4 h-4 text-blue-400" />
            <span>Estimated delivery: 3-5 business days</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-nxl-ivory/80">
            <CreditCard className="w-4 h-4 text-nxl-gold" />
            <span>SSL Protected</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
