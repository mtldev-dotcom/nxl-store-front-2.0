/*****************************************************************************************
 * Store Page ([countryCode]/[locale]/(main)/store/page.tsx)
 * ---------------------------------------------------------------------------------------
 * Purpose:
 *   • Render the main store listing page for a given country context.
 *   • Apply optional query parameters (sorting, pagination) from URL search params.
 *   • Use Next.js App Router to provide static metadata.
 *
 * High-level flow:
 *   1. Define `metadata` for the page (title + description).
 *   2. Define `Params` type for incoming route and search parameters.
 *   3. Default export → Async server component:
 *        a. Await route params            (countryCode)
 *        b. Await searchParams           (sortBy & page)
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
 * Using Next.js’s App Router metadata export to set <head> tags:
 *   - `title`       → Page title shown in browser tab and SEO
 *   - `description` → Meta description for SEO previews
 * --------------------------------------------------------------------------- */
export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our products.",
}

/* =============================================================================
 * 2) Params Type Definition
 * =============================================================================
 * Describes the shape of props passed into the async component:
 *   - `searchParams` → Promise wrapping an object with optional:
 *         • sortBy : SortOptions (e.g., "price_asc", "price_desc")
 *         • page   : string (page number in pagination)
 *   - `params`       → Promise wrapping an object with:
 *         • countryCode : string (ISO-2 country code from dynamic route)
 * --------------------------------------------------------------------------- */
type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

/* =============================================================================
 * 3) StorePage Component (default export)
 * =============================================================================
 * Async server component executed on each request (or ISR revalidation):
 *   a. Await `params` to get dynamic route segment (countryCode).
 *   b. Await `searchParams` to retrieve optional query settings.
 *   c. Destructure `sortBy` and `page` from searchParams.
 *   d. Render the `StoreTemplate` component with all necessary props:
 *        - sortBy       : desired sort order
 *        - page         : pagination page number
 *        - countryCode  : region context for pricing/localization
 * --------------------------------------------------------------------------- */
export default async function StorePage(props: Params) {
  // Await the dynamic route parameter for the country
  const params = await props.params
  // Await URL search parameters for sorting & pagination
  const searchParams = await props.searchParams
  const { sortBy, page } = searchParams

  // Render the store template with props injected
  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
    />
  )
}
