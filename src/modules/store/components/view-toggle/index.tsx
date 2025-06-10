"use client"

import { useState, useEffect } from "react"
import { getDictionary } from "@lib/i18n/get-dictionary"
import { Locale } from "@lib/i18n/config"

type ViewType = "grid" | "list"

interface ViewToggleProps {
  locale?: Locale
}

const ViewToggle = ({ locale = "en" }: ViewToggleProps) => {
  const [viewType, setViewType] = useState<ViewType>("grid")
  const [dictionary, setDictionary] = useState<any>(null)

  useEffect(() => {
    const loadTranslations = async () => {
      const dict = await getDictionary(locale)
      setDictionary(dict)
    }
    loadTranslations()
  }, [locale])

  return (
    <div className="flex items-center space-x-1 bg-nxl-navy/30 rounded-sm border border-nxl-gold/20 p-1">
      {/* Grid View Button */}
      <button
        onClick={() => setViewType("grid")}
        className={`p-2 rounded-sm transition-all duration-200 ${
          viewType === "grid"
            ? "bg-nxl-gold text-nxl-black"
            : "text-white/80 hover:text-nxl-gold hover:bg-nxl-gold/10"
        }`}
        aria-label={dictionary?.store?.viewToggle?.grid || "Grid view"}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      </button>

      {/* List View Button */}
      <button
        onClick={() => setViewType("list")}
        className={`p-2 rounded-sm transition-all duration-200 ${
          viewType === "list"
            ? "bg-nxl-gold text-nxl-black"
            : "text-white/80 hover:text-nxl-gold hover:bg-nxl-gold/10"
        }`}
        aria-label={dictionary?.store?.viewToggle?.list || "List view"}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      </button>
    </div>
  )
}

export default ViewToggle
