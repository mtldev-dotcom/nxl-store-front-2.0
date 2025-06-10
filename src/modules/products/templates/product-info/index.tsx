import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getTranslatedProduct, getTranslatedCollection, StoreProductWithTranslations } from "@lib/util/translations"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
  locale?: string
}

const ProductInfo = ({ product, locale }: ProductInfoProps) => {
  // Get translated product data (optional, falls back to original if no translations)
  const translatedProduct = locale && product ? getTranslatedProduct(product as StoreProductWithTranslations, locale) : product
  const translatedCollection = locale && product.collection ? getTranslatedCollection(product.collection, locale) : product.collection
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
        {translatedCollection && product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-medium text-nxl-gold hover:text-nxl-gold/80"
          >
            {translatedCollection.title}
          </LocalizedClientLink>
        )}
        <Heading
          level="h2"
          className="text-3xl leading-10 text-nxl-gold"
          data-testid="product-title"
        >
          {translatedProduct.title}
        </Heading>

<Text
  className="text-medium text-nxl-gold whitespace-pre-line"
  data-testid="product-description"
>
  {translatedProduct.description}
</Text>
      </div>
    </div>
  )
}

export default ProductInfo
