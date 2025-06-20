/*****************************************************************************************
 * Store Page ([countryCode]/[locale]/(main)/store/page.tsx)
 * ---------------------------------------------------------------------------------------
 * Purpose:
 *   • Render the main store listing page for a given country context.
 *   • Apply optional query parameters (sorting, pagination, filtering) from URL search params.
 *   • Use Next.js App Router to provide static metadata.
 *
 * High-level flow:
 *   1. Define `metadata` for the page (title + description).
 *   2. Define `Params` type for incoming route and search parameters.
 *   3. Default export → Async server component:
 *        a. Await route params            (countryCode)
 *        b. Await searchParams           (sortBy, page, filters)
 *        c. Render `StoreTemplate` with props.
 *****************************************************************************************/

import { Metadata } from "next" // Next.js type for page metadata

// Module containing sorting option definitions for store listings
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

// Presentation layer – template component to display store grid and controls
import StoreTemplate from "@modules/store/templates"

/* =============================================================================
 * 1) Page Metadata
 * =============================================================================
 * Using Next.js's App Router metadata export to set <head> tags:
 *   - `title`       → Page title shown in browser tab and SEO
 *   - `description` → Meta description for SEO previews
 * --------------------------------------------------------------------------- */
export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our products.",
}

/* =============================================================================
 * 2) Type Definition for Page Parameters
 * =============================================================================
 * Define the shape of both route parameters and URL search parameters:
 *   - `params`      → Dynamic route segments (countryCode, locale)
 *   - `searchParams`→ URL query parameters for filtering and pagination
 * --------------------------------------------------------------------------- */
type Params = {
  params: Promise<{
    countryCode: string
    locale: string
  }>
  searchParams: Promise<{
    sortBy?: SortOptions           // Sort option (price_asc, price_desc, created_at)
    page?: string                  // Pagination page number
    category_id?: string[]         // Category filter IDs (multiple allowed)
    collection_id?: string[]       // Collection filter IDs (multiple allowed) 
    min_price?: string             // Minimum price filter
    max_price?: string             // Maximum price filter
    q?: string                     // Search query
  }>
}

/* =============================================================================
 * 3) StorePage Component (default export)
 * =============================================================================
 * Async server component executed on each request (or ISR revalidation):
 *   a. Await `params` to get dynamic route segment (countryCode, locale).
 *   b. Await `searchParams` to retrieve optional query settings.
 *   c. Destructure all filter parameters from searchParams.
 *   d. Render the `StoreTemplate` component with all necessary props:
 *        - sortBy       : desired sort order
 *        - page         : pagination page number
 *        - countryCode  : region context for pricing/localization
 *        - locale       : language context for translations
 *        - filters      : all filter parameters for categories, collections, price
 * --------------------------------------------------------------------------- */
export default async function StorePage(props: Params) {
  // Await the dynamic route parameter for the country and locale
  const params = await props.params
  // Await URL search parameters for sorting, pagination, and filtering
  const searchParams = await props.searchParams
  const {
    sortBy,
    page,
    category_id,
    collection_id,
    min_price,
    max_price,
    q
  } = searchParams

  // Render the store template with props injected
  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
      locale={params.locale}
      searchParams={{
        category_id,
        collection_id,
        min_price,
        max_price,
        q
      }}
    />
  )
}
