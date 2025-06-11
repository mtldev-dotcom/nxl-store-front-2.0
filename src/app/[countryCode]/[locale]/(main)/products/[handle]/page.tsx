/*****************************************************************************************
 * Product Page ([countryCode]/[locale]/(main)/products/[handle]/page.tsx)
 * ---------------------------------------------------------------------------------------
 * Purpose:
 *   • Render a single product page for a given product "handle" (slug) and country code.
 *   • Generate static paths and metadata so the page can be statically pre-rendered
 *     (or re-generated) by Next.js for better performance and SEO.
 *   • Implement internationalization with proper fallbacks and error handling
 *   • Optimize for mobile responsiveness and NXL brand compliance
 *
 * High-level flow:
 *   1. At build-time → generateStaticParams()    → Tell Next.js which routes to prebuild
 *   2. For each route  → generateMetadata()      → Produce <head> tags (OG + SEO + i18n)
 *   3. At runtime      → default export          → Fetch region & product, render page
 *****************************************************************************************/

import { Metadata } from "next"             // Type helper for meta generation
import { notFound } from "next/navigation"  // Utility to trigger 404 page

// Internal data-layer helpers -------------------------------------------------------------
import { listProducts, retrieveProduct } from "@lib/data/products"      // Fetch products from Medusa backend
import { getRegion, listRegions } from "@lib/data/regions" // Fetch region info

// Internationalization helpers ------------------------------------------------------------
import { getDictionary } from "@lib/i18n/get-dictionary"
import { i18nConfig, Locale } from "@lib/i18n/config"
import { getTranslatedProduct, StoreProductWithTranslations } from "@lib/util/translations"

// Presentation layer ---------------------------------------------------------------------
import ProductTemplate from "@modules/products/templates" // React component that shows product

/**
 * Route parameters automatically provided by Next.js App Router.
 *
 * NOTE: In an async server component/function, `props.params` is a Promise.
 * We reflect that here so TypeScript reminds us to await it.
 */
type Props = {
  params: Promise<{ countryCode: string; handle: string; locale: string }>
}

/* =============================================================================
 * 1) generateStaticParams
 * =============================================================================
 * Runs at build-time (and during ISR revalidation) to tell Next.js which
 * paths (countryCode + product handle) should be pre-rendered.
 * ---------------------------------------------------------------------------
 * Steps:
 *   a. Fetch all regions, flatten to ISO-2 country codes
 *   b. Fetch every product's handle (using "US" as default region just to list)
 *   c. Create the Cartesian product: every country × every handle
 *   d. Return as array of `{ countryCode, handle }`
 *   e. If anything fails → log and return [] so Next.js falls back to SSR.
 * ---------------------------------------------------------------------------
 */
export async function generateStaticParams() {
  try {
    // a. Collect country codes from regions (["US", "CA", ...])
    const countryCodes = await listRegions()
      .then((regions) =>
        regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
      )

    // Guard: no regions? nothing to pre-render
    if (!countryCodes) {
      return []
    }

    // b. Fetch all product handles (we only need the 'handle' field)
    const products = await listProducts({
      countryCode: "US", // Region chosen arbitrarily for listing
      queryParams: { fields: "handle" },
    }).then(({ response }) => response.products)

    // c. Build every combination of country × product
    return countryCodes
      .map((countryCode) =>
        products.map((product) => ({
          countryCode,
          handle: product.handle,
        }))
      )
      .flat()
      // d. Safety: filter out products without handle (shouldn't happen)
      .filter((param) => param.handle)
  } catch (error) {
    // e. Log error so it surfaces during build/deploy
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return [] // Fallback: Next.js will attempt on-demand ISR
  }
}

/* =============================================================================
 * 2) generateMetadata
 * =============================================================================
 * Generates SEO & OpenGraph metadata for each product page with i18n support.
 * Called by Next.js for every route produced by generateStaticParams (and
 * during runtime if page is rendered on demand).
 *
 * Enhanced with:
 * • Internationalization support
 * • Rich metadata for better SEO
 * • NXL brand compliance
 * • Proper fallback handling
 * ---------------------------------------------------------------------------
 */
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle, countryCode, locale } = params

  // --- Validate locale and region -------------------------------------------------------
  const validLocale = i18nConfig.locales.includes(locale as Locale) 
    ? (locale as Locale) 
    : i18nConfig.defaultLocale

  const region = await getRegion(countryCode)
  if (!region) {
    notFound()
  }

  // --- Fetch dictionary for metadata translations ----------------------------------------
  const dictionary = await getDictionary(validLocale)

  // --- Fetch product data with locale support -------------------------------------------
  const allProducts = await listProducts({
    countryCode: countryCode,
    locale: validLocale,
    queryParams: { limit: 100 },
  }).then(({ response }) => response.products)

  const product = allProducts.find(p => p.handle === handle)

  if (!product) {
    notFound()
  }

  // --- Get translated product data -------------------------------------------------------
  const translatedProduct = getTranslatedProduct(product as StoreProductWithTranslations, validLocale)
  
  // --- Build comprehensive metadata ------------------------------------------------------
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://nextxlevel.com'
  const productUrl = `${baseUrl}/${countryCode}/${validLocale}/products/${handle}`
  
  // Generate hreflang alternate URLs for all supported locales
  const alternateUrls = i18nConfig.locales.reduce((acc, lng) => {
    acc[lng] = `${baseUrl}/${countryCode}/${lng}/products/${handle}`
    return acc
  }, {} as Record<string, string>)

  return {
    title: `${translatedProduct.title} | Next X Level`,
    description: translatedProduct.description || 
      `${dictionary.product?.description || 'Discover'} ${translatedProduct.title} ${dictionary.product?.atNxl || 'at Next X Level'}. ${dictionary.product?.premiumQuality || 'Premium quality athletic wear for the discerning athlete.'}`,
    
    keywords: [
      translatedProduct.title,
      'Next X Level',
      'NXL',
      dictionary.product?.athleticWear || 'athletic wear',
      dictionary.product?.premium || 'premium',
      dictionary.product?.luxury || 'luxury',
      ...(product.tags?.map(tag => tag.value) || [])
    ].join(', '),

    openGraph: {
      title: `${translatedProduct.title} | Next X Level`,
      description: translatedProduct.description || 
        `${dictionary.product?.premiumQuality || 'Premium quality athletic wear'} - ${translatedProduct.title}`,
      url: productUrl,
      siteName: 'Next X Level',
      images: translatedProduct.thumbnail ? [{
        url: translatedProduct.thumbnail,
        width: 1200,
        height: 630,
        alt: translatedProduct.title,
      }] : [],
      locale: validLocale,
      type: 'website',
    },

    twitter: {
      card: 'summary_large_image',
      title: `${translatedProduct.title} | Next X Level`,
      description: translatedProduct.description || 
        `${dictionary.product?.premiumQuality || 'Premium quality athletic wear'} - ${translatedProduct.title}`,
      images: translatedProduct.thumbnail ? [translatedProduct.thumbnail] : [],
      creator: '@NextXLevel',
      site: '@NextXLevel',
    },

    alternates: {
      canonical: productUrl,
      languages: alternateUrls,
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    other: {
      'product:brand': 'Next X Level',
      'product:availability': product.variants?.some(v => 
        v.inventory_quantity && v.inventory_quantity > 0
      ) ? 'in stock' : 'out of stock',
      'product:condition': 'new',
      'product:price:amount': product.variants?.[0]?.calculated_price?.original_amount?.toString() || '0',
      'product:price:currency': region.currency_code?.toUpperCase() || 'USD',
    },
  }
}

/* =============================================================================
 * 3) ProductPage (default export)
 * =============================================================================
 * Server component that:
 *   • Confirms region exists
 *   • Fetches the fully-priced product for that region
 *   • Renders ProductTemplate with product & region data
 * ---------------------------------------------------------------------------
 */
export default async function ProductPage(props: Props) {
  const params = await props.params // Destructure awaited params for convenience

  // 1. Fetch & validate region -----------------------------------------------------------
  const region = await getRegion(params.countryCode)
  if (!region) {
    notFound()                          // Unknown region → show 404
  }

  // 2. Fetch product priced for this region with translations --------------------------
  const pricedProducts = await listProducts({
    countryCode: params.countryCode,
    locale: params.locale,
    queryParams: { limit: 100 }, // Get more products to find the right one by handle
  }).then(({ response }) => response.products)

  const pricedProduct = pricedProducts.find(p => p.handle === params.handle)

  if (!pricedProduct) {
    notFound()                          // Product not found → 404
  }

  // 3. Render page ----------------------------------------------------------------------
  return (
    <ProductTemplate
      product={pricedProduct}
      region={region}
      countryCode={params.countryCode}
      locale={params.locale}
    />
  )
}
