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

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  locale?: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  locale,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <>
      {/* Mobile-first responsive product layout */}
      <div
        className="content-container relative bg-nxl-black min-h-screen"
        data-testid="product-container"
      >
        {/* Mobile Layout: Stack vertically */}
        <div className="flex flex-col lg:hidden">
          {/* Mobile Product Info */}
          <div className="px-4 py-6 bg-nxl-black border-b border-nxl-gold/20">
            <ProductInfo product={product} locale={locale} />
          </div>
          
          {/* Mobile Image Gallery */}
          <div className="w-full bg-nxl-black">
            <ImageGallery images={product?.images || []} />
          </div>
          
          {/* Mobile Actions */}
          <div className="px-4 py-6 bg-nxl-black border-t border-nxl-gold/20 sticky bottom-0 z-10">
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
          
          {/* Mobile Product Tabs */}
          <div className="px-4 py-6 bg-nxl-navy/20">
            <ProductTabs product={product} />
          </div>
        </div>

        {/* Desktop Layout: Three-column layout */}
        <div className="hidden lg:flex lg:gap-8 lg:py-16 lg:min-h-screen">
          {/* Left Column: Product Info */}
          <div className="lg:w-1/4 lg:sticky lg:top-24 lg:self-start">
            <div className="bg-nxl-black border border-nxl-gold/20 rounded-lg p-6 mb-6">
              <ProductInfo product={product} locale={locale} />
            </div>
            <div className="bg-nxl-navy/20 border border-nxl-gold/10 rounded-lg p-6">
              <ProductTabs product={product} />
            </div>
          </div>
          
          {/* Center Column: Image Gallery */}
          <div className="lg:w-1/2 lg:flex lg:justify-center">
            <div className="w-full max-w-2xl">
              <ImageGallery images={product?.images || []} />
            </div>
          </div>
          
          {/* Right Column: Actions */}
          <div className="lg:w-1/4 lg:sticky lg:top-24 lg:self-start">
            <div className="bg-nxl-black border border-nxl-gold/20 rounded-lg p-6 mb-6">
              <ProductOnboardingCta />
            </div>
            <div className="bg-nxl-black border border-nxl-gold/20 rounded-lg p-6">
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

      {/* Related Products Section */}
      <div
        className="content-container py-16 lg:py-24 bg-nxl-navy/10"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} locale={locale} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
