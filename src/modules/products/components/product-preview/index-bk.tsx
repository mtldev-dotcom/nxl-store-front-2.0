import { Text } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import { getTranslatedProduct, StoreProductWithTranslations } from "@lib/util/translations"
import { Suspense } from "react"

export default async function ProductPreview({
    product,
    isFeatured,
    region,
    locale,
}: {
    product: HttpTypes.StoreProduct
    isFeatured?: boolean
    region: HttpTypes.StoreRegion
    locale?: string
}) {
    // Get translated product data (optional, falls back to original if no translations)
    const translatedProduct = locale ? getTranslatedProduct(product as StoreProductWithTranslations, locale) : product

    const { cheapestPrice } = getProductPrice({
        product,
    })

    // Enhanced stock calculations
    const totalStock = product.variants?.reduce((total, variant) =>
        total + (variant.inventory_quantity || 0), 0) || 0
    const hasStock = totalStock > 0
    const isLowStock = totalStock > 0 && totalStock <= 5
    const stockLevel = totalStock

    // Calculate discount percentage if on sale
    const discountPercentage = cheapestPrice && cheapestPrice.price_type === "sale" ?
        parseInt(cheapestPrice.percentage_diff) : 0

    const isOnSale = cheapestPrice?.price_type === "sale"
    const isNewProduct = new Date(product.created_at || '').getTime() > Date.now() - (30 * 24 * 60 * 60 * 1000) // 30 days

    // Enhanced stock status helper
    const getStockStatus = () => {
        if (!hasStock) return { color: 'text-red-600', bg: 'bg-red-500', label: locale === 'fr' ? 'Rupture' : 'Out of Stock' }
        if (isLowStock) return { color: 'text-orange-600', bg: 'bg-orange-500', label: locale === 'fr' ? 'Stock faible' : 'Low Stock' }
        return { color: 'text-green-600', bg: 'bg-green-500', label: locale === 'fr' ? 'En stock' : 'In Stock' }
    }

    const stockStatus = getStockStatus()

    return (
        <article
            className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-nxl-gold/50 transition-all duration-300 hover:shadow-luxury mobile-tap-feedback focus-within:ring-2 focus-within:ring-nxl-gold focus-within:ring-offset-2"
            data-testid="product-wrapper"
        >
            {/* Product Image Container with improved aspect ratio and loading */}
            <div className="relative overflow-hidden aspect-[4/5] bg-gray-50">
                <LocalizedClientLink
                    href={`/products/${product.handle}`}
                    className="block w-full h-full"
                    aria-label={`View ${translatedProduct.title} product details`}
                >
                    <Suspense fallback={
                        <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
                            <div className="w-8 h-8 border-2 border-nxl-gold border-t-transparent rounded-full animate-spin" />
                        </div>
                    }>
                        <Thumbnail
                            thumbnail={product.thumbnail}
                            images={product.images}
                            size="full"
                            isFeatured={isFeatured}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    </Suspense>
                </LocalizedClientLink>

                {/* Enhanced Badge System with better positioning and contrast */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                    {/* Sale Badge - Highest priority */}
                    {isOnSale && discountPercentage > 0 && (
                        <span className="bg-red-500 text-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full shadow-lg">
                            -{discountPercentage}% OFF
                        </span>
                    )}

                    {/* New Badge - Secondary priority (only if not on sale) */}
                    {!isOnSale && isNewProduct && (
                        <span className="bg-nxl-gold text-nxl-black px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full shadow-lg">
                            {locale === 'fr' ? 'Nouveau' : 'New'}
                        </span>
                    )}

                    {/* Low Stock Warning Badge - Third priority */}
                    {!isOnSale && !isNewProduct && isLowStock && (
                        <span className="bg-orange-500 text-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full shadow-lg animate-pulse">
                            {locale === 'fr' ? 'Stock Faible' : 'Low Stock'}
                        </span>
                    )}
                </div>

                {/* Enhanced Stock status overlay for out-of-stock items */}
                {!hasStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                        <div className="text-center">
                            <span className="bg-white text-gray-900 px-4 py-2 rounded-md font-medium text-sm mb-2 block">
                                {locale === 'fr' ? 'Rupture de stock' : 'Out of Stock'}
                            </span>
                            <button className="text-white/80 text-xs hover:text-white underline">
                                {locale === 'fr' ? 'Me notifier' : 'Notify Me'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Wishlist button - desktop hover, always visible on mobile */}
                <button
                    className="absolute top-3 right-3 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100 md:opacity-100 shadow-lg"
                    aria-label={`Add ${translatedProduct.title} to wishlist`}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                </button>

                {/* Quick view button - desktop only */}
                <button className="absolute bottom-3 right-3 z-10 bg-nxl-black text-white px-3 py-2 text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-nxl-gold hover:text-nxl-black hidden md:block">
                    {locale === 'fr' ? 'Aperçu rapide' : 'Quick View'}
                </button>
            </div>

            {/* Enhanced Product Information with improved spacing and hierarchy */}
            <div className="p-4 space-y-3">
                {/* Brand/Category */}
                {product.type?.value && (
                    <Text className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                        {product.type.value}
                    </Text>
                )}

                {/* Product Title with better typography */}
                <LocalizedClientLink
                    href={`/products/${product.handle}`}
                    className="block"
                >
                    <h3
                        className="text-gray-900 font-medium text-base leading-tight line-clamp-2 group-hover:text-nxl-gold transition-colors duration-200 min-h-[2.5rem] flex items-start"
                        data-testid="product-title"
                    >
                        {translatedProduct.title}
                    </h3>
                </LocalizedClientLink>

                {/* Enhanced Rating Stars with better styling */}
                <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                        <svg
                            key={i}
                            className="w-4 h-4 text-yellow-400 fill-current"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ))}
                    <span className="text-xs text-gray-500 ml-1">(0)</span>
                </div>

                {/* Enhanced Pricing Section with improved layout */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        {cheapestPrice && (
                            <PreviewPrice price={cheapestPrice} />
                        )}
                    </div>

                    {/* Enhanced Stock indicator with more details */}
                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1.5 mb-1">
                            <div className={`w-2 h-2 rounded-full ${stockStatus.bg}`} />
                            <Text className={`text-xs font-medium ${stockStatus.color}`}>
                                {stockStatus.label}
                            </Text>
                        </div>
                        {hasStock && (
                            <Text className="text-xs text-gray-500">
                                {stockLevel} {locale === 'fr' ? 'disponible' : 'available'}
                            </Text>
                        )}
                    </div>
                </div>

                {/* Enhanced Add to Cart Button - Always visible with better styling and loading state */}
                <button
                    className={`w-full py-3 px-4 text-sm font-semibold rounded-lg transition-all duration-200 relative overflow-hidden ${hasStock
                        ? 'bg-nxl-gold text-nxl-black hover:bg-nxl-gold/90 active:bg-nxl-gold/80 hover:shadow-md'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                    disabled={!hasStock}
                    aria-label={`${hasStock ? 'Add' : 'Cannot add'} ${translatedProduct.title} to cart`}
                >
                    <span className="flex items-center justify-center gap-2">
                        {hasStock ? (
                            <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="9" cy="21" r="1"></circle>
                                    <circle cx="20" cy="21" r="1"></circle>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                </svg>
                                {locale === 'fr' ? 'Ajouter au panier' : 'Add to Cart'}
                            </>
                        ) : (
                            <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M8.5 8.5l7 7"></path>
                                    <path d="M15.5 8.5l-7 7"></path>
                                </svg>
                                {locale === 'fr' ? 'Non disponible' : 'Unavailable'}
                            </>
                        )}
                    </span>
                </button>

                {/* Enhanced Size/Color variants preview with better information */}
                {product.variants && product.variants.length > 1 && (
                    <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                                {locale === 'fr' ? 'Variantes:' : 'Variants:'}
                            </span>
                            <div className="flex gap-1">
                                {product.variants.slice(0, 3).map((variant, index) => (
                                    <div
                                        key={variant.id}
                                        className="w-4 h-4 rounded-full border border-gray-300 bg-gray-100"
                                        title={variant.title || undefined}
                                    />
                                ))}
                                {product.variants.length > 3 && (
                                    <span className="text-xs text-gray-500">
                                        +{product.variants.length - 3}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Total variants count */}
                        <span className="text-xs text-gray-500">
                            {product.variants.length} {locale === 'fr' ? 'options' : 'options'}
                        </span>
                    </div>
                )}

                {/* Enhanced Product Details Preview */}
                {product.description && (
                    <div className="pt-2 border-t border-gray-100">
                        <Text className="text-xs text-gray-600 line-clamp-2">
                            {product.description.substring(0, 80)}...
                        </Text>
                    </div>
                )}
            </div>
        </article>
    )
}
