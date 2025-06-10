/*****************************************************************************************
 * Home Page ([countryCode]/[locale]/(main)/page.tsx)
 * ---------------------------------------------------------------------------------------
 * Purpose:
 *   • Render the localized home page for a given country and locale.
 *   • Provide SEO metadata based on locale-specific dictionary.
 *   • Fetch and display content sections: Hero, Featured Products, Brand Story,
 *     Categories Showcase, Lifestyle Benefits, Newsletter.
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

export async function generateMetadata({
  params: paramsPromise,
}: {
  params: Promise<{ locale: Locale; countryCode: string }>
}): Promise<Metadata> {
  const params = await paramsPromise
  const dictionary = await getDictionary(params.locale)
  return {
    title: dictionary.general.title,
    description: dictionary.general.description,
  }
}

export default async function Home(props: {
  params:
    | Promise<{ countryCode: string; locale: Locale }>
    | { countryCode: string; locale: Locale }
}) {
  const params = await props.params
  const { countryCode, locale } = params
  const dictionary = await getDictionary(locale)
  const region = await getRegion(countryCode)

  // Fetch only the 'features' collection for featured products
  const { collections } = await listCollections({
    handle: "features",
    fields: "id,handle,title",
  })

  if (!region) {
    console.error("Region data is missing. Check your Medusa backend setup.")
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
        <h1 className="text-2xl font-bold mb-4">Region Configuration Error</h1>
        <p>Unable to load region data for country code: {countryCode}</p>
      </div>
    )
  }

  return (
    <>
      <h1 className="hidden">Next X Level</h1>

      {/* Hero Section */}
      <Hero dictionary={dictionary} />

      {/* Featured Products Section */}
      <div className="py-16 bg-white">
        <div className="content-container">
          <h2 className="font-display text-3xl md:text-4xl text-nxl-gold uppercase tracking-wider text-center mb-10">
            {dictionary.general.featuredProducts}
          </h2>
          <FeaturedProducts collections={collections} region={region} />
        </div>
      </div>

      {/* Other Page Sections */}
      <BrandStory dictionary={dictionary} />
      <CategoriesShowcase dictionary={dictionary} />
      <LifestyleBenefits dictionary={dictionary} />
      <Newsletter dictionary={dictionary} />
    </>
  )
}
