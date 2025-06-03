import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { listRegions } from "@lib/data/regions"
import { getDictionary } from "@lib/i18n/get-dictionary"
import { Locale } from "@lib/i18n/config"
import { Text, clx } from "@medusajs/ui"
import { StoreRegion } from "@medusajs/types"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import FooterSelectors from "@modules/layout/components/footer-selectors"

interface FooterProps {
  params: {
    locale: Locale
  }
}

export default async function Footer({ params }: FooterProps) {
  const dictionary = await getDictionary(params.locale)
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <footer className="border-t border-nxl-gold/30 w-full bg-nxl-black text-nxl-ivory">
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-12 py-20">
          {/* Header with logo */}
          <div className="flex justify-center mb-8">
            <LocalizedClientLink
              href="/"
              className="font-display text-2xl tracking-wider text-nxl-gold hover:text-nxl-gold/80 uppercase"
            >
              Next <span className="text-nxl-gold">X</span> Level
            </LocalizedClientLink>
          </div>
          
          {/* Main footer content in 4 columns on desktop, stacked on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* 1. Navigation column */}
            <div className="flex flex-col gap-y-3">
              <span className="font-serif text-base text-nxl-gold mb-2">{dictionary.footer.navigation}</span>
              <ul className="grid grid-cols-1 gap-y-2 text-nxl-ivory font-body">
                <li>
                  <LocalizedClientLink
                    href="/"
                    className="hover:text-nxl-gold transition-colors"
                  >
                    {dictionary.navigation.home}
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/store"
                    className="hover:text-nxl-gold transition-colors"
                  >
                    {dictionary.navigation.shop}
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/about"
                    className="hover:text-nxl-gold transition-colors"
                  >
                    {dictionary.navigation.about}
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/contact"
                    className="hover:text-nxl-gold transition-colors"
                  >
                    {dictionary.navigation.contact}
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>
            
            {/* 2. Description and social links */}
            <div className="flex flex-col gap-4">
              <span className="font-serif text-base text-nxl-gold mb-2">{dictionary.footer.aboutUs}</span>
              <p className="font-body text-nxl-ivory/80">
                {dictionary.footer.premiumDescription}
              </p>
              <div className="mt-4 flex space-x-4">
                <a href="#" className="text-nxl-gold hover:text-nxl-gold/80 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                </a>
                <a href="#" className="text-nxl-gold hover:text-nxl-gold/80 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="#" className="text-nxl-gold hover:text-nxl-gold/80 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </a>
              </div>
            </div>
            
            {/* 3. Contact form */}
            <div className="flex flex-col gap-y-2">
              <span className="font-serif text-base text-nxl-gold mb-2">{dictionary.footer.contactUs}</span>
              <form className="mt-1">
                <div className="flex flex-col gap-y-3">
                  <input 
                    type="email" 
                    placeholder={dictionary.footer.emailPlaceholder || "Your email"} 
                    className="bg-nxl-black border border-nxl-gold/30 rounded px-3 py-2 text-nxl-ivory font-body text-sm focus:outline-none focus:ring-1 focus:ring-nxl-gold/50"
                    required
                  />
                  <textarea 
                    placeholder={dictionary.footer.messagePlaceholder || "Your message"} 
                    className="bg-nxl-black border border-nxl-gold/30 rounded px-3 py-2 text-nxl-ivory font-body text-sm h-20 focus:outline-none focus:ring-1 focus:ring-nxl-gold/50 resize-none"
                    required
                  ></textarea>
                  <button 
                    type="submit" 
                    className="bg-nxl-gold text-nxl-black px-4 py-2 rounded font-body text-sm hover:bg-nxl-gold/90 transition-colors mt-1"
                  >
                    {dictionary.footer.send || "Send"}
                  </button>
                </div>
              </form>
            </div>
            
            {/* 4. Selectors */}
            <div>
              <span className="font-serif text-base text-nxl-gold mb-2 block">{dictionary.footer.settings || "Settings"}</span>
              <div className="mt-1">
                <FooterSelectors regions={regions} dictionary={dictionary} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full mb-16 justify-between text-nxl-ivory/60 font-body">
          <Text className="txt-compact-small">
            © {new Date().getFullYear()} Next X Level. {dictionary.footer.madein}
          </Text>
          <div className="flex gap-4 text-sm">
            <a href="/privacy" className="hover:text-nxl-gold transition-colors">{dictionary.footer.privacy}</a>
            <a href="/terms" className="hover:text-nxl-gold transition-colors">{dictionary.footer.terms}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
