/**
 * Shipping Utilities
 * ----------------
 * Functions for calculating and displaying shipping estimates
 */

import { HttpTypes } from "@medusajs/types"
import { formatPriceWithSmallCurrency } from "./money"

export interface ShippingEstimate {
    min: number
    max: number
    currency: string
    hasOptions: boolean
    cheapestOption?: HttpTypes.StoreCartShippingOption
    estimatedDelivery: string | null
}

/**
 * Basic client-side shipping estimate
 * Provides reasonable estimates for common scenarios
 */
export function calculateBasicShippingEstimate(
    cartTotal: number,
    currencyCode?: string,
    regionId?: string,
    dictionary?: any
): ShippingEstimate {
    const currency = currencyCode?.toUpperCase() || 'CAD'

    // Free shipping threshold (typically $100-150)
    const freeShippingThreshold = currency === 'USD' ? 10000 : 15000 // $100 USD or $150 CAD

    if (cartTotal >= freeShippingThreshold) {
        return {
            min: 0,
            max: 0,
            currency,
            hasOptions: true,
            estimatedDelivery: dictionary?.cart?.estimatedDelivery || "3-5 business days"
        }
    }

    // Estimate shipping based on region and cart value (reasonable shipping rates in dollars)
    let estimatedShipping: number

    if (currency === 'USD') {
        estimatedShipping = cartTotal < 5000 ? 8 : 10 // $8-10 USD (threshold: $50)
    } else {
        estimatedShipping = cartTotal < 7500 ? 10 : 12 // $10-12 CAD (threshold: $75)
    }

    return {
        min: estimatedShipping,
        max: estimatedShipping + 2, // Add $2 range
        currency,
        hasOptions: true,
        estimatedDelivery: dictionary?.cart?.estimatedDelivery || "3-5 business days"
    }
}

/**
 * Format shipping estimate for display
 */
export function formatShippingEstimate(
    estimate: ShippingEstimate | null,
    dictionary?: any
): {
    text: string
    priceDisplay: string | null
    deliveryTime: string | null
} {
    if (!estimate || !estimate.hasOptions) {
        return {
            text: dictionary?.cart?.shippingCalculated || "Calculated at checkout",
            priceDisplay: null,
            deliveryTime: null
        }
    }

    const minFormatted = formatPriceWithSmallCurrency({
        amount: estimate.min,
        currency_code: estimate.currency
    })

    const maxFormatted = formatPriceWithSmallCurrency({
        amount: estimate.max,
        currency_code: estimate.currency
    })

    let priceDisplay: string
    let text: string

    if (estimate.min === 0) {
        text = dictionary?.shipping?.freeShipping || "Free shipping"
        priceDisplay = dictionary?.cart?.free || "Free"
    } else if (estimate.min === estimate.max) {
        text = dictionary?.cart?.shippingEstimate || "Estimated shipping"
        priceDisplay = `${minFormatted.price} ${minFormatted.currency}`
    } else {
        text = dictionary?.cart?.shippingEstimate || "Estimated shipping"
        priceDisplay = `${minFormatted.price} - ${maxFormatted.price} ${minFormatted.currency}`
    }

    return {
        text,
        priceDisplay,
        deliveryTime: estimate.estimatedDelivery
    }
}

/**
 * Get shipping estimate from cart data
 */
export function getShippingEstimateFromCart(
    cart?: HttpTypes.StoreCart | null,
    dictionary?: any
): ShippingEstimate | null {
    if (!cart || !cart.items?.length) {
        return null
    }

    const cartTotal = cart.subtotal || 0

    return calculateBasicShippingEstimate(
        cartTotal,
        cart.currency_code,
        cart.region_id,
        dictionary
    )
}

