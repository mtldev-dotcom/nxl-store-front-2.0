import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreHeader from "@modules/store/components/store-header"
import ViewToggle from "@modules/store/components/view-toggle"
import { getDictionary } from "@lib/i18n/get-dictionary"
import { Locale } from "@lib/i18n/config"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
  locale,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  locale?: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const dictionary = await getDictionary(locale as Locale || "en")

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
              <RefinementList sortBy={sort} locale={locale as Locale} />
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
