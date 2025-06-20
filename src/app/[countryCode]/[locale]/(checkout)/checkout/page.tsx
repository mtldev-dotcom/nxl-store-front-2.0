import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Checkout",
}

export default async function Checkout() {
  const cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()

  return (
    <div className="min-h-screen bg-gradient-to-br from-nxl-black via-nxl-black to-nxl-navy/90">
      {/* Mobile-First Layout Container */}
      <div className="content-container py-4 sm:py-8 lg:py-12">

        {/* Mobile: Stacked Layout | Desktop: Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 lg:gap-12">

          {/* Main Checkout Form - Mobile Priority */}
          <div className="order-2 lg:order-1">
            <PaymentWrapper cart={cart}>
              <div className="space-y-6">
                {/* Mobile: Progress Indicator */}
                <div className="lg:hidden bg-nxl-black/60 backdrop-blur-sm border border-nxl-gold/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h1 className="text-lg font-bold text-nxl-gold font-display">
                      Secure Checkout
                    </h1>
                    <div className="text-xs text-nxl-ivory/70">
                      Steps 1-4
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-nxl-navy rounded-full overflow-hidden">
                      <div className="h-full bg-nxl-gold transition-all duration-500" style={{ width: '25%' }} />
                    </div>
                    <span className="text-xs text-nxl-gold font-medium">25%</span>
                  </div>
                </div>

                <CheckoutForm cart={cart} customer={customer} />
              </div>
            </PaymentWrapper>
          </div>

          {/* Checkout Summary - Mobile: Fixed Bottom | Desktop: Sticky Sidebar */}
          <div className="order-1 lg:order-2">
            <div className="lg:sticky lg:top-8">
              {/* Desktop: Full Summary | Mobile: Collapsed Summary */}
              <div className="hidden lg:block">
                <CheckoutSummary cart={cart} />
              </div>

              {/* Mobile: Collapsible Summary */}
              <div className="lg:hidden">
                <div className="bg-nxl-black/80 backdrop-blur-sm border border-nxl-gold/30 rounded-xl p-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-nxl-gold/20 flex items-center justify-center border border-nxl-gold/30">
                        <svg className="w-4 h-4 text-nxl-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-sm font-semibold text-nxl-gold">
                          Order Summary
                        </h2>
                        <p className="text-xs text-nxl-ivory/70">
                          {cart?.items?.length || 0} items
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-nxl-gold">
                        ${((cart?.total || 0) / 100).toFixed(2)}
                      </div>
                      <button className="text-xs text-nxl-gold/80 hover:text-nxl-gold transition-colors">
                        View details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: Trust Signals Footer */}
        <div className="lg:hidden mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center gap-2 p-3 bg-nxl-black/40 rounded-lg border border-nxl-gold/20">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-xs text-nxl-ivory/80 font-medium">
              Secure
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 bg-nxl-black/40 rounded-lg border border-nxl-gold/20">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span className="text-xs text-nxl-ivory/80 font-medium">
              Fast Shipping
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 bg-nxl-black/40 rounded-lg border border-nxl-gold/20">
            <svg className="w-5 h-5 text-nxl-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs text-nxl-ivory/80 font-medium">
              Guaranteed
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
