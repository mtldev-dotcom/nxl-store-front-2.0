import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getDictionary } from "@lib/i18n/get-dictionary"
import { i18nConfig, Locale } from "@lib/i18n/config"
import { HttpTypes } from "@medusajs/types"
import Product from "../product-preview"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
  locale?: string
}

export default async function RelatedProducts({
  product,
  countryCode,
  locale = "en",
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  // Validate locale and get dictionary
  const validLocale = i18nConfig.locales.includes(locale as Locale) 
    ? (locale as Locale) 
    : i18nConfig.defaultLocale
  
  const dictionary = await getDictionary(validLocale)

  // Enhanced related products logic - simplified for TypeScript compatibility
  const queryParams: any = {
    limit: 8, // Limit to 8 products for better UX
  }
  
  if (region?.id) {
    queryParams.region_id = region.id
  }
  
  // Fallback to getting products from same collection or general products
  if (product.collection_id) {
    queryParams.collection_id = [product.collection_id]
  }

  const products = await listProducts({
    queryParams,
    countryCode,
    locale: validLocale,
  }).then(({ response }) => {
    return response.products.filter(
      (responseProduct) => responseProduct.id !== product.id
    )
  })

  if (!products.length) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="nxl-heading text-2xl md:text-3xl font-serif text-nxl-ivory mb-4">
            {dictionary.product?.relatedProducts || "Related Products"}
          </h2>
          <p className="nxl-body text-base text-nxl-ivory/70 max-w-md mx-auto">
            {dictionary.product?.noRelatedProducts || "No related products found at this time."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16">
      {/* Enhanced Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-4 mb-6">
          <div className="w-16 h-px bg-nxl-gold"></div>
          <span className="text-sm font-button uppercase tracking-wider text-nxl-gold">
            {dictionary.product?.relatedProducts || "Related Products"}
          </span>
          <div className="w-16 h-px bg-nxl-gold"></div>
        </div>
        
        <h2 className="nxl-heading text-2xl md:text-3xl lg:text-4xl font-serif text-nxl-ivory mb-4">
          {dictionary.product?.relatedProductsTitle || "You Might Also Like"}
        </h2>
        
        <p className="nxl-body text-base md:text-lg text-nxl-ivory/80 max-w-2xl mx-auto leading-relaxed">
          {dictionary.product?.relatedProductsDesc || "Discover more premium pieces from our collection that complement your style."}
        </p>
      </div>

      {/* Enhanced Products Grid */}
      <div className="relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-nxl-navy/10 to-transparent rounded-2xl"></div>
        
        <div className="relative p-6 md:p-8">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {products.slice(0, 8).map((relatedProduct, index) => (
              <li 
                key={relatedProduct.id}
                className="group relative"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="bg-nxl-black/40 backdrop-blur-sm border border-nxl-gold/20 rounded-lg p-4 h-full transition-all duration-500 hover:border-nxl-gold/60 hover:bg-nxl-black/60 hover:shadow-luxury">
                  <Product 
                    region={region} 
                    product={relatedProduct}
                    locale={validLocale}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* View More CTA */}
      {products.length >= 8 && (
        <div className="text-center mt-12">
          <a 
            href={`/${countryCode}/${validLocale}/store`}
            className="inline-flex items-center gap-3 nxl-btn-secondary px-8 py-3 transition-all duration-300 group"
          >
            <span>{dictionary.store?.viewAllProducts || "View All Products"}</span>
            <svg 
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      )}
    </div>
  )
}
