/*****************************************************************************************
 * Home Page ([countryCode]/[locale]/(main)/page.tsx)
 * ---------------------------------------------------------------------------------------
 * Purpose:
 *   • Render the localized home page for a given country and locale.
 *   • Provide SEO metadata based on locale-specific dictionary.
 *   • Fetch and display content sections: Hero, Featured Products, Brand Story,
 *     Categories Showcase, Lifestyle Benefits, Newsletter.
 *
 * High-level flow:
 *   1. generateMetadata() → Build page <head> tags (title + description) using i18n.
 *   2. default export Home() → Async server component:
 *        a. Await route params (countryCode, locale).
 *        b. Load dictionary for translations.
 *        c. Fetch region data for pricing / localization.
 *        d. Fetch collections for featured products.
 *        e. Guard against missing data (return null if absent).
 *        f. Render page sections in order.
 *****************************************************************************************/

import { Metadata } from "next" // Next.js type for metadata export

// UI components for each page section
import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import BrandStory from "@modules/home/components/brand-story"
import CategoriesShowcase from "@modules/home/components/categories-showcase"
import LifestyleBenefits from "@modules/home/components/lifestyle-benefits"
import Newsletter from "@modules/home/components/newsletter"

// Data-fetching helpers
import { listCollections } from "@lib/data/collections" // Fetch product collections
import { getRegion } from "@lib/data/regions"           // Fetch region/pricing context

// Internationalization helpers
import { getDictionary } from "@lib/i18n/get-dictionary" // Load locale-specific texts
import { Locale } from "@lib/i18n/config"                // Locale type

/**
 * generateMetadata
 * -----------------------------------------------------------------------------
 * Called by Next.js App Router to generate <head> metadata for the home page.
 * Uses the locale to load the appropriate dictionary for title and description.
 *
 * @param paramsPromise - Promise or object containing locale and countryCode
 * @returns Metadata object with localized title & description
 */
export async function generateMetadata({
  params: paramsPromise,
}: {
  params: Promise<{ locale: Locale; countryCode: string }>
}): Promise<Metadata> {
  // Wait for route params to resolve
  const params = await paramsPromise

  // Load translation dictionary for the given locale
  const dictionary = await getDictionary(params.locale)

  // Return metadata using locale-specific text
  return {
    title: dictionary.general.title,
    description: dictionary.general.description,
  }
}

/**
 * Home Component (default export)
 * -----------------------------------------------------------------------------
 * Async server component that renders the home page.
 *
 * @param props.params  - Promise or object with { countryCode, locale }
 * @returns JSX for the home page layout and sections
 */
export default async function Home(props: {
  params:
  | Promise<{ countryCode: string; locale: Locale }>
  | { countryCode: string; locale: Locale }
}) {

  // 1. Await dynamic route params (country and locale)
  const params = await props.params
  const { countryCode, locale } = params
  // 2. Load localized text dictionary
  const dictionary = await getDictionary(locale)
  // 3. Fetch region for pricing/localization context
  const region = await getRegion(countryCode)

  // 4. Fetch collections for featured products section
  //    - listCollections returns `{ collections: Collection[] }` containing all collections.
  //    - We request only minimal fields (`id`, `handle`, `title`) to reduce payload size.
  //    - The FeaturedProducts component expects the 'features' collection handle.
  //      Ensure your backend has a collection with handle "features" (case-sensitive).
  //    - If you want to fetch only that collection directly, enable:
  //        listCollections({ queryParams: { handle: "features" } })
  //      which returns only the matching collection.
  //    - If `collections` is empty or missing "features", no featured products will render.
  // 4. Fetch only the 'features' collection for featured products
  //    • Your backend collection title is "Fearures", but handle must be exactly "features".
  //    • Confirm in Medusa admin that the handle (not title) reads "features" (lowercase).
  //    • Querying by handle avoids including empty or unrelated collections.
  //    • listCollections returns StoreCollection[] directly, no destructuring needed.
  // Build translation fields based on locale
  const translationsField = locale ? `,+translations.${locale}` : ""

  const collections = await listCollections({
    handle: "favorites",       // Fetch only the 'favorites' collection
    fields: `id,handle,title${translationsField}`, // Include translation fields for collection titles
  })



  // Guard against missing region data - we need this for product pricing
  if (!region) {
    console.error("Region data is missing. Check your Medusa backend setup.");
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
        <h1 className="text-2xl font-bold mb-4">{dictionary.general.regionError}</h1>
        <p>{dictionary.general.regionErrorDescription}: {countryCode}</p>
        <p className="text-sm mt-2">{dictionary.general.regionErrorAdvice}</p>
      </div>
    );
  }

  return (
    <main id="main-content" className="min-h-screen">
      {/* Hero Section: main banner with call-to-action */}
      <Hero dictionary={dictionary} />

      {/* Featured Products Section: highlighted collections */}
      <section className="py-16 lg:py-24 bg-nxl-black" aria-labelledby="featured-products-heading">
        <div className="content-container">
          <header className="text-center mb-16">
            <h2
              id="featured-products-heading"
              className="font-display text-3xl md:text-4xl lg:text-5xl text-nxl-gold uppercase tracking-wider mb-4"
            >
              {dictionary.general.featuredProducts}
            </h2>
            <p className="font-body text-lg text-nxl-ivory max-w-2xl mx-auto">
              {dictionary.general.featuredProductsDescription}
            </p>
          </header>

          <div className="space-y-16">
            {collections && collections.length > 0 ? (
              <FeaturedProducts
                collections={collections}
                region={region}
                locale={locale}
                countryCode={countryCode}
              />
            ) : (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <svg className="w-16 h-16 text-nxl-gold/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <h3 className="font-serif text-xl text-nxl-ivory mb-2">{dictionary.general.comingSoon}</h3>
                  <p className="text-nxl-ivory/60 font-body">
                    {dictionary.general.comingSoonDescription}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Brand Story Section: company background and values */}
      <BrandStory dictionary={dictionary} />

      {/* Categories Showcase Section: overview of product categories */}
      <CategoriesShowcase dictionary={dictionary} />

      {/* Lifestyle Benefits Section: highlight lifestyle use cases */}
      <LifestyleBenefits dictionary={dictionary} />

      {/* Newsletter Signup Section: email capture form */}
      {/* <Newsletter dictionary={dictionary} /> */}
    </main>
  )
}
