"use client"

import { Text, clx } from "@medusajs/ui"
import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { useState } from "react"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { useTranslation } from "@lib/context/translation-context"
import { useCart } from "@lib/context/cart-context"

type MobileCartItemProps = {
    item: HttpTypes.StoreCartLineItem
    currencyCode: string
    dictionary?: any
}

const MobileCartItem = ({ item, currencyCode, dictionary }: MobileCartItemProps) => {
    const { translate } = useTranslation()
    const { refreshCart } = useCart()
    const [updating, setUpdating] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isRemoving, setIsRemoving] = useState(false)

    const changeQuantity = async (quantity: number) => {
        setError(null)
        setUpdating(true)

        try {
            await updateLineItem({
                lineId: item.id,
                quantity,
            })
            // Refresh cart after successful update
            await refreshCart()
        } catch (err: any) {
            setError(err.message || translate("cart", "updateError", "Failed to update quantity"))
        } finally {
            setUpdating(false)
        }
    }

    const handleDeleteStart = () => {
        setIsRemoving(true)
        setError(null)
    }

    const handleDeleteComplete = async () => {
        // Refresh cart after successful deletion
        try {
            await refreshCart()
        } catch (error) {
            console.error('Failed to refresh cart after deletion:', error)
        }
    }

    const handleDeleteError = (errorMessage: string) => {
        setError(errorMessage)
        setIsRemoving(false)
    }

    const maxQtyFromInventory = 10
    const maxQuantity = item.variant?.manage_inventory ? 10 : maxQtyFromInventory

    // Get translated product title (if available) or fallback to original
    const productTitle = (dictionary?.products && item.product_handle && dictionary.products[item.product_handle]?.title) || item.product_title

    if (isRemoving) {
        return (
            <div className="bg-nxl-black/40 backdrop-blur-sm border border-red-500/30 rounded-xl p-4 sm:p-6 animate-pulse">
                <div className="flex items-center justify-center h-20">
                    <div className="flex items-center gap-2 text-red-400">
                        <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                        <span className="text-sm font-medium">{translate("cart", "removing", "Removing item...")}</span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-nxl-black/60 backdrop-blur-sm border border-nxl-gold/30 rounded-xl p-4 sm:p-6 transition-all duration-300 hover:border-nxl-gold/50 hover:bg-nxl-black/70 cart-item-enhanced">
            <div className="flex gap-4">
                {/* Product Image */}
                <LocalizedClientLink
                    href={`/products/${item.product_handle}`}
                    className="flex-shrink-0 mobile-touch-target"
                >
                    <div className="relative">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-nxl-gold/20 bg-nxl-black/40">
                            <Thumbnail
                                thumbnail={item.thumbnail}
                                images={item.variant?.product?.images}
                                size="square"
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                        </div>
                        <div className="absolute inset-0 rounded-xl ring-1 ring-nxl-gold/10" />
                    </div>
                </LocalizedClientLink>

                {/* Product Info */}
                <div className="flex-1 min-w-0 space-y-3">
                    {/* Product Title */}
                    <div>
                        <LocalizedClientLink href={`/products/${item.product_handle}`}>
                            <Text
                                className="text-base sm:text-lg font-semibold text-nxl-gold hover:text-nxl-gold/80 transition-colors line-clamp-2 mb-1"
                                data-testid="product-title"
                            >
                                {productTitle}
                            </Text>
                        </LocalizedClientLink>

                        {/* Product Variant */}
                        <div className="text-sm text-nxl-ivory/70">
                            <LineItemOptions variant={item.variant} data-testid="product-variant" />
                        </div>
                    </div>

                    {/* Price Information */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="text-xs text-nxl-ivory/60 font-medium">
                                {translate("cart", "unitPrice", "Unit Price")}
                            </div>
                            <div className="text-sm font-medium text-nxl-ivory">
                                <LineItemUnitPrice
                                    item={item}
                                    style="tight"
                                    currencyCode={currencyCode}
                                />
                            </div>
                        </div>
                        <div className="text-right space-y-1">
                            <div className="text-xs text-nxl-ivory/60 font-medium">
                                {translate("cart", "totalPrice", "Total")}
                            </div>
                            <div className="text-lg font-bold text-nxl-gold">
                                <LineItemPrice
                                    item={item}
                                    style="tight"
                                    currencyCode={currencyCode}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between pt-2 border-t border-nxl-gold/20">
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-nxl-ivory/70 font-medium">
                                {translate("cart", "quantity", "Quantity")}:
                            </span>
                            <div className="flex items-center border border-nxl-gold/40 rounded-xl bg-nxl-black/60 shadow-sm">
                                <button
                                    onClick={() => changeQuantity(Math.max(1, item.quantity - 1))}
                                    disabled={updating || item.quantity <= 1}
                                    className={clx(
                                        "mobile-touch-target w-10 h-10 flex items-center justify-center text-nxl-gold font-bold transition-all duration-200 rounded-l-xl",
                                        "hover:bg-nxl-gold/10 active:bg-nxl-gold/20 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed",
                                        updating && "pointer-events-none"
                                    )}
                                    data-testid="quantity-decrease"
                                    aria-label={translate("cart", "decreaseQuantity", "Decrease quantity")}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                    </svg>
                                </button>

                                <div className="min-w-[48px] h-10 flex items-center justify-center text-nxl-ivory font-bold text-base border-x border-nxl-gold/20 bg-nxl-black/80">
                                    {updating ? (
                                        <div className="w-4 h-4 border-2 border-nxl-gold/30 border-t-nxl-gold rounded-full animate-spin" />
                                    ) : (
                                        item.quantity
                                    )}
                                </div>

                                <button
                                    onClick={() => changeQuantity(Math.min(maxQuantity, item.quantity + 1))}
                                    disabled={updating || item.quantity >= maxQuantity}
                                    className={clx(
                                        "mobile-touch-target w-10 h-10 flex items-center justify-center text-nxl-gold font-bold transition-all duration-200 rounded-r-xl",
                                        "hover:bg-nxl-gold/10 active:bg-nxl-gold/20 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed",
                                        updating && "pointer-events-none"
                                    )}
                                    data-testid="quantity-increase"
                                    aria-label={translate("cart", "increaseQuantity", "Increase quantity")}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Delete Button */}
                        <div className="flex items-center gap-2">
                            <div className="text-xs text-nxl-ivory/50 font-medium">
                                {translate("cart", "maxQuantity", "Max")}: {maxQuantity}
                            </div>
                            <DeleteButton
                                id={item.id}
                                className="mobile-delete-button"
                                onDeleteStart={handleDeleteStart}
                                onDeleteComplete={handleDeleteComplete}
                                onDeleteError={handleDeleteError}
                                autoRefreshCart={false}
                                data-testid="product-delete-button"
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mt-3">
                            <ErrorMessage error={error} data-testid="product-error-message" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MobileCartItem 