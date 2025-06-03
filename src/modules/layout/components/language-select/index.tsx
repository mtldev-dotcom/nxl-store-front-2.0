"use client"

import { useParams, usePathname, useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { i18nConfig, Locale } from "@lib/i18n/config"
import { useDictionary } from "@lib/i18n/use-dictionary"

const LanguageSelect = () => {
  const { countryCode, locale } = useParams()
  const router = useRouter()
  const pathname = usePathname()
  const dictionary = useDictionary()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [dropdownRef])

  // Get language display names from dictionary
  const getLanguageName = (localeCode: string): string => {
    // Access dictionary values safely
    if (dictionary && 
        typeof dictionary.navigation === 'object' && 
        dictionary.navigation && 
        typeof dictionary.navigation.languages === 'object' && 
        dictionary.navigation.languages) {
      
      // Now safely access the specific language properties
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
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center gap-x-2 text-sm font-medium text-nxl-ivory hover:text-nxl-gold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-nxl-gold/50 focus:ring-opacity-50 rounded-md p-1"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={dictionary?.navigation?.language || "Language"}
      >
        <span className="whitespace-nowrap">{getLanguageName(locale as string)}</span>
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
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </button>

      {isOpen && (
        <div 
          className="absolute top-full right-0 mt-2 bg-nxl-black/95 shadow-lg border border-nxl-gold/40 rounded-md z-50 backdrop-blur-sm min-w-max"
          role="listbox"
        >
          <div className="py-2">
            {i18nConfig.locales.map((localeOption) => (
              <button
                key={localeOption}
                role="option"
                aria-selected={localeOption === locale}
                className={`w-full px-6 py-2.5 text-left text-sm hover:bg-nxl-navy/70 hover:text-nxl-gold transition-colors duration-200 font-medium
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
  )
}

export default LanguageSelect
