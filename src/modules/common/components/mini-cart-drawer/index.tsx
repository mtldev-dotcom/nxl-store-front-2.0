"use client"

import { Fragment, useEffect, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import { useRouter } from "next/navigation"
import LocalizedClientLink from "../localized-client-link"
import DeleteButton from "../delete-button"
import { formatPriceWithSmallCurrency } from "@lib/util/money"
import { useTranslation } from "@lib/context/translation-context"
import { useCart } from "@lib/context/cart-context"

interface MiniCartDrawerProps {
  isOpen: boolean
  onClose: () => void
  countryCode: string
}

const MiniCartDrawer = ({
  isOpen,
  onClose,
  countryCode
}: MiniCartDrawerProps) => {
  const router = useRouter()
  const { translate } = useTranslation()
  const { cart, refreshCart, isLoading } = useCart()
  const [isAnimating, setIsAnimating] = useState(false)
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleCheckout = () => {
    router.push(`/${countryCode}/checkout`)
    onClose()
  }

  const handleViewCart = () => {
    router.push(`/${countryCode}/cart`)
    onClose()
  }

  const handleDeleteStart = (itemId: string) => {
    setRemovingItems(prev => new Set(Array.from(prev).concat(itemId)))
  }

  const handleDeleteComplete = async (itemId: string) => {
    // Remove from removing items state
    setRemovingItems(prev => {
      const newSet = new Set(prev)
      newSet.delete(itemId)
      return newSet
    })

    // Refresh cart to get updated state
    try {
      await refreshCart()
    } catch (error) {
      console.error('Failed to refresh cart after deletion:', error)
    }
  }

  const handleDeleteError = (itemId: string) => {
    setRemovingItems(prev => {
      const newSet = new Set(prev)
      newSet.delete(itemId)
      return newSet
    })
  }

  const subtotalFormatted = cart?.subtotal ? formatPriceWithSmallCurrency({
    amount: cart.subtotal,
    currency_code: cart.region?.currency_code || 'USD'
  }) : null

  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        {/* Drawer */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                  <div className="flex h-full flex-col bg-nxl-black border-l-2 border-nxl-gold shadow-2xl">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-nxl-gold to-nxl-gold/90 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-nxl-black rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-nxl-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 2.5M7 13l2.5 2.5m6-2.5a2.5 2.5 0 105 0 2.5 2.5 0 00-5 0z" />
                            </svg>
                          </div>
                          <h2 className="text-lg font-bold text-nxl-black font-serif">
                            {translate("cart", "title", "Shopping Cart")} ({itemCount})
                          </h2>
                        </div>
                        <button
                          onClick={onClose}
                          className="mobile-touch-target w-8 h-8 bg-nxl-black/20 rounded-full flex items-center justify-center hover:bg-nxl-black/30 transition-colors"
                          aria-label={translate("cart", "close", "Close cart")}
                        >
                          <svg className="w-5 h-5 text-nxl-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Cart Content */}
                    <div className="flex-1 overflow-y-auto">
                      {isLoading ? (
                        <div className="flex items-center justify-center h-32">
                          <div className="w-6 h-6 border-2 border-nxl-gold/30 border-t-nxl-gold rounded-full animate-spin" />
                        </div>
                      ) : cart?.items && cart.items.length > 0 ? (
                        <div className="divide-y divide-nxl-gold/20">
                          {cart.items.map((item) => {
                            const isRemoving = removingItems.has(item.id)

                            if (isRemoving) {
                              return (
                                <div key={item.id} className="p-4 bg-red-500/5">
                                  <div className="flex items-center justify-center h-16">
                                    <div className="flex items-center gap-2 text-red-400">
                                      <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                                      <span className="text-sm font-medium">
                                        {translate("cart", "removing", "Removing item...")}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )
                            }

                            return (
                              <div key={item.id} className="p-4 hover:bg-nxl-gold/5 transition-colors">
                                <div className="flex gap-3">
                                  <LocalizedClientLink
                                    href={`/products/${item.product_handle}`}
                                    className="flex-shrink-0 mobile-touch-target"
                                    onClick={onClose}
                                  >
                                    <div className="w-16 h-16 bg-nxl-navy/20 rounded-lg border border-nxl-gold/20 overflow-hidden">
                                      {item.thumbnail ? (
                                        <img
                                          src={item.thumbnail}
                                          alt={item.title}
                                          className="w-full h-full object-cover transition-transform hover:scale-105"
                                        />
                                      ) : (
                                        <div className="w-full h-full bg-nxl-gold/20 flex items-center justify-center">
                                          <svg className="w-6 h-6 text-nxl-gold/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                          </svg>
                                        </div>
                                      )}
                                    </div>
                                  </LocalizedClientLink>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start gap-2">
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-nxl-ivory text-sm truncate">
                                          <LocalizedClientLink
                                            href={`/products/${item.product_handle}`}
                                            onClick={onClose}
                                            className="hover:text-nxl-gold transition-colors"
                                          >
                                            {item.title}
                                          </LocalizedClientLink>
                                        </h4>
                                        {item.variant && (
                                          <p className="text-xs text-nxl-ivory/60 mt-1">
                                            {item.variant.options?.map(opt => opt.value).join(" • ")}
                                          </p>
                                        )}
                                      </div>

                                      {/* Delete Button */}
                                      <DeleteButton
                                        id={item.id}
                                        className="ml-2"
                                        onDeleteStart={() => handleDeleteStart(item.id)}
                                        onDeleteComplete={() => handleDeleteComplete(item.id)}
                                        onDeleteError={() => handleDeleteError(item.id)}
                                        autoRefreshCart={false}
                                      />
                                    </div>

                                    <div className="flex items-center justify-between mt-2">
                                      <span className="text-xs text-nxl-ivory/70">
                                        {translate("cart", "quantityShort", "Qty")}: {item.quantity}
                                      </span>
                                      <span className="text-sm font-medium text-nxl-gold inline-flex items-baseline gap-1">
                                        {(() => {
                                          const formatted = formatPriceWithSmallCurrency({
                                            amount: item.subtotal || 0,
                                            currency_code: cart.region?.currency_code || 'USD'
                                          })
                                          return (
                                            <>
                                              <span>{formatted.price}</span>
                                              <span className="text-xs text-nxl-ivory/60">({formatted.currency})</span>
                                            </>
                                          )
                                        })()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                          <div className="w-16 h-16 bg-nxl-gold/10 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-nxl-gold/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 2.5M7 13l2.5 2.5m6-2.5a2.5 2.5 0 105 0 2.5 2.5 0 00-5 0z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-medium text-nxl-ivory mb-2">
                            {translate("cart", "empty", "Your cart is empty")}
                          </h3>
                          <p className="text-sm text-nxl-ivory/60 mb-4">
                            {translate("cart", "emptyDescription", "Add some items to get started")}
                          </p>
                          <Button
                            onClick={onClose}
                            variant="secondary"
                            className="nxl-btn-secondary mobile-touch-target"
                          >
                            {translate("cart", "continueShopping", "Continue Shopping")}
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    {cart?.items && cart.items.length > 0 && (
                      <div className="border-t border-nxl-gold/20 p-4 space-y-4">
                        {/* Subtotal */}
                        <div className="flex justify-between items-center">
                          <span className="text-base font-medium text-nxl-ivory">
                            {translate("cart", "subtotal", "Subtotal")}:
                          </span>
                          <span className="text-lg font-bold text-nxl-gold inline-flex items-baseline gap-1">
                            {subtotalFormatted ? (
                              <>
                                <span>{subtotalFormatted.price}</span>
                                <span className="text-xs text-nxl-ivory/60">({subtotalFormatted.currency})</span>
                              </>
                            ) : (
                              "$0.00"
                            )}
                          </span>
                        </div>

                        {/* Shipping Notice */}
                        <div className="text-xs text-nxl-ivory/60 text-center">
                          {translate("cart", "shippingCalculatedAtCheckout", "Shipping will be calculated at checkout")}
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                          <Button
                            onClick={handleCheckout}
                            variant="primary"
                            className="nxl-btn-primary w-full h-12 text-base font-semibold mobile-touch-target"
                          >
                            {translate("cart", "checkout", "Checkout")}
                          </Button>
                          <Button
                            onClick={handleViewCart}
                            variant="secondary"
                            className="nxl-btn-secondary w-full mobile-touch-target"
                          >
                            {translate("cart", "viewCart", "View Full Cart")}
                          </Button>
                        </div>

                        {/* Free Shipping Progress */}
                        {cart.subtotal && cart.subtotal < 10000 && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs text-nxl-ivory/70">
                              <span>{translate("cart", "freeShippingAt", "Free shipping at")} $100</span>
                              <span>
                                ${((10000 - cart.subtotal) / 100).toFixed(0)} {translate("cart", "away", "away")}
                              </span>
                            </div>
                            <div className="w-full bg-nxl-navy/30 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-nxl-gold to-nxl-gold/80 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min((cart.subtotal / 10000) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default MiniCartDrawer
