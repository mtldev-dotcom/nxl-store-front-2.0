/**
 * Enhanced CartDropdown Component
 * -------------------------------
 * Premium desktop cart experience with:
 * - Smooth hover interactions and animations
 * - Enhanced visual hierarchy and design
 * - Optimized performance and accessibility
 * - Improved empty states and micro-interactions
 * - Better responsive behavior
 */

"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { formatPriceWithSmallCurrency } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import DeleteButton from "@modules/common/components/delete-button"
import CartIconEnhanced from "@modules/common/components/cart-icon-enhanced"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import MobileCartModal from "@modules/layout/components/mobile-cart-modal"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState, useCallback } from "react"
import { useTranslation } from "@lib/context/translation-context"

interface CartDropdownProps {
  cart?: HttpTypes.StoreCart | null;
  dictionary?: Record<string, any>;
}

const CartDropdown = ({
  cart: cartState,
  dictionary
}: CartDropdownProps) => {
  // Access translation function for client-side translations
  const { translate } = useTranslation()

  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(undefined)
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)
  const [mobileCartOpen, setMobileCartOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [itemCount, setItemCount] = useState(0)
  const [showItemAnimation, setShowItemAnimation] = useState(false)

  const hoverTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const closeTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const open = useCallback(() => setCartDropdownOpen(true), [])
  const close = useCallback(() => setCartDropdownOpen(false), [])
  const openMobileCart = useCallback(() => setMobileCartOpen(true), [])
  const closeMobileCart = useCallback(() => setMobileCartOpen(false), [])

  const totalItems = cartState?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0
  const subtotal = cartState?.subtotal ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  // Enhanced cart item count animation
  useEffect(() => {
    if (totalItems > itemCount && totalItems > 0) {
      setShowItemAnimation(true)
      const timer = setTimeout(() => setShowItemAnimation(false), 600)
      return () => clearTimeout(timer)
    }
    setItemCount(totalItems)
  }, [totalItems, itemCount])

  // Enhanced mobile detection with resize listener
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // Changed to 768px for better tablet experience
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Enhanced timer management
  const timedOpen = useCallback(() => {
    if (activeTimer) clearTimeout(activeTimer)
    open()
    const timer = setTimeout(close, 4000) // Reduced from 5000ms for better UX
    setActiveTimer(timer)
  }, [activeTimer, open, close])

  const openAndCancel = useCallback(() => {
    if (activeTimer) clearTimeout(activeTimer)
    open()
  }, [activeTimer, open])

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (activeTimer) clearTimeout(activeTimer)
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    }
  }, [activeTimer])

  const pathname = usePathname()

  // Enhanced cart change detection
  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart") && !pathname.includes("/checkout")) {
      if (totalItems > itemRef.current) {
        timedOpen()
      }
      itemRef.current = totalItems
    }
  }, [totalItems, pathname, timedOpen])

  // Enhanced hover interactions
  const handleMouseEnter = useCallback(() => {
    if (isMobile) return

    setIsHovering(true)
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = undefined
    }

    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    hoverTimeoutRef.current = setTimeout(() => {
      openAndCancel()
    }, 150) // Small delay for better UX
  }, [isMobile, openAndCancel])

  const handleMouseLeave = useCallback(() => {
    if (isMobile) return

    setIsHovering(false)
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = undefined
    }

    closeTimeoutRef.current = setTimeout(() => {
      close()
    }, 300) // Delay before closing
  }, [isMobile, close])

  // Enhanced cart click handler
  const handleCartClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isMobile) {
      openMobileCart()
    } else {
      cartDropdownOpen ? close() : openAndCancel()
    }
  }, [isMobile, cartDropdownOpen, close, openAndCancel, openMobileCart])

  // Enhanced touch handlers
  const handleTouchStart = useCallback(() => setIsPressed(true), [])
  const handleTouchEnd = useCallback(() => setIsPressed(false), [])

  // Format subtotal
  const formattedSubtotal = subtotal ? formatPriceWithSmallCurrency({
    amount: subtotal,
    currency_code: cartState?.currency_code || 'CAD',
  }) : null

  return (
    <>
      <div
        className="h-full z-[100] relative cart-dropdown-container"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Popover className="relative h-full z-[100]">
          <PopoverButton
            className={`
              h-full mobile-touch-target min-w-[48px] min-h-[48px] flex items-center justify-center rounded-xl
              transition-all duration-300 ease-out relative overflow-hidden
              ${isPressed ? 'scale-95 bg-nxl-gold/15' : 'scale-100'}
              ${isHovering ? 'bg-nxl-gold/10 scale-105' : ''}
              ${isMobile ? '-webkit-tap-highlight-color: transparent' : ''}
              focus:outline-none focus:ring-2 focus:ring-nxl-gold/40 focus:ring-offset-2 focus:ring-offset-nxl-black
              hover:bg-nxl-gold/8 active:bg-nxl-gold/15
              before:absolute before:inset-0 before:bg-gradient-to-r before:from-nxl-gold/0 before:via-nxl-gold/5 before:to-nxl-gold/0
              before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500
            `}
            onClick={handleCartClick}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            aria-label={`Shopping cart with ${totalItems} item${totalItems !== 1 ? 's' : ''}`}
            data-testid="cart-button"
          >
            <CartIconEnhanced
              cart={cartState || null}
              className={`
                font-body text-nxl-ivory transition-all duration-300 relative z-10
                ${isPressed ? 'text-nxl-gold scale-110' : ''}
                ${isHovering ? 'text-nxl-gold scale-105' : 'hover:text-nxl-gold'}
                ${showItemAnimation ? 'animate-pulse' : ''}
                ${isMobile ? 'p-1' : 'p-2'}
              `}
              asButton={false}
            />

            {/* Enhanced button glow effect */}
            <div className={`
              absolute inset-0 rounded-xl bg-gradient-to-r from-nxl-gold/0 via-nxl-gold/10 to-nxl-gold/0
              opacity-0 transition-opacity duration-300
              ${isHovering ? 'opacity-100' : ''}
            `} />
          </PopoverButton>

          <Transition
            show={cartDropdownOpen && !isMobile}
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1 scale-95"
            enterTo="opacity-100 translate-y-0 scale-100"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0 scale-100"
            leaveTo="opacity-0 translate-y-1 scale-95"
          >
            <PopoverPanel
              static
              className="absolute top-[calc(100%+12px)] right-0 bg-gradient-to-br from-nxl-black via-nxl-black to-nxl-navy/20 
                         border border-nxl-gold/30 w-[420px] text-nxl-ivory shadow-2xl rounded-2xl overflow-hidden 
                         min-w-[320px] max-w-[90vw] backdrop-blur-xl z-[100]"
              data-testid="nav-cart-dropdown"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={handleMouseLeave}
            >
              {/* Enhanced Header */}
              <div className="p-6 border-b border-nxl-gold/20 bg-gradient-to-r from-nxl-gold/5 to-nxl-gold/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-nxl-gold/20 rounded-full flex items-center justify-center border border-nxl-gold/30">
                      <svg className="w-4 h-4 text-nxl-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-nxl-gold font-display">
                        {dictionary?.general?.cart || "CART"}
                      </h3>
                      <p className="text-xs text-nxl-ivory/70">
                        {totalItems} {totalItems === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="flex items-center gap-2">
                    {cartState?.items?.length ? (
                      <LocalizedClientLink href="/cart">
                        <button className="text-xs text-nxl-gold hover:text-nxl-gold/80 transition-colors">
                          View Full Cart
                        </button>
                      </LocalizedClientLink>
                    ) : null}
                  </div>
                </div>
              </div>

              {cartState?.items?.length ? (
                <>
                  {/* Enhanced Cart Items */}
                  <div className="overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-nxl-gold/20 scrollbar-track-transparent">
                    <div className="p-4 space-y-4">
                      {cartState.items
                        .sort((a, b) => (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1)
                        .map((item, index) => (
                          <div
                            className="group bg-nxl-black/40 border border-nxl-gold/20 rounded-xl p-4 
                                     transition-all duration-300 hover:border-nxl-gold/40 hover:bg-nxl-black/60
                                     hover:shadow-lg hover:shadow-nxl-gold/10"
                            key={item.id}
                            data-testid="cart-item"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <div className="flex gap-4">
                              <LocalizedClientLink
                                href={`/products/${item.product_handle}`}
                                className="flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
                              >
                                <div className="relative">
                                  <Thumbnail
                                    thumbnail={item.thumbnail}
                                    images={item.variant?.product?.images}
                                    size="square"
                                    className="w-16 h-16 rounded-lg border border-nxl-gold/20"
                                  />
                                  <div className="absolute inset-0 rounded-lg ring-1 ring-nxl-gold/10 group-hover:ring-nxl-gold/30 transition-all duration-300" />
                                </div>
                              </LocalizedClientLink>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1 min-w-0 mr-3">
                                    <h4 className="text-sm font-semibold text-nxl-ivory line-clamp-2 group-hover:text-nxl-gold transition-colors duration-300">
                                      <LocalizedClientLink
                                        href={`/products/${item.product_handle}`}
                                        data-testid="product-link"
                                      >
                                        {item.title}
                                      </LocalizedClientLink>
                                    </h4>
                                    <div className="text-xs text-nxl-ivory/60 mt-1">
                                      <LineItemOptions
                                        variant={item.variant}
                                        data-testid="cart-item-variant"
                                      />
                                    </div>
                                    <div className="text-xs text-nxl-ivory/70 mt-1">
                                      Qty: {item.quantity}
                                    </div>
                                  </div>

                                  <div className="flex items-start gap-2">
                                    <div className="text-right text-sm font-bold text-nxl-gold">
                                      <LineItemPrice
                                        item={item}
                                        style="tight"
                                        currencyCode={cartState.currency_code}
                                      />
                                    </div>
                                    <DeleteButton
                                      id={item.id}
                                      className="p-1 text-nxl-ivory/50 hover:text-red-400 transition-all duration-300 
                                               hover:scale-110 hover:bg-red-500/10 rounded-lg"
                                      data-testid="cart-item-remove-button"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Enhanced Footer */}
                  <div className="p-6 border-t border-nxl-gold/20 bg-gradient-to-t from-nxl-navy/10 to-transparent">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-sm font-semibold text-nxl-ivory">
                          {dictionary?.cart?.subtotal || "Subtotal"}
                        </span>
                        <p className="text-xs text-nxl-ivory/60">(excl. taxes)</p>
                      </div>
                      <span className="text-xl font-bold text-nxl-gold inline-flex items-baseline gap-1">
                        {formattedSubtotal ? (
                          <>
                            <span>{formattedSubtotal.price}</span>
                            <span className="text-xs text-nxl-ivory/60">({formattedSubtotal.currency})</span>
                          </>
                        ) : (
                          "$0.00"
                        )}
                      </span>
                    </div>

                    {/* Shipping Message - shows translated message indicating shipping will be calculated at checkout */}
                    <div className="flex items-center justify-between mb-4 py-2 border-t border-nxl-gold/10">
                      <div>
                        <span className="text-sm font-medium text-nxl-ivory/90">
                          {translate("cart", "shipping", "Shipping")}
                        </span>
                      </div>
                      <span className="text-nxl-ivory/70 text-xs italic">
                        {translate("cart", "shippingCalculatedAtCheckout", "Shipping will be calculated at checkout")}
                      </span>
                    </div>

                    {/* Trust indicators */}
                    <div className="flex items-center justify-center gap-4 mb-4 py-2 border-y border-nxl-gold/10">
                      <div className="flex items-center gap-1 text-xs text-nxl-ivory/70">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span>Secure</span>
                      </div>
                      <div className="w-px h-3 bg-nxl-ivory/20" />
                      <div className="flex items-center gap-1 text-xs text-nxl-ivory/70">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>Fast Ship</span>
                      </div>
                    </div>

                    <LocalizedClientLink href="/checkout?step=address" passHref>
                      <Button
                        className="w-full bg-gradient-to-r from-nxl-gold to-nxl-gold/90 hover:from-nxl-gold/90 hover:to-nxl-gold 
                                 text-nxl-black font-bold py-3 rounded-xl transition-all duration-300 
                                 hover:shadow-lg hover:shadow-nxl-gold/20 hover:scale-[1.02] active:scale-[0.98]"
                        size="large"
                        data-testid="go-to-checkout-button"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          <span>Secure Checkout</span>
                        </div>
                      </Button>
                    </LocalizedClientLink>
                  </div>
                </>
              ) : (
                /* Enhanced Empty Cart State */
                <div className="p-8">
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-16 h-16 rounded-full bg-nxl-gold/10 border-2 border-nxl-gold/20 flex items-center justify-center mb-4
                                  animate-pulse">
                      <svg className="w-8 h-8 text-nxl-gold/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-nxl-gold mb-2 font-display">
                      Your cart is empty
                    </h3>
                    <p className="text-sm text-nxl-ivory/70 text-center mb-6 max-w-xs">
                      Discover our premium collection and add some luxury to your cart.
                    </p>
                    <LocalizedClientLink href="/store">
                      <Button
                        onClick={close}
                        className="bg-nxl-gold hover:bg-nxl-gold/90 text-nxl-black font-semibold px-6 py-2 rounded-lg 
                                 transition-all duration-300 hover:scale-105"
                      >
                        {dictionary?.shipping?.viewProducts || "Explore Products"}
                      </Button>
                    </LocalizedClientLink>
                  </div>
                </div>
              )}
            </PopoverPanel>
          </Transition>
        </Popover>
      </div>

      {/* Enhanced Mobile Cart Modal */}
      <MobileCartModal
        isOpen={mobileCartOpen}
        onClose={closeMobileCart}
        cart={cartState}
        dictionary={dictionary}
      />
    </>
  )
}

export default CartDropdown
