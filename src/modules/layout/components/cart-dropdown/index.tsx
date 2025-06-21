"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
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
import { Fragment, useEffect, useRef, useState } from "react"

interface CartDropdownProps {
  cart?: HttpTypes.StoreCart | null;
  dictionary?: Record<string, any>;
}

const CartDropdown = ({
  cart: cartState,
  dictionary
}: CartDropdownProps) => {
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(
    undefined
  )
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)
  const [mobileCartOpen, setMobileCartOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)
  const openMobileCart = () => setMobileCartOpen(true)
  const closeMobileCart = () => setMobileCartOpen(false)

  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const subtotal = cartState?.subtotal ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  // Enhanced mobile detection with resize listener
  useEffect(() => {
    const checkMobile = () => {
      // Simple mobile detection - only hide dropdown on very small screens
      setIsMobile(window.innerWidth < 640)
    }

    // Initial check
    checkMobile()

    // Listen for resize events
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const timedOpen = () => {
    open()

    const timer = setTimeout(close, 5000)

    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }

    open()
  }

  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  const pathname = usePathname()

  // open cart dropdown when modifying the cart items, but only if we're not on the cart page
  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      timedOpen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, itemRef.current])

  // Enhanced cart click handler with better mobile support
  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Always open mobile cart on mobile, toggle dropdown on desktop
    if (isMobile) {
      openMobileCart()
    } else {
      // On desktop, toggle the popover
      if (cartDropdownOpen) {
        close()
      } else {
        openAndCancel()
      }
    }
  }

  // Touch event handlers for better mobile feedback
  const handleTouchStart = () => {
    setIsPressed(true)
  }

  const handleTouchEnd = () => {
    setIsPressed(false)
  }

  // Mouse event handlers (desktop only)
  const handleMouseEnter = () => {
    if (!isMobile) {
      openAndCancel()
    }
  }

  const handleMouseLeave = () => {
    if (!isMobile) {
      close()
    }
  }

  return (
    <>
      <div
        className="h-full z-[9999] relative cart-dropdown-container"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Popover className="relative h-full z-[9999]">
          <PopoverButton
            className={`
              h-full mobile-touch-target min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg
              transition-all duration-200 ease-out
              ${isPressed ? 'scale-95 bg-nxl-gold/10' : 'scale-100'}
              ${isMobile ? '-webkit-tap-highlight-color: transparent' : ''}
              focus:outline-none focus:ring-2 focus:ring-nxl-gold/30 focus:ring-offset-2
              hover:bg-nxl-gold/5 active:bg-nxl-gold/10
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
                font-body text-[var(--color-charcoal)] transition-all duration-300
                ${isPressed ? 'text-nxl-gold scale-110' : 'hover:text-nxl-gold'}
                ${isMobile ? 'p-1' : 'p-2'}
              `}
              asButton={false}
            />
          </PopoverButton>
          <Transition
            show={cartDropdownOpen}
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <PopoverPanel
              static
              className="absolute top-[calc(100%+20px)] right-0 bg-white border border-gray-200 w-[420px] text-ui-fg-base shadow-xl rounded-lg overflow-hidden min-w-[320px]"
              data-testid="nav-cart-dropdown"
              style={{
                marginTop: '8px',
                maxHeight: 'calc(100vh - 120px)',
                minHeight: '200px',
                zIndex: 99999,
                position: 'absolute',
                display: 'block',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div className="p-4 flex items-center justify-center border-b border-gray-100">
                <h3 className="text-large-semi text-nxl-black font-serif">{dictionary?.general?.cart || "Cart"}</h3>
              </div>
              {cartState && cartState.items?.length ? (
                <>
                  <div className="overflow-y-scroll max-h-[402px] px-4 grid grid-cols-1 gap-y-8 no-scrollbar p-px">
                    {cartState.items
                      .sort((a, b) => {
                        return (a.created_at ?? "") > (b.created_at ?? "")
                          ? -1
                          : 1
                      })
                      .map((item) => (
                        <div
                          className="grid grid-cols-[122px_1fr] gap-x-4"
                          key={item.id}
                          data-testid="cart-item"
                        >
                          <LocalizedClientLink
                            href={`/products/${item.product_handle}`}
                            className="w-24"
                          >
                            <Thumbnail
                              thumbnail={item.thumbnail}
                              images={item.variant?.product?.images}
                              size="square"
                            />
                          </LocalizedClientLink>
                          <div className="flex flex-col justify-between flex-1">
                            <div className="flex flex-col flex-1">
                              <div className="flex items-start justify-between">
                                <div className="flex flex-col overflow-ellipsis whitespace-nowrap mr-4 w-[180px]">
                                  <h3 className="text-base-regular overflow-hidden text-ellipsis">
                                    <LocalizedClientLink
                                      href={`/products/${item.product_handle}`}
                                      data-testid="product-link"
                                    >
                                      {item.title}
                                    </LocalizedClientLink>
                                  </h3>
                                  <LineItemOptions
                                    variant={item.variant}
                                    data-testid="cart-item-variant"
                                    data-value={item.variant}
                                  />
                                  <span
                                    data-testid="cart-item-quantity"
                                    data-value={item.quantity}
                                  >
                                    Quantity: {item.quantity}
                                  </span>
                                </div>
                                <div className="flex justify-end">
                                  <LineItemPrice
                                    item={item}
                                    style="tight"
                                    currencyCode={cartState.currency_code}
                                  />
                                </div>
                              </div>
                            </div>
                            <DeleteButton
                              id={item.id}
                              className="mt-1 text-red-500 hover:text-red-700 transition-colors duration-200"
                              data-testid="cart-item-remove-button"
                            >
                              {dictionary?.cart?.remove || "Remove"}
                            </DeleteButton>
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="p-4 flex flex-col gap-y-4 text-small-regular">
                    <div className="flex items-center justify-between">
                      <span className="text-ui-fg-base font-semibold">
                        {dictionary?.cart?.subtotal || "Subtotal"}{" "}
                        <span className="font-normal">(excl. taxes)</span>
                      </span>
                      <span
                        className="text-large-semi"
                        data-testid="cart-subtotal"
                        data-value={subtotal}
                      >
                        {convertToLocale({
                          amount: subtotal,
                          currency_code: cartState.currency_code,
                        })}
                      </span>
                    </div>
                    <LocalizedClientLink href="/cart" passHref>
                      <Button
                        className="w-full"
                        size="large"
                        data-testid="go-to-cart-button"
                      >
                        {dictionary?.cart?.viewCart || "Go to cart"}
                      </Button>
                    </LocalizedClientLink>
                  </div>
                </>
              ) : (
                <div>
                  <div className="flex py-16 flex-col gap-y-4 items-center justify-center">
                    <div className="bg-gray-900 text-small-regular flex items-center justify-center w-6 h-6 rounded-full text-white">
                      <span>0</span>
                    </div>
                    <span>{dictionary?.cart?.empty || "Your shopping bag is empty."}</span>
                    <div>
                      <LocalizedClientLink href="/store">
                        <>
                          <span className="sr-only">Go to all products page</span>
                          <Button onClick={close}>{dictionary?.shipping?.viewProducts || "Explore products"}</Button>
                        </>
                      </LocalizedClientLink>
                    </div>
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
