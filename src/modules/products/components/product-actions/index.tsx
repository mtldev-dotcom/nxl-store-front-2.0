"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { useCart } from "@lib/context/cart-context"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import CartNotification from "@modules/common/components/cart-notification"
import MiniCartDrawer from "@modules/common/components/mini-cart-drawer"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import SizeGuide from "@modules/products/components/size-guide"
import { isEqual } from "lodash"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"
import { useTranslation } from "@lib/context/translation-context"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  disabled,
}: ProductActionsProps) {
  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [showMiniCart, setShowMiniCart] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const countryCode = useParams().countryCode as string
  const { translate } = useTranslation()
  const { cart, refreshCart } = useCart()

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
    setAddedToCart(false) // Reset added state when options change
  }

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }

    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant?.allow_backorder) {
      return true
    }

    // If there is inventory available, we can add to cart
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }

    // Otherwise, we can't add to cart
    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)
  const inView = useIntersection(actionsRef, "0px")

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)

    try {
      await addToCart({
        variantId: selectedVariant.id,
        quantity: 1,
        countryCode,
      })

      // Refresh cart data using context
      await refreshCart()

      setAddedToCart(true)
      setShowNotification(true)

      // Auto-show mini cart after notification - DISABLED
      // setTimeout(() => {
      //   setShowMiniCart(true)
      // }, 2000)

      // Reset added state after animation
      setTimeout(() => setAddedToCart(false), 3000)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsAdding(false)
    }
  }

  // Handle wishlist toggle
  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted)
    // TODO: Implement actual wishlist functionality
  }

  // Handle social sharing
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description || `Check out ${product.title} from Next X Level`,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Share was cancelled or failed')
      }
    } else {
      // Fallback to copy URL
      await navigator.clipboard.writeText(window.location.href)
      // TODO: Show toast notification
    }
  }

  // Get button text based on state
  const getButtonText = () => {
    if (addedToCart) {
      return translate("product", "addedToCart", "Added to Cart!")
    }
    if (isAdding) {
      return translate("product", "adding", "Adding...")
    }
    if (!selectedVariant && !options) {
      return translate("product", "selectVariant", "Select Options")
    }
    if (!inStock || !isValidVariant) {
      return translate("product", "outOfStock", "Out of Stock")
    }
    return translate("product", "addToCart", "Add to Cart")
  }

  // Get inventory status text
  const getInventoryStatus = () => {
    if (!selectedVariant) return null

    const inventory = selectedVariant.inventory_quantity || 0

    if (inventory <= 0 && selectedVariant.allow_backorder) {
      return (
        <div className="text-sm text-nxl-gold/80 font-body">
          {translate("product", "backorderAvailable", "Available on backorder")}
        </div>
      )
    }

    if (inventory > 0 && inventory <= 5) {
      return (
        <div className="text-sm text-nxl-gold/80 font-body">
          {translate("product", "lowStock", `Only ${inventory} left in stock`)}
        </div>
      )
    }

    return null
  }

  // Determine product type for size guide
  const getProductType = () => {
    const productTitle = product.title?.toLowerCase() || ""
    const productType = product.type?.value?.toLowerCase() || ""

    if (productTitle.includes("hoodie") || productTitle.includes("sweatshirt") ||
      productType.includes("hoodie") || productType.includes("sweatshirt")) {
      return "hoodie"
    }
    return "apparel"
  }

  return (
    <>
      <div className="flex flex-col gap-y-8" ref={actionsRef}>
        {/* Enhanced Product Options */}
        {(product.variants?.length ?? 0) > 1 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="text-sm font-button uppercase tracking-wider text-nxl-gold border-b border-nxl-gold/20 pb-2">
                {translate("product", "selectOptions", "Select Options")}
              </div>
              <SizeGuide productType={getProductType()} />
            </div>
            {(product.options || []).map((option) => (
              <div key={option.id} className="space-y-2">
                <OptionSelect
                  option={option}
                  current={options[option.id]}
                  updateOption={setOptionValue}
                  title={option.title ?? ""}
                  data-testid="product-options"
                  disabled={!!disabled || isAdding}
                />
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Price Section with Luxury Styling */}
        <div className="bg-gradient-to-r from-nxl-navy/30 via-nxl-navy/20 to-transparent border border-nxl-gold/20 rounded-xl p-6 backdrop-blur-sm">
          <div className="space-y-3">
            <ProductPrice product={product} variant={selectedVariant} />
            {getInventoryStatus()}

            {/* Trust Indicators */}
            <div className="flex items-center gap-2 pt-2">
              <svg className="w-4 h-4 text-nxl-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-body text-nxl-ivory/70 uppercase tracking-wider">Authentic • Premium Quality</span>
            </div>
          </div>
        </div>

        {/* Enhanced Add to Cart Section */}
        <div className="space-y-4">
          <Button
            onClick={handleAddToCart}
            disabled={
              !inStock ||
              !selectedVariant ||
              !!disabled ||
              isAdding ||
              !isValidVariant ||
              addedToCart
            }
            variant="primary"
            className={`nxl-btn-primary w-full h-14 transition-all duration-300 text-lg font-bold ${addedToCart
              ? 'bg-nxl-green text-nxl-ivory border-nxl-green transform scale-105'
              : 'shimmer hover:shadow-luxury'
              }`}
            isLoading={isAdding}
            data-testid="add-product-button"
          >
            {getButtonText()}
          </Button>

          {/* Enhanced Action Buttons Grid */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleWishlistToggle}
              variant="secondary"
              className={`h-12 text-sm transition-all duration-300 ${isWishlisted
                ? 'bg-nxl-gold text-nxl-black border-nxl-gold'
                : 'nxl-btn-secondary hover:shadow-md'
                }`}
              disabled={!selectedVariant}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{isWishlisted ? translate("product", "wishlisted", "Saved") : translate("product", "addToWishlist", "Save")}</span>
              </div>
            </Button>

            <Button
              onClick={handleShare}
              variant="secondary"
              className="nxl-btn-secondary h-12 text-sm hover:shadow-md transition-all duration-300"
              disabled={!selectedVariant}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span>{translate("product", "shareProduct", "Share")}</span>
              </div>
            </Button>
          </div>
        </div>

        {/* Enhanced Product Features with Visual Improvements */}
        <div className="space-y-4 pt-6 border-t border-nxl-gold/10">
          <h4 className="text-sm font-button uppercase tracking-wider text-nxl-gold mb-4">{translate("product", "premiumBenefits", "Premium Benefits")}</h4>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-nxl-navy/10 border border-nxl-gold/10 rounded-lg hover:bg-nxl-navy/20 transition-colors">
              <div className="w-8 h-8 bg-nxl-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-nxl-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="font-body text-nxl-ivory/90 text-sm">
                {translate("product", "freeShipping", "Free shipping on orders over $100")}
              </span>
            </div>

            <div className="flex items-center gap-4 p-3 bg-nxl-navy/10 border border-nxl-gold/10 rounded-lg hover:bg-nxl-navy/20 transition-colors">
              <div className="w-8 h-8 bg-nxl-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-nxl-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="font-body text-nxl-ivory/90 text-sm">
                {translate("product", "qualityGuarantee", "Premium quality guarantee")}
              </span>
            </div>

            <div className="flex items-center gap-4 p-3 bg-nxl-navy/10 border border-nxl-gold/10 rounded-lg hover:bg-nxl-navy/20 transition-colors">
              <div className="w-8 h-8 bg-nxl-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-nxl-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <span className="font-body text-nxl-ivory/90 text-sm">
                {translate("product", "easyReturns", "30-day easy returns")}
              </span>
            </div>
          </div>

          {/* Customer Support CTA */}
          <div className="mt-6 p-4 bg-gradient-to-r from-nxl-gold/10 to-transparent border border-nxl-gold/20 rounded-lg">
            <h5 className="text-sm font-button uppercase tracking-wider text-nxl-gold mb-2">{translate("product", "needHelp", "Need Help?")}</h5>
            <p className="text-xs text-nxl-ivory/80 font-body mb-3">{translate("product", "expertHelp", "Need expert help with sizing, care, or product questions?")}</p>
            <button className="text-xs font-button uppercase tracking-wider text-nxl-gold hover:text-nxl-gold-light transition-colors underline underline-offset-2">
              {translate("product", "contactExperts", "Contact Our Experts")}
            </button>
          </div>
        </div>

        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>

      {/* Cart Notification */}
      <CartNotification
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
        product={product}
        variant={selectedVariant}
        onViewCart={() => { }} // Disabled - mini cart drawer is disabled
        onContinueShopping={() => setShowNotification(false)}
      />

      {/* Mini Cart Drawer */}
      <MiniCartDrawer
        isOpen={showMiniCart}
        onClose={() => setShowMiniCart(false)}
        cart={cart}
        countryCode={countryCode}
      />
    </>
  )
}
