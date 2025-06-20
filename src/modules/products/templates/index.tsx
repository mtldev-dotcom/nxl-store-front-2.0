import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import ProductActionsWrapper from "./product-actions-wrapper"
import { HttpTypes } from "@medusajs/types"
import { getDictionary } from "@lib/i18n/get-dictionary"
import { Locale } from "@lib/i18n/config"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  locale?: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = async ({
  product,
  region,
  countryCode,
  locale = "en",
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  // Get translations dictionary for the current locale
  const dictionary = await getDictionary(locale as Locale)

  return (
    <>
      {/* Enhanced Product Detail Layout with Luxury Aesthetic */}
      <div
        className="relative bg-gradient-to-br from-nxl-black via-nxl-black to-nxl-navy/20 min-h-screen"
        data-testid="product-container"
      >
        {/* Luxury Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,182,96,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_49%,rgba(212,182,96,0.05)_50%,transparent_51%)] bg-[length:20px_20px]"></div>
        </div>

        <div className="relative content-container">
          {/* Enhanced Mobile Layout: Optimized for Touch */}
          <div className="flex flex-col lg:hidden">
            {/* Mobile Product Header with Breadcrumb */}
            <div className="px-4 pt-safe-area-top py-6 bg-gradient-to-r from-nxl-black/95 to-nxl-navy/95 backdrop-blur-md border-b border-nxl-gold/10">
              {/* Breadcrumb */}
              <nav className="mb-4" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-sm">
                  <li><a href={`/${countryCode}/${locale}`} className="text-nxl-ivory/70 hover:text-nxl-gold transition-colors">{dictionary.navigation.home}</a></li>
                  <span className="text-nxl-ivory/40">/</span>
                  {product.collection && (
                    <>
                      <li><a href={`/${countryCode}/${locale}/collections/${product.collection.handle}`} className="text-nxl-ivory/70 hover:text-nxl-gold transition-colors">{product.collection.title}</a></li>
                      <span className="text-nxl-ivory/40">/</span>
                    </>
                  )}
                  <li className="text-nxl-gold font-medium truncate">{product.title}</li>
                </ol>
              </nav>

              <ProductInfo product={product} locale={locale} dictionary={dictionary} />
            </div>

            {/* Mobile Image Gallery with Enhanced Gestures */}
            <div className="w-full bg-nxl-black relative">
              <ImageGallery images={product?.images || []} />

              {/* Mobile Floating Trust Badge */}
              <div className="absolute top-4 left-4 bg-nxl-black/80 backdrop-blur-sm border border-nxl-gold/30 rounded-lg px-3 py-1">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-nxl-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-button uppercase tracking-wider text-nxl-gold">{dictionary.product.qualityGuarantee}</span>
                </div>
              </div>
            </div>

            {/* Mobile Actions - Enhanced Sticky Bottom */}
            <div className="bg-gradient-to-t from-nxl-black via-nxl-black/95 to-transparent px-4 py-6 sticky bottom-0 z-20 backdrop-blur-lg border-t border-nxl-gold/20">
              <Suspense
                fallback={
                  <ProductActions
                    disabled={true}
                    product={product}
                    region={region}
                  />
                }
              >
                <ProductActionsWrapper id={product.id} region={region} />
              </Suspense>
            </div>

            {/* Mobile Product Details Tabs */}
            <div className="px-4 py-8 bg-gradient-to-b from-transparent to-nxl-navy/10">
              <ProductTabs product={product} />
            </div>
          </div>

          {/* Enhanced Desktop Layout: Luxury Three-Column Design */}
          <div className="hidden lg:flex lg:gap-12 lg:py-20 lg:min-h-screen">
            {/* Left Column: Product Information - Now Wider */}
            <div className="lg:w-1/3 xl:w-2/5">
              <div className="sticky top-24 space-y-8">
                {/* Enhanced Product Info Card */}
                <div className="bg-gradient-to-br from-nxl-black via-nxl-black to-nxl-navy/20 border border-nxl-gold/20 rounded-2xl p-8 shadow-luxury backdrop-blur-sm">
                  <ProductInfo product={product} locale={locale} dictionary={dictionary} />
                </div>

                {/* Enhanced Product Details Card */}
                <div className="bg-gradient-to-br from-nxl-navy/30 via-nxl-navy/20 to-transparent border border-nxl-gold/10 rounded-2xl p-8 backdrop-blur-sm">
                  <ProductTabs product={product} />
                </div>

                {/* Trust Signals Card */}
                <div className="bg-gradient-to-r from-nxl-black/50 to-nxl-navy/30 border border-nxl-gold/10 rounded-2xl p-6 backdrop-blur-sm">
                  <h3 className="text-lg font-serif text-nxl-gold mb-4 text-center">{dictionary.product.whyChooseNxl}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <svg className="w-5 h-5 text-nxl-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-body text-nxl-ivory/90">{dictionary.product.canadianCraftsmanship}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <svg className="w-5 h-5 text-nxl-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-body text-nxl-ivory/90">{dictionary.product.fastShippingCanada}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <svg className="w-5 h-5 text-nxl-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="font-body text-nxl-ivory/90">{dictionary.product.lifetimeSatisfaction}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Column: Image Gallery - Enhanced */}
            <div className="lg:w-1/2 xl:w-2/5 lg:flex lg:justify-center">
              <div className="w-full max-w-2xl">
                <div className="sticky top-24">
                  <ImageGallery images={product?.images || []} />
                </div>
              </div>
            </div>

            {/* Right Column: Actions - Streamlined */}
            <div className="lg:w-1/3 xl:w-1/5">
              <div className="sticky top-24 space-y-6">
                {/* Enhanced CTA Card */}
                <div className="bg-gradient-to-br from-nxl-black via-nxl-black to-nxl-navy/20 border border-nxl-gold/20 rounded-2xl p-6 shadow-luxury backdrop-blur-sm">
                  <ProductOnboardingCta />
                </div>

                {/* Enhanced Actions Card */}
                <div className="bg-gradient-to-br from-nxl-black via-nxl-black to-nxl-navy/20 border border-nxl-gold/20 rounded-2xl p-6 shadow-luxury backdrop-blur-sm">
                  <Suspense
                    fallback={
                      <ProductActions
                        disabled={true}
                        product={product}
                        region={region}
                      />
                    }
                  >
                    <ProductActionsWrapper id={product.id} region={region} />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Related Products Section */}
      <div
        className="relative bg-gradient-to-b from-nxl-navy/10 via-nxl-navy/5 to-nxl-black py-20 lg:py-32"
        data-testid="related-products-container"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(212,182,96,0.1),transparent_50%)]"></div>
        </div>

        <div className="relative">
          <Suspense fallback={<SkeletonRelatedProducts />}>
            <RelatedProducts product={product} countryCode={countryCode} locale={locale} />
          </Suspense>
        </div>
      </div>
    </>
  )
}

export default ProductTemplate
