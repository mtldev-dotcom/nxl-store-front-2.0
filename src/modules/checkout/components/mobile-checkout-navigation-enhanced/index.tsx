"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"

interface MobileCheckoutNavigationEnhancedProps {
    cart: any
    currentStep: string
    isStepValid: boolean
    onStepChange?: (step: string) => void
    className?: string
}

interface CheckoutStep {
    id: string
    name: string
    icon: string
    description: string
    completed: boolean
}

const MobileCheckoutNavigationEnhanced = ({
    cart,
    currentStep,
    isStepValid,
    onStepChange,
    className = ""
}: MobileCheckoutNavigationEnhancedProps) => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isVisible, setIsVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)
    const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
    const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null)
    const navigationRef = useRef<HTMLDivElement>(null)

    const steps: CheckoutStep[] = [
        {
            id: 'address',
            name: 'Address',
            icon: '📍',
            description: 'Shipping details',
            completed: Boolean(cart?.shipping_address)
        },
        {
            id: 'delivery',
            name: 'Delivery',
            icon: '🚚',
            description: 'Shipping method',
            completed: Boolean(cart?.shipping_methods && cart.shipping_methods.length > 0)
        },
        {
            id: 'payment',
            name: 'Payment',
            icon: '💳',
            description: 'Payment method',
            completed: Boolean(cart?.payment_collection)
        },
        {
            id: 'review',
            name: 'Review',
            icon: '✅',
            description: 'Final review',
            completed: false
        }
    ]

    const currentStepIndex = steps.findIndex(step => step.id === currentStep)
    const nextStep = steps[currentStepIndex + 1]
    const prevStep = steps[currentStepIndex - 1]

    // Enhanced scroll behavior with momentum
    useEffect(() => {
        let ticking = false

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY
                    const scrollDifference = Math.abs(currentScrollY - lastScrollY)

                    if (scrollDifference > 5) { // Threshold to prevent excessive state changes
                        if (currentScrollY > lastScrollY && currentScrollY > 80) {
                            setIsVisible(false) // Scrolling down
                        } else {
                            setIsVisible(true) // Scrolling up
                        }
                        setLastScrollY(currentScrollY)
                    }
                    ticking = false
                })
                ticking = true
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [lastScrollY])

    // Touch handlers for swipe gestures
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        const touch = e.touches[0]
        setTouchStart({ x: touch.clientX, y: touch.clientY })
        setTouchEnd(null)
    }, [])

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        const touch = e.touches[0]
        setTouchEnd({ x: touch.clientX, y: touch.clientY })
    }, [])

    const handleTouchEnd = useCallback(() => {
        if (!touchStart || !touchEnd) return

        const deltaX = touchStart.x - touchEnd.x
        const deltaY = touchStart.y - touchEnd.y
        const minSwipeDistance = 50

        // Only handle horizontal swipes
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                // Swipe left - go to next step
                setSwipeDirection('left')
                if (nextStep && isStepValid) {
                    setTimeout(() => navigateToStep(nextStep.id), 150)
                }
            } else {
                // Swipe right - go to previous step
                setSwipeDirection('right')
                if (prevStep) {
                    setTimeout(() => navigateToStep(prevStep.id), 150)
                }
            }

            // Reset swipe direction after animation
            setTimeout(() => setSwipeDirection(null), 300)
        }

        setTouchStart(null)
        setTouchEnd(null)
    }, [touchStart, touchEnd, nextStep, prevStep, isStepValid])

    // Navigate to step
    const navigateToStep = useCallback((stepId: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('step', stepId)
        const newUrl = `${pathname}?${params.toString()}`

        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(15)
        }

        router.push(newUrl, { scroll: false })
        onStepChange?.(stepId)
    }, [pathname, searchParams, router, onStepChange])

    const handleContinue = useCallback(() => {
        if (nextStep && isStepValid) {
            navigateToStep(nextStep.id)
        } else if (currentStep === 'review' && isStepValid) {
            // Handle order completion
            console.log('Complete order')
        }
    }, [nextStep, isStepValid, currentStep, navigateToStep])

    const handleBack = useCallback(() => {
        if (prevStep) {
            navigateToStep(prevStep.id)
        } else {
            router.push(`${pathname.replace('/checkout', '/cart')}`)
        }
    }, [prevStep, navigateToStep, router, pathname])

    // Calculate order total for display
    const orderTotal = cart?.total ? `$${(cart.total / 100).toFixed(2)}` : '$0.00'
    const itemCount = cart?.items?.length || 0

    return (
        <>
            {/* Enhanced Bottom Navigation Bar */}
            <div
                ref={navigationRef}
                className={`
          lg:hidden fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 safe-bottom
          ${isVisible ? 'translate-y-0' : 'translate-y-full'}
          ${swipeDirection === 'left' ? 'animate-pulse' : ''}
          ${swipeDirection === 'right' ? 'animate-pulse' : ''}
          ${className}
        `}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Main Navigation Container */}
                <div className="bg-gradient-to-t from-nxl-black via-nxl-black/98 to-nxl-black/95 backdrop-blur-xl border-t border-nxl-gold/30">

                    {/* Progress Bar */}
                    <div className="px-4 pt-3 pb-2">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-nxl-gold">
                                    Step {currentStepIndex + 1} of {steps.length}
                                </span>
                                <div className="w-1 h-1 bg-nxl-gold/60 rounded-full" />
                                <span className="text-xs text-nxl-ivory/60">
                                    {steps[currentStepIndex]?.description}
                                </span>
                            </div>
                            <span className="text-xs font-bold text-nxl-gold">
                                {Math.round(((currentStepIndex + 1) / steps.length) * 100)}%
                            </span>
                        </div>

                        {/* Enhanced Progress Bar */}
                        <div className="relative w-full h-2 bg-nxl-navy/40 rounded-full overflow-hidden">
                            <div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-nxl-gold via-nxl-gold/90 to-nxl-gold/80 rounded-full transition-all duration-700 ease-out"
                                style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
                        </div>
                    </div>

                    {/* Step Indicator Dots */}
                    <div className="flex items-center justify-between px-8 py-3 border-b border-nxl-gold/10">
                        {steps.map((step, index) => (
                            <button
                                key={step.id}
                                onClick={() => index <= currentStepIndex && navigateToStep(step.id)}
                                disabled={index > currentStepIndex}
                                className={`
                  flex flex-col items-center gap-1 transition-all duration-300 touch-target
                  ${index <= currentStepIndex ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'}
                `}
                            >
                                <div className={`
                  w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 relative
                  ${step.completed
                                        ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/30'
                                        : index === currentStepIndex
                                            ? 'bg-nxl-gold border-nxl-gold text-nxl-black shadow-lg shadow-nxl-gold/30'
                                            : index < currentStepIndex
                                                ? 'bg-nxl-gold/20 border-nxl-gold text-nxl-gold'
                                                : 'bg-transparent border-nxl-gold/20 text-nxl-gold/40'
                                    }
                `}>
                                    {step.completed ? '✓' : step.icon}
                                    {index === currentStepIndex && (
                                        <div className="absolute inset-0 rounded-full animate-ping bg-nxl-gold/20" />
                                    )}
                                </div>
                                <span className={`
                  text-xs transition-colors duration-300 font-medium
                  ${index === currentStepIndex ? 'text-nxl-gold' : 'text-nxl-ivory/50'}
                `}>
                                    {step.name}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="px-6 py-3 border-b border-nxl-gold/10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-nxl-gold/10 border border-nxl-gold/20 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-nxl-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-nxl-ivory">Order Total</span>
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                    </div>
                                    <div className="text-xs text-nxl-ivory/60">
                                        {itemCount} item{itemCount !== 1 ? 's' : ''} • All taxes included
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xl font-bold text-nxl-gold">{orderTotal}</div>
                                <div className="text-xs text-green-400">Free shipping qualified</div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 px-4 py-4">
                        {/* Back Button */}
                        <button
                            onClick={handleBack}
                            className="flex items-center justify-center gap-2 py-3 px-4 bg-nxl-black/60 border border-nxl-gold/30 text-nxl-ivory rounded-xl font-medium hover:bg-nxl-gold/10 transition-all duration-300 active:scale-95 touch-target"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="text-sm">Back</span>
                        </button>

                        {/* Continue Button */}
                        <button
                            onClick={handleContinue}
                            disabled={!isStepValid}
                            className={`
                flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold transition-all duration-300 active:scale-95 touch-target relative overflow-hidden
                ${isStepValid
                                    ? 'bg-nxl-gold text-nxl-black hover:bg-nxl-gold/90 shadow-lg shadow-nxl-gold/25'
                                    : 'bg-nxl-navy/40 text-nxl-ivory/40 cursor-not-allowed'
                                }
              `}
                        >
                            <span className="text-sm font-semibold">
                                {currentStep === 'review' ? 'Complete Order' : 'Continue'}
                            </span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            {isStepValid && (
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shimmer_2s_ease-in-out_infinite]" />
                            )}
                        </button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="px-4 pb-2">
                        <div className="flex items-center justify-center gap-4 text-xs text-nxl-ivory/50">
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

                    {/* Swipe Gesture Indicator */}
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                        <div className="w-8 h-1 bg-nxl-gold/30 rounded-full" />
                    </div>
                </div>
            </div>

            {/* Spacer to prevent content from being hidden behind fixed navigation */}
            <div className="lg:hidden h-52" />
        </>
    )
}

export default MobileCheckoutNavigationEnhanced 