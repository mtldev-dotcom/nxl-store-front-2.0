"use client"

import { formatPriceWithSmallCurrency } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import React from "react"

type CartTotalsProps = {
  totals: HttpTypes.StoreCart | HttpTypes.StoreOrder
}

const CartTotals: React.FC<CartTotalsProps> = ({ totals }) => {
  const {
    currency_code,
    total,
    subtotal,
    tax_total,
    discount_total,
    gift_card_total,
    shipping_subtotal,
  } = totals

  // Use item_total for correct subtotal (items only, no shipping)
  // @ts-ignore - item_total exists on cart but not in types
  const itemTotal = totals.item_total ?? subtotal ?? 0

  // Format all prices using the new function
  const formattedSubtotal = formatPriceWithSmallCurrency({ amount: itemTotal, currency_code })
  const formattedDiscount = formatPriceWithSmallCurrency({ amount: discount_total ?? 0, currency_code })
  const formattedShipping = formatPriceWithSmallCurrency({ amount: shipping_subtotal ?? 0, currency_code })
  const formattedTax = formatPriceWithSmallCurrency({ amount: tax_total ?? 0, currency_code })
  const formattedGiftCard = formatPriceWithSmallCurrency({ amount: gift_card_total ?? 0, currency_code })
  const formattedTotal = formatPriceWithSmallCurrency({ amount: total ?? 0, currency_code })

  return (
    <div>
      <div className="flex flex-col gap-y-2 txt-medium text-nxl-ivory/80 ">
        <div className="flex items-center justify-between">
          <span className="flex gap-x-1 items-center">
            Subtotal (excl. shipping and taxes)
          </span>
          <span data-testid="cart-subtotal" data-value={itemTotal || 0} className="text-nxl-ivory inline-flex items-baseline gap-1">
            <span>{formattedSubtotal.price}</span>
            <span className="text-xs text-nxl-ivory/60">({formattedSubtotal.currency})</span>
          </span>
        </div>
        {!!discount_total && (
          <div className="flex items-center justify-between">
            <span>Discount</span>
            <span
              className="text-nxl-gold inline-flex items-baseline gap-1"
              data-testid="cart-discount"
              data-value={discount_total || 0}
            >
              -{" "}
              <span>{formattedDiscount.price}</span>
              <span className="text-xs text-nxl-ivory/60">({formattedDiscount.currency})</span>
            </span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span>Shipping</span>
          <span data-testid="cart-shipping" data-value={shipping_subtotal || 0} className="text-nxl-ivory inline-flex items-baseline gap-1">
            <span>{formattedShipping.price}</span>
            <span className="text-xs text-nxl-ivory/60">({formattedShipping.currency})</span>
          </span>
        </div>
        <div className="flex justify-between">
          <span className="flex gap-x-1 items-center">Taxes</span>
          <span data-testid="cart-taxes" data-value={tax_total || 0} className="text-nxl-ivory inline-flex items-baseline gap-1">
            <span>{formattedTax.price}</span>
            <span className="text-xs text-nxl-ivory/60">({formattedTax.currency})</span>
          </span>
        </div>
        {!!gift_card_total && (
          <div className="flex items-center justify-between">
            <span className="flex gap-x-1 items-center">
              Gift card
            </span>
            <span
              className="text-nxl-gold inline-flex items-baseline gap-1"
              data-testid="cart-gift-card-amount"
              data-value={gift_card_total || 0}
            >
              -{" "}
              <span>{formattedGiftCard.price}</span>
              <span className="text-xs text-nxl-ivory/60">({formattedGiftCard.currency})</span>
            </span>
          </div>
        )}
      </div>
      <div className="h-px w-full border-b border-gray-200 border-dashed my-4" />
      <div className="flex items-center justify-between text-nxl-ivory txt-medium ">
        <span>Total</span>
        <span data-testid="cart-total" data-value={total || 0} className="txt-xlarge-plus inline-flex items-baseline gap-1">
          <span>{formattedTotal.price}</span>
          <span className="text-xs text-nxl-ivory/60">({formattedTotal.currency})</span>
        </span>
      </div>
    </div>
  )
}

export default CartTotals
