"use client"

import { useParams, usePathname, useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { i18nConfig, Locale } from "@lib/i18n/config"
import { useDictionary } from "@lib/i18n/use-dictionary"

const LanguageSelect = () => {
  const { countryCode, locale } = useParams() as { countryCode: string; locale: string }
  const router = useRouter()
  const pathname = usePathname()
  const dictionary = useDictionary()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLanguageChange = (newLocale: Locale) => {
    if (newLocale === locale) return
    const pathSegments = pathname.split("/")
    pathSegments[2] = newLocale
    router.push(pathSegments.join("/"))
    setIsOpen(false)
  }

  // Display target language code
  const code = locale === "fr" ? "EN" : "FR"

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-charcoal)] focus:outline-none cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={dictionary?.navigation?.language || "Language"}
      >
        <span className="text-nxl-gold font-medium">{code}</span>
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
                onClick={() => handleLanguageChange(localeOption as Locale)}
              >
                {localeOption.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default LanguageSelect
