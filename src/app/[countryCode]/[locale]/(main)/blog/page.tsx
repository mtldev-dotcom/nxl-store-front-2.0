/*****************************************************************************************
 * About Page ([countryCode]/[locale]/(main)/blog/page.tsx)
 * ---------------------------------------------------------------------------------------
 * Purpose:
 *   • Render the localized about page for a given country and locale.
 *   • Provide SEO metadata based on locale-specific dictionary.
 *   • Display company information, values, team, and story.
 *
 * High-level flow:
 *   1. generateMetadata() → Build page <head> tags (title + description) using i18n.
 *   2. default export Blog() → Async server component:
 *        a. Await route params (countryCode, locale).
 *        b. Load dictionary for translations.
 *        c. Render page sections in order.
 *****************************************************************************************/

import { Metadata } from "next" // Next.js type for metadata export
import Image from "next/image"

// Internationalization helpers
import { getDictionary } from "@lib/i18n/get-dictionary" // Load locale-specific texts
import { Locale } from "@lib/i18n/config"                // Locale type

/**
 * generateMetadata
 * -----------------------------------------------------------------------------
 * Called by Next.js App Router to generate <head> metadata for the about page.
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
    title: `${dictionary.navigation.about} | ${dictionary.general.title}`,
    description: dictionary.brandStory.paragraph1,
  }
}

/**
 * Blog/About Component (default export)
 * -----------------------------------------------------------------------------
 * Async server component that renders the about page.
 *
 * @param props.params - Promise or object with { countryCode, locale }
 * @returns JSX for the about page layout and sections
 */
export default async function Blog(props: {
  params:
    | Promise<{ countryCode: string; locale: Locale }>
    | { countryCode: string; locale: Locale }
}) {
  // 1. Await dynamic route params (country and locale)
  const params = await props.params
  const { locale } = params
  
  // 2. Load localized text dictionary
  const dictionary = await getDictionary(locale)

  return (
    <>
      {/* Hero Section with large image and title overlay */}
      <section className="relative h-[60vh] min-h-[400px] bg-nxl-black">
        <div className="absolute inset-0 z-0">
          <Image
            src="/product-samples/nxl-polo-blue-gray-logo3.png" 
            alt="Next X Level Golf Apparel"
            fill
            className="object-cover object-center opacity-70"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-nxl-black via-nxl-black/30 to-transparent"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center p-8">
            <h1 className="font-display text-5xl md:text-6xl text-nxl-gold uppercase tracking-wider mb-6">
              {dictionary.navigation.about}
            </h1>
            <p className="font-serif text-xl md:text-2xl text-nxl-ivory max-w-2xl mx-auto">
              {dictionary.brandStory.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24 bg-nxl-black">
        <div className="content-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="font-display text-3xl md:text-4xl text-nxl-gold uppercase tracking-wider mb-6">
                {dictionary.brandStory.title}
              </h2>
              <p className="font-body text-nxl-ivory/90 mb-6 leading-relaxed">
                {dictionary.brandStory.paragraph1}
              </p>
              <p className="font-body text-nxl-ivory/90 mb-6 leading-relaxed">
                {dictionary.brandStory.paragraph2}
              </p>
              <p className="font-body text-nxl-ivory/90 mb-6 leading-relaxed">
                Founded with a passion for the game and an eye for style, Next X Level emerged from the realization that golf apparel should be as exceptional as the game itself. Our journey began with a simple premise: create golf clothing that golfers actually want to wear, both on and off the course.
              </p>
              <p className="font-body text-nxl-ivory/90 leading-relaxed">
                Today, we continue to push boundaries and challenge conventions, creating apparel that performs without compromise and styles that stand the test of time. Each piece in our collection is crafted with purpose, designed for the golfer who refuses to settle for anything less than excellence.
              </p>
            </div>
            <div className="order-1 lg:order-2 relative aspect-square w-full max-w-xl mx-auto">
              <div className="absolute inset-0 border border-nxl-gold/20 -m-3 z-0"></div>
              <div className="w-full h-full relative z-10 overflow-hidden">
                <Image 
                  src="/product-samples/nxl-polo-blk-yellow-logo2.png"
                  alt="Next X Level Brand Story"
                  fill
                  className="object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-nxl-black to-nxl-navy">
        <div className="content-container">
          <h2 className="font-display text-3xl md:text-4xl text-nxl-gold uppercase tracking-wider text-center mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Value 1 */}
            <div className="bg-nxl-black/50 border border-nxl-gold/20 p-8 rounded-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 mb-6 text-nxl-gold flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                  <circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path>
                </svg>
              </div>
              <h3 className="font-serif text-xl text-nxl-ivory mb-4">Excellence</h3>
              <p className="font-body text-nxl-ivory/80">
                We pursue excellence in every thread, stitch, and design detail, crafting apparel that exceeds expectations.
              </p>
            </div>
            
            {/* Value 2 */}
            <div className="bg-nxl-black/50 border border-nxl-gold/20 p-8 rounded-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 mb-6 text-nxl-gold flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
                </svg>
              </div>
              <h3 className="font-serif text-xl text-nxl-ivory mb-4">Innovation</h3>
              <p className="font-body text-nxl-ivory/80">
                We reimagine what golf apparel can be, combining cutting-edge fabrics with timeless designs.
              </p>
            </div>
            
            {/* Value 3 */}
            <div className="bg-nxl-black/50 border border-nxl-gold/20 p-8 rounded-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 mb-6 text-nxl-gold flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"></path><path d="M8 7h6"></path><path d="M8 11h8"></path><path d="M8 15h6"></path>
                </svg>
              </div>
              <h3 className="font-serif text-xl text-nxl-ivory mb-4">Craftsmanship</h3>
              <p className="font-body text-nxl-ivory/80">
                We honor the traditions of quality craftsmanship while embracing modern techniques to create apparel built to last.
              </p>
            </div>
            
            {/* Value 4 */}
            <div className="bg-nxl-black/50 border border-nxl-gold/20 p-8 rounded-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 mb-6 text-nxl-gold flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                </svg>
              </div>
              <h3 className="font-serif text-xl text-nxl-ivory mb-4">Authenticity</h3>
              <p className="font-body text-nxl-ivory/80">
                We stay true to our Canadian roots and golfing heritage, creating genuine products for genuine players.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-nxl-black">
        <div className="content-container">
          <h2 className="font-display text-3xl md:text-4xl text-nxl-gold uppercase tracking-wider text-center mb-12">
            Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="relative group">
              <div className="aspect-[3/4] relative overflow-hidden">
                <div className="absolute inset-0 bg-nxl-black/20 z-10"></div>
                <div className="w-full h-full bg-nxl-navy"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-nxl-black to-transparent z-20">
                <h3 className="font-serif text-xl text-nxl-gold mb-1">James Wilson</h3>
                <p className="font-body text-nxl-ivory/90 mb-3">Founder & CEO</p>
                <p className="font-body text-nxl-ivory/70 text-sm hidden group-hover:block transition-all">
                  Former pro golfer with a passion for design and business. James founded Next X Level to bring his vision of premium golf apparel to life.
                </p>
              </div>
            </div>
            
            {/* Team Member 2 */}
            <div className="relative group">
              <div className="aspect-[3/4] relative overflow-hidden">
                <div className="absolute inset-0 bg-nxl-black/20 z-10"></div>
                <div className="w-full h-full bg-nxl-navy"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-nxl-black to-transparent z-20">
                <h3 className="font-serif text-xl text-nxl-gold mb-1">Olivia Chen</h3>
                <p className="font-body text-nxl-ivory/90 mb-3">Head of Design</p>
                <p className="font-body text-nxl-ivory/70 text-sm hidden group-hover:block transition-all">
                  With experience at top fashion houses, Olivia brings her expertise in high-performance fabrics and elegant aesthetics to our collections.
                </p>
              </div>
            </div>
            
            {/* Team Member 3 */}
            <div className="relative group">
              <div className="aspect-[3/4] relative overflow-hidden">
                <div className="absolute inset-0 bg-nxl-black/20 z-10"></div>
                <div className="w-full h-full bg-nxl-navy"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-nxl-black to-transparent z-20">
                <h3 className="font-serif text-xl text-nxl-gold mb-1">Michael Tran</h3>
                <p className="font-body text-nxl-ivory/90 mb-3">Production Director</p>
                <p className="font-body text-nxl-ivory/70 text-sm hidden group-hover:block transition-all">
                  Overseeing our Canadian manufacturing, Michael ensures every piece meets our exacting standards for quality and craftsmanship.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-nxl-navy to-nxl-black">
        <div className="content-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-square w-full max-w-xl mx-auto">
              <div className="absolute inset-0 border border-nxl-gold/20 -m-3 z-0"></div>
              <div className="w-full h-full relative z-10 overflow-hidden">
                <Image 
                  src="/product-samples/nxl-cap-blk-green-logo.png"
                  alt="Next X Level Sustainability"
                  fill
                  className="object-cover object-center"
                />
              </div>
            </div>
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-nxl-gold uppercase tracking-wider mb-6">
                Our Commitment
              </h2>
              <p className="font-body text-nxl-ivory/90 mb-6 leading-relaxed">
                At Next X Level, we're committed to responsible manufacturing and sustainable practices. We believe that quality golf apparel should not come at the expense of our environment.
              </p>
              <p className="font-body text-nxl-ivory/90 mb-6 leading-relaxed">
                Our fabrics are sourced from responsible suppliers, our packaging is made from recycled materials, and our Canadian production facilities operate with minimal environmental impact.
              </p>
              <p className="font-body text-nxl-ivory/90 leading-relaxed">
                We're constantly innovating to reduce our carbon footprint while increasing the durability and performance of our products—because a truly premium product is one that's built to last.
              </p>
              <div className="mt-8">
                <div className="inline-block border border-nxl-gold/20 px-6 py-4 rounded-sm">
                  <p className="font-serif text-xl text-nxl-gold italic">
                    "We don't just make golf apparel. We make a statement about who you are, on and off the course."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
