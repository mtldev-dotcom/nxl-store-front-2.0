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

  // Calculate discount percentage if on sale
  const discountPercentage = cheapestPrice && cheapestPrice.price_type === "sale" ? 
    parseInt(cheapestPrice.percentage_diff) : 0

  const isOnSale = cheapestPrice?.price_type === "sale"

  return (
    <article 
      className="group relative bg-nxl-black/40 backdrop-blur-sm border border-nxl-gold/10 rounded-lg overflow-hidden hover:border-nxl-gold/30 transition-all duration-500 hover:shadow-luxury"
      data-testid="product-wrapper"
    >
      {/* Product Image Container */}
      <div className="relative overflow-hidden">
        <LocalizedClientLink href={`/products/${product.handle}`} className="block">
          <Suspense fallback={<div className="aspect-[3/4] bg-nxl-navy/20 animate-pulse" />}>
            <Thumbnail
              thumbnail={product.thumbnail}
              images={product.images}
              size="full"
              isFeatured={isFeatured}
              className="group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </Suspense>
        </LocalizedClientLink>

        {/* Sale Badge */}
        {isOnSale && discountPercentage > 0 && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-nxl-gold text-nxl-black px-2 py-1 text-xs font-button uppercase tracking-wider rounded-sm">
              -{discountPercentage}%
            </span>
          </div>
        )}

        {/* New Badge */}
        {!isOnSale && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-nxl-navy/80 text-nxl-ivory px-2 py-1 text-xs font-button uppercase tracking-wider rounded-sm border border-nxl-gold/20">
              {locale === 'fr' ? 'Nouveau' : 'New'}
            </span>
          </div>
        )}

        {/* Luxury Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-nxl-gold/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Product Category */}
        {product.type?.value && (
          <Text className="text-xs uppercase tracking-wider text-nxl-gold/60 font-button">
            {product.type.value}
          </Text>
        )}

        {/* Product Title */}
        <LocalizedClientLink href={`/products/${product.handle}`}>
          <h3 
            className="text-nxl-ivory font-sans text-lg font-medium group-hover:text-nxl-gold transition-colors duration-300 line-clamp-2"
            data-testid="product-title"
          >
            {translatedProduct.title}
          </h3>
        </LocalizedClientLink>

        {/* Product Description (truncated) */}
        {/* {translatedProduct.description && (
          <Text className="text-nxl-ivory/80 text-sm font-body line-clamp-2 leading-relaxed">
            {translatedProduct.description}
          </Text>
        )} */}

        {/* Pricing */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            {cheapestPrice && (
              <PreviewPrice price={cheapestPrice} />
            )}
        
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-nxl-green rounded-full" />
            <Text className="text-xs text-nxl-gold font-body">
              {locale === 'fr' ? 'En stock' : 'In Stock'}
            </Text>
          </div>
        </div>

        {/* Underline Animation */}
        <div className="h-px w-0 bg-gradient-to-r from-nxl-gold to-nxl-gold/50 group-hover:w-full transition-all duration-500 ease-out" />
      </div>

      {/* Enhanced Hover Effects */}
      <div className="absolute inset-0 bg-nxl-gold/0 group-hover:bg-nxl-gold/5 transition-colors duration-300 pointer-events-none" />
      
      {/* Corner Accent */}
      <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[40px] border-t-transparent border-r-nxl-gold/0 group-hover:border-r-nxl-gold/20 transition-all duration-500" />
    </article>
  )
}
