import { Heading, Text, Button } from "@medusajs/ui"
import { cookies as nextCookies } from "next/headers"
import { CheckCircleSolid, Sparkles, ArrowRight, Share, Heart } from "@medusajs/icons"

import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OnboardingCta from "@modules/order/components/onboarding-cta"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const cookies = await nextCookies()
  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"

  // Calculate estimated delivery date (7-10 business days from now)
  const estimatedDelivery = new Date()
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 9)

  return (
    <div className="min-h-screen bg-gradient-to-br from-nxl-black via-nxl-black to-nxl-navy/90">
      {/* Hero Success Section */}
      <div className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-nxl-gold/5 to-transparent" />
        <div className="absolute top-10 left-10 w-32 h-32 bg-nxl-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-nxl-gold/5 rounded-full blur-2xl" />

        <div className="relative content-container py-12 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Success Icon with Animation */}
            <div className="relative inline-flex items-center justify-center mb-8">
              <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/25 animate-pulse">
                <CheckCircleSolid className="w-12 h-12 lg:w-16 lg:h-16 text-white" />
              </div>
              {/* Sparkle Effects */}
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-nxl-gold animate-bounce" />
              <Sparkles className="absolute -bottom-2 -left-2 w-4 h-4 text-nxl-gold animate-bounce delay-300" />
            </div>

            {/* Success Message */}
            <div className="mb-8">
              <Heading
                level="h1"
                className="text-3xl lg:text-5xl font-bold text-nxl-gold font-display mb-4"
              >
                🎉 Order Confirmed!
              </Heading>
              <Text className="text-lg lg:text-xl text-nxl-ivory/90 mb-2">
                Thank you for your purchase, your order has been successfully placed.
              </Text>
              <Text className="text-base text-nxl-ivory/70">
                You'll receive a confirmation email shortly at{" "}
                <span className="text-nxl-gold font-semibold">{order.email}</span>
              </Text>
            </div>

            {/* Order Summary Card */}
            <div className="bg-nxl-black/60 backdrop-blur-sm border border-nxl-gold/30 rounded-xl p-6 lg:p-8 mb-8 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <Text className="text-sm text-nxl-ivory/60 uppercase tracking-wide mb-1">
                    Order Number
                  </Text>
                  <Text className="text-lg font-bold text-nxl-gold" data-testid="order-id">
                    #{order.display_id}
                  </Text>
                </div>
                <div>
                  <Text className="text-sm text-nxl-ivory/60 uppercase tracking-wide mb-1">
                    Order Date
                  </Text>
                  <Text className="text-lg font-semibold text-nxl-ivory" data-testid="order-date">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </Text>
                </div>
                <div>
                  <Text className="text-sm text-nxl-ivory/60 uppercase tracking-wide mb-1">
                    Estimated Delivery
                  </Text>
                  <Text className="text-lg font-semibold text-green-400">
                    {estimatedDelivery.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </Text>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <LocalizedClientLink href="/account/orders" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  className="w-full sm:w-auto bg-nxl-gold hover:bg-nxl-gold/90 text-nxl-black font-semibold px-6 py-3 transition-all duration-300"
                >
                  Track Your Order
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </LocalizedClientLink>

              <LocalizedClientLink href="/store" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  className="w-full sm:w-auto border-nxl-gold/30 text-nxl-gold hover:bg-nxl-gold/10 px-6 py-3 transition-all duration-300 bg-transparent"
                >
                  Continue Shopping
                </Button>
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Section */}
      <div className="content-container py-12">
        <div className="max-w-4xl mx-auto">
          {isOnboarding && (
            <div className="mb-8">
              <OnboardingCta orderId={order.id} />
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-nxl-black/80 backdrop-blur-sm border border-nxl-gold/30 rounded-xl shadow-xl overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-nxl-gold/20 to-nxl-gold/10 px-6 py-4 border-b border-nxl-gold/20">
              <Heading level="h2" className="text-xl font-semibold text-nxl-gold font-display">
                Order Summary
              </Heading>
            </div>
            <div className="p-6">
              <Items order={order} />
              <div className="mt-6 pt-6 border-t border-nxl-gold/20">
                <CartTotals totals={order} />
              </div>
            </div>
          </div>

          {/* Shipping & Payment Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Shipping Details */}
            <div className="bg-nxl-black/80 backdrop-blur-sm border border-nxl-gold/30 rounded-xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-nxl-gold/20 to-nxl-gold/10 px-6 py-4 border-b border-nxl-gold/20">
                <Heading level="h3" className="text-lg font-semibold text-nxl-gold font-display">
                  Shipping Details
                </Heading>
              </div>
              <div className="p-6">
                <ShippingDetails order={order} />
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-nxl-black/80 backdrop-blur-sm border border-nxl-gold/30 rounded-xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-nxl-gold/20 to-nxl-gold/10 px-6 py-4 border-b border-nxl-gold/20">
                <Heading level="h3" className="text-lg font-semibold text-nxl-gold font-display">
                  Payment Details
                </Heading>
              </div>
              <div className="p-6">
                <PaymentDetails order={order} />
              </div>
            </div>
          </div>

          {/* What's Next Section */}
          <div className="bg-nxl-black/80 backdrop-blur-sm border border-nxl-gold/30 rounded-xl shadow-xl p-6 lg:p-8 mb-8">
            <Heading level="h2" className="text-xl font-semibold text-nxl-gold font-display mb-6">
              What happens next?
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-12 h-12 bg-nxl-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Text className="text-lg font-bold text-nxl-gold">1</Text>
                </div>
                <Text className="font-semibold text-nxl-ivory mb-2">Order Processing</Text>
                <Text className="text-sm text-nxl-ivory/70">
                  We'll prepare your order and notify you when it's ready to ship.
                </Text>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-12 h-12 bg-nxl-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Text className="text-lg font-bold text-nxl-gold">2</Text>
                </div>
                <Text className="font-semibold text-nxl-ivory mb-2">Shipping</Text>
                <Text className="text-sm text-nxl-ivory/70">
                  Your order will be shipped and you'll receive tracking information.
                </Text>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-12 h-12 bg-nxl-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Text className="text-lg font-bold text-nxl-gold">3</Text>
                </div>
                <Text className="font-semibold text-nxl-ivory mb-2">Delivery</Text>
                <Text className="text-sm text-nxl-ivory/70">
                  Enjoy your new products! We hope you love them.
                </Text>
              </div>
            </div>
          </div>

          {/* Enhanced Help Section */}
          <div className="bg-nxl-black/80 backdrop-blur-sm border border-nxl-gold/30 rounded-xl shadow-xl p-6 lg:p-8">
            <Help />
          </div>
        </div>
      </div>
    </div>
  )
}
