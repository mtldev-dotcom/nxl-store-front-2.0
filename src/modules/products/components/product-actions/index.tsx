"use client"

import { addToCart, retrieveCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import CartNotification from "@modules/common/components/cart-notification"
import MiniCartDrawer from "@modules/common/components/mini-cart-drawer"
import OptionSelect from "@modules/products/components/product-actions/option-select"
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
  const [currentCart, setCurrentCart] = useState<HttpTypes.StoreCart | null>(null)
  const countryCode = useParams().countryCode as string
  const { translate } = useTranslation()

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
      
      // Fetch updated cart data
      const updatedCart = await retrieveCart()
      setCurrentCart(updatedCart)
      
      setAddedToCart(true)
      setShowNotification(true)
      
      // Auto-show mini cart after notification
      setTimeout(() => {
        setShowMiniCart(true)
      }, 2000)
      
      // Reset added state after animation
      setTimeout(() => setAddedToCart(false), 3000)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsAdding(false)
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

  return (
    <>
      <div className="flex flex-col gap-y-6" ref={actionsRef}>
        {/* Product Options */}
        {(product.variants?.length ?? 0) > 1 && (
          <div className="space-y-4">
            <div className="text-sm font-button uppercase tracking-wider text-nxl-gold border-b border-nxl-gold/20 pb-2">
              {translate("product", "selectOptions", "Select Options")}
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

        {/* Price Section */}
        <div className="bg-nxl-navy/20 border border-nxl-gold/10 rounded-lg p-4">
          <ProductPrice product={product} variant={selectedVariant} />
          {getInventoryStatus()}
        </div>

        {/* Add to Cart Button */}
        <div className="space-y-3">
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
            className={`nxl-btn-primary w-full h-12 transition-all duration-300 ${
              addedToCart 
                ? 'bg-nxl-green text-nxl-ivory border-nxl-green' 
                : 'shimmer'
            }`}
            isLoading={isAdding}
            data-testid="add-product-button"
          >
            {getButtonText()}
          </Button>

          {/* Additional Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              className="nxl-btn-secondary h-10 text-sm"
              disabled={!selectedVariant}
            >
              {translate("product", "addToWishlist", "Add to Wishlist")}
            </Button>
            
            <Button
              variant="secondary"
              className="nxl-btn-secondary h-10 text-sm"
              disabled={!selectedVariant}
            >
              {translate("product", "shareProduct", "Share")}
            </Button>
          </div>
        </div>

        {/* Product Features */}
        <div className="space-y-3 pt-4 border-t border-nxl-gold/10">
          <div className="flex items-center gap-3 text-sm">
            <svg className="w-5 h-5 text-nxl-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-body text-nxl-ivory/90">
              {translate("product", "freeShipping", "Free shipping on orders over $100")}
            </span>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <svg className="w-5 h-5 text-nxl-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-body text-nxl-ivory/90">
              {translate("product", "qualityGuarantee", "Premium quality guarantee")}
            </span>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <svg className="w-5 h-5 text-nxl-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="font-body text-nxl-ivory/90">
              {translate("product", "easyReturns", "30-day easy returns")}
            </span>
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
        onViewCart={() => setShowMiniCart(true)}
        onContinueShopping={() => setShowNotification(false)}
      />

      {/* Mini Cart Drawer */}
      <MiniCartDrawer
        isOpen={showMiniCart}
        onClose={() => setShowMiniCart(false)}
        cart={currentCart}
        countryCode={countryCode}
      />
    </>
  )
}
