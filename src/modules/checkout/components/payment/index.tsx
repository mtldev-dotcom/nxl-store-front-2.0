"use client"

import { RadioGroup } from "@headlessui/react"
import { isStripe as isStripeFunc, paymentInfoMap } from "@lib/constants"
import { initiatePaymentSession } from "@lib/data/cart"
import { CheckCircleSolid, CreditCard, ShieldCheck } from "@medusajs/icons"
import { Button, Container, Heading, Text, clx } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import PaymentContainer, {
  StripeCardContainer,
} from "@modules/checkout/components/payment-container"
import Divider from "@modules/common/components/divider"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "@lib/context/translation-context"

const Payment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: any
  availablePaymentMethods: any[]
}) => {
  const { translate } = useTranslation()
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"

  const isStripe = isStripeFunc(selectedPaymentMethod)

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)
    if (isStripeFunc(method)) {
      await initiatePaymentSession(cart, {
        provider_id: method,
      })
    }
  }

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const paymentReady =
    (activeSession && cart?.shipping_methods.length !== 0) || paidByGiftcard

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const shouldInputCard =
        isStripeFunc(selectedPaymentMethod) && !activeSession

      const checkActiveSession =
        activeSession?.provider_id === selectedPaymentMethod

      if (!checkActiveSession) {
        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
        })
      }

      if (!shouldInputCard) {
        return router.push(
          pathname + "?" + createQueryString("step", "review"),
          {
            scroll: false,
          }
        )
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  return (
    <div className="bg-nxl-black/80 backdrop-blur-sm border border-nxl-gold/30 rounded-xl p-6 shadow-xl">
      <div className="flex flex-row items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${!isOpen && paymentReady
            ? 'bg-green-500 text-white'
            : 'bg-nxl-gold/20 text-nxl-gold border border-nxl-gold/30'
            }`}>
            {!isOpen && paymentReady ? (
              <CheckCircleSolid className="w-5 h-5" />
            ) : (
              <span className="text-sm font-semibold">3</span>
            )}
          </div>
          <Heading
            level="h2"
            className={clx(
              "text-2xl font-semibold text-nxl-gold font-display",
              {
                "opacity-50 pointer-events-none select-none":
                  !isOpen && !paymentReady,
              }
            )}
          >
            {translate("checkout", "payment")}
          </Heading>
        </div>
        {!isOpen && paymentReady && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-nxl-gold hover:text-nxl-gold/80 font-medium transition-colors duration-200"
              data-testid="edit-payment-button"
            >
              {translate("checkout", "edit")}
            </button>
          </Text>
        )}
      </div>

      {/* Enhanced Security Trust Signals */}
      {isOpen && (
        <div className="mb-6 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-green-400 mb-1">
                {translate("checkout", "securePayment")}
              </h3>
              <p className="text-xs text-nxl-ivory/80 leading-relaxed">
                {translate("checkout", "paymentSecurityMessage")}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-nxl-ivory/70">
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  256-bit SSL
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  PCI Compliant
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <div className={isOpen ? "block" : "hidden"}>
          {!paidByGiftcard && availablePaymentMethods?.length && (
            <>
              <div className="mb-4">
                <Text className="text-sm font-medium text-nxl-gold mb-2">
                  {translate("checkout", "selectPaymentMethod")}
                </Text>
                <Text className="text-xs text-nxl-ivory/70 mb-4">
                  {translate("checkout", "paymentMethodDescription")}
                </Text>
              </div>

              <RadioGroup
                value={selectedPaymentMethod}
                onChange={(value: string) => setPaymentMethod(value)}
                className="space-y-3"
              >
                {availablePaymentMethods.map((paymentMethod) => (
                  <div key={paymentMethod.id} className="relative">
                    {isStripeFunc(paymentMethod.id) ? (
                      <StripeCardContainer
                        paymentProviderId={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                        paymentInfoMap={paymentInfoMap}
                        setCardBrand={setCardBrand}
                        setError={setError}
                        setCardComplete={setCardComplete}
                      />
                    ) : (
                      <PaymentContainer
                        paymentInfoMap={paymentInfoMap}
                        paymentProviderId={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                      />
                    )}
                  </div>
                ))}
              </RadioGroup>
            </>
          )}

          {paidByGiftcard && (
            <div className="flex flex-col w-full">
              <Text className="txt-medium-plus text-nxl-gold mb-1 font-semibold">
                {translate("checkout", "paymentMethod")}
              </Text>
              <Text
                className="txt-medium text-nxl-ivory/80"
                data-testid="payment-method-summary"
              >
                {translate("checkout", "giftCard")}
              </Text>
            </div>
          )}

          <ErrorMessage
            error={error}
            data-testid="payment-method-error-message"
          />

          <Button
            size="large"
            className="mt-6 w-full bg-nxl-gold hover:bg-nxl-gold/90 text-nxl-black font-semibold transition-all duration-300"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={
              (isStripe && !cardComplete) ||
              (!selectedPaymentMethod && !paidByGiftcard)
            }
            data-testid="submit-payment-button"
          >
            <div className="flex items-center justify-center gap-2">
              <span>
                {!activeSession && isStripeFunc(selectedPaymentMethod)
                  ? translate("checkout", "enterCardDetails")
                  : translate("checkout", "continueToReview")}
              </span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </Button>
        </div>

        <div className={isOpen ? "hidden" : "block"}>
          {cart && paymentReady && activeSession ? (
            <div className="flex items-start gap-x-1 w-full">
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-nxl-gold mb-1 font-semibold">
                  {translate("checkout", "paymentMethod")}
                </Text>
                <Text
                  className="txt-medium text-nxl-ivory/80"
                  data-testid="payment-method-summary"
                >
                  {paymentInfoMap[activeSession?.provider_id]?.title ||
                    activeSession?.provider_id}
                </Text>
              </div>
              <div className="flex flex-col w-2/3">
                <Text className="txt-medium-plus text-nxl-gold mb-1 font-semibold">
                  {translate("checkout", "paymentDetails")}
                </Text>
                <div
                  className="flex gap-2 txt-medium text-nxl-ivory/80 items-center"
                  data-testid="payment-details-summary"
                >
                  <Container className="flex items-center h-7 w-fit p-2 bg-nxl-gold/20 border border-nxl-gold/30 rounded">
                    {paymentInfoMap[selectedPaymentMethod]?.icon || (
                      <CreditCard className="text-nxl-gold" />
                    )}
                  </Container>
                  <Text className="text-nxl-ivory/80">
                    {isStripeFunc(selectedPaymentMethod) && cardBrand
                      ? `${cardBrand} ${translate("checkout", "cardReady")}`
                      : translate("checkout", "anotherStepWillAppear")}
                  </Text>
                </div>
              </div>
            </div>
          ) : paidByGiftcard ? (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-nxl-gold mb-1 font-semibold">
                {translate("checkout", "paymentMethod")}
              </Text>
              <Text
                className="txt-medium text-nxl-ivory/80"
                data-testid="payment-method-summary"
              >
                {translate("checkout", "giftCard")}
              </Text>
            </div>
          ) : null}
        </div>
      </div>
      <Divider className="mt-8 border-nxl-gold/20" />
    </div>
  )
}

export default Payment
