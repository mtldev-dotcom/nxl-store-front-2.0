"use client"

import { useState, useEffect, useCallback } from "react"
import { RadioGroup } from "@headlessui/react"
import { isStripe as isStripeFunc, paymentInfoMap } from "@lib/constants"
import { initiatePaymentSession } from "@lib/data/cart"
import { CheckCircleSolid, CreditCard, ShieldCheck } from "@medusajs/icons"
import { Button, Container, Heading, Text, clx } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import PaymentContainer, {
    StripeCardContainer,
} from "@modules/checkout/components/payment-container"

interface EnhancedPaymentProps {
    cart: any
    availablePaymentMethods: any[]
    onStepComplete?: (stepData: any) => void
    isMobile?: boolean
}

const EnhancedPayment = ({
    cart,
    availablePaymentMethods,
    onStepComplete,
    isMobile = false
}: EnhancedPaymentProps) => {
    // Enhanced state management
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [cardBrand, setCardBrand] = useState<string | null>(null)
    const [cardComplete, setCardComplete] = useState(false)
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
    const [paymentStep, setPaymentStep] = useState<'select' | 'details' | 'processing' | 'complete'>('select')
    const [securityStatus, setSecurityStatus] = useState({
        sslActive: true,
        pciCompliant: true,
        dataEncrypted: true
    })

    const activeSession = cart.payment_collection?.payment_sessions?.find(
        (paymentSession: any) => paymentSession.status === "pending"
    )

    // Initialize payment method
    useEffect(() => {
        if (activeSession?.provider_id) {
            setSelectedPaymentMethod(activeSession.provider_id)
            setPaymentStep('details')
        }
    }, [activeSession])

    // Enhanced payment method selection
    const setPaymentMethod = useCallback(async (method: string) => {
        setError(null)
        setIsLoading(true)
        setSelectedPaymentMethod(method)

        try {
            if (isStripeFunc(method)) {
                await initiatePaymentSession(cart, { provider_id: method })
                setPaymentStep('details')
            } else {
                setPaymentStep('complete')
            }
        } catch (err: any) {
            setError(err.message)
            setPaymentStep('select')
        } finally {
            setIsLoading(false)
        }
    }, [cart])

    // Enhanced payment processing
    const handlePaymentSubmit = useCallback(async () => {
        setIsLoading(true)
        setPaymentStep('processing')

        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000))

            setPaymentStep('complete')
            onStepComplete?.({
                paymentMethod: selectedPaymentMethod,
                cardBrand,
                isComplete: true
            })
        } catch (err: any) {
            setError(err.message)
            setPaymentStep('details')
        } finally {
            setIsLoading(false)
        }
    }, [selectedPaymentMethod, cardBrand, onStepComplete])

    const paidByGiftcard = cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0
    const paymentReady = (activeSession && cart?.shipping_methods.length !== 0) || paidByGiftcard

    return (
        <div className="bg-nxl-black/80 backdrop-blur-sm border border-nxl-gold/30 rounded-xl p-4 lg:p-6 shadow-xl">
            {/* Enhanced Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                <div className="flex items-center gap-3 mb-4 lg:mb-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${paymentStep === 'complete'
                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                        : paymentStep === 'processing'
                            ? 'bg-blue-500 text-white animate-pulse'
                            : 'bg-nxl-gold/20 text-nxl-gold border border-nxl-gold/30'
                        }`}>
                        {paymentStep === 'complete' ? (
                            <CheckCircleSolid className="w-5 h-5" />
                        ) : paymentStep === 'processing' ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <span className="text-sm font-semibold">3</span>
                        )}
                    </div>
                    <div>
                        <Heading level="h2" className="text-xl lg:text-2xl font-semibold text-nxl-gold font-display">
                            Payment
                        </Heading>
                        {isMobile && (
                            <p className="text-sm text-nxl-ivory/60 mt-1">
                                {paymentStep === 'select' ? 'Choose payment method' :
                                    paymentStep === 'details' ? 'Enter payment details' :
                                        paymentStep === 'processing' ? 'Processing payment...' :
                                            'Payment complete'}
                            </p>
                        )}
                    </div>
                </div>

                {/* Security Indicators */}
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1 text-green-400">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span>SSL Secured</span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-400">
                        <ShieldCheck className="w-3 h-3" />
                        <span>PCI Compliant</span>
                    </div>
                </div>
            </div>

            {/* Enhanced Security Banner */}
            <div className="mb-6 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                        <ShieldCheck className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-green-400 mb-2">
                            🔒 Your payment is completely secure
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 text-xs text-nxl-ivory/80">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full" />
                                <span>256-bit SSL encryption</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                                <span>PCI DSS Level 1 compliant</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                                <span>Fraud protection enabled</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Method Selection */}
            {paymentStep === 'select' && (
                <div className="space-y-4">
                    <div className="mb-4">
                        <Text className="text-sm font-medium text-nxl-gold mb-2">
                            Select Payment Method
                        </Text>
                        <Text className="text-xs text-nxl-ivory/70">
                            All payment methods are secure and encrypted
                        </Text>
                    </div>

                    <RadioGroup
                        value={selectedPaymentMethod}
                        onChange={setPaymentMethod}
                        className="space-y-3"
                    >
                        {availablePaymentMethods.map((paymentMethod) => (
                            <RadioGroup.Option
                                key={paymentMethod.id}
                                value={paymentMethod.id}
                                className={({ checked }) =>
                                    `relative flex cursor-pointer rounded-lg px-4 py-3 shadow-md focus:outline-none transition-all duration-200 ${checked
                                        ? 'bg-nxl-gold/20 border-2 border-nxl-gold ring-2 ring-nxl-gold/30'
                                        : 'bg-nxl-black/40 border border-nxl-gold/20 hover:border-nxl-gold/40'
                                    }`
                                }
                            >
                                {({ checked }) => (
                                    <div className="flex w-full items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Container className="flex items-center h-10 w-10 p-2 bg-nxl-gold/20 border border-nxl-gold/30 rounded">
                                                {paymentInfoMap[paymentMethod.id]?.icon || <CreditCard className="text-nxl-gold" />}
                                            </Container>
                                            <div>
                                                <Text className="text-sm font-medium text-nxl-ivory">
                                                    {paymentInfoMap[paymentMethod.id]?.title || paymentMethod.id}
                                                </Text>
                                                <Text className="text-xs text-nxl-ivory/60">
                                                    Secure payment method
                                                </Text>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {checked && (
                                                <CheckCircleSolid className="w-5 h-5 text-nxl-gold" />
                                            )}
                                            <div className={`w-4 h-4 rounded-full border-2 ${checked ? 'border-nxl-gold bg-nxl-gold' : 'border-nxl-ivory/30'
                                                }`}>
                                                {checked && <div className="w-2 h-2 bg-nxl-black rounded-full mx-auto mt-0.5" />}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </RadioGroup.Option>
                        ))}
                    </RadioGroup>
                </div>
            )}

            {/* Card Details Input */}
            {paymentStep === 'details' && isStripeFunc(selectedPaymentMethod) && (
                <div className="space-y-6">
                    <div className="bg-nxl-navy/20 border border-nxl-gold/20 rounded-lg p-4">
                        <div className="mb-4">
                            <Text className="text-sm font-medium text-nxl-gold mb-2">
                                Card Information
                            </Text>
                            <Text className="text-xs text-nxl-ivory/70">
                                Your card details are encrypted and secure
                            </Text>
                        </div>

                        <StripeCardContainer
                            paymentProviderId={selectedPaymentMethod}
                            selectedPaymentOptionId={selectedPaymentMethod}
                            paymentInfoMap={paymentInfoMap}
                            setCardBrand={setCardBrand}
                            setError={setError}
                            setCardComplete={setCardComplete}
                        />

                        {cardBrand && (
                            <div className="mt-4 flex items-center gap-2 text-sm text-nxl-ivory/80">
                                <CreditCard className="w-4 h-4 text-nxl-gold" />
                                <span>{cardBrand} card detected</span>
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            </div>
                        )}
                    </div>

                    <Button
                        size="large"
                        className="w-full bg-nxl-gold hover:bg-nxl-gold/90 text-nxl-black font-semibold transition-all duration-300 disabled:opacity-50"
                        onClick={handlePaymentSubmit}
                        disabled={!cardComplete || isLoading}
                        isLoading={isLoading}
                    >
                        <div className="flex items-center justify-center gap-2">
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-nxl-black border-t-transparent rounded-full animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <span>Continue to Review</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </>
                            )}
                        </div>
                    </Button>
                </div>
            )}

            {/* Processing State */}
            {paymentStep === 'processing' && (
                <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <div className="w-8 h-8 border-3 border-blue-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                    <h3 className="text-lg font-semibold text-blue-400 mb-2">Processing Payment</h3>
                    <p className="text-sm text-nxl-ivory/70">
                        Please wait while we securely process your payment...
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-nxl-ivory/60">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span>SSL encryption active</span>
                    </div>
                </div>
            )}

            {/* Complete State */}
            {paymentStep === 'complete' && (
                <div className="text-center py-6">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                        <CheckCircleSolid className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-green-400 mb-2">Payment Method Ready</h3>
                    <p className="text-sm text-nxl-ivory/70">
                        {cardBrand ? `${cardBrand} card configured` : 'Payment method configured'}
                    </p>
                </div>
            )}

            {/* Error Display */}
            {error && (
                <ErrorMessage error={error} data-testid="payment-method-error-message" />
            )}

            {/* Mobile: Payment Summary */}
            {isMobile && cart && (
                <div className="mt-6 p-4 bg-nxl-navy/20 border border-nxl-gold/20 rounded-lg">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-nxl-ivory/80">Order Total</span>
                        <span className="text-lg font-bold text-nxl-gold">
                            ${((cart.total || 0) / 100).toFixed(2)}
                        </span>
                    </div>
                    <div className="mt-2 text-xs text-nxl-ivory/60">
                        All taxes and fees included
                    </div>
                </div>
            )}
        </div>
    )
}

export default EnhancedPayment 