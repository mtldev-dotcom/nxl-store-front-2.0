"use client"

import { useState } from "react"
import { useParams, useRouter, usePathname } from "next/navigation"
import { clx } from "@medusajs/ui"
import { ArrowRightMini } from "@medusajs/icons"
import CountrySelect from "../country-select"
import { useToggleState } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import { i18nConfig, Locale } from "@lib/i18n/config"

interface FooterSelectorsProps {
  regions: HttpTypes.StoreRegion[] | null
  dictionary?: Record<string, any>
}

const FooterSelectors = ({ regions, dictionary }: FooterSelectorsProps) => {
  const { countryCode, locale } = useParams()
  const router = useRouter()
  const pathname = usePathname()
  const toggleState = useToggleState()
  const [isLangOpen, setIsLangOpen] = useState(false)

  // Get language display names from dictionary
  const getLanguageName = (localeCode: string): string => {
    // Access dictionary values safely
    if (dictionary && 
        typeof dictionary.navigation === 'object' && 
        dictionary.navigation && 
        typeof dictionary.navigation.languages === 'object' && 
        dictionary.navigation.languages) {
      
      // Safely access the specific language properties
      const languages = dictionary.navigation.languages as any;
      
      if (localeCode === "en" && languages.english) {
        return languages.english;
      } else if (localeCode === "fr" && languages.french) {
        return languages.french;
      }
    }
    
    // Fallback if translation is missing
    switch (localeCode) {
      case "en":
        return locale === "fr" ? "Anglais" : "English"
      case "fr":
        return locale === "fr" ? "Français" : "French"
      default:
        return localeCode.toUpperCase()
    }
  }

  // Handle language change
  const handleLanguageChange = (newLocale: Locale) => {
    if (newLocale === locale) return

    // Replace current locale in pathname with new locale
    const pathSegments = pathname.split("/")
    
    // The locale is always the third segment ([0] is empty, [1] is countryCode, [2] is locale)
    pathSegments[2] = newLocale
    
    // Build new path and navigate
    const newPath = pathSegments.join("/")
    router.push(newPath)
    setIsLangOpen(false)
  }

  // Get footer labels for language and country from dictionary
  const langLabel = dictionary?.footer?.language || (locale === "fr" ? "Langue" : "Language")
  const countryLabel = dictionary?.footer?.country || (locale === "fr" ? "Pays" : "Country")

  return (
    <div className="flex flex-col gap-y-5 font-body">
      <div className="flex flex-col gap-3">
        <span className="font-serif text-base text-nxl-gold">
          {langLabel}
        </span>
        <div className="relative">
          <button
            className="flex items-center gap-x-2 text-nxl-ivory hover:text-nxl-gold transition-colors"
            onClick={() => setIsLangOpen(!isLangOpen)}
            aria-haspopup="true"
            aria-expanded={isLangOpen}
          >
            <span>{getLanguageName(locale as string)}</span>
            <span className="h-4 w-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`h-4 w-4 transition-transform duration-300 ${
                  isLangOpen ? "rotate-180" : "rotate-0"
                }`}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </span>
          </button>

          {isLangOpen && (
            <div className="absolute top-full left-0 mt-1 bg-nxl-black/95 border border-nxl-gold/40 rounded-md z-50 w-40 shadow-lg shadow-black/20 backdrop-blur-sm">
              <div className="py-1">
                {i18nConfig.locales.map((localeOption) => (
                  <button
                    key={localeOption}
                    role="option"
                    aria-selected={localeOption === locale}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-nxl-navy/70 hover:text-nxl-gold transition-colors duration-200 font-medium
                      ${localeOption === locale 
                        ? "bg-nxl-navy/40 text-nxl-gold" 
                        : "text-nxl-ivory/95"
                      }
                    `}
                    onClick={() => handleLanguageChange(localeOption)}
                  >
                    {getLanguageName(localeOption)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="font-serif text-base text-nxl-gold">
          {countryLabel}
        </span>
        <div 
          className="relative"
        >
          {regions && (
            <div 
              className="flex items-center gap-x-2 text-nxl-ivory hover:text-nxl-gold transition-colors cursor-pointer"
              onClick={() => toggleState.toggle()}
            >
              <CountrySelect
                toggleState={toggleState}
                regions={regions}
                dictionary={dictionary}
              />
              <ArrowRightMini
                className={clx(
                  "transition-transform duration-300",
                  toggleState.state ? "-rotate-90" : ""
                )}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FooterSelectors
