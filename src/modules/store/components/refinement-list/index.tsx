"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState, useEffect } from "react"
import { getDictionary } from "@lib/i18n/get-dictionary"
import { Locale } from "@lib/i18n/config"

import SortProducts, { SortOptions } from "./sort-products"

type CategoryWithCount = {
  id: string
  name: string
  handle: string
  product_count: number
}

type CollectionWithCount = {
  id: string
  title: string
  handle: string
  product_count: number
}

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  'data-testid'?: string
  locale?: Locale
  categories: CategoryWithCount[]
  collections: CollectionWithCount[]
}

const RefinementList = ({
  sortBy,
  'data-testid': dataTestId,
  locale = "en",
  categories = [],
  collections = []
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [dictionary, setDictionary] = useState<any>(null)

  // Get current filters from URL
  const selectedCategories = searchParams.getAll('category_id') || []
  const selectedCollections = searchParams.getAll('collection_id') || []
  const minPrice = searchParams.get('min_price') || ''
  const maxPrice = searchParams.get('max_price') || ''

  useEffect(() => {
    const loadTranslations = async () => {
      const dict = await getDictionary(locale)
      setDictionary(dict)
    }
    loadTranslations()
  }, [locale])

  const createQueryString = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const params = new URLSearchParams(searchParams)

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
          params.delete(key)
        } else if (Array.isArray(value)) {
          params.delete(key)
          value.forEach(v => params.append(key, v))
        } else {
          params.set(key, value)
        }
      })

      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString({ [name]: value })
    router.push(`${pathname}?${query}`)
  }

  const toggleCategoryFilter = (categoryId: string) => {
    const newSelection = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId]

    const query = createQueryString({ category_id: newSelection })
    router.push(`${pathname}?${query}`)
  }

  const toggleCollectionFilter = (collectionId: string) => {
    const newSelection = selectedCollections.includes(collectionId)
      ? selectedCollections.filter(id => id !== collectionId)
      : [...selectedCollections, collectionId]

    const query = createQueryString({ collection_id: newSelection })
    router.push(`${pathname}?${query}`)
  }

  const applyPriceFilter = () => {
    const query = createQueryString({
      min_price: minPrice || null,
      max_price: maxPrice || null
    })
    router.push(`${pathname}?${query}`)
  }

  const clearAllFilters = () => {
    const query = createQueryString({
      category_id: null,
      collection_id: null,
      min_price: null,
      max_price: null
    })
    router.push(`${pathname}?${query}`)
  }

  const setPrice = (value: string, type: 'min' | 'max') => {
    if (type === 'min') {
      const query = createQueryString({ min_price: value || null })
      router.replace(`${pathname}?${query}`, { scroll: false })
    } else {
      const query = createQueryString({ max_price: value || null })
      router.replace(`${pathname}?${query}`, { scroll: false })
    }
  }

  if (!dictionary) {
    return <div className="bg-nxl-navy/20 rounded-sm border border-nxl-gold-muted p-6 h-64 animate-pulse"></div>
  }

  return (
    <div className="bg-nxl-navy/20 rounded-sm border border-nxl-gold-muted p-6">
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
        {categories.length > 0 && (
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
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => toggleCategoryFilter(category.id)}
                    />
                    <div className={`w-4 h-4 border border-nxl-gold-muted rounded-sm mr-3 group-hover:border-nxl-gold transition-colors flex items-center justify-center ${selectedCategories.includes(category.id) ? 'bg-nxl-gold border-nxl-gold' : ''
                      }`}>
                      {selectedCategories.includes(category.id) && (
                        <svg className="w-3 h-3 text-nxl-black" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-white/95 drop-shadow-sm group-hover:text-nxl-gold transition-colors">
                      {category.name}
                    </span>
                  </div>
                  <span className="text-white/70 drop-shadow-sm text-sm">({category.product_count})</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Collections */}
        {collections.length > 0 && (
          <div>
            <h3 className="font-serif text-white drop-shadow-md text-lg mb-4">
              {dictionary.store?.filters?.collections || "Collections"}
            </h3>
            <div className="space-y-3">
              {collections.map((collection) => (
                <label key={collection.id} className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={selectedCollections.includes(collection.id)}
                      onChange={() => toggleCollectionFilter(collection.id)}
                    />
                    <div className={`w-4 h-4 border border-nxl-gold-muted rounded-sm mr-3 group-hover:border-nxl-gold transition-colors flex items-center justify-center ${selectedCollections.includes(collection.id) ? 'bg-nxl-gold border-nxl-gold' : ''
                      }`}>
                      {selectedCollections.includes(collection.id) && (
                        <svg className="w-3 h-3 text-nxl-black" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-white/95 drop-shadow-sm group-hover:text-nxl-gold transition-colors">
                      {collection.title}
                    </span>
                  </div>
                  <span className="text-white/70 drop-shadow-sm text-sm">({collection.product_count})</span>
                </label>
              ))}
            </div>
          </div>
        )}

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
                value={minPrice}
                onChange={(e) => setPrice(e.target.value, 'min')}
                className="w-full px-3 py-2 bg-nxl-black border border-nxl-gold-muted rounded-sm text-white/95 focus:border-nxl-gold focus:outline-none"
              />
              <span className="text-white/70">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setPrice(e.target.value, 'max')}
                className="w-full px-3 py-2 bg-nxl-black border border-nxl-gold-muted rounded-sm text-white/95 focus:border-nxl-gold focus:outline-none"
              />
            </div>
            <button
              onClick={applyPriceFilter}
              className="w-full py-2 bg-nxl-gold text-nxl-black font-button uppercase tracking-wider hover:bg-nxl-gold-light transition-colors duration-200 text-sm"
            >
              {dictionary.store?.filters?.apply || "Apply"}
            </button>
          </div>
        </div>

        {/* Clear Filters */}
        {(selectedCategories.length > 0 || selectedCollections.length > 0 || minPrice || maxPrice) && (
          <button
            onClick={clearAllFilters}
            className="w-full py-2 border border-nxl-gold-muted text-nxl-gold font-button uppercase tracking-wider hover:bg-nxl-gold-muted/10 transition-colors duration-200 text-sm"
          >
            {dictionary.store?.filters?.clearAll || "Clear All Filters"}
          </button>
        )}
      </div>
    </div>
  )
}

export default RefinementList
