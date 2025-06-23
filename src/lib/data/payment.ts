"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { HttpTypes } from "@medusajs/types"

export const listCartPaymentMethods = async (regionId: string) => {
  // Enhanced debugging for payment method fetching
  console.log("🔍 [Payment Debug] Fetching payment methods for region:", regionId)

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("payment_providers")),
  }

  try {
    console.log("🔍 [Payment Debug] Making API call to /store/payment-providers")
    console.log("🔍 [Payment Debug] Query params:", { region_id: regionId })
    console.log("🔍 [Payment Debug] Headers:", Object.keys(headers))

    const response = await sdk.client.fetch<HttpTypes.StorePaymentProviderListResponse>(
      `/store/payment-providers`,
      {
        method: "GET",
        query: { region_id: regionId },
        headers,
        next,
        cache: "force-cache",
      }
    )

    console.log("✅ [Payment Debug] API Response received")
    console.log("🔍 [Payment Debug] Raw response:", JSON.stringify(response, null, 2))

    const { payment_providers } = response

    if (!payment_providers || payment_providers.length === 0) {
      console.log("❌ [Payment Debug] No payment providers found in response")
      console.log("🔍 [Payment Debug] This usually means:")
      console.log("   1. Medusa backend doesn't have payment providers configured")
      console.log("   2. Payment providers aren't associated with region:", regionId)
      console.log("   3. Backend configuration issue")
      return []
    }

    console.log("✅ [Payment Debug] Found payment providers:", payment_providers.map(p => ({ id: p.id })))

    const sortedProviders = payment_providers.sort((a, b) => {
      return a.id > b.id ? 1 : -1
    })

    console.log("✅ [Payment Debug] Sorted payment providers:", sortedProviders.map(p => p.id))

    return sortedProviders
  } catch (error) {
    console.error("❌ [Payment Debug] API call failed:", error)
    console.error("🔍 [Payment Debug] Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
    })
    console.log("🔍 [Payment Debug] This usually means:")
    console.log("   1. Backend is not running or not accessible")
    console.log("   2. Backend URL is incorrect:", process.env.MEDUSA_BACKEND_URL)
    console.log("   3. Network connectivity issues")
    console.log("   4. Authentication issues")

    // Return empty array instead of null to prevent checkout from breaking
    return []
  }
}

// Add a new function to check Stripe configuration
export const checkStripeConfiguration = async () => {
  console.log("🔍 [Stripe Debug] Checking Stripe configuration")

  const stripeKey = process.env.NEXT_PUBLIC_STRIPE_KEY
  console.log("🔍 [Stripe Debug] NEXT_PUBLIC_STRIPE_KEY exists:", !!stripeKey)

  if (stripeKey) {
    console.log("🔍 [Stripe Debug] Stripe key prefix:", stripeKey.substring(0, 7) + "...")
    console.log("🔍 [Stripe Debug] Key looks like test key:", stripeKey.startsWith("pk_test_"))
    console.log("🔍 [Stripe Debug] Key looks like live key:", stripeKey.startsWith("pk_live_"))
  } else {
    console.log("❌ [Stripe Debug] NEXT_PUBLIC_STRIPE_KEY is missing!")
    console.log("🔍 [Stripe Debug] Add this to your .env.local file:")
    console.log("   NEXT_PUBLIC_STRIPE_KEY=pk_test_your_stripe_publishable_key_here")
  }

  return !!stripeKey
}
