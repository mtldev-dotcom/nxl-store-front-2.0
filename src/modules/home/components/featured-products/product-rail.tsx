/**
 * ProductRail Component
 * ----------------------
 * Enhanced version with better performance, accessibility, and UX
 * 
 * Features:
 * - Internationalization support with French and English translations
 * - Collection title translation using Tolgee system
 * - Product data translation (titles, descriptions, variants)
 * - Optimized product fetching with collection-specific queries
 * - Enhanced hover animations and visual feedback
 * - Improved accessibility with proper ARIA labels
 * - Better loading states and error handling
 * - Responsive design with improved mobile experience
 */

import { Suspense } from "react"
import { HttpTypes } from "@medusajs/types"
import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { convertToLocale } from "@lib/util/money"
import { getDictionary } from "@lib/i18n/get-dictionary"
import { getTranslatedCollection, getTranslatedProduct, StoreProductWithTranslations } from "@lib/util/translations"
import { Locale } from "@lib/i18n/config"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import { formatPrice, formatPriceWithSmallCurrency } from "@lib/util/money"

type ProductRailProps = {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
  countryCode: string
  locale: Locale
}

// Loading skeleton component
const ProductCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="relative h-80 mb-4 bg-nxl-navy/30 rounded-lg"></div>
    <div className="space-y-2">
      <div className="h-4 bg-nxl-navy/30 rounded w-3/4"></div>
      <div className="h-3 bg-nxl-navy/30 rounded w-1/2"></div>
    </div>
  </div>
)

// Product Card Component with translations
const ProductCard = ({
  product,
  region,
  dictionary,
  locale
}: {
  product: any,
  region: HttpTypes.StoreRegion,
  dictionary: any,
  locale: Locale
}) => {
  // Get translated product data
  const translatedProduct = getTranslatedProduct(product as StoreProductWithTranslations, locale)

  const price = getProductPrice({ product: translatedProduct })

  if (!price) return null

  const hasDiscount = price.cheapestPrice?.calculated_price_number !== price.cheapestPrice?.original_price_number
  const discountPercentage = hasDiscount
    ? Math.round((1 - (price.cheapestPrice?.calculated_price_number || 0) / (price.cheapestPrice?.original_price_number || 1)) * 100)
    : 0

  return (
    <article className="group relative">
      <LocalizedClientLink
        href={`/products/${translatedProduct.handle}`}
        className="block"
        aria-label={dictionary?.product?.viewProductDetails?.replace('{title}', translatedProduct.title) || `View ${translatedProduct.title} details`}
      >
        {/* Sale badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 z-10 bg-status-error text-white px-2 py-1 text-xs font-button uppercase rounded-sm">
            {discountPercentage}{dictionary?.product?.salePercentage || '% Off'}
          </div>
        )}

        {/* Image container with enhanced hover effects */}
        <div className="relative h-80 mb-4 overflow-hidden rounded-lg bg-nxl-navy/10">
          {translatedProduct.thumbnail ? (
            <Image
              src={translatedProduct.thumbnail}
              alt={`${translatedProduct.title} - ${dictionary?.product?.premiumApparelAlt || 'Premium next level apparel'}`}
              fill
              className="object-cover object-center transition-all duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-nxl-navy/20">
              <svg className="w-16 h-16 text-nxl-gold/30" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          )}

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-nxl-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="space-y-2">
          {/* Product title */}
          <h4 className="font-serif text-nxl-ivory text-lg leading-tight group-hover:text-nxl-gold transition-colors duration-300">
            {translatedProduct.title}
          </h4>

          {/* Product subtitle if available */}
          {/* {translatedProduct.subtitle && (
            <p className="text-xs font-body text-nxl-ivory italic">
              {translatedProduct.subtitle}
            </p>
          )} */}

          {/* Product type/category */}
          {/* {translatedProduct.type?.value && (
            <p className="text-xs font-body text-nxl-ivory/90 uppercase tracking-wider">
              {translatedProduct.type.value}
            </p>
          )} */}

          {/* Price section */}
          <div className="flex items-baseline gap-2">
            <div className="inline-flex items-baseline gap-1">
              <span className="font-sans text-nxl-gold text-lg">
                {(() => {
                  const formatted = formatPriceWithSmallCurrency({
                    amount: price.cheapestPrice?.calculated_price_number || 0,
                    currency_code: region.currency_code,
                  })
                  return (
                    <>
                      <span>{formatted.price}</span>
                      <span className="text-xs text-nxl-ivory/60 ml-1">({formatted.currency})</span>
                    </>
                  )
                })()}
              </span>
            </div>

            {hasDiscount && (
              <div className="inline-flex items-baseline gap-1">
                <span className="line-through text-nxl-ivory/70 text-sm">
                  {(() => {
                    const formatted = formatPriceWithSmallCurrency({
                      amount: price.cheapestPrice?.original_price_number || 0,
                      currency_code: region.currency_code,
                    })
                    return (
                      <>
                        <span>{formatted.price}</span>
                        <span className="text-xs text-nxl-ivory/60 ml-1">({formatted.currency})</span>
                      </>
                    )
                  })()}
                </span>
              </div>
            )}
          </div>

          {/* Product description preview (first 80 characters) */}
          {/* {translatedProduct.description && (
            <p className="text-xs font-body text-nxl-ivory line-clamp-2 mt-2">
              {translatedProduct.description.length > 80 
                ? `${translatedProduct.description.substring(0, 80)}...` 
                : translatedProduct.description}
            </p>
          )} */}
        </div>

        {/* Hover indicator */}
        <div className="h-px w-0 bg-nxl-gold mt-3 group-hover:w-full transition-all duration-500 ease-in-out"></div>
      </LocalizedClientLink>
    </article>
  )
}

export default async function ProductRail({
  collection,
  region,
  countryCode,
  locale,
}: ProductRailProps) {
  // Get translations for the current locale
  const dictionary = await getDictionary(locale)

  // Get translated collection data with fallback mapping
  const translatedCollection = getTranslatedCollection(collection, locale)

  // Fallback translation mapping for common collection titles
  const getCollectionTitle = (title: string): string => {
    if (locale === 'fr') {
      const frenchTitles: Record<string, string> = {
        'OUR FAVORITES': 'NOS FAVORIS',
        'Our Favorites': 'Nos Favoris',
        'FAVORITES': 'FAVORIS',
        'Favorites': 'Favoris',
        'FEATURED': 'VEDETTE',
        'Featured': 'Vedette',
        'NEW ARRIVALS': 'NOUVEAUTÉS',
        'New Arrivals': 'Nouveautés'
      }
      return frenchTitles[title] || title
    }
    return title
  }

  // Use translated title with fallback
  const displayTitle = getCollectionTitle(translatedCollection.title)

  try {
    // Build translation fields for products based on locale
    const translationsField = locale ? `,+translations.${locale},+variants.translations.${locale},+options.translations.${locale},+options.values.translations.${locale}` : ""

    // Fetch products and filter by collection with translation support
    const response = await listProducts({
      countryCode,
      locale,
      queryParams: {
        limit: 50, // Fetch enough to filter by collection
        fields: `id,title,subtitle,description,handle,thumbnail,images,variants,type,collection_id${translationsField}`, // Include translation fields
      },
    })

    const allProducts = response?.response?.products || []
    const products = allProducts
      .filter(product => product.collection_id === collection.id)
      .slice(0, 4) // Only take first 4 products

    // If no products found, render nothing
    if (products.length === 0) {
      return null
    }

    return (
      <section className="space-y-6" aria-labelledby={`collection-${collection.id}`}>
        {/* Header with enhanced styling and translated collection title */}
        <header className="flex items-center justify-between border-b border-nxl-gold/20 pb-4">
          <h3
            id={`collection-${collection.id}`}
            className="font-display text-2xl md:text-3xl text-nxl-gold uppercase tracking-wider"
          >
            {displayTitle}
          </h3>

          <LocalizedClientLink
            href={`/collections/${collection.handle}`}
            className="group flex items-center gap-2 text-sm font-button uppercase text-nxl-ivory hover:text-nxl-gold transition-all duration-300"
            aria-label={dictionary?.product?.viewAllInCollection?.replace('{title}', displayTitle) || `View all products in ${displayTitle} collection`}
          >
            <span>{dictionary?.general?.viewCollection || 'View Collection'}</span>
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </LocalizedClientLink>
        </header>

        {/* Products grid with enhanced responsive design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <Suspense fallback={
            Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          }>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                region={region}
                dictionary={dictionary}
                locale={locale}
              />
            ))}
          </Suspense>
        </div>
      </section>
    )
  } catch (error) {
    console.error(`Error loading products for collection ${displayTitle}:`, error)
    return (
      <div className="text-center py-8">
        <p className="text-nxl-ivory/60 font-body">
          {dictionary?.product?.errorLoadingProducts || 'Unable to load products at this time. Please try again later.'}
        </p>
      </div>
    )
  }
}
