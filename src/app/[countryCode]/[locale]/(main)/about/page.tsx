/*****************************************************************************************
 * About Page ([countryCode]/[locale]/(main)/about/page.tsx)
 * ---------------------------------------------------------------------------------------
 * Purpose:
 *   • Render the localized about page for a given country and locale.
 *   • Provide SEO metadata based on locale-specific dictionary.
 *   • Display brand story, values, team, and mission.
 *
 * High-level flow:
 *   1. generateMetadata() → Build page <head> tags (title + description) using i18n.
 *   2. default export About() → Async server component:
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
    description: "Learn about Next X Level - the premium golf apparel brand designed for every golfer. Discover our story, mission, values, and the team behind our exceptional products.",
  }
}

/**
 * Safe way to access potentially nested dictionary values
 * Provides proper type checking and fallbacks
 */
function getDictValue(obj: any, path: string[], fallback: string): string {
  try {
    let current = obj;
    for (const key of path) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return fallback;
      }
    }
    
    return typeof current === 'string' ? current : fallback;
  } catch (e) {
    return fallback;
  }
}

/**
 * About Component (default export)
 * -----------------------------------------------------------------------------
 * Async server component that renders the about page.
 *
 * @param props.params - Promise or object with { countryCode, locale }
 * @returns JSX for the about page layout and sections
 */
export default async function About(props: {
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
      <section className="relative h-[50vh] min-h-[400px] bg-nxl-black">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover object-center opacity-70"
          >
            <source src="/golf-background.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-nxl-black via-nxl-black/40 to-transparent"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center p-8">
            <h1 className="font-display text-5xl md:text-6xl text-nxl-gold uppercase tracking-wider mb-6">
              {dictionary.navigation.about}
            </h1>
            <p className="font-serif text-xl md:text-2xl text-nxl-ivory max-w-2xl mx-auto">
              {getDictValue(dictionary, ['about', 'hero', 'subtitle'], "Elevating the game with premium golf apparel for every level")}
            </p>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-16 md:py-24 bg-nxl-black">
        <div className="content-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-nxl-gold uppercase tracking-wider mb-10">
                {getDictValue(dictionary, ['about', 'story', 'title'], "Our Story")}
              </h2>
              
              <div className="space-y-6">
                <p className="font-body text-nxl-ivory/90 text-lg">
                  {getDictValue(dictionary, ['about', 'story', 'paragraph1'], 
                    "Next X Level was born from a passion for the game of golf and a vision to create apparel that performs at the highest level while embodying timeless elegance. Founded in 2023 by a team of golf enthusiasts and fashion industry veterans, we set out to bridge the gap between traditional golf attire and modern performance wear.")}
                </p>
                
                <p className="font-body text-nxl-ivory/90 text-lg">
                  {getDictValue(dictionary, ['about', 'story', 'paragraph2'], 
                    "What began as a small collection of premium polo shirts has expanded into a comprehensive line of golf apparel and accessories, each piece designed with meticulous attention to detail and crafted from the finest materials.")}
                </p>
                
                <p className="font-body text-nxl-ivory/90 text-lg">
                  {getDictValue(dictionary, ['about', 'story', 'paragraph3'], 
                    "Our commitment to excellence extends beyond our products to every interaction with our brand. We believe that every golfer, regardless of skill level, deserves to look and feel their best on the course.")}
                </p>
              </div>
            </div>
            
            <div className="relative h-[500px] rounded-sm overflow-hidden">
              <Image
                src="/product-samples/nxl-polo-blk-yellow-logo.png"
                alt="Next X Level Polo Shirt"
                fill
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-gradient-to-t from-nxl-navy to-nxl-black">
        <div className="content-container">
          <h2 className="font-display text-3xl md:text-4xl text-nxl-gold uppercase tracking-wider text-center mb-16">
            {getDictValue(dictionary, ['about', 'values', 'title'], "Our Core Values")}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Value 1 */}
            <div className="text-center">
              <div className="inline-block p-6 mb-6 rounded-full bg-nxl-gold/10 border border-nxl-gold/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-nxl-gold">
                  <path d="M12 22a.966.966 0 0 1-.71-.29.966.966 0 0 1-.29-.71v-5a4 4 0 1 1 2 0v5a.966.966 0 0 1-.29.71.966.966 0 0 1-.71.29Z"></path><rect width="20" height="14" x="2" y="2" rx="2"></rect>
                </svg>
              </div>
              <h3 className="font-serif text-2xl text-nxl-gold mb-4">
                {getDictValue(dictionary, ['about', 'values', 'quality', 'title'], "Uncompromising Quality")}
              </h3>
              <p className="font-body text-nxl-ivory/90">
                {getDictValue(dictionary, ['about', 'values', 'quality', 'description'], 
                  "We source the finest materials and partner with skilled artisans to create apparel that stands the test of time in both durability and design.")}
              </p>
            </div>
            
            {/* Value 2 */}
            <div className="text-center">
              <div className="inline-block p-6 mb-6 rounded-full bg-nxl-gold/10 border border-nxl-gold/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-nxl-gold">
                  <path d="M2 12c0-3.5 2.5-6 6.5-6 4 0 4.5 2.5 4.5 6s.5 6 4.5 6c4 0 6.5-2.5 6.5-6"></path><path d="M8 12h8"></path><path d="M12 8v8"></path>
                </svg>
              </div>
              <h3 className="font-serif text-2xl text-nxl-gold mb-4">
                {getDictValue(dictionary, ['about', 'values', 'innovation', 'title'], "Performance Innovation")}
              </h3>
              <p className="font-body text-nxl-ivory/90">
                {getDictValue(dictionary, ['about', 'values', 'innovation', 'description'], 
                  "We continuously explore cutting-edge fabrics and construction techniques to enhance comfort, mobility, and performance in all playing conditions.")}
              </p>
            </div>
            
            {/* Value 3 */}
            <div className="text-center">
              <div className="inline-block p-6 mb-6 rounded-full bg-nxl-gold/10 border border-nxl-gold/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-nxl-gold">
                  <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
                </svg>
              </div>
              <h3 className="font-serif text-2xl text-nxl-gold mb-4">
                {getDictValue(dictionary, ['about', 'values', 'inclusivity', 'title'], "Inclusive Excellence")}
              </h3>
              <p className="font-body text-nxl-ivory/90">
                {getDictValue(dictionary, ['about', 'values', 'inclusivity', 'description'], 
                  "We design for golfers of all levels, backgrounds, and body types, believing that exceptional style and performance should be accessible to everyone who loves the game.")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-nxl-black">
        <div className="content-container">
          <h2 className="font-display text-3xl md:text-4xl text-nxl-gold uppercase tracking-wider text-center mb-16">
            {getDictValue(dictionary, ['about', 'team', 'title'], "Meet Our Team")}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {/* Team Member 1 */}
            <div className="text-center">
              <div className="relative w-56 h-56 mx-auto mb-6 rounded-full overflow-hidden border-2 border-nxl-gold/30">
                <div className="absolute inset-0 bg-nxl-forest flex items-center justify-center">
                  <span className="font-display text-4xl text-nxl-gold uppercase">JD</span>
                </div>
              </div>
              <h3 className="font-serif text-2xl text-nxl-gold mb-2">
                {getDictValue(dictionary, ['about', 'team', 'member1', 'name'], "James Donaldson")}
              </h3>
              <p className="font-body text-nxl-ivory/70 mb-4">
                {getDictValue(dictionary, ['about', 'team', 'member1', 'position'], "Founder & Creative Director")}
              </p>
              <p className="font-body text-nxl-ivory/90 max-w-xs mx-auto">
                {getDictValue(dictionary, ['about', 'team', 'member1', 'bio'], 
                  "Former professional golfer with 15 years of experience in fashion design for luxury sportswear brands.")}
              </p>
            </div>
            
            {/* Team Member 2 */}
            <div className="text-center">
              <div className="relative w-56 h-56 mx-auto mb-6 rounded-full overflow-hidden border-2 border-nxl-gold/30">
                <div className="absolute inset-0 bg-nxl-forest flex items-center justify-center">
                  <span className="font-display text-4xl text-nxl-gold uppercase">SW</span>
                </div>
              </div>
              <h3 className="font-serif text-2xl text-nxl-gold mb-2">
                {getDictValue(dictionary, ['about', 'team', 'member2', 'name'], "Sarah Wong")}
              </h3>
              <p className="font-body text-nxl-ivory/70 mb-4">
                {getDictValue(dictionary, ['about', 'team', 'member2', 'position'], "Head of Product Development")}
              </p>
              <p className="font-body text-nxl-ivory/90 max-w-xs mx-auto">
                {getDictValue(dictionary, ['about', 'team', 'member2', 'bio'], 
                  "Textile engineer with a passion for creating performance fabrics that combine comfort with technical excellence.")}
              </p>
            </div>
            
            {/* Team Member 3 */}
            <div className="text-center">
              <div className="relative w-56 h-56 mx-auto mb-6 rounded-full overflow-hidden border-2 border-nxl-gold/30">
                <div className="absolute inset-0 bg-nxl-forest flex items-center justify-center">
                  <span className="font-display text-4xl text-nxl-gold uppercase">MT</span>
                </div>
              </div>
              <h3 className="font-serif text-2xl text-nxl-gold mb-2">
                {getDictValue(dictionary, ['about', 'team', 'member3', 'name'], "Marcus Thompson")}
              </h3>
              <p className="font-body text-nxl-ivory/70 mb-4">
                {getDictValue(dictionary, ['about', 'team', 'member3', 'position'], "Chief Sustainability Officer")}
              </p>
              <p className="font-body text-nxl-ivory/90 max-w-xs mx-auto">
                {getDictValue(dictionary, ['about', 'team', 'member3', 'bio'], 
                  "Environmental scientist leading our efforts to minimize environmental impact while maximizing product performance.")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-nxl-black to-nxl-navy">
        <div className="content-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Mission */}
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-nxl-gold uppercase tracking-wider mb-10">
                {getDictValue(dictionary, ['about', 'mission', 'title'], "Our Mission")}
              </h2>
              
              <div className="space-y-6">
                <p className="font-body text-nxl-ivory/90 text-lg">
                  {getDictValue(dictionary, ['about', 'mission', 'paragraph1'], 
                    "At Next X Level, our mission is to elevate every golfer's experience through apparel that combines luxury with performance. We design for confidence, knowing that when you feel exceptional in what you wear, your game naturally follows.")}
                </p>
                
                <p className="font-body text-nxl-ivory/90 text-lg">
                  {getDictValue(dictionary, ['about', 'mission', 'paragraph2'], 
                    "We create products that honor golf's distinguished heritage while embracing cutting-edge innovation. Each piece is meticulously crafted to support your performance through every swing, from the first drive to the final putt.")}
                </p>
                
                <blockquote className="font-serif text-nxl-gold italic text-xl pl-6 border-l-2 border-nxl-gold/50 my-8">
                  {getDictValue(dictionary, ['about', 'mission', 'quote'], 
                    "\"Excellence in every thread. Performance with every swing.\"")}
                </blockquote>
              </div>
            </div>
            
            {/* Vision */}
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-nxl-gold uppercase tracking-wider mb-10">
                {getDictValue(dictionary, ['about', 'vision', 'title'], "Our Vision")}
              </h2>
              
              <div className="space-y-6">
                <p className="font-body text-nxl-ivory/90 text-lg">
                  {getDictValue(dictionary, ['about', 'vision', 'paragraph1'], 
                    "We envision a future where golf apparel transcends conventional boundaries—where performance technology seamlessly merges with timeless elegance, where inclusivity and sustainability are foundational principles, and where every golfer, regardless of skill level, belongs to the Next X Level community.")}
                </p>
                
                <p className="font-body text-nxl-ivory/90 text-lg">
                  {getDictValue(dictionary, ['about', 'vision', 'paragraph2'], 
                    "Our ambition extends beyond clothing to cultivating an ecosystem that empowers golfers throughout their personal journey, whether they're pursuing professional excellence or simply discovering deeper appreciation for the game's subtle pleasures.")}
                </p>
                
                <p className="font-body text-nxl-ivory/90 text-lg">
                  {getDictValue(dictionary, ['about', 'vision', 'paragraph3'], 
                    "We are dedicated to pioneering advancements in golf apparel design, establishing new benchmarks of quality and performance while honoring the time-honored traditions and etiquette that distinguish this remarkable sport.")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="py-16 md:py-24 bg-nxl-black">
        <div className="content-container">
          <h2 className="font-display text-3xl md:text-4xl text-nxl-gold uppercase tracking-wider text-center mb-12">
            {getDictValue(dictionary, ['about', 'craftsmanship', 'title'], "Our Craftsmanship")}
          </h2>
          
              <p className="font-serif text-xl text-nxl-ivory/90 text-center max-w-3xl mx-auto mb-16">
                {getDictValue(dictionary, ['about', 'craftsmanship', 'subtitle'], 
                  "Every Next X Level creation embodies the perfect synthesis of artistry and engineering—where exceptional materials meet precision craftsmanship to deliver garments of unparalleled quality and distinction.")}
              </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative h-[300px] rounded-sm overflow-hidden">
              <Image
                src="/product-samples/nxl-hoodie-blk-yellow-logo.png"
                alt="Next X Level Craftsmanship"
                fill
                className="object-cover object-center"
              />
            </div>
            <div className="relative h-[300px] rounded-sm overflow-hidden">
              <Image
                src="/product-samples/nxl-cap-blk-green-logo.png"
                alt="Next X Level Craftsmanship"
                fill
                className="object-cover object-center"
              />
            </div>
            <div className="relative h-[300px] rounded-sm overflow-hidden">
              <Image
                src="/product-samples/nxl-joggers-blk-yellow-logo.png"
                alt="Next X Level Craftsmanship"
                fill
                className="object-cover object-center"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mt-16">
            <div>
                <h3 className="font-serif text-xl text-nxl-gold mb-4">
                  {getDictValue(dictionary, ['about', 'craftsmanship', 'feature1', 'title'], "Exceptional Materials")}
                </h3>
                <p className="font-body text-nxl-ivory/90">
                  {getDictValue(dictionary, ['about', 'craftsmanship', 'feature1', 'description'], 
                    "We curate the world's most distinguished fabrics, each meticulously selected for its superior performance characteristics, luxurious feel, and exceptional longevity through countless rounds.")}
                </p>
            </div>
            
            <div>
                <h3 className="font-serif text-xl text-nxl-gold mb-4">
                  {getDictValue(dictionary, ['about', 'craftsmanship', 'feature2', 'title'], "Advanced Performance")}
                </h3>
                <p className="font-body text-nxl-ivory/90">
                  {getDictValue(dictionary, ['about', 'craftsmanship', 'feature2', 'description'], 
                    "Our garments integrate cutting-edge technologies—advanced moisture management, comprehensive UV protection, and strategic multi-directional stretch—ensuring uncompromised comfort and performance across all playing conditions.")}
                </p>
            </div>
            
            <div>
                <h3 className="font-serif text-xl text-nxl-gold mb-4">
                  {getDictValue(dictionary, ['about', 'craftsmanship', 'feature3', 'title'], "Refined Design")}
                </h3>
                <p className="font-body text-nxl-ivory/90">
                  {getDictValue(dictionary, ['about', 'craftsmanship', 'feature3', 'description'], 
                    "Every element—from precisely engineered seams to strategically positioned pockets and signature hardware—is thoughtfully integrated with intention, ensuring our apparel delivers uncompromised performance while maintaining its distinguished aesthetic.")}
                </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
