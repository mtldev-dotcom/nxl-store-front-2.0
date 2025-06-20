import { Radio as RadioGroupOption } from "@headlessui/react"
import { Text, clx } from "@medusajs/ui"
import React, { useContext, useMemo, type JSX } from "react"

import Radio from "@modules/common/components/radio"

import { isManual } from "@lib/constants"
import SkeletonCardDetails from "@modules/skeletons/components/skeleton-card-details"
import { CardElement } from "@stripe/react-stripe-js"
import { StripeCardElementOptions } from "@stripe/stripe-js"
import PaymentTest from "../payment-test"
import { StripeContext } from "../payment-wrapper/stripe-wrapper"

type PaymentContainerProps = {
  paymentProviderId: string
  selectedPaymentOptionId: string | null
  disabled?: boolean
  paymentInfoMap: Record<string, { title: string; icon: JSX.Element }>
  children?: React.ReactNode
}

const PaymentContainer: React.FC<PaymentContainerProps> = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  children,
}) => {
  const isDevelopment = process.env.NODE_ENV === "development"

  return (
    <RadioGroupOption
      key={paymentProviderId}
      value={paymentProviderId}
      disabled={disabled}
      className={clx(
        "flex flex-col gap-y-3 text-small-regular cursor-pointer py-4 px-6 border rounded-xl transition-all duration-300 mobile-tap-feedback touch-target",
        {
          "border-nxl-gold bg-nxl-gold/5 shadow-md":
            selectedPaymentOptionId === paymentProviderId,
          "border-nxl-gold/30 bg-nxl-black/40 hover:border-nxl-gold/50 hover:bg-nxl-gold/5":
            selectedPaymentOptionId !== paymentProviderId,
          "opacity-50 cursor-not-allowed": disabled,
        }
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <Radio
            checked={selectedPaymentOptionId === paymentProviderId}
            className="text-nxl-gold"
          />
          <Text className="text-base-regular text-nxl-ivory font-medium">
            {paymentInfoMap[paymentProviderId]?.title || paymentProviderId}
          </Text>
          {isManual(paymentProviderId) && isDevelopment && (
            <PaymentTest className="hidden small:block" />
          )}
        </div>
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-nxl-gold/10 border border-nxl-gold/30">
          {paymentInfoMap[paymentProviderId]?.icon}
        </div>
      </div>
      {isManual(paymentProviderId) && isDevelopment && (
        <PaymentTest className="small:hidden text-[10px] ml-8" />
      )}
      {children}
    </RadioGroupOption>
  )
}

export default PaymentContainer

export const StripeCardContainer = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  setCardBrand,
  setError,
  setCardComplete,
}: Omit<PaymentContainerProps, "children"> & {
  setCardBrand: (brand: string) => void
  setError: (error: string | null) => void
  setCardComplete: (complete: boolean) => void
}) => {
  const stripeReady = useContext(StripeContext)

  const useOptions: StripeCardElementOptions = useMemo(() => {
    return {
      style: {
        base: {
          fontFamily: "Inter, sans-serif",
          fontSize: "16px",
          color: "#F8F6F1",
          backgroundColor: "transparent",
          "::placeholder": {
            color: "rgba(248, 246, 241, 0.6)",
          },
          iconColor: "#D4B660",
        },
        invalid: {
          color: "#EF4444",
          iconColor: "#EF4444",
        },
        complete: {
          color: "#10B981",
          iconColor: "#10B981",
        },
      },
      classes: {
        base: "block w-full h-12 px-4 py-3 bg-nxl-black/60 border border-nxl-gold/30 rounded-lg placeholder:text-nxl-ivory/60 focus:outline-none focus:ring-4 focus:ring-nxl-gold/20 focus:border-nxl-gold transition-all duration-300",
        invalid: "border-red-500",
        complete: "border-green-500",
      },
    }
  }, [])

  return (
    <PaymentContainer
      paymentProviderId={paymentProviderId}
      selectedPaymentOptionId={selectedPaymentOptionId}
      paymentInfoMap={paymentInfoMap}
      disabled={disabled}
    >
      {selectedPaymentOptionId === paymentProviderId &&
        (stripeReady ? (
          <div className="my-4 transition-all duration-150 ease-in-out">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 rounded-full bg-nxl-gold/20 flex items-center justify-center">
                <svg className="w-2 h-2 text-nxl-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <Text className="txt-medium-plus text-nxl-gold mb-1 font-medium">
                Enter your card details
              </Text>
            </div>
            <div className="relative">
              <CardElement
                options={useOptions as StripeCardElementOptions}
                onChange={(e) => {
                  setCardBrand(
                    e.brand && e.brand.charAt(0).toUpperCase() + e.brand.slice(1)
                  )
                  setError(e.error?.message || null)
                  setCardComplete(e.complete)
                }}
              />
              <div className="absolute inset-0 pointer-events-none rounded-lg ring-1 ring-nxl-gold/20" />
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-nxl-ivory/60">
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure & encrypted
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Never stored
              </span>
            </div>
          </div>
        ) : (
          <SkeletonCardDetails />
        ))}
    </PaymentContainer>
  )
}
