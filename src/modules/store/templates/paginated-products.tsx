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
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
  locale,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
  locale?: string
}) {
  const dictionary = await getDictionary(locale as Locale || "en")
  
  const queryParams: PaginatedProductsParams = {
    limit: 12,
  }

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

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

  let {
    response: { products, count },
  } = await listProductsWithSort({
    page,
    queryParams,
    sortBy,
    countryCode,
    locale,
  })

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-16 h-16 bg-nxl-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
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
          <button className="px-6 py-2 border border-nxl-gold text-nxl-gold hover:bg-nxl-gold/10 transition-colors">
            Clear Filters
          </button>
        </div>
      </div>
    )
  }

  const getSortLabel = (sortOption: SortOptions) => {
    const locale_code = locale || "en"
    
    switch(sortOption) {
      case "created_at":
        return locale_code === "fr" ? "Dernières Arrivées" : "Latest Arrivals"
      case "price_asc":
        return locale_code === "fr" ? "Prix: Du Plus Bas au Plus Haut" : "Price: Low to High"
      case "price_desc":
        return locale_code === "fr" ? "Prix: Du Plus Haut au Plus Bas" : "Price: High to Low"
      default:
        return sortOption
    }
  }

  return (
    <div className="space-y-8">
      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm">
        <p className="text-white/90 drop-shadow-sm">
          {locale === "fr" 
            ? `Affichage ${((page - 1) * PRODUCT_LIMIT) + 1}-${Math.min(page * PRODUCT_LIMIT, count)} sur ${count} produits`
            : `Showing ${((page - 1) * PRODUCT_LIMIT) + 1}-${Math.min(page * PRODUCT_LIMIT, count)} of ${count} products`
          }
        </p>
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
          <a 
            href={`?page=${page + 1}${sortBy ? `&sortBy=${sortBy}` : ''}`}
            className="inline-block px-8 py-3 border border-nxl-gold text-nxl-gold hover:bg-nxl-gold hover:text-nxl-black transition-all duration-300 font-button uppercase tracking-wider"
          >
            {dictionary.store?.loadMore || "Load More Products"}
          </a>
        </div>
      )}
    </div>
  )
}
