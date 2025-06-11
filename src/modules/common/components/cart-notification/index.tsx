"use client"

import { Fragment, useEffect } from "react"
import { Transition } from "@headlessui/react"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import { useRouter } from "next/navigation"
import { useTranslation } from "@lib/context/translation-context"

interface CartNotificationProps {
  isVisible: boolean
  onClose: () => void
  product?: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  onViewCart?: () => void
  onContinueShopping?: () => void
}

const CartNotification = ({
  isVisible,
  onClose,
  product,
  variant,
  onViewCart,
  onContinueShopping
}: CartNotificationProps) => {
  const router = useRouter()
  const { translate } = useTranslation()

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000) // Auto close after 5 seconds
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  const handleViewCart = () => {
    onViewCart?.()
    router.push('/cart')
    onClose()
  }

  const handleContinueShopping = () => {
    onContinueShopping?.()
    onClose()
  }

  return (
    <Transition appear show={isVisible} as={Fragment}>
      <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pointer-events-none">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95 translate-y-[-20px]"
          enterTo="opacity-100 scale-100 translate-y-0"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100 translate-y-0"
          leaveTo="opacity-0 scale-95 translate-y-[-20px]"
        >
          <div className="bg-nxl-black border-2 border-nxl-gold rounded-xl shadow-2xl max-w-md w-full pointer-events-auto overflow-hidden mt-16">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-nxl-gold to-nxl-gold/80 p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-8 h-8 bg-nxl-black rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-nxl-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-bold text-nxl-black font-serif">
                {translate("product", "addedToCart", "Added to Cart!")}
              </h3>
            </div>

            {/* Product Info */}
            <div className="p-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 bg-nxl-navy/20 rounded-lg border border-nxl-gold/20 flex items-center justify-center">
                  {product?.thumbnail ? (
                    <img 
                      src={product.thumbnail} 
                      alt={product.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-nxl-gold/20 rounded"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-nxl-ivory truncate">
                    {product?.title}
                  </h4>
                  {variant && (
                    <p className="text-sm text-nxl-ivory/70 mt-1">
                      {variant.options?.map(opt => opt.value).join(" • ")}
                    </p>
                  )}
                  <p className="text-sm text-nxl-gold mt-1 font-medium">
                    {translate("cart", "quantity", "Quantity")}: 1
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-nxl-ivory/60 hover:text-nxl-ivory transition-colors p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  onClick={handleContinueShopping}
                  variant="secondary"
                  className="nxl-btn-secondary text-sm h-10"
                >
                  {translate("cart", "continueShopping", "Continue Shopping")}
                </Button>
                <Button
                  onClick={handleViewCart}
                  variant="primary"
                  className="nxl-btn-primary text-sm h-10"
                >
                  {translate("cart", "viewCart", "View Cart")}
                </Button>
              </div>
            </div>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  )
}

export default CartNotification
