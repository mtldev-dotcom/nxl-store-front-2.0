"use client"

import { useState, useEffect, useMemo } from "react"
import { HttpTypes } from "@medusajs/types"
import { convertToLocale, formatPrice } from "@lib/util/money"
import { useTranslation } from "@lib/context/translation-context"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface SmartCartSummaryProps {
    cart: HttpTypes.StoreCart
    showUpsells?: boolean
    showSavings?: boolean
    dictionary: any
}

const SmartCartSummary = ({
    cart,
    showUpsells = true,
    showSavings = true,
    dictionary
}: SmartCartSummaryProps) => {
    const { translate } = useTranslation()
    const [isExpanded, setIsExpanded] = useState(false)
    const [shippingEstimate, setShippingEstimate] = useState<number>(0)
    const [savingsAmount, setSavingsAmount] = useState<number>(0)

    // Calculate various pricing metrics
    const pricingData = useMemo(() => {
        const subtotal = cart.subtotal || 0
        const shipping = shippingEstimate
        const tax = cart.tax_total || 0
        const discount = cart.discount_total || 0
        const giftCardTotal = cart.gift_card_total || 0
        const total = cart.total || 0

        // Calculate potential savings
        const originalPrice = subtotal + discount // What they would have paid without discounts
        const finalPrice = total
        const totalSavings = originalPrice - finalPrice + giftCardTotal

        // Free shipping progress
        const freeShippingThreshold = 10000 // $100 in cents
        const needsForFreeShipping = Math.max(0, freeShippingThreshold - subtotal)
        const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100)

        return {
            subtotal,
            shipping,
            tax,
            discount,
            giftCardTotal,
            total,
            originalPrice,
            finalPrice,
            totalSavings,
            needsForFreeShipping,
            freeShippingProgress,
            itemCount: cart.items?.length || 0,
            totalQuantity: cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
        }
    }, [cart, shippingEstimate])

    // Format currency
    const formatCurrency = (amount: number) => formatPrice({
        amount,
        currency_code: cart.region?.currency_code || 'USD'
    })

    // Estimate shipping based on location and items
    useEffect(() => {
        // Simulate shipping calculation
        const baseShipping = 500 // $5.00
        const itemWeight = pricingData.totalQuantity * 100 // Rough weight estimate
        const estimated = pricingData.subtotal >= 10000 ? 0 : baseShipping + (itemWeight * 10)
        setShippingEstimate(estimated)
    }, [pricingData])

    // Dynamic upsell suggestions based on cart contents
    const upsellSuggestions = useMemo(() => {
        if (!showUpsells) return []

        // This would typically come from your product recommendation engine
        return [
            {
                id: '1',
                title: 'Premium Gift Wrapping',
                price: 995, // $9.95
                image: '/product-samples/gift-wrap.jpg',
                description: 'Make it special with luxury wrapping',
                tag: 'Popular Add-on'
            },
            {
                id: '2',
                title: 'Express Shipping',
                price: 1500, // $15.00
                image: '/product-samples/express.jpg',
                description: 'Get it tomorrow with express delivery',
                tag: 'Fast Delivery'
            }
        ]
    }, [showUpsells, cart.items])

    return (
        <div className="bg-nxl-black/90 backdrop-blur-sm border border-nxl-gold/40 rounded-xl p-6 shadow-luxury">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-nxl-gold font-display">
                    {dictionary.cart?.summary || "Order Summary"}
                </h2>
                <div className="flex items-center gap-2 text-sm text-nxl-ivory/70">
                    <span>{pricingData.itemCount} items</span>
                    <span>•</span>
                    <span>{pricingData.totalQuantity} qty</span>
                </div>
            </div>

            {/* Free Shipping Progress */}
            {pricingData.needsForFreeShipping > 0 && (
                <div className="mb-6 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-green-400">
                            🚚 Free Shipping Progress
                        </span>
                        <span className="text-xs text-nxl-ivory/70">
                            {formatCurrency(pricingData.needsForFreeShipping)} away
                        </span>
                    </div>
                    <div className="w-full bg-nxl-navy/30 rounded-full h-2 mb-2">
                        <div
                            className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${pricingData.freeShippingProgress}%` }}
                        />
                    </div>
                    <p className="text-xs text-nxl-ivory/60">
                        Add {formatCurrency(pricingData.needsForFreeShipping)} more to qualify for free shipping!
                    </p>
                </div>
            )}

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                    <span className="text-nxl-ivory/80">Subtotal</span>
                    <span className="text-nxl-ivory">{formatCurrency(pricingData.subtotal)}</span>
                </div>

                {pricingData.discount > 0 && (
                    <div className="flex justify-between items-center">
                        <span className="text-green-400">Discount</span>
                        <span className="text-green-400">-{formatCurrency(pricingData.discount)}</span>
                    </div>
                )}

                {pricingData.giftCardTotal > 0 && (
                    <div className="flex justify-between items-center">
                        <span className="text-nxl-gold">Gift Card</span>
                        <span className="text-nxl-gold">-{formatCurrency(pricingData.giftCardTotal)}</span>
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <span className="text-nxl-ivory/80">
                        Shipping
                        {shippingEstimate === 0 && (
                            <span className="ml-2 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                                FREE
                            </span>
                        )}
                    </span>
                    <span className="text-nxl-ivory">
                        {shippingEstimate === 0 ? 'Free' : formatCurrency(shippingEstimate)}
                    </span>
                </div>

                {pricingData.tax > 0 && (
                    <div className="flex justify-between items-center">
                        <span className="text-nxl-ivory/80">Tax</span>
                        <span className="text-nxl-ivory">{formatCurrency(pricingData.tax)}</span>
                    </div>
                )}
            </div>

            {/* Savings Display */}
            {showSavings && pricingData.totalSavings > 0 && (
                <div className="mb-6 p-3 bg-gradient-to-r from-nxl-gold/10 to-nxl-gold/5 border border-nxl-gold/20 rounded-lg">
                    <div className="flex items-center gap-2">
                        <span className="text-nxl-gold text-lg">🎉</span>
                        <div className="flex-1">
                            <div className="text-sm font-semibold text-nxl-gold">
                                You're saving {formatCurrency(pricingData.totalSavings)}!
                            </div>
                            <div className="text-xs text-nxl-ivory/70">
                                Great choices on discounts and promotions
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Total */}
            <div className="border-t border-nxl-gold/20 pt-4 mb-6">
                <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-nxl-gold">Total</span>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-nxl-gold">
                            {formatCurrency(pricingData.total)}
                        </div>
                        {pricingData.originalPrice > pricingData.total && (
                            <div className="text-sm text-nxl-ivory/50 line-through">
                                {formatCurrency(pricingData.originalPrice)}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Checkout Button */}
            <LocalizedClientLink
                href="/checkout?step=address"
                className="block w-full bg-gradient-to-r from-nxl-gold to-nxl-gold/90 hover:from-nxl-gold/90 hover:to-nxl-gold text-nxl-black font-semibold py-4 px-6 rounded-lg text-center transition-all duration-300 hover:shadow-lg hover:shadow-nxl-gold/25 hover:-translate-y-0.5"
            >
                <div className="flex items-center justify-center gap-2">
                    <span>Proceed to Checkout</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </div>
            </LocalizedClientLink>

            {/* Continue Shopping Link */}
            <LocalizedClientLink
                href="/store"
                className="block w-full text-center text-nxl-ivory/70 hover:text-nxl-gold transition-colors mt-3 py-2"
            >
                ← Continue Shopping
            </LocalizedClientLink>

            {/* Upsell Suggestions */}
            {showUpsells && upsellSuggestions.length > 0 && (
                <div className="mt-6 border-t border-nxl-gold/20 pt-6">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center justify-between w-full text-left mb-4"
                    >
                        <h3 className="text-sm font-semibold text-nxl-gold">
                            Recommended Add-ons
                        </h3>
                        <svg
                            className={`w-4 h-4 text-nxl-gold transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''
                                }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {isExpanded && (
                        <div className="space-y-3">
                            {upsellSuggestions.map((item) => (
                                <div key={item.id} className="flex items-center gap-3 p-3 bg-nxl-navy/20 rounded-lg border border-nxl-gold/10 hover:border-nxl-gold/30 transition-colors">
                                    <div className="w-12 h-12 bg-nxl-gold/10 rounded-lg flex items-center justify-center">
                                        <span className="text-lg">{item.id === '1' ? '🎁' : '⚡'}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="text-sm font-medium text-nxl-ivory truncate">
                                                {item.title}
                                            </h4>
                                            <span className="px-2 py-1 bg-nxl-gold/20 text-nxl-gold text-xs rounded-full">
                                                {item.tag}
                                            </span>
                                        </div>
                                        <p className="text-xs text-nxl-ivory/60 truncate">
                                            {item.description}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-semibold text-nxl-gold">
                                            {formatCurrency(item.price)}
                                        </div>
                                        <button className="text-xs text-nxl-gold hover:text-nxl-gold/80 transition-colors">
                                            Add
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Trust Indicators */}
            <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-nxl-ivory/60">
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>30-day returns</span>
                </div>
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                    </svg>
                    <span>Customer support</span>
                </div>
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-nxl-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <span>Fast shipping</span>
                </div>
            </div>
        </div>
    )
}

export default SmartCartSummary 