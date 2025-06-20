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
  stock_status?: 'in_stock' | 'out_of_stock' | 'low_stock' | 'all'
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
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.08 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="font-serif text-xl text-white drop-shadow-lg mb-2">
            {locale === 'fr' ? 'Région Non Disponible' : 'Region Not Available'}
          </h3>
          <p className="text-white/90 drop-shadow-md">
            {locale === 'fr'
              ? 'Nous ne desservons pas actuellement cette région.'
              : 'We\'re currently not serving this region.'}
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

    // Enhanced client-side filtering with stock status
    let filteredProducts = products

    // Apply price filtering
    if (searchParams?.min_price || searchParams?.max_price) {
      const minPrice = searchParams.min_price ? parseFloat(searchParams.min_price) : 0
      const maxPrice = searchParams.max_price ? parseFloat(searchParams.max_price) : Infinity

      filteredProducts = filteredProducts.filter(product => {
        if (!product.variants?.length) return false

        const prices = product.variants
          .map(variant => variant.calculated_price?.calculated_amount)
          .filter(price => price !== undefined && price !== null) as number[]

        if (prices.length === 0) return false

        const minProductPrice = Math.min(...prices) / 100 // Convert from cents
        return minProductPrice >= minPrice && minProductPrice <= maxPrice
      })
    }

    // Enhanced stock status filtering
    if (searchParams?.stock_status && searchParams.stock_status !== 'all') {
      filteredProducts = filteredProducts.filter(product => {
        const totalStock = product.variants?.reduce((total, variant) =>
          total + (variant.inventory_quantity || 0), 0) || 0

        switch (searchParams.stock_status) {
          case 'in_stock':
            return totalStock > 5 // More than 5 items in stock
          case 'low_stock':
            return totalStock > 0 && totalStock <= 5 // 1-5 items in stock
          case 'out_of_stock':
            return totalStock === 0 // No stock
          default:
            return true
        }
      })
    }

    // Update count after filtering
    const filteredCount = filteredProducts.length
    const totalPages = Math.ceil(filteredCount / PRODUCT_LIMIT)

    // Apply pagination to filtered results
    const startIndex = (page - 1) * PRODUCT_LIMIT
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + PRODUCT_LIMIT)

    // Enhanced empty state
    if (paginatedProducts.length === 0) {
      const hasFilters = searchParams && (
        searchParams.category_id?.length ||
        searchParams.collection_id?.length ||
        searchParams.min_price ||
        searchParams.max_price ||
        searchParams.q ||
        (searchParams.stock_status && searchParams.stock_status !== 'all')
      )

      return (
        <div className="flex items-center justify-center py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-nxl-gold-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-nxl-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="font-serif text-xl text-white drop-shadow-lg mb-2">
              {locale === 'fr' ? 'Aucun Produit Trouvé' : 'No Products Found'}
            </h3>
            <p className="text-white/90 drop-shadow-md mb-4">
              {hasFilters
                ? locale === 'fr'
                  ? 'Essayez d\'ajuster vos filtres ou critères de recherche.'
                  : 'Try adjusting your filters or search criteria.'
                : locale === 'fr'
                  ? 'Aucun produit n\'est disponible pour le moment.'
                  : 'No products are available at the moment.'
              }
            </p>
            <a
              href="/store"
              className="inline-block px-6 py-2 border border-nxl-gold text-nxl-gold hover:bg-nxl-gold-muted/10 transition-colors rounded-md"
            >
              {locale === 'fr' ? 'Effacer les Filtres' : 'Clear Filters'}
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
      if (searchParams.stock_status && searchParams.stock_status !== 'all') count += 1
      return count
    }

    const activeFiltersCount = getActiveFiltersCount()

    // Calculate stock statistics for better user information
    const stockStats = products.reduce((stats, product) => {
      const totalStock = product.variants?.reduce((total, variant) =>
        total + (variant.inventory_quantity || 0), 0) || 0

      if (totalStock === 0) stats.outOfStock++
      else if (totalStock <= 5) stats.lowStock++
      else stats.inStock++

      return stats
    }, { inStock: 0, lowStock: 0, outOfStock: 0 })

    return (
      <div className="space-y-8">
        {/* Enhanced Results Summary with Stock Information */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-white/90 drop-shadow-sm">
                {locale === "fr"
                  ? `Affichage ${startIndex + 1}-${Math.min(startIndex + PRODUCT_LIMIT, filteredCount)} sur ${filteredCount} produits`
                  : `Showing ${startIndex + 1}-${Math.min(startIndex + PRODUCT_LIMIT, filteredCount)} of ${filteredCount} products`
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

          {/* Stock Statistics Summary */}
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-white/80">
                {stockStats.inStock} {locale === 'fr' ? 'en stock' : 'in stock'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="text-white/80">
                {stockStats.lowStock} {locale === 'fr' ? 'stock faible' : 'low stock'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-white/80">
                {stockStats.outOfStock} {locale === 'fr' ? 'rupture' : 'out of stock'}
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Products Grid with optimized responsive breakpoints */}
        <ul
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-4 md:gap-6 lg:gap-8"
          data-testid="products-list"
        >
          {paginatedProducts.map((product, index) => {
            return (
              <li
                key={product.id}
                className="animate-fade-in-up"
                style={{
                  animationDelay: `${index * 0.05}s`,
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

        {/* Enhanced Pagination with better accessibility */}
        {totalPages > 1 && (
          <div className="flex justify-center pt-8">
            <Pagination
              data-testid="product-pagination"
              page={page}
              totalPages={totalPages}
            />
          </div>
        )}

        {/* Enhanced Load More Button for Large Collections */}
        {totalPages > 1 && page < totalPages && (
          <div className="text-center pt-4">
            <div className="space-y-2">
              <button
                onClick={() => {
                  const url = new URL(window.location.href)
                  url.searchParams.set('page', String(page + 1))
                  window.location.href = url.toString()
                }}
                className="inline-block px-8 py-3 border border-nxl-gold text-nxl-gold hover:bg-nxl-gold hover:text-nxl-black transition-all duration-300 font-button uppercase tracking-wider rounded-md"
              >
                {dictionary.store?.loadMore || (locale === 'fr' ? 'Charger Plus' : 'Load More Products')}
              </button>
              <p className="text-xs text-white/60">
                {locale === 'fr'
                  ? `Page ${page} sur ${totalPages}`
                  : `Page ${page} of ${totalPages}`}
              </p>
            </div>
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error('Error loading products:', error)

    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.08 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="font-serif text-xl text-white drop-shadow-lg mb-2">
            {locale === 'fr' ? 'Erreur de Chargement' : 'Error Loading Products'}
          </h3>
          <p className="text-white/90 drop-shadow-md mb-4">
            {locale === 'fr'
              ? 'Il y a eu un problème lors du chargement des produits. Veuillez réessayer.'
              : 'There was an issue loading the products. Please try again.'}
          </p>
          <div className="space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="inline-block px-6 py-2 border border-nxl-gold text-nxl-gold hover:bg-nxl-gold-muted/10 transition-colors rounded-md"
            >
              {locale === 'fr' ? 'Réessayer' : 'Try Again'}
            </button>
            <a
              href="/store"
              className="inline-block px-6 py-2 bg-nxl-gold text-nxl-black hover:bg-nxl-gold/90 transition-colors rounded-md"
            >
              {locale === 'fr' ? 'Retour au Magasin' : 'Return to Store'}
            </a>
          </div>
        </div>
      </div>
    )
  }
}
