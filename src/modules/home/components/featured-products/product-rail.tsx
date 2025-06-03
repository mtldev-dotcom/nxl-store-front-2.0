/**
 * ProductRail Component
 * ----------------------
 * Purpose:
 *   • Display a small grid (“rail”) of up to 4 products from a given collection.
 *   • Fetches products for the collection and formats their prices for the current region.
 *
 * Props:
 *   - collection: StoreCollection object (id, title, handle) to fetch products for.
 *   - region:     StoreRegion object (currency_code, etc.) for price localization.
 *
 * Flow:
 *   1. Fetch up to 4 products that belong to the collection (by collection.id).
 *   2. Extract products array; if none, render nothing.
 *   3. Render:
 *      a. Header row with collection title and “View Collection” link.
 *      b. Responsive grid of product cards (up to 4 items).
 *         – Each card links to the product page.
 *         – Displays thumbnail, title, and price (with optional sale price strike-through).
 */

import { HttpTypes } from "@medusajs/types"
import { listProducts } from "@lib/data/products"      // Data fetcher for products
import { getProductPrice } from "@lib/util/get-product-price" // Helper to compute price details
import { convertToLocale } from "@lib/util/money"     // Formats numbers into locale currency
import LocalizedClientLink from "@modules/common/components/localized-client-link" // Link with locale prefix
import Image from "next/image"                       // Next.js optimized image component

// Props type for clarity and TypeScript support
type ProductRailProps = {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}

export default async function ProductRail({
  collection,
  region,
}: ProductRailProps) {
  // 1. Fetch a maximum of 4 products for this collection
  const response = await listProducts({
    queryParams: {
      collection_id: [collection.id], // Filter by this collection’s ID
      limit: 4,                        // Only need up to 4 products
    },
    regionId: region.id,              // Provide region ID to satisfy backend requirement
  })

  // 2. Extract products array safely; fallback to empty array
  const products = response?.response?.products || []

  // 3. If no products found, render nothing (avoid empty section)
  if (products.length === 0) {
    return null
  }

  // 4. Render the rail container
  return (
    <div className="flex flex-col gap-y-4">
      {/* Header row: Title + View Collection link */}
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-2xl text-nxl-ivory">
          {collection.title}
        </h3>
        <LocalizedClientLink
          href={`/collections/${collection.handle}`}
          className="text-sm font-button uppercase text-nxl-gold hover:text-nxl-gold/80 transition-colors duration-200 flex items-center"
        >
          View Collection
          {/* Arrow icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4 ml-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </LocalizedClientLink>
      </div>

      {/* Grid of product cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          // 5. Compute pricing details for the product
          const price = getProductPrice({ product })
          if (!price) {
            // If pricing fails, skip this product
            return null
          }

          return (
            <LocalizedClientLink
              key={product.id}
              href={`/products/${product.handle}`}
              className="group"
            >
              {/* Card container with hover effects */}
              <div className="nxl-card hover:border-nxl-gold/60 transition-all duration-300">
                {/* Image container */}
                <div className="relative h-80 mb-4 overflow-hidden">
                  {product.thumbnail && (
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                </div>
                {/* Title & Price section */}
                <div className="p-4">
                  {/* Product title */}
                  <h4 className="font-button text-nxl-ivory text-lg mb-1 group-hover:text-nxl-gold transition-colors duration-300">
                    {product.title}
                  </h4>
                  {/* Price display */}
                  <p className="font-body text-nxl-gold text-sm">
                    {/* Current price formatted to locale */}
                    {convertToLocale({
                      amount: price.cheapestPrice?.calculated_price_number || 0,
                      currency_code: region.currency_code,
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    {/* If there's a discount, show original price struck-through */}
                    {price.cheapestPrice?.calculated_price_number !==
                      price.cheapestPrice?.original_price_number && (
                      <span className="line-through text-nxl-ivory/50 ml-2">
                        {convertToLocale({
                          amount:
                            price.cheapestPrice?.original_price_number || 0,
                          currency_code: region.currency_code,
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </LocalizedClientLink>
          )
        })}
      </div>
    </div>
  )
}
