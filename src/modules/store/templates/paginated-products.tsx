import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getDictionary } from "@lib/i18n/get-dictionary"
import { Locale } from "@lib/i18n/config"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
  q?: string
  price_list_id?: string[]
}

type SearchParams = {
  category_id?: string[]
  collection_id?: string[]
  min_price?: string
  max_price?: string
  q?: string
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
  locale,
  searchParams,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
  locale?: string
  searchParams?: SearchParams
}) {
  const dictionary = await getDictionary(locale as Locale || "en")

  const queryParams: PaginatedProductsParams = {
    limit: PRODUCT_LIMIT,
  }

  // Handle legacy single collection/category props (for category/collection pages)
  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  // Handle new searchParams filtering (for store page)
  if (searchParams) {
    // Handle category filtering
    if (searchParams.category_id?.length) {
      queryParams["category_id"] = searchParams.category_id
    }

    // Handle collection filtering - ensure it's properly formatted
    if (searchParams.collection_id?.length) {
      // For single collection, pass as string; for multiple, pass as array
      if (searchParams.collection_id.length === 1) {
        queryParams["collection_id"] = searchParams.collection_id
      } else {
        queryParams["collection_id"] = searchParams.collection_id
      }
    }

    // Handle search query
    if (searchParams.q) {
      queryParams["q"] = searchParams.q
    }

    // Price filtering will be handled client-side for now
    // as Medusa doesn't natively support price range filtering in the store API
  }

  // Note: Price sorting will be handled by the listProductsWithSort function
  // which has built-in client-side sorting logic

  const region = await getRegion(countryCode)

  if (!region) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <h3 className="font-serif text-xl text-white drop-shadow-lg mb-2">
            Region Not Available
          </h3>
          <p className="text-white/90 drop-shadow-md">
            We're currently not serving this region.
          </p>
        </div>
      </div>
    )
  }

  try {
    let {
      response: { products, count },
    } = await listProductsWithSort({
      page,
      queryParams,
      sortBy,
      countryCode,
      locale,
    })

    // Apply client-side price filtering if needed
    if (searchParams?.min_price || searchParams?.max_price) {
      const minPrice = searchParams.min_price ? parseFloat(searchParams.min_price) : 0
      const maxPrice = searchParams.max_price ? parseFloat(searchParams.max_price) : Infinity

      products = products.filter(product => {
        if (!product.variants?.length) return false

        const prices = product.variants
          .map(variant => variant.calculated_price?.calculated_amount)
          .filter(price => price !== undefined && price !== null) as number[]

        if (prices.length === 0) return false

        const minProductPrice = Math.min(...prices) / 100 // Convert from cents
        return minProductPrice >= minPrice && minProductPrice <= maxPrice
      })

      count = products.length
    }

    const totalPages = Math.ceil(count / PRODUCT_LIMIT)

    if (products.length === 0) {
      return (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-nxl-gold-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-nxl-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="font-serif text-xl text-white drop-shadow-lg mb-2">
              No Products Found
            </h3>
            <p className="text-white/90 drop-shadow-md mb-4">
              Try adjusting your filters or search criteria.
            </p>
            <a
              href="/store"
              className="inline-block px-6 py-2 border border-nxl-gold text-nxl-gold hover:bg-nxl-gold-muted/10 transition-colors"
            >
              Clear Filters
            </a>
          </div>
        </div>
      )
    }

    const getSortLabel = (sortOption: SortOptions) => {
      const locale_code = locale || "en"

      switch (sortOption) {
        case "price_asc":
          return locale_code === "fr" ? "Prix: Du Plus Bas au Plus Haut" : "Price: Low to High"
        case "price_desc":
          return locale_code === "fr" ? "Prix: Du Plus Haut au Plus Bas" : "Price: High to Low"
        default:
          return sortOption
      }
    }

    const getActiveFiltersCount = () => {
      if (!searchParams) return 0
      let count = 0
      if (searchParams.category_id?.length) count += searchParams.category_id.length
      if (searchParams.collection_id?.length) count += searchParams.collection_id.length
      if (searchParams.min_price || searchParams.max_price) count += 1
      if (searchParams.q) count += 1
      return count
    }

    const activeFiltersCount = getActiveFiltersCount()

    return (
      <div className="space-y-8">
        {/* Results Summary with Active Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-white/90 drop-shadow-sm">
              {locale === "fr"
                ? `Affichage ${((page - 1) * PRODUCT_LIMIT) + 1}-${Math.min(page * PRODUCT_LIMIT, count)} sur ${count} produits`
                : `Showing ${((page - 1) * PRODUCT_LIMIT) + 1}-${Math.min(page * PRODUCT_LIMIT, count)} of ${count} products`
              }
            </p>
            {activeFiltersCount > 0 && (
              <p className="text-nxl-gold drop-shadow-sm text-xs">
                {locale === "fr"
                  ? `${activeFiltersCount} filtre${activeFiltersCount > 1 ? 's' : ''} actif${activeFiltersCount > 1 ? 's' : ''}`
                  : `${activeFiltersCount} active filter${activeFiltersCount > 1 ? 's' : ''}`
                }
              </p>
            )}
          </div>
          {sortBy && (
            <p className="text-white/90 drop-shadow-sm">
              {locale === "fr" ? "Trié par" : "Sorted by"}: <span className="text-nxl-gold">{getSortLabel(sortBy)}</span>
            </p>
          )}
        </div>

        {/* Products Grid */}
        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
          data-testid="products-list"
        >
          {products.map((product, index) => {
            return (
              <li
                key={product.id}
                className="animate-fade-in-up"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: 'both'
                }}
              >
                <ProductPreview
                  product={product}
                  region={region}
                  locale={locale}
                />
              </li>
            )
          })}
        </ul>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center pt-8">
            <Pagination
              data-testid="product-pagination"
              page={page}
              totalPages={totalPages}
            />
          </div>
        )}

        {/* Load More Button for Large Collections */}
        {totalPages > 1 && page < totalPages && (
          <div className="text-center pt-4">
            <button
              onClick={() => {
                const url = new URL(window.location.href)
                url.searchParams.set('page', String(page + 1))
                window.location.href = url.toString()
              }}
              className="inline-block px-8 py-3 border border-nxl-gold text-nxl-gold hover:bg-nxl-gold hover:text-nxl-black transition-all duration-300 font-button uppercase tracking-wider"
            >
              {dictionary.store?.loadMore || "Load More Products"}
            </button>
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error('Error loading products:', error)

    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.08 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="font-serif text-xl text-white drop-shadow-lg mb-2">
            Error Loading Products
          </h3>
          <p className="text-white/90 drop-shadow-md mb-4">
            There was an issue loading the products. Please try again.
          </p>
          <a
            href="/store"
            className="inline-block px-6 py-2 border border-nxl-gold text-nxl-gold hover:bg-nxl-gold-muted/10 transition-colors"
          >
            Return to Store
          </a>
        </div>
      </div>
    )
  }
}
