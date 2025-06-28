import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import EnhancedCheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Checkout | Next X Level",
  description: "Complete your premium shopping experience",
}

export default async function Checkout() {
  const cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()

  return (
    <div className="min-h-screen bg-gradient-to-br from-nxl-black via-nxl-black to-nxl-navy/90">
      {/* Enhanced Mobile-First Layout Container */}
      <div className="content-container py-4 sm:py-6 lg:py-8">

        {/* Responsive Grid Layout: Mobile Stacked | Desktop Two-Column */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_450px] gap-6 lg:gap-8 xl:gap-12">

          {/* Main Checkout Form - Enhanced Mobile Experience */}
          <div className="order-2 xl:order-1">
            <PaymentWrapper cart={cart}>
              <div className="space-y-6">
                {/* Enhanced Mobile Progress Header */}
                <div className="xl:hidden bg-gradient-to-r from-nxl-black/80 to-nxl-navy/60 backdrop-blur-md border border-nxl-gold/30 rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-nxl-gold/20 flex items-center justify-center border border-nxl-gold/30">
                        <svg className="w-5 h-5 text-nxl-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <div>
                        <h1 className="text-lg font-bold text-nxl-gold font-display">
                          Secure Checkout
                        </h1>
                        <p className="text-sm text-nxl-ivory/70">
                          Complete your premium experience
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-nxl-ivory/60 bg-nxl-black/40 px-2 py-1 rounded-full border border-nxl-gold/20">
                      SSL Protected
                    </div>
                  </div>

                  {/* Enhanced Progress Indicator */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 h-2 bg-nxl-black/60 rounded-full overflow-hidden border border-nxl-gold/20">
                      <div className="h-full bg-gradient-to-r from-nxl-gold to-nxl-gold/80 transition-all duration-500" style={{ width: '25%' }} />
                    </div>
                    <span className="text-xs text-nxl-gold font-semibold bg-nxl-gold/10 px-2 py-1 rounded">25%</span>
                  </div>

                  {/* Step Indicators */}
                  <div className="flex items-center justify-between text-xs text-nxl-ivory/60">
                    <span className="text-nxl-gold font-medium">Address</span>
                    <span>Delivery</span>
                    <span>Payment</span>
                    <span>Review</span>
                  </div>
                </div>

                <CheckoutForm cart={cart} customer={customer} />
              </div>
            </PaymentWrapper>
          </div>

          {/* Enhanced Checkout Summary - Mobile: Fixed Bottom | Desktop: Sticky Sidebar */}
          <div className="order-1 xl:order-2">
            <div className="xl:sticky xl:top-8">
              {/* Desktop: Full Enhanced Summary */}
              <div className="hidden xl:block">
                <EnhancedCheckoutSummary cart={cart} />
              </div>

              {/* Mobile & Tablet: Enhanced Collapsible Summary */}
              <div className="xl:hidden">
                <EnhancedCheckoutSummary cart={cart} />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Trust Signals Footer */}
        <div className="xl:hidden mt-8 grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl border border-green-500/20 hover:border-green-500/30 transition-colors duration-200">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span className="text-xs text-green-400 font-semibold text-center">
              Secure Payment
            </span>
            <span className="text-xs text-nxl-ivory/60 text-center">
              256-bit SSL
            </span>
          </div>

          <div className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl border border-blue-500/20 hover:border-blue-500/30 transition-colors duration-200">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0v10l-8 4-8-4V7m16 0L12 11 4 7" />
              </svg>
            </div>
            <span className="text-xs text-blue-400 font-semibold text-center">
              Fast Shipping
            </span>
            <span className="text-xs text-nxl-ivory/60 text-center">
              3-5 days
            </span>
          </div>

          <div className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-nxl-gold/10 to-nxl-gold/5 rounded-xl border border-nxl-gold/20 hover:border-nxl-gold/30 transition-colors duration-200">
            <div className="w-8 h-8 rounded-full bg-nxl-gold/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-nxl-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs text-nxl-gold font-semibold text-center">
              Guaranteed
            </span>
            <span className="text-xs text-nxl-ivory/60 text-center">
              30-day returns
            </span>
          </div>
        </div>

        {/* Mobile: Additional Support Information */}
        <div className="xl:hidden mt-6 text-center">
          <p className="text-xs text-nxl-ivory/60 mb-2">
            Need help? Contact our support team
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-nxl-ivory/70">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              24/7 Support
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Live Chat
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
