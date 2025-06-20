import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getTranslatedProduct, getTranslatedCollection, StoreProductWithTranslations } from "@lib/util/translations"
import { Dictionary } from "@lib/i18n/use-dictionary"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
  locale?: string
  dictionary?: Dictionary
}

const ProductInfo = ({ product, locale, dictionary }: ProductInfoProps) => {
  // Get translated product data with fallback handling
  const translatedProduct = locale && product
    ? getTranslatedProduct(product as StoreProductWithTranslations, locale)
    : product

  const translatedCollection = locale && product.collection
    ? getTranslatedCollection(product.collection, locale)
    : product.collection

  return (
    <div id="product-info" className="w-full">
      <div className="flex flex-col gap-y-6">
        {/* Collection Link with NXL Styling */}
        {translatedCollection && product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="group inline-flex items-center gap-2 text-sm font-button uppercase tracking-wider text-nxl-gold hover:text-nxl-gold-light transition-colors duration-300"
          >
            <span className="w-8 h-px bg-nxl-gold group-hover:bg-nxl-gold-light transition-colors duration-300"></span>
            {translatedCollection.title}
          </LocalizedClientLink>
        )}

        {/* Product Title with NXL Display Typography */}
        <div className="space-y-2">
          <Heading
            level="h1"
            className="nxl-heading text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-nxl-ivory leading-tight"
            data-testid="product-title"
          >
            {translatedProduct.title}
          </Heading>

          {/* Subtitle if available */}
          {translatedProduct.subtitle && (
            <Text className="text-lg font-body text-nxl-ivory/80 italic">
              {translatedProduct.subtitle}
            </Text>
          )}
        </div>

        {/* Product Description with Enhanced Typography */}
        {translatedProduct.description && (
          <div className="prose prose-invert max-w-none">
            <Text
              className="nxl-body text-base font-body text-nxl-ivory/90 leading-relaxed whitespace-pre-line"
              data-testid="product-description"
            >
              {translatedProduct.description}
            </Text>
          </div>
        )}

        {/* Product Tags/Features */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-nxl-gold/20">
            {product.tags.slice(0, 5).map((tag) => (
              <span
                key={tag.id}
                className="px-3 py-1 text-xs font-button uppercase tracking-wider bg-nxl-navy/40 text-nxl-gold border border-nxl-gold/30 rounded-sm"
              >
                {tag.value}
              </span>
            ))}
          </div>
        )}

        {/* Product Metadata */}
        <div className="space-y-2 pt-4 border-t border-nxl-gold/10">
          {product.material && (
            <div className="flex items-center justify-between text-sm">
              <span className="font-button uppercase tracking-wide text-nxl-ivory/60">{dictionary?.product?.material || 'Material'}</span>
              <span className="font-body text-nxl-ivory">{product.material}</span>
            </div>
          )}

          {product.weight && (
            <div className="flex items-center justify-between text-sm">
              <span className="font-button uppercase tracking-wide text-nxl-ivory/60">{dictionary?.product?.weight || 'Weight'}</span>
              <span className="font-body text-nxl-ivory">{product.weight}g</span>
            </div>
          )}

          {product.origin_country && (
            <div className="flex items-center justify-between text-sm">
              <span className="font-button uppercase tracking-wide text-nxl-ivory/60">{dictionary?.product?.origin || 'Origin'}</span>
              <span className="font-body text-nxl-ivory">{product.origin_country}</span>
            </div>
          )}
        </div>

        {/* SKU Information */}
        {product.variants && product.variants.length > 0 && (
          <div className="pt-2">
            <span className="text-xs font-mono text-nxl-ivory/40 uppercase tracking-wider">
              {dictionary?.product?.sku || 'SKU'}: {product.variants[0].sku || 'N/A'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductInfo
