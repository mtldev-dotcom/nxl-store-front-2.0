import { Text } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import { getTranslatedProduct, StoreProductWithTranslations } from "@lib/util/translations"
import { Suspense } from "react"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
  locale,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
  locale?: string
}) {
  // Get translated product data (optional, falls back to original if no translations)
  const translatedProduct = locale ? getTranslatedProduct(product as StoreProductWithTranslations, locale) : product

  const { cheapestPrice } = getProductPrice({
    product,
  })

  // Enhanced stock calculations
  const totalStock = product.variants?.reduce((total, variant) =>
    total + (variant.inventory_quantity || 0), 0) || 0
  const hasStock = totalStock > 0
  const isLowStock = totalStock > 0 && totalStock <= 5
  const stockLevel = totalStock

  // Calculate discount percentage if on sale
  const discountPercentage = cheapestPrice && cheapestPrice.price_type === "sale" ?
    parseInt(cheapestPrice.percentage_diff) : 0

  const isOnSale = cheapestPrice?.price_type === "sale"
  const isNewProduct = new Date(product.created_at || '').getTime() > Date.now() - (30 * 24 * 60 * 60 * 1000) // 30 days

  // Enhanced stock status helper
  const getStockStatus = () => {
    if (!hasStock) return { color: 'text-red-600', bg: 'bg-red-500', label: locale === 'fr' ? 'Rupture' : 'Out of Stock' }
    if (isLowStock) return { color: 'text-orange-600', bg: 'bg-orange-500', label: locale === 'fr' ? 'Stock faible' : 'Low Stock' }
    return { color: 'text-green-600', bg: 'bg-green-500', label: locale === 'fr' ? 'En stock' : 'In Stock' }
  }

  const stockStatus = getStockStatus()

  return (
    <article
      className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-nxl-gold/50 transition-all duration-300 hover:shadow-luxury mobile-tap-feedback focus-within:ring-2 focus-within:ring-nxl-gold focus-within:ring-offset-2"
      data-testid="product-wrapper"
    >
      {/* Product Image Container with improved aspect ratio and loading */}
      <div className="relative overflow-hidden aspect-[4/5] bg-gray-50">
        <LocalizedClientLink
          href={`/products/${product.handle}`}
          className="block w-full h-full"
          aria-label={`View ${translatedProduct.title} product details`}
        >
          <Suspense fallback={
            <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-nxl-gold border-t-transparent rounded-full animate-spin" />
            </div>
          }>
            <Thumbnail
              thumbnail={product.thumbnail}
              images={product.images}
              size="full"
              isFeatured={isFeatured}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </Suspense>
        </LocalizedClientLink>

        {/* Enhanced Badge System with better positioning and contrast */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {/* Sale Badge - Highest priority */}
          {isOnSale && discountPercentage > 0 && (
            <span className="bg-red-500 text-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full shadow-lg">
              -{discountPercentage}% OFF
            </span>
          )}

          {/* New Badge - Secondary priority (only if not on sale) */}
          {!isOnSale && isNewProduct && (
            <span className="bg-nxl-gold text-nxl-black px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full shadow-lg">
              {locale === 'fr' ? 'Nouveau' : 'New'}
            </span>
          )}

          {/* Low Stock Warning Badge - Third priority */}
          {!isOnSale && !isNewProduct && isLowStock && (
            <span className="bg-orange-500 text-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full shadow-lg animate-pulse">
              {locale === 'fr' ? 'Stock Faible' : 'Low Stock'}
            </span>
          )}
        </div>

        {/* Enhanced Stock status overlay for out-of-stock items */}


        {/* Wishlist button - desktop hover, always visible on mobile */}
        <button
          className="absolute top-3 right-3 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100 md:opacity-100 shadow-lg"
          aria-label={`Add ${translatedProduct.title} to wishlist`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Quick view button - desktop only */}
        <button className="absolute bottom-3 right-3 z-10 bg-nxl-black text-white px-3 py-2 text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-nxl-gold hover:text-nxl-black hidden md:block">
          {locale === 'fr' ? 'Aperçu rapide' : 'Quick View'}
        </button>
      </div>

      {/* Enhanced Product Information with improved spacing and hierarchy */}
      <div className="p-4 space-y-3">
        {/* Brand/Category */}
        {product.type?.value && (
          <Text className="text-xs uppercase tracking-wider text-gray-500 font-medium">
            {product.type.value}
          </Text>
        )}

        {/* Product Title with better typography */}
        <LocalizedClientLink
          href={`/products/${product.handle}`}
          className="block"
        >
          <h3
            className="text-gray-900 font-medium text-base leading-tight line-clamp-2 group-hover:text-nxl-gold transition-colors duration-200 min-h-[2.5rem] flex items-start"
            data-testid="product-title"
          >
            {translatedProduct.title}
          </h3>
        </LocalizedClientLink>

        {/* Enhanced Rating Stars with better styling */}


        {/* Enhanced Pricing Section with improved layout */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {cheapestPrice && (
              <PreviewPrice price={cheapestPrice} />
            )}
          </div>

          {/* Enhanced Stock indicator with more details */}

        </div>

      </div>
    </article>
  )
}
