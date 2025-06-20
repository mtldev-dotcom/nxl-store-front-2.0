import { Text } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import { getTranslatedProduct, StoreProductWithTranslations } from "@lib/util/translations"
import { Suspense } from "react"
import Image from "next/image"

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

  // Calculate discount percentage if on sale
  const discountPercentage = cheapestPrice && cheapestPrice.price_type === "sale" ?
    parseInt(cheapestPrice.percentage_diff) : 0

  const isOnSale = cheapestPrice?.price_type === "sale"
  const isNewProduct = new Date(product.created_at || '').getTime() > Date.now() - (30 * 24 * 60 * 60 * 1000) // 30 days

  return (
    <article
      className="group relative bg-nxl-black/40 backdrop-blur-sm border border-nxl-gold/10 rounded-lg overflow-hidden hover:border-nxl-gold/30 transition-all duration-500 hover:shadow-luxury active:scale-98"
      data-testid="product-wrapper"
    >
      {/* Product Image Container with enhanced mobile optimization */}
      <div className="relative overflow-hidden aspect-[3/4]">
        <LocalizedClientLink
          href={`/products/${product.handle}`}
          className="block w-full h-full"
          aria-label={`View ${translatedProduct.title} product details`}
        >
          <Suspense fallback={
            <div className="w-full h-full bg-nxl-navy/20 animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-nxl-gold border-t-transparent rounded-full animate-spin" />
            </div>
          }>
            <Thumbnail
              thumbnail={product.thumbnail}
              images={product.images}
              size="full"
              isFeatured={isFeatured}
              className="group-hover:scale-105 group-active:scale-102 transition-transform duration-700 ease-out w-full h-full object-cover"
            />
          </Suspense>
        </LocalizedClientLink>

        {/* Enhanced Badge System */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {/* Sale Badge - Priority */}
          {isOnSale && discountPercentage > 0 && (
            <span className="bg-nxl-gold text-nxl-black px-3 py-1 text-xs font-button uppercase tracking-wider rounded-full shadow-lg border border-nxl-black/20">
              -{discountPercentage}%
            </span>
          )}

          {/* New Badge - Secondary */}
          {!isOnSale && isNewProduct && (
            <span className="bg-nxl-navy/90 text-nxl-ivory px-3 py-1 text-xs font-button uppercase tracking-wider rounded-full border border-nxl-gold/30 backdrop-blur-sm">
              {locale === 'fr' ? 'Nouveau' : 'New'}
            </span>
          )}
        </div>

        {/* Quick action buttons for mobile */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Wishlist/Favorite button placeholder */}
          <button
            className="w-10 h-10 bg-nxl-black/80 backdrop-blur-sm border border-nxl-gold/30 rounded-full flex items-center justify-center text-nxl-ivory hover:text-nxl-gold transition-colors duration-200 mobile-touch-target"
            aria-label={`Add ${translatedProduct.title} to wishlist`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {/* Enhanced Luxury Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-nxl-gold/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

        {/* Mobile-specific overlay for better tap feedback */}
        <div className="absolute inset-0 bg-nxl-gold/0 group-active:bg-nxl-gold/5 transition-colors duration-150 pointer-events-none lg:hidden" />
      </div>

      {/* Enhanced Product Info with better mobile spacing */}
      <div className="p-4 sm:p-5 space-y-3">
        {/* Product Category */}
        {product.type?.value && (
          <Text className="text-xs uppercase tracking-wider text-nxl-gold/60 font-button">
            {product.type.value}
          </Text>
        )}

        {/* Product Title with improved mobile typography */}
        <LocalizedClientLink href={`/products/${product.handle}`}>
          <h3
            className="text-nxl-ivory font-sans text-base sm:text-lg font-medium group-hover:text-nxl-gold transition-colors duration-300 line-clamp-2 leading-tight"
            data-testid="product-title"
          >
            {translatedProduct.title}
          </h3>
        </LocalizedClientLink>

        {/* Enhanced Pricing Section */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col gap-1">
            {cheapestPrice && (
              <PreviewPrice price={cheapestPrice} />
            )}

            {/* Enhanced currency display for international users */}
            {region && (
              <Text className="text-xs text-nxl-ivory/50 font-body">
                {locale === 'fr' ? 'Livraison' : 'Shipping'}: {region.name}
              </Text>
            )}
          </div>

          {/* Enhanced Stock Status */}
          <div className="flex items-center gap-1.5 text-right">
            <div className="w-2 h-2 bg-nxl-green rounded-full animate-pulse" />
            <Text className="text-xs text-nxl-green font-medium">
              {locale === 'fr' ? 'En stock' : 'In Stock'}
            </Text>
          </div>
        </div>

        {/* Enhanced Quick Add to Cart (Mobile-friendly) */}
        <div className="pt-3 border-t border-nxl-gold/10">
          <button
            className="w-full nxl-btn-secondary py-2 px-4 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label={`Quick add ${translatedProduct.title} to cart`}
          >
            {locale === 'fr' ? 'Ajouter au panier' : 'Add to Cart'}
          </button>
        </div>

        {/* Enhanced animated underline */}
        <div className="h-px w-0 bg-gradient-to-r from-nxl-gold to-nxl-gold/50 group-hover:w-full transition-all duration-500 ease-out" />
      </div>

      {/* Enhanced Hover Effects */}
      <div className="absolute inset-0 bg-nxl-gold/0 group-hover:bg-nxl-gold/5 transition-colors duration-300 pointer-events-none rounded-lg" />

      {/* Enhanced Corner Accent */}
      <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[40px] border-t-transparent border-r-nxl-gold/0 group-hover:border-r-nxl-gold/20 transition-all duration-500" />

      {/* Focus indicator for keyboard navigation */}
      <div className="absolute inset-0 rounded-lg ring-0 ring-nxl-gold ring-offset-2 ring-offset-nxl-black focus-within:ring-2 transition-all duration-200 pointer-events-none" />
    </article>
  )
}
