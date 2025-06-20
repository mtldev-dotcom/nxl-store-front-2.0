import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreHeader from "@modules/store/components/store-header"
import ViewToggle from "@modules/store/components/view-toggle"
import { getDictionary } from "@lib/i18n/get-dictionary"
import { Locale } from "@lib/i18n/config"
import { listMainCategories } from "@lib/data/categories"
import { listMainCollections } from "@lib/data/collections"

import PaginatedProducts from "./paginated-products"

type StoreSearchParams = {
  category_id?: string[]
  collection_id?: string[]
  min_price?: string
  max_price?: string
  q?: string
}

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

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
  locale,
  searchParams,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  locale?: string
  searchParams?: StoreSearchParams
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "price_asc"
  const dictionary = await getDictionary(locale as Locale || "en")

  // Fetch categories and collections data on the server side
  let categories: CategoryWithCount[] = []
  let collections: CollectionWithCount[] = []

  try {
    const [categoriesData, collectionsData] = await Promise.all([
      listMainCategories(),
      listMainCollections(),
    ])

    categories = categoriesData.categories || []
    collections = collectionsData.collections || []
  } catch (error) {
    console.error('Error loading filter data:', error)
    // Use empty arrays as fallback
  }

  return (
    <>
      {/* Store Header with Hero Section */}
      <StoreHeader locale={locale as Locale} />

      <div className="bg-nxl-black min-h-screen">
        <div className="content-container py-12">
          {/* Breadcrumbs */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <a href="/" className="text-white/80 hover:text-nxl-gold transition-colors">
                  {dictionary.navigation?.home || "Home"}
                </a>
              </li>
              <li className="text-white/50">/</li>
              <li className="text-nxl-gold font-medium">
                {dictionary.navigation?.shop || "Store"}
              </li>
            </ol>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-start gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-80 lg:sticky lg:top-8">
              <RefinementList
                sortBy={sort}
                locale={locale as Locale}
                categories={categories}
                collections={collections}
              />
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              {/* Page Header with Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-display text-white drop-shadow-lg uppercase tracking-wider mb-2" data-testid="store-page-title">
                    {dictionary.store?.allProducts || "All Products"}
                  </h1>
                  <p className="text-white/90 drop-shadow-md font-body">
                    {dictionary.store?.description || "Discover our complete collection of premium golf apparel"}
                  </p>
                </div>

                {/* View Toggle and Sort Controls */}
                <div className="flex items-center gap-4">
                  <ViewToggle locale={locale as Locale} />
                </div>
              </div>

              {/* Products Grid with Loading State */}
              <Suspense fallback={<SkeletonProductGrid />}>
                <PaginatedProducts
                  sortBy={sort}
                  page={pageNumber}
                  countryCode={countryCode}
                  locale={locale}
                  searchParams={searchParams}
                />
              </Suspense>
            </main>
          </div>
        </div>
      </div>
    </>
  )
}

export default StoreTemplate
