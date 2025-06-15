"use client"

import { useEffect } from "react"
import { convertToLocale } from "@lib/util/money"
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

export default function MobileCartModal({ 
  isOpen, 
  onClose, 
  cart: cartState, 
  dictionary 
}: MobileCartModalProps) {
  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const subtotal = cartState?.subtotal ?? 0

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
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 sm:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-end">
        <div className="w-full bg-white rounded-t-lg max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-serif text-nxl-black">
              {dictionary?.general?.cart || "Cart"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700"
              aria-label="Close cart"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {cartState && cartState.items?.length ? (
              <>
                {/* Cart Items */}
                <div className="p-4 space-y-4">
                  {cartState.items
                    .sort((a, b) => {
                      return (a.created_at ?? "") > (b.created_at ?? "")
                        ? -1
                        : 1
                    })
                    .map((item) => (
                      <div
                        className="flex space-x-3 py-3 border-b border-gray-100 last:border-b-0"
                        key={item.id}
                        data-testid="cart-item"
                      >
                        <LocalizedClientLink
                          href={`/products/${item.product_handle}`}
                          className="flex-shrink-0"
                          onClick={onClose}
                        >
                          <Thumbnail
                            thumbnail={item.thumbnail}
                            images={item.variant?.product?.images}
                            size="square"
                            className="w-16 h-16"
                          />
                        </LocalizedClientLink>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-medium text-gray-900 truncate">
                                <LocalizedClientLink
                                  href={`/products/${item.product_handle}`}
                                  onClick={onClose}
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
                              <p className="text-xs text-gray-500 mt-1">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <LineItemPrice
                                item={item}
                                style="tight"
                                currencyCode={cartState.currency_code}
                              />
                              <DeleteButton
                                id={item.id}
                                className="text-xs text-red-500 hover:text-red-700"
                                data-testid="cart-item-remove-button"
                              >
                                {dictionary?.cart?.remove || "Remove"}
                              </DeleteButton>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-gray-900">
                      {dictionary?.cart?.subtotal || "Subtotal"}{" "}
                      <span className="font-normal text-gray-600">(excl. taxes)</span>
                    </span>
                    <span
                      className="text-lg font-semibold"
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
                      onClick={onClose}
                      data-testid="go-to-cart-button"
                    >
                      {dictionary?.cart?.viewCart || "Go to cart"}
                    </Button>
                  </LocalizedClientLink>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="bg-gray-900 text-white w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <span className="text-lg">0</span>
                </div>
                <p className="text-gray-600 text-center mb-6">
                  {dictionary?.cart?.empty || "Your shopping bag is empty."}
                </p>
                <LocalizedClientLink href="/store">
                  <Button onClick={onClose}>
                    {dictionary?.shipping?.viewProducts || "Explore products"}
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
