"use client"

import { Heading, Text, clx } from "@medusajs/ui"
import { CheckCircleSolid, ShieldCheck, TruckFast, CreditCard } from "@medusajs/icons"

import PaymentButton from "../payment-button"
import { useSearchParams } from "next/navigation"
import { useTranslation } from "@lib/context/translation-context"

const Review = ({ cart }: { cart: any }) => {
  const { translate } = useTranslation()
  const searchParams = useSearchParams()

  const isOpen = searchParams.get("step") === "review"

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods.length > 0 &&
    (cart.payment_collection || paidByGiftcard)

  return (
    <div className="bg-nxl-black/80 backdrop-blur-sm border border-nxl-gold/30 rounded-xl p-6 shadow-xl">
      <div className="flex flex-row items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isOpen && previousStepsCompleted
            ? 'bg-green-500 text-white'
            : 'bg-nxl-gold/20 text-nxl-gold border border-nxl-gold/30'
            }`}>
            {isOpen && previousStepsCompleted ? (
              <CheckCircleSolid className="w-5 h-5" />
            ) : (
              <span className="text-sm font-semibold">4</span>
            )}
          </div>
          <Heading
            level="h2"
            className={clx(
              "text-2xl font-semibold text-nxl-gold font-display",
              {
                "opacity-50 pointer-events-none select-none": !isOpen,
              }
            )}
          >
            {translate("checkout", "reviewOrder")}
          </Heading>
        </div>
      </div>

      {isOpen && previousStepsCompleted && (
        <>
          {/* Enhanced Security and Trust Section */}
          <div className="mb-8 space-y-4">
            {/* Primary Trust Message */}
            <div className="p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-green-400 mb-2">
                    {translate("checkout", "orderProtection")}
                  </h3>
                  <p className="text-xs text-nxl-ivory/80 leading-relaxed mb-3">
                    {translate("checkout", "orderProtectionMessage")}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2 text-xs text-nxl-ivory/70">
                      <ShieldCheck className="w-4 h-4 text-green-400" />
                      <span>Order Protection</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-nxl-ivory/70">
                      <TruckFast className="w-4 h-4 text-blue-400" />
                      <span>Fast & Secure Delivery</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-nxl-ivory/70">
                      <CreditCard className="w-4 h-4 text-nxl-gold" />
                      <span>Encrypted Payment</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Money-Back Guarantee */}
            <div className="p-4 bg-gradient-to-r from-nxl-gold/5 to-nxl-gold/10 border border-nxl-gold/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-nxl-gold/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-nxl-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-nxl-gold mb-1">
                    30-Day Money-Back Guarantee
                  </h4>
                  <p className="text-xs text-nxl-ivory/70">
                    Not satisfied? Get a full refund within 30 days of purchase.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="mb-6 p-4 bg-nxl-navy/20 border border-nxl-navy/40 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded bg-nxl-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-nxl-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <Text className="text-sm text-nxl-ivory/90 leading-relaxed">
                  By placing this order, you confirm that you have read and agree to our{" "}
                  <button className="text-nxl-gold hover:text-nxl-gold/80 font-medium underline transition-colors">
                    Terms of Use
                  </button>
                  ,{" "}
                  <button className="text-nxl-gold hover:text-nxl-gold/80 font-medium underline transition-colors">
                    Terms of Sale
                  </button>
                  , and{" "}
                  <button className="text-nxl-gold hover:text-nxl-gold/80 font-medium underline transition-colors">
                    Returns Policy
                  </button>
                  . You also acknowledge our{" "}
                  <button className="text-nxl-gold hover:text-nxl-gold/80 font-medium underline transition-colors">
                    Privacy Policy
                  </button>
                  .
                </Text>
              </div>
            </div>
          </div>

          {/* Enhanced Payment Button */}
          <div className="space-y-4">
            <div className="w-full">
              <PaymentButton
                cart={cart}
                data-testid="submit-order-button"
              />
            </div>

            {/* Final Trust Signals */}
            <div className="flex items-center justify-center gap-6 text-xs text-nxl-ivory/60">
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>256-bit SSL Encryption</span>
              </div>
              <div className="w-px h-3 bg-nxl-ivory/20" />
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>PCI DSS Compliant</span>
              </div>
              <div className="w-px h-3 bg-nxl-ivory/20" />
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>Trusted by 50,000+ customers</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Review
