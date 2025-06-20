import React, { Suspense, useState, useEffect, useRef } from "react"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "../product-preview"
import { useIntersection } from "@lib/hooks/use-in-view"

interface MobileProductGridProps {
    products: HttpTypes.StoreProduct[]
    region: HttpTypes.StoreRegion
    locale?: string
    className?: string
    showLoadMore?: boolean
    onLoadMore?: () => void
    loading?: boolean
    hasMore?: boolean
    gridCols?: "2" | "3" | "auto"
}

const ProductGridSkeleton = ({ count = 6 }: { count?: number }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 mobile-gap">
        {Array.from({ length: count }).map((_, i) => (
            <div
                key={i}
                className="bg-nxl-black/20 border border-nxl-gold/10 rounded-lg overflow-hidden animate-pulse"
            >
                <div className="aspect-product bg-nxl-navy/20" />
                <div className="p-4 space-y-3">
                    <div className="h-3 bg-nxl-navy/20 rounded w-1/2" />
                    <div className="h-4 bg-nxl-navy/20 rounded w-3/4" />
                    <div className="h-4 bg-nxl-navy/20 rounded w-1/2" />
                    <div className="flex justify-between items-center pt-2">
                        <div className="h-3 bg-nxl-navy/20 rounded w-1/3" />
                        <div className="h-3 bg-nxl-navy/20 rounded w-1/4" />
                    </div>
                </div>
            </div>
        ))}
    </div>
)

const LoadMoreButton = ({
    onLoadMore,
    loading,
    hasMore
}: {
    onLoadMore: () => void
    loading: boolean
    hasMore: boolean
}) => {
    if (!hasMore) {
        return (
            <div className="text-center py-8">
                <p className="text-nxl-ivory/60 text-sm">
                    You've seen all our amazing products! 🎉
                </p>
            </div>
        )
    }

    return (
        <div className="flex justify-center pt-8 pb-4">
            <button
                onClick={onLoadMore}
                disabled={loading}
                className="nxl-btn-secondary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-nxl-gold border-t-transparent rounded-full animate-spin" />
                        <span>Loading...</span>
                    </div>
                ) : (
                    "Load More Products"
                )}
            </button>
        </div>
    )
}

const MobileProductGrid: React.FC<MobileProductGridProps> = ({
    products,
    region,
    locale = "en",
    className = "",
    showLoadMore = false,
    onLoadMore,
    loading = false,
    hasMore = false,
    gridCols = "auto",
}) => {
    const [isClient, setIsClient] = useState(false)
    const loadMoreRef = useRef<HTMLDivElement>(null)
    const inView = useIntersection(loadMoreRef, "0px")

    // Handle client-side hydration
    useEffect(() => {
        setIsClient(true)
    }, [])

    // Auto-trigger load more when in view (infinite scroll)
    useEffect(() => {
        if (inView && hasMore && !loading && onLoadMore && showLoadMore) {
            onLoadMore()
        }
    }, [inView, hasMore, loading, onLoadMore, showLoadMore])

    // Dynamic grid classes based on screen size and preference
    const getGridClasses = () => {
        switch (gridCols) {
            case "2":
                return "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            case "3":
                return "grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            default:
                return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
        }
    }

    if (!isClient) {
        return <ProductGridSkeleton count={8} />
    }

    if (!products || products.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="max-w-md mx-auto space-y-4">
                    <div className="w-16 h-16 mx-auto bg-nxl-navy/20 rounded-full flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-nxl-ivory/40"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-5h2m0 0V5a2 2 0 00-2-2H6a2 2 0 00-2 2v3m0 0h16"
                            />
                        </svg>
                    </div>
                    <h3 className="nxl-heading text-xl">
                        {locale === 'fr' ? 'Aucun produit trouvé' : 'No Products Found'}
                    </h3>
                    <p className="nxl-body text-nxl-ivory/60">
                        {locale === 'fr'
                            ? 'Nous n\'avons trouvé aucun produit correspondant à vos critères.'
                            : 'We couldn\'t find any products matching your criteria.'
                        }
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className={`mobile-product-grid ${className}`}>
            {/* Product Grid */}
            <div
                className={`grid ${getGridClasses()} mobile-gap mobile-tap-highlight-none`}
                role="grid"
                aria-label={`Product grid showing ${products.length} products`}
            >
                {products.map((product, index) => (
                    <div
                        key={product.id}
                        role="gridcell"
                        className="group relative"
                        style={{
                            // Staggered animation delay for smooth loading
                            animationDelay: `${index * 50}ms`,
                        }}
                    >
                        <Suspense
                            fallback={
                                <div className="bg-nxl-black/20 border border-nxl-gold/10 rounded-lg overflow-hidden animate-pulse">
                                    <div className="aspect-product bg-nxl-navy/20" />
                                    <div className="p-4 space-y-3">
                                        <div className="h-3 bg-nxl-navy/20 rounded w-1/2" />
                                        <div className="h-4 bg-nxl-navy/20 rounded w-3/4" />
                                        <div className="h-4 bg-nxl-navy/20 rounded w-1/2" />
                                    </div>
                                </div>
                            }
                        >
                            <ProductPreview
                                product={product}
                                region={region}
                                locale={locale}
                                isFeatured={index < 3} // First 3 products are featured
                            />
                        </Suspense>
                    </div>
                ))}
            </div>

            {/* Load More Section */}
            {showLoadMore && (
                <div
                    ref={loadMoreRef}
                    className="mt-8"
                >
                    <LoadMoreButton
                        onLoadMore={onLoadMore || (() => { })}
                        loading={loading}
                        hasMore={hasMore}
                    />
                </div>
            )}

            {/* Loading indicator overlay for infinite scroll */}
            {loading && showLoadMore && (
                <div className="flex justify-center py-4">
                    <div className="flex items-center gap-2 text-nxl-ivory/60">
                        <div className="w-4 h-4 border-2 border-nxl-gold border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm">
                            {locale === 'fr' ? 'Chargement...' : 'Loading more products...'}
                        </span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MobileProductGrid 