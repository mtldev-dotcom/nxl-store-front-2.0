/**
 * Enhanced Footer Component
 * -------------------------
 * Features:
 * - Fixed TypeScript errors and improved type safety
 * - Added comprehensive error handling for data fetching
 * - Optimized data fetching with proper field selection
 * - Added collection title translations (French/English)
 * - Enhanced accessibility with proper ARIA labels
 * - Improved responsive design and performance
 * - Clean code structure with better maintainability
 */

import { Suspense } from "react"
import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { listRegions } from "@lib/data/regions"
import { getDictionary } from "@lib/i18n/get-dictionary"
import { getTranslatedCollection } from "@lib/util/translations"
import { Locale } from "@lib/i18n/config"
import { Text } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import FooterSelectors from "@modules/layout/components/footer-selectors"

interface FooterProps {
  params: {
    locale: Locale
  }
}

/**
 * Loading skeleton for footer sections
 */
const FooterSkeleton = () => (
  <div className="animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-4">
          <div className="h-6 bg-nxl-navy/30 rounded w-32"></div>
          <div className="space-y-2">
            {[...Array(3)].map((_, j) => (
              <div key={j} className="h-4 bg-nxl-navy/20 rounded w-24"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
)

/**
 * Enhanced Collections Section with translation support
 */
const CollectionsSection = ({
  collections,
  locale,
  dictionary
}: {
  collections: HttpTypes.StoreCollection[]
  locale: Locale
  dictionary: any
}) => {
  // Fallback translation mapping for collection titles
  const getCollectionTitle = (collection: HttpTypes.StoreCollection): string => {
    // Try to get translated title first
    const translatedCollection = getTranslatedCollection(collection, locale)
    let title = translatedCollection.title || collection.title

    // Fallback French translations for common collection names
    if (locale === 'fr') {
      const frenchTitles: Record<string, string> = {
        'OUR FAVORITES': 'NOS FAVORIS',
        'Our Favorites': 'Nos Favoris',
        'FAVORITES': 'FAVORIS',
        'Favorites': 'Favoris',
        'FEATURED': 'VEDETTE',
        'Featured': 'Vedette',
        'NEW ARRIVALS': 'NOUVEAUTÉS',
        'New Arrivals': 'Nouveautés',
        'PICKS': 'SÉLECTIONS',
        'Picks': 'Sélections',
        'OUR PICKS': 'NOS SÉLECTIONS',
        'Our Picks': 'Nos Sélections'
      }
      title = frenchTitles[title] || title
    }

    return title
  }

  if (!collections || collections.length === 0) {
    return (
      <div className="space-y-6">
        <h3 className="font-display text-nxl-gold text-lg uppercase tracking-wider">
          {locale === 'fr' ? 'Collections' : 'Collections'}
        </h3>
        <p className="font-body text-nxl-ivory/70 text-sm">
          {locale === 'fr' ? 'Aucune collection disponible' : 'No collections available'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="font-display text-nxl-gold text-lg uppercase tracking-wider">
        {locale === 'fr' ? 'Collections' : 'Collections'}
      </h3>
      <nav aria-label={locale === 'fr' ? 'Navigation des collections' : 'Collections navigation'}>
        <ul className="space-y-3">
          {collections.slice(0, 4).map((collection) => {
            const displayTitle = getCollectionTitle(collection)

            return (
              <li key={collection.id}>
                <LocalizedClientLink
                  href={`/collections/${collection.handle}`}
                  className="font-body text-nxl-ivory hover:text-nxl-gold transition-colors duration-300 flex items-center group focus:outline-none focus:ring-2 focus:ring-nxl-gold focus:ring-opacity-50 rounded-md"
                  aria-label={`${locale === 'fr' ? 'Voir la collection' : 'View collection'} ${displayTitle}`}
                >
                  <span>{displayTitle}</span>
                  <svg
                    className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </LocalizedClientLink>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}

/**
 * Enhanced Footer Component with comprehensive error handling and optimization
 */
export default async function Footer({ params }: FooterProps) {
  try {
    // Fetch dictionary first as it's essential
    const dictionary = await getDictionary(params.locale)

    // Build translation fields for collections
    const translationsField = params.locale ? `,+translations.${params.locale}` : ""

    // Parallel data fetching for better performance
    const [collectionsResult, categoriesResult, regionsResult] = await Promise.allSettled([
      // Fixed: listCollections returns StoreCollection[] directly, not { collections }
      listCollections({
        fields: `id,handle,title,metadata${translationsField}`,
        limit: 6 // Limit to 6 collections for footer display
      }).catch(error => {
        console.warn('Failed to load collections for footer:', error)
        return []
      }),

      listCategories({
        fields: "id,name,handle,parent_category_id",
        limit: 4 // Only need a few categories for footer
      }).catch(error => {
        console.warn('Failed to load categories for footer:', error)
        return []
      }),

      listRegions().catch(error => {
        console.warn('Failed to load regions for footer:', error)
        return []
      })
    ])

    // Extract results with fallbacks
    const collections = collectionsResult.status === 'fulfilled' ? collectionsResult.value : []
    const productCategories = categoriesResult.status === 'fulfilled' ? categoriesResult.value : []
    const regions = regionsResult.status === 'fulfilled' ? regionsResult.value : []

    return (
      <footer className="w-full bg-gradient-to-t from-nxl-black via-nxl-navy to-nxl-green relative overflow-hidden border-t border-nxl-gold border-opacity-20">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-5" aria-hidden="true">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-nxl-gold rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-nxl-gold rounded-full blur-2xl" />
        </div>

        <div className="content-container relative z-10">
          <div className="flex flex-col gap-y-16 py-16 lg:py-20">
            {/* Enhanced header with logo and tagline */}
            <header className="flex flex-col items-center text-center mb-8">
              <LocalizedClientLink
                href="/"
                className="font-display text-3xl lg:text-4xl tracking-wider text-nxl-gold hover:text-nxl-gold-light uppercase transition-colors duration-300 mb-4 focus:outline-none focus:ring-2 focus:ring-nxl-gold focus:ring-opacity-50 rounded-md"
                aria-label={`${dictionary.general?.title || 'Next X Level'} - ${dictionary.navigation?.home || 'Home'}`}
              >
                Next <span className="text-nxl-gold">X</span> Level
              </LocalizedClientLink>
              <p className="font-body text-nxl-ivory text-lg max-w-2xl mx-auto leading-relaxed">
                {dictionary.footer?.premiumDescription || 'Premium Canadian apparel designed for every moment—from the chalet fireside to the city nightlife.'}
              </p>
              <div className="w-24 h-px bg-nxl-gold mx-auto mt-6" aria-hidden="true" />
            </header>

            {/* Main footer content in responsive grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {/* 1. Enhanced Navigation column */}
              <nav className="space-y-6" aria-labelledby="nav-heading">
                <h3 id="nav-heading" className="font-display text-nxl-gold text-lg uppercase tracking-wider">
                  {dictionary.footer?.navigation || 'Navigation'}
                </h3>
                <ul className="space-y-3" role="list">
                  <li>
                    <LocalizedClientLink
                      href="/"
                      className="font-body text-nxl-ivory hover:text-nxl-gold transition-colors duration-300 flex items-center group focus:outline-none focus:ring-2 focus:ring-nxl-gold focus:ring-opacity-50 rounded-md"
                    >
                      <span>{dictionary.navigation?.home || 'Home'}</span>
                      <svg className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </LocalizedClientLink>
                  </li>
                  <li>
                    <LocalizedClientLink
                      href="/store"
                      className="font-body text-nxl-ivory hover:text-nxl-gold transition-colors duration-300 flex items-center group focus:outline-none focus:ring-2 focus:ring-nxl-gold focus:ring-opacity-50 rounded-md"
                    >
                      <span>{dictionary.navigation?.shop || 'Store'}</span>
                      <svg className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </LocalizedClientLink>
                  </li>

                  <li>
                    <LocalizedClientLink
                      href="/contact"
                      className="font-body text-nxl-ivory hover:text-nxl-gold transition-colors duration-300 flex items-center group focus:outline-none focus:ring-2 focus:ring-nxl-gold focus:ring-opacity-50 rounded-md"
                    >
                      <span>{dictionary.navigation?.contact || 'Contact'}</span>
                      <svg className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </LocalizedClientLink>
                  </li>
                </ul>
              </nav>

              {/* 2. Enhanced Collections with translation support */}
              <Suspense fallback={<FooterSkeleton />}>
                <CollectionsSection
                  collections={collections}
                  locale={params.locale}
                  dictionary={dictionary}
                />
              </Suspense>

              {/* 3. Enhanced Contact Info */}
              <address className="space-y-6 not-italic" aria-labelledby="contact-heading">
                <h3 id="contact-heading" className="font-display text-nxl-gold text-lg uppercase tracking-wider">
                  {dictionary.footer?.contactUs || 'Contact Us'}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-nxl-gold mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="font-body text-nxl-ivory text-sm">
                        {params.locale === 'fr' ? 'Courriel' : 'Email'}
                      </p>
                      <a
                        href="mailto:info@nextxlevel.com"
                        className="font-body text-nxl-gold hover:text-nxl-gold-light transition-colors focus:outline-none focus:ring-2 focus:ring-nxl-gold focus:ring-opacity-50 rounded-md"
                        aria-label={`${params.locale === 'fr' ? 'Envoyer un courriel à' : 'Send email to'} info@nextxlevel.com`}
                      >
                        info@nextxlevel.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-nxl-gold mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="font-body text-nxl-ivory text-sm">
                        {params.locale === 'fr' ? 'Emplacement' : 'Location'}
                      </p>
                      <p className="font-body text-nxl-ivory text-sm">
                        {params.locale === 'fr' ? 'Montréal, Canada' : 'Montreal, Canada'}
                      </p>
                    </div>
                  </div>

                  {/* Enhanced Social Links */}
                  <div className="pt-4">
                    <p className="font-body text-nxl-ivory text-sm mb-3">
                      {dictionary.footer?.follow || 'Follow Us'}
                    </p>
                    <div className="flex space-x-4" role="list" aria-label={params.locale === 'fr' ? 'Liens de médias sociaux' : 'Social media links'}>
                      <a
                        href="#"
                        className="text-nxl-gold hover:text-nxl-gold-light transition-colors duration-300 hover:scale-110 transform focus:outline-none focus:ring-2 focus:ring-nxl-gold focus:ring-opacity-50 rounded-md"
                        aria-label="Instagram"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </a>
                      <a
                        href="#"
                        className="text-nxl-gold hover:text-nxl-gold-light transition-colors duration-300 hover:scale-110 transform focus:outline-none focus:ring-2 focus:ring-nxl-gold focus:ring-opacity-50 rounded-md"
                        aria-label="Facebook"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </a>
                      <a
                        href="#"
                        className="text-nxl-gold hover:text-nxl-gold-light transition-colors duration-300 hover:scale-110 transform focus:outline-none focus:ring-2 focus:ring-nxl-gold focus:ring-opacity-50 rounded-md"
                        aria-label="Twitter"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </address>

              {/* 4. Enhanced Settings & Selectors */}
              <div className="space-y-6" aria-labelledby="settings-heading">
                <h3 id="settings-heading" className="font-display text-nxl-gold text-lg uppercase tracking-wider">
                  {dictionary.footer?.settings || 'Settings'}
                </h3>
                <div className="space-y-4">
                  <Suspense fallback={<div className="animate-pulse h-20 bg-nxl-navy/30 rounded"></div>}>
                    <FooterSelectors regions={regions} dictionary={dictionary} />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced bottom section */}
          <div className="border-t border-nxl-gold border-opacity-20 pt-8 pb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <Text className="font-body text-nxl-ivory text-sm text-center md:text-left">
                © {new Date().getFullYear()} Next X Level. {dictionary.footer?.madein || 'Proudly made in Canada.'}
              </Text>
              <nav className="flex flex-wrap gap-6 text-sm" aria-label={params.locale === 'fr' ? 'Liens légaux' : 'Legal links'}>
                <LocalizedClientLink
                  href="/privacy"
                  className="font-body text-nxl-ivory hover:text-nxl-gold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-nxl-gold focus:ring-opacity-50 rounded-md"
                >
                  {dictionary.footer?.privacy || 'Privacy Policy'}
                </LocalizedClientLink>
                <LocalizedClientLink
                  href="/terms"
                  className="font-body text-nxl-ivory hover:text-nxl-gold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-nxl-gold focus:ring-opacity-50 rounded-md"
                >
                  {dictionary.footer?.terms || 'Terms & Conditions'}
                </LocalizedClientLink>
                <LocalizedClientLink
                  href="/shipping"
                  className="font-body text-nxl-ivory hover:text-nxl-gold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-nxl-gold focus:ring-opacity-50 rounded-md"
                >
                  {dictionary.footer?.shipping || 'Shipping & Returns'}
                </LocalizedClientLink>
              </nav>
            </div>
          </div>
        </div>
      </footer>
    )
  } catch (error) {
    console.error('Footer component error:', error)

    // Fallback footer in case of critical errors
    return (
      <footer className="w-full bg-nxl-black border-t border-nxl-gold border-opacity-20 py-8">
        <div className="content-container">
          <div className="text-center">
            <LocalizedClientLink
              href="/"
              className="font-display text-2xl text-nxl-gold hover:text-nxl-gold-light transition-colors"
            >
              Next X Level
            </LocalizedClientLink>
            <p className="font-body text-nxl-ivory text-sm mt-4">
              © {new Date().getFullYear()} Next X Level. Made in Canada.
            </p>
          </div>
        </div>
      </footer>
    )
  }
}
