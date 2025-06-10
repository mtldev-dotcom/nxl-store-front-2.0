"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState, useEffect } from "react"
import { getDictionary } from "@lib/i18n/get-dictionary"
import { Locale } from "@lib/i18n/config"

import SortProducts, { SortOptions } from "./sort-products"

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  'data-testid'?: string
  locale?: Locale
}

const RefinementList = ({ sortBy, 'data-testid': dataTestId, locale = "en" }: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [dictionary, setDictionary] = useState<any>(null)

  useEffect(() => {
    const loadTranslations = async () => {
      const dict = await getDictionary(locale)
      setDictionary(dict)
    }
    loadTranslations()
  }, [locale])

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}?${query}`)
  }

  if (!dictionary) {
    return <div className="bg-nxl-navy/20 rounded-sm border border-nxl-gold/20 p-6 h-64 animate-pulse"></div>
  }

  // Category filter options with translations
  const categories = [
    { id: "polos", label: dictionary.store?.categories?.polos || "Polo Shirts", count: 12 },
    { id: "hoodies", label: dictionary.store?.categories?.hoodies || "Hoodies & Sweatshirts", count: 8 },
    { id: "joggers", label: dictionary.store?.categories?.joggers || "Joggers & Pants", count: 6 },
    { id: "caps", label: dictionary.store?.categories?.caps || "Caps & Hats", count: 4 },
    { id: "accessories", label: dictionary.store?.categories?.accessories || "Accessories", count: 5 },
  ]

  // Size filter options
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"]

  // Color filter options
  const colors = [
    { name: "Black", class: "bg-black", value: "black" },
    { name: "White", class: "bg-white border border-gray-300", value: "white" },
    { name: "Navy", class: "bg-blue-900", value: "navy" },
    { name: "Gray", class: "bg-gray-500", value: "gray" },
    { name: "Green", class: "bg-green-700", value: "green" },
  ]

  return (
    <div className="bg-nxl-navy/20 rounded-sm border border-nxl-gold/20 p-6">
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="lg:hidden w-full flex items-center justify-between text-nxl-gold font-serif text-lg mb-4"
      >
        <span>{dictionary.store?.filters?.title || "Filters"}</span>
        <svg
          className={`w-5 h-5 transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className={`space-y-8 ${isCollapsed ? 'hidden lg:block' : 'block'}`}>
        {/* Sort Options */}
        <div>
          <SortProducts sortBy={sortBy} setQueryParams={setQueryParams} data-testid={dataTestId} locale={locale} />
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-serif text-white drop-shadow-md text-lg mb-4">
            {dictionary.store?.filters?.categories || "Categories"}
          </h3>
          <div className="space-y-3">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="sr-only"
                  />
                  <div className="w-4 h-4 border border-nxl-gold/50 rounded-sm mr-3 group-hover:border-nxl-gold transition-colors flex items-center justify-center">
                    <svg className="w-3 h-3 text-nxl-gold opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-white/95 drop-shadow-sm group-hover:text-nxl-gold transition-colors">
                    {category.label}
                  </span>
                </div>
                <span className="text-white/70 drop-shadow-sm text-sm">({category.count})</span>
              </label>
            ))}
          </div>
        </div>

        {/* Size Filter */}
        <div>
          <h3 className="font-serif text-white drop-shadow-md text-lg mb-4">
            {dictionary.store?.filters?.size || "Size"}
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                className="p-2 border border-nxl-gold/30 rounded-sm text-white/95 drop-shadow-sm hover:border-nxl-gold hover:bg-nxl-gold/10 transition-all duration-200 text-sm"
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color Filter */}
        <div>
          <h3 className="font-serif text-white drop-shadow-md text-lg mb-4">
            {dictionary.store?.filters?.color || "Color"}
          </h3>
          <div className="grid grid-cols-5 gap-3">
            {colors.map((color) => (
              <button
                key={color.value}
                className={`w-8 h-8 rounded-sm ${color.class} hover:ring-2 hover:ring-nxl-gold transition-all duration-200`}
                title={color.name}
                aria-label={color.name}
              />
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="font-serif text-white drop-shadow-md text-lg mb-4">
            {dictionary.store?.filters?.priceRange || "Price Range"}
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                className="w-full px-3 py-2 bg-nxl-black border border-nxl-gold/30 rounded-sm text-white/95 focus:border-nxl-gold focus:outline-none"
              />
              <span className="text-white/70">-</span>
              <input
                type="number"
                placeholder="Max"
                className="w-full px-3 py-2 bg-nxl-black border border-nxl-gold/30 rounded-sm text-white/95 focus:border-nxl-gold focus:outline-none"
              />
            </div>
            <button className="w-full py-2 bg-nxl-gold text-nxl-black font-button uppercase tracking-wider hover:bg-nxl-gold/90 transition-colors duration-200 text-sm">
              {dictionary.store?.filters?.apply || "Apply"}
            </button>
          </div>
        </div>

        {/* Clear Filters */}
        <button className="w-full py-2 border border-nxl-gold/30 text-nxl-gold font-button uppercase tracking-wider hover:bg-nxl-gold/10 transition-colors duration-200 text-sm">
          {dictionary.store?.filters?.clearAll || "Clear All Filters"}
        </button>
      </div>
    </div>
  )
}

export default RefinementList
