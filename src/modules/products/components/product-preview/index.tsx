import { Text } from "@medusajs/ui"
import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import { getTranslatedProduct, StoreProductWithTranslations } from "@lib/util/translations"

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

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div data-testid="product-wrapper" className="transition-all duration-300">
        <div className="relative overflow-hidden">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
          />
          {/* Gold corner accent on hover */}
          <div className="absolute top-0 right-0 w-0 h-0 border-t-[50px] border-r-[50px] border-t-transparent border-r-nxl-gold/0 group-hover:border-r-nxl-gold/30 transition-all duration-500"></div>
        </div>
        
        <div className="mt-6 space-y-2 px-1">
          <div className="flex justify-between items-baseline">
            <Text 
              className="font-serif text-nxl-gold font-medium group-hover:text-nxl-gold/80 transition-colors duration-300" 
              data-testid="product-title"
            >
              {translatedProduct.title}
            </Text>
            <div className="flex items-center">
              {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
            </div>
          </div>
          
          {/* Product type/category displayed as subtle text */}
          <Text className="font-body text-sm text-nxl-ivory/90">
            {product.type?.value || "Golf Apparel"}
          </Text>
        </div>
        
        {/* Underline animation on hover */}
        <div className="h-px w-0 bg-nxl-gold mt-3 group-hover:w-full transition-all duration-500 ease-in-out"></div>
      </div>
    </LocalizedClientLink>
  )
}
