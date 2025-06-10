/*****************************************************************************************
 * Product Page ([countryCode]/[locale]/(main)/products/[handle]/page.tsx)
 * ---------------------------------------------------------------------------------------
 * Purpose:
 *   • Render a single product page for a given product "handle" (slug) and country code.
 *   • Generate static paths and metadata so the page can be statically pre-rendered
 *     (or re-generated) by Next.js for better performance and SEO.
 *
 * High-level flow:
 *   1. At build-time → generateStaticParams()    → Tell Next.js which routes to prebuild
 *   2. For each route  → generateMetadata()      → Produce <head> tags (OG + SEO)
 *   3. At runtime      → default export          → Fetch region & product, render page
 *****************************************************************************************/

import { Metadata } from "next"             // Type helper for meta generation
import { notFound } from "next/navigation"  // Utility to trigger 404 page

// Internal data-layer helpers -------------------------------------------------------------
import { listProducts, retrieveProduct } from "@lib/data/products"      // Fetch products from Medusa backend
import { getRegion, listRegions } from "@lib/data/regions" // Fetch region info

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
 * Generates SEO & OpenGraph metadata for each product page.
 * Called by Next.js for every route produced by generateStaticParams (and
 * during runtime if page is rendered on demand).
 *
 * If region or product cannot be fetched, trigger 404 with `notFound()`.
 * ---------------------------------------------------------------------------
 */
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params                     // Await promised params
  const { handle } = params                             // Product slug

  // --- Validate region ------------------------------------------------------------------
  const region = await getRegion(params.countryCode)
  if (!region) {
    notFound()                                          // Invalid country → 404
  }

  // --- Fetch product data ---------------------------------------------------------------
  const allProducts = await listProducts({
    countryCode: params.countryCode,                    // Use correct pricing region
    queryParams: { limit: 100 },                       // Get more products to find by handle
  }).then(({ response }) => response.products)         // API returns array

  const product = allProducts.find(p => p.handle === handle)

  if (!product) {
    notFound()                                          // Unknown product → 404
  }

  // --- Build metadata object ------------------------------------------------------------
  return {
    title: `${product.title} | Medusa Store`,
    description: `${product.title}`,
    openGraph: {
      title: `${product.title} | Medusa Store`,
      description: `${product.title}`,
      images: product.thumbnail ? [product.thumbnail] : [],
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
