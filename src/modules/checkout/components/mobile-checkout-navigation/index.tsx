"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"

interface MobileCheckoutNavigationProps {
    cart: any
    currentStep: string
    isStepValid: boolean
    onStepChange?: (step: string) => void
    className?: string
}

const MobileCheckoutNavigation = ({
    cart,
    currentStep,
    isStepValid,
    onStepChange,
    className = ""
}: MobileCheckoutNavigationProps) => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isVisible, setIsVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)

    const steps = [
        { id: 'address', name: 'Address', icon: '📍' },
        { id: 'shipping', name: 'Delivery', icon: '🚚' },
        { id: 'payment', name: 'Payment', icon: '💳' },
        { id: 'review', name: 'Review', icon: '✓' }
    ]

    const currentStepIndex = steps.findIndex(step => step.id === currentStep)
    const nextStep = steps[currentStepIndex + 1]
    const prevStep = steps[currentStepIndex - 1]

    // Hide/show navigation based on scroll direction
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false) // Scrolling down
            } else {
                setIsVisible(true) // Scrolling up
            }

            setLastScrollY(currentScrollY)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [lastScrollY])

    // Navigate to next/previous step
    const navigateToStep = (stepId: string) => {
        const params = new URLSearchParams(searchParams)
        params.set('step', stepId)
        const newUrl = `${pathname}?${params.toString()}`

        router.push(newUrl, { scroll: false })
        onStepChange?.(stepId)
    }

    const handleContinue = () => {
        if (nextStep && isStepValid) {
            navigateToStep(nextStep.id)
        } else if (currentStep === 'review' && isStepValid) {
            // Handle order completion
            console.log('Complete order')
        }
    }

    const handleBack = () => {
        if (prevStep) {
            navigateToStep(prevStep.id)
        } else {
            router.push(`${pathname.replace('/checkout', '/cart')}`)
        }
    }

    // Calculate order total for display
    const orderTotal = cart?.total ? `$${(cart.total / 100).toFixed(2)}` : '$0.00'

    return (
        <>
            {/* Bottom Navigation Bar */}
            <div className={`
        lg:hidden fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 safe-bottom
        ${isVisible ? 'translate-y-0' : 'translate-y-full'}
        ${className}
      `}>
                <div className="bg-gradient-to-t from-nxl-black via-nxl-black/98 to-nxl-black/95 backdrop-blur-lg border-t border-nxl-gold/20">
                    {/* Progress Bar */}
                    <div className="px-4 pt-2">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-nxl-ivory/60">
                                Step {currentStepIndex + 1} of {steps.length}
                            </span>
                            <span className="text-xs font-medium text-nxl-gold">
                                {Math.round(((currentStepIndex + 1) / steps.length) * 100)}% Complete
                            </span>
                        </div>
                        <div className="w-full h-1 bg-nxl-navy/40 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-nxl-gold to-nxl-gold/80 transition-all duration-500 ease-out"
                                style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Step Indicator Dots */}
                    <div className="flex justify-center items-center gap-3 py-3">
                        {steps.map((step, index) => (
                            <button
                                key={step.id}
                                onClick={() => index <= currentStepIndex && navigateToStep(step.id)}
                                disabled={index > currentStepIndex}
                                className={`
                  flex flex-col items-center gap-1 transition-all duration-300
                  ${index <= currentStepIndex ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
                `}
                            >
                                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300
                  ${index < currentStepIndex
                                        ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/25'
                                        : index === currentStepIndex
                                            ? 'bg-nxl-gold border-nxl-gold text-nxl-black animate-pulse shadow-lg shadow-nxl-gold/25'
                                            : 'bg-transparent border-nxl-gold/30 text-nxl-gold/50'
                                    }
                `}>
                                    {index < currentStepIndex ? '✓' : step.icon}
                                </div>
                                <span className={`
                  text-xs transition-colors duration-300
                  ${index === currentStepIndex ? 'text-nxl-gold font-medium' : 'text-nxl-ivory/50'}
                `}>
                                    {step.name}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="px-4 py-2 border-t border-nxl-gold/10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-nxl-ivory/80">Order Total</span>
                                <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                </div>
                            </div>
                            <span className="text-lg font-bold text-nxl-gold">{orderTotal}</span>
                        </div>
                        {cart?.items?.length > 0 && (
                            <div className="text-xs text-nxl-ivory/60 mt-1">
                                {cart.items.length} item{cart.items.length !== 1 ? 's' : ''} • Taxes included
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="p-4 grid grid-cols-3 gap-3">
                        {/* Back Button */}
                        <button
                            onClick={handleBack}
                            className="flex items-center justify-center gap-2 py-3 px-4 bg-nxl-black/60 border border-nxl-gold/30 text-nxl-ivory rounded-lg font-medium hover:bg-nxl-gold/10 transition-all duration-300 active:scale-95"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="text-sm">Back</span>
                        </button>

                        {/* Current Step Info */}
                        <div className="flex flex-col items-center justify-center px-2">
                            <span className="text-xs text-nxl-ivory/70 mb-1">Current Step</span>
                            <div className="flex items-center gap-1">
                                <span className="text-lg">{steps[currentStepIndex]?.icon}</span>
                                <span className="text-xs font-medium text-nxl-gold">
                                    {steps[currentStepIndex]?.name}
                                </span>
                            </div>
                        </div>

                        {/* Continue Button */}
                        <button
                            onClick={handleContinue}
                            disabled={!isStepValid}
                            className={`
                flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all duration-300 active:scale-95
                ${isStepValid
                                    ? 'bg-nxl-gold text-nxl-black hover:bg-nxl-gold/90 shadow-lg shadow-nxl-gold/25'
                                    : 'bg-nxl-navy/40 text-nxl-ivory/40 cursor-not-allowed'
                                }
              `}
                        >
                            <span className="text-sm">
                                {currentStep === 'review' ? 'Place Order' : 'Continue'}
                            </span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="px-4 pb-2">
                        <div className="flex items-center justify-center gap-4 text-xs text-nxl-ivory/60">
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                <span>SSL Secure</span>
                            </div>
                            <div className="w-px h-3 bg-nxl-ivory/20" />
                            <div className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>PCI Compliant</span>
                            </div>
                            <div className="w-px h-3 bg-nxl-ivory/20" />
                            <div className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span>256-bit Encryption</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Spacer to prevent content from being hidden behind fixed navigation */}
            <div className="lg:hidden h-48" />
        </>
    )
}

export default MobileCheckoutNavigation 