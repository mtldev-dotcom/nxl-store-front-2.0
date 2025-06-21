"use client"

import { useState, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

interface SmartProgressIndicatorProps {
    cart: any
    customer: any
    currentStep?: string
}

const SmartProgressIndicator = ({
    cart,
    customer,
    currentStep
}: SmartProgressIndicatorProps) => {
    const searchParams = useSearchParams()
    const [completionEstimate, setCompletionEstimate] = useState(0)
    const [timeRemaining, setTimeRemaining] = useState("2-3 minutes")
    const [userProgress, setUserProgress] = useState({
        hasAddress: false,
        hasShipping: false,
        hasPayment: false,
        canProceed: false
    })

    const steps = [
        {
            id: 'address',
            name: "Address Info",
            icon: '📍',
            estimatedTime: '30s',
            isCompleted: userProgress.hasAddress,
            isActive: currentStep === 'address',
            helpText: "We'll use this for delivery and billing"
        },
        {
            id: 'shipping',
            name: "Delivery",
            icon: '🚚',
            estimatedTime: '15s',
            isCompleted: userProgress.hasShipping,
            isActive: currentStep === 'shipping',
            helpText: "Choose your preferred delivery option"
        },
        {
            id: 'payment',
            name: "Payment",
            icon: '💳',
            estimatedTime: '45s',
            isCompleted: userProgress.hasPayment,
            isActive: currentStep === 'payment',
            helpText: "Secure payment processing"
        },
        {
            id: 'review',
            name: "Review",
            icon: '✓',
            estimatedTime: '15s',
            isCompleted: false,
            isActive: currentStep === 'review',
            helpText: "Final check before placing order"
        }
    ]

    // Calculate progress based on cart state
    useEffect(() => {
        const progress = {
            hasAddress: !!(cart?.shipping_address && cart?.billing_address),
            hasShipping: !!(cart?.shipping_methods && cart.shipping_methods.length > 0),
            hasPayment: !!(cart?.payment_collection || cart?.gift_cards?.length > 0),
            canProceed: true
        }

        setUserProgress(progress)

        // Calculate completion percentage
        const completedSteps = Object.values(progress).filter(Boolean).length
        const totalSteps = 4
        const percentage = Math.round((completedSteps / totalSteps) * 100)
        setCompletionEstimate(percentage)

        // Estimate time remaining based on remaining steps
        const remainingSteps = totalSteps - completedSteps
        const estimatedMinutes = remainingSteps * 0.5 // 30 seconds per step average
        setTimeRemaining(estimatedMinutes < 1 ? "Less than 1 minute" : `${Math.ceil(estimatedMinutes)} minutes`)
    }, [cart])

    const currentStepIndex = steps.findIndex(step => step.isActive)
    const activeStep = steps[currentStepIndex] || steps[0]

    return (
        <>
            {/* Mobile Progress Bar */}
            <div className="lg:hidden bg-nxl-black/60 backdrop-blur-sm border border-nxl-gold/30 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">{activeStep.icon}</span>
                        <div>
                            <h2 className="text-lg font-bold text-nxl-gold font-display">
                                {activeStep.name}
                            </h2>
                            <p className="text-xs text-nxl-ivory/70">
                                {activeStep.helpText}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-semibold text-nxl-gold">
                            {completionEstimate}%
                        </div>
                        <div className="text-xs text-nxl-ivory/60">
                            {timeRemaining}
                        </div>
                    </div>
                </div>

                {/* Enhanced Progress Bar with Smart Segments */}
                <div className="relative">
                    <div className="flex items-center gap-1 mb-2">
                        <div className="flex-1 h-2 bg-nxl-navy/40 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-nxl-gold to-nxl-gold/80 transition-all duration-700 ease-out"
                                style={{ width: `${completionEstimate}%` }}
                            />
                        </div>
                        <span className="text-xs text-nxl-gold font-medium ml-2">
                            {Math.floor(completionEstimate)}%
                        </span>
                    </div>

                    {/* Smart Step Dots */}
                    <div className="flex justify-between items-center mt-3">
                        {steps.map((step, index) => (
                            <div
                                key={step.id}
                                className={`flex flex-col items-center gap-1 transition-all duration-300 ${step.isActive ? 'scale-110' : step.isCompleted ? 'scale-100' : 'scale-90 opacity-60'
                                    }`}
                            >
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${step.isCompleted
                                    ? 'bg-green-500 border-green-500 text-white'
                                    : step.isActive
                                        ? 'bg-nxl-gold border-nxl-gold text-nxl-black animate-pulse'
                                        : 'bg-transparent border-nxl-gold/30 text-nxl-gold/50'
                                    }`}>
                                    {step.isCompleted ? '✓' : index + 1}
                                </div>
                                <span className={`text-xs transition-colors duration-300 ${step.isActive ? 'text-nxl-gold font-medium' : 'text-nxl-ivory/50'
                                    }`}>
                                    {step.estimatedTime}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contextual Next Step Hint */}
                {currentStepIndex < steps.length - 1 && (
                    <div className="mt-4 p-3 bg-nxl-gold/10 border border-nxl-gold/20 rounded-lg">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-nxl-gold">💡</span>
                            <span className="text-nxl-ivory/80">
                                <strong className="text-nxl-gold">Next:</strong> {steps[currentStepIndex + 1]?.name}
                                <span className="text-nxl-ivory/60"> ({steps[currentStepIndex + 1]?.estimatedTime})</span>
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Desktop Enhanced Progress Indicator */}
            <div className="hidden lg:block bg-nxl-black/60 backdrop-blur-sm border border-nxl-gold/30 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-nxl-gold font-display mb-1">
                            Secure Checkout
                        </h1>
                        <p className="text-sm text-nxl-ivory/70">
                            {completionEstimate}% complete • {timeRemaining} remaining
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-nxl-ivory/60">
                        <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse"></div>
                        <span>SSL Secured</span>
                    </div>
                </div>

                {/* Desktop Step Flow */}
                <div className="flex items-center justify-between relative">
                    {/* Progress Line */}
                    <div className="absolute top-6 left-6 right-6 h-1 bg-nxl-navy/40 rounded-full">
                        <div
                            className="h-full bg-gradient-to-r from-nxl-gold to-nxl-gold/80 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${(completionEstimate / 100) * 100}%` }}
                        />
                    </div>

                    {steps.map((step, index) => (
                        <div key={step.id} className="flex flex-col items-center gap-3 relative z-10">
                            <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all duration-300 ${step.isCompleted
                                ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/25'
                                : step.isActive
                                    ? 'bg-nxl-gold border-nxl-gold text-nxl-black shadow-lg shadow-nxl-gold/25 animate-pulse'
                                    : 'bg-nxl-black border-nxl-gold/30 text-nxl-gold/50'
                                }`}>
                                {step.isCompleted ? '✓' : step.icon}
                            </div>
                            <div className="text-center">
                                <div className={`text-sm font-medium transition-colors duration-300 ${step.isActive ? 'text-nxl-gold' : step.isCompleted ? 'text-green-400' : 'text-nxl-ivory/60'
                                    }`}>
                                    {step.name}
                                </div>
                                <div className="text-xs text-nxl-ivory/40 mt-1">
                                    {step.estimatedTime}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Smart Assistance */}
                {activeStep && !activeStep.isCompleted && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                <span className="text-blue-400 text-lg">💬</span>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-blue-400 mb-1">
                                    Smart Assistance
                                </h4>
                                <p className="text-xs text-nxl-ivory/80 leading-relaxed">
                                    {activeStep.helpText}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default SmartProgressIndicator 