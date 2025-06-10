"use client"

import { useEffect, useState } from "react"
import FilterRadioGroup from "@modules/common/components/filter-radio-group"
import { getDictionary } from "@lib/i18n/get-dictionary"
import { Locale } from "@lib/i18n/config"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  "data-testid"?: string
  locale?: Locale
}

const SortProducts = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
  locale = "en"
}: SortProductsProps) => {
  const [dictionary, setDictionary] = useState<any>(null)

  useEffect(() => {
    const loadTranslations = async () => {
      const dict = await getDictionary(locale)
      setDictionary(dict)
    }
    loadTranslations()
  }, [locale])

  const handleChange = (value: SortOptions) => {
    setQueryParams("sortBy", value)
  }

  if (!dictionary) {
    return <div className="h-20 bg-nxl-navy/10 rounded animate-pulse"></div>
  }

  const sortOptions = [
    {
      value: "created_at",
      label: dictionary.store?.filters?.sortOptions?.created_at || "Latest Arrivals",
    },
    {
      value: "price_asc",
      label: dictionary.store?.filters?.sortOptions?.price_asc || "Price: Low to High",
    },
    {
      value: "price_desc",
      label: dictionary.store?.filters?.sortOptions?.price_desc || "Price: High to Low",
    },
  ]

  return (
    <FilterRadioGroup
      title={dictionary.store?.filters?.sortBy || "Sort by"}
      items={sortOptions}
      value={sortBy}
      handleChange={handleChange}
      data-testid={dataTestId}
    />
  )
}

export default SortProducts
