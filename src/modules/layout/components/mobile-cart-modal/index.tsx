"use client"

import { useEffect, useState } from "react"
import { convertToLocale } from "@lib/util/money"
import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import X from "@modules/common/icons/x"

interface MobileCartModalProps {
  isOpen: boolean
  onClose: () => void
  cart?: HttpTypes.StoreCart | null
  dictionary?: Record<string, any>
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

// Quantity Update Component
function QuantitySelector({ item }: { item: any }) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [quantity, setQuantity] = useState(item.quantity)

  const updateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity === quantity || isUpdating) return

    setIsUpdating(true)
    try {
      await updateLineItem({
        lineId: item.id,
        quantity: newQuantity
      })
      setQuantity(newQuantity)
    } catch (error) {
      console.error('Failed to update quantity:', error)
      // Reset quantity on error
      setQuantity(item.quantity)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex items-center gap-2 bg-nxl-black/60 rounded-lg border border-nxl-gold/20">
      <button
        className="p-1 text-nxl-ivory hover:text-nxl-gold transition-colors touch-target disabled:opacity-50"
        onClick={() => updateQuantity(quantity - 1)}
        disabled={isUpdating || quantity <= 1}
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>
      <span className="text-sm font-medium text-nxl-ivory min-w-[24px] text-center">
        {isUpdating ? '...' : quantity}
      </span>
      <button
        className="p-1 text-nxl-ivory hover:text-nxl-gold transition-colors touch-target disabled:opacity-50"
        onClick={() => updateQuantity(quantity + 1)}
        disabled={isUpdating}
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
        </svg>
      </button>
    </div>
  )
}

export default function MobileCartModal({
  isOpen,
  onClose,
  cart: cartState,
  dictionary
}: MobileCartModalProps) {
  const [isClosing, setIsClosing] = useState(false)

  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const subtotal = cartState?.subtotal ?? 0
  const shippingProgress = getFreeShippingProgress(subtotal)

  // Enhanced close function with animation
  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 300)
  }

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 sm:hidden">
      {/* Enhanced Backdrop with blur */}
      <div
        className={`fixed inset-0 bg-nxl-black/80 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'
          }`}
        onClick={handleClose}
      />

      {/* Enhanced Modal */}
      <div className={`fixed bottom-0 left-0 right-0 transition-transform duration-300 ease-out ${isClosing ? 'translate-y-full' : 'translate-y-0'
        }`}>
        <div className="w-full bg-gradient-to-b from-nxl-black to-nxl-navy rounded-t-2xl max-h-[85vh] min-h-[60vh] flex flex-col shadow-2xl border-t border-nxl-gold/30">

          {/* Enhanced Header */}
          <div className="flex items-center justify-between p-6 border-b border-nxl-gold/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-nxl-gold/20 flex items-center justify-center border border-nxl-gold/30">
                <svg className="w-4 h-4 text-nxl-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-nxl-gold font-display">
                  {dictionary?.general?.cart || "PANIER"}
                </h2>
                <p className="text-xs text-nxl-ivory/70">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-nxl-ivory/60 hover:text-nxl-gold transition-colors duration-200 touch-target"
              aria-label="Close cart"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {cartState && cartState.items?.length ? (
              <>
                {/* Free Shipping Progress */}
                {!shippingProgress.qualified && (
                  <div className="mx-6 mt-4 p-4 bg-gradient-to-r from-nxl-gold/10 to-nxl-gold/5 border border-nxl-gold/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-nxl-gold">
                        Free Shipping Progress
                      </span>
                      <span className="text-xs text-nxl-ivory/80">
                        ${(shippingProgress.remaining / 100).toFixed(2)} away
                      </span>
                    </div>
                    <div className="w-full bg-nxl-black/60 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-nxl-gold to-nxl-gold/80 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${shippingProgress.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {shippingProgress.qualified && (
                  <div className="mx-6 mt-4 p-3 bg-gradient-to-r from-green-500/15 to-emerald-500/10 border border-green-500/30 rounded-lg flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-green-400">
                      Free shipping qualified!
                    </span>
                  </div>
                )}

                {/* Cart Items */}
                <div className="p-6 space-y-4">
                  {cartState.items
                    .sort((a, b) => {
                      return (a.created_at ?? "") > (b.created_at ?? "")
                        ? -1
                        : 1
                    })
                    .map((item) => (
                      <div
                        className="bg-nxl-black/40 border border-nxl-gold/20 rounded-xl p-4 transition-all duration-300 hover:border-nxl-gold/40"
                        key={item.id}
                        data-testid="cart-item"
                      >
                        <div className="flex gap-4">
                          <LocalizedClientLink
                            href={`/products/${item.product_handle}`}
                            className="flex-shrink-0"
                            onClick={handleClose}
                          >
                            <div className="relative">
                              <Thumbnail
                                thumbnail={item.thumbnail}
                                images={item.variant?.product?.images}
                                size="square"
                                className="w-20 h-20 rounded-lg border border-nxl-gold/20"
                              />
                              <div className="absolute inset-0 rounded-lg ring-1 ring-nxl-gold/10" />
                            </div>
                          </LocalizedClientLink>

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-sm font-semibold text-nxl-ivory line-clamp-2">
                                <LocalizedClientLink
                                  href={`/products/${item.product_handle}`}
                                  onClick={handleClose}
                                  data-testid="product-link"
                                  className="hover:text-nxl-gold transition-colors"
                                >
                                  {item.title}
                                </LocalizedClientLink>
                              </h3>
                              <DeleteButton
                                id={item.id}
                                className="ml-2 p-1 text-nxl-ivory/60 hover:text-red-400 transition-colors touch-target"
                                data-testid="cart-item-remove-button"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </DeleteButton>
                            </div>

                            <div className="space-y-2">
                              <div className="text-xs text-nxl-ivory/70">
                                <LineItemOptions
                                  variant={item.variant}
                                  data-testid="cart-item-variant"
                                  data-value={item.variant}
                                />
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="text-xs text-nxl-ivory/70">Qty:</span>
                                  <QuantitySelector item={item} />
                                </div>

                                <div className="text-right text-sm font-bold text-nxl-gold">
                                  <LineItemPrice
                                    item={item}
                                    style="tight"
                                    currencyCode={cartState.currency_code}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Enhanced Footer */}
                <div className="p-6 border-t border-nxl-gold/20 bg-gradient-to-t from-nxl-navy/30 to-transparent">
                  {/* Subtotal */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-base font-semibold text-nxl-ivory">
                        {dictionary?.cart?.subtotal || "Subtotal"}
                      </span>
                      <p className="text-xs text-nxl-ivory/60">
                        (excl. taxes & shipping)
                      </p>
                    </div>
                    <span
                      className="text-2xl font-bold text-nxl-gold"
                      data-testid="cart-subtotal"
                      data-value={subtotal}
                    >
                      {convertToLocale({
                        amount: subtotal,
                        currency_code: cartState.currency_code,
                      })}
                    </span>
                  </div>

                  {/* Trust Signals */}
                  <div className="flex items-center justify-center gap-4 mb-4 py-3 border-y border-nxl-gold/10">
                    <div className="flex items-center gap-1 text-xs text-nxl-ivory/70">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span>Secure</span>
                    </div>
                    <div className="w-px h-3 bg-nxl-ivory/20" />
                    <div className="flex items-center gap-1 text-xs text-nxl-ivory/70">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Guaranteed</span>
                    </div>
                    <div className="w-px h-3 bg-nxl-ivory/20" />
                    <div className="flex items-center gap-1 text-xs text-nxl-ivory/70">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Fast Ship</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <LocalizedClientLink href="/checkout" passHref>
                      <Button
                        className="w-full h-12 bg-nxl-gold hover:bg-nxl-gold/90 text-nxl-black font-bold text-base rounded-xl transition-all duration-300 shadow-luxury hover:shadow-luxury-lg transform hover:-translate-y-0.5"
                        size="large"
                        onClick={handleClose}
                        data-testid="quick-checkout-button"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          <span>Secure Checkout</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </Button>
                    </LocalizedClientLink>

                    <LocalizedClientLink href="/cart" passHref>
                      <Button
                        className="w-full h-10 bg-nxl-black/60 border border-nxl-gold/30 text-nxl-ivory hover:bg-nxl-gold/10 transition-all duration-300 rounded-lg touch-target"
                        variant="secondary"
                        onClick={handleClose}
                        data-testid="view-cart-button"
                      >
                        {dictionary?.cart?.viewCart || "View Full Cart"}
                      </Button>
                    </LocalizedClientLink>
                  </div>
                </div>
              </>
            ) : (
              /* Empty Cart State */
              <div className="flex flex-col items-center justify-center py-16 px-6">
                <div className="w-16 h-16 rounded-full bg-nxl-gold/10 border-2 border-nxl-gold/20 flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-nxl-gold/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-nxl-gold mb-2 font-display">
                  Your cart is empty
                </h3>
                <p className="text-nxl-ivory/70 text-center mb-8 max-w-sm">
                  Discover our premium collection and add some luxury to your cart.
                </p>
                <LocalizedClientLink href="/store">
                  <Button
                    onClick={handleClose}
                    className="bg-nxl-gold hover:bg-nxl-gold/90 text-nxl-black font-semibold px-8 py-3 rounded-xl transition-all duration-300"
                  >
                    Explore Products
                  </Button>
                </LocalizedClientLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
