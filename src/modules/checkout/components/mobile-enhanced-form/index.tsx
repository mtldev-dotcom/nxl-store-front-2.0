"use client"

import { useState, useRef } from "react"

interface MobileEnhancedFormProps {
    onSubmit?: (data: any) => void
    initialData?: any
    isLoading?: boolean
    errors?: Record<string, string>
    currentStep?: number
    totalSteps?: number
}

interface FormField {
    name: string
    label: string
    type: string
    required: boolean
    placeholder?: string
    validation?: (value: string) => string | undefined
    autoComplete?: string
    inputMode?: string
}

const MobileEnhancedForm = ({
    onSubmit,
    initialData = {},
    isLoading = false,
    errors = {},
    currentStep = 1,
    totalSteps = 4
}: MobileEnhancedFormProps) => {
    const [formData, setFormData] = useState(initialData)
    const [focusedField, setFocusedField] = useState<string | null>(null)
    const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())
    const formRef = useRef<HTMLFormElement>(null)

    // Enhanced form fields with better mobile UX
    const formFields: FormField[] = [
        {
            name: 'firstName',
            label: 'First Name',
            type: 'text',
            required: true,
            placeholder: 'Enter your first name',
            autoComplete: 'given-name',
            inputMode: 'text'
        },
        {
            name: 'lastName',
            label: 'Last Name',
            type: 'text',
            required: true,
            placeholder: 'Enter your last name',
            autoComplete: 'family-name',
            inputMode: 'text'
        },
        {
            name: 'email',
            label: 'Email Address',
            type: 'email',
            required: true,
            placeholder: 'Enter your email',
            autoComplete: 'email',
            inputMode: 'email',
            validation: (value) => {
                if (!value) return 'Email is required'
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email'
                return undefined
            }
        },
        {
            name: 'address',
            label: 'Street Address',
            type: 'text',
            required: true,
            placeholder: 'Enter your address',
            autoComplete: 'street-address',
            inputMode: 'text'
        },
        {
            name: 'city',
            label: 'City',
            type: 'text',
            required: true,
            placeholder: 'Enter your city',
            autoComplete: 'address-level2',
            inputMode: 'text'
        },
        {
            name: 'postalCode',
            label: 'Postal Code',
            type: 'text',
            required: true,
            placeholder: 'Enter postal code',
            autoComplete: 'postal-code',
            inputMode: 'text'
        },
        {
            name: 'phone',
            label: 'Phone Number',
            type: 'tel',
            required: false,
            placeholder: 'Enter phone number (optional)',
            autoComplete: 'tel',
            inputMode: 'tel'
        }
    ]

    const handleFieldChange = (name: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [name]: value }))
        setTouchedFields(prev => {
            const newSet = new Set(prev)
            newSet.add(name)
            return newSet
        })
    }

    const handleFieldFocus = (name: string) => {
        setFocusedField(name)
        // Haptic feedback simulation
        if (navigator.vibrate) {
            navigator.vibrate(10)
        }
    }

    const handleFieldBlur = (name: string) => {
        setFocusedField(null)
        setTouchedFields(prev => {
            const newSet = new Set(prev)
            newSet.add(name)
            return newSet
        })
    }

    const getFieldError = (name: string) => {
        return touchedFields.has(name) ? errors[name] : undefined
    }

    const isFieldValid = (name: string) => {
        const field = formFields.find(f => f.name === name)
        if (!field) return false

        const value = formData[name] || ''
        const hasError = getFieldError(name)

        if (field.required && !value.trim()) return false
        if (field.validation) {
            const validationError = field.validation(value)
            if (validationError) return false
        }

        return touchedFields.has(name) && !hasError
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Mark all fields as touched
        const allFieldNames = formFields.map(f => f.name)
        setTouchedFields(new Set(allFieldNames))

        // Validate all fields
        const hasErrors = formFields.some(field => {
            const value = formData[field.name] || ''
            if (field.required && !value.trim()) return true
            if (field.validation) {
                const error = field.validation(value)
                if (error) return true
            }
            return false
        })

        if (!hasErrors) {
            onSubmit?.(formData)
        }
    }

    return (
        <div className="relative bg-nxl-black/80 backdrop-blur-sm border border-nxl-gold/30 rounded-xl overflow-hidden">
            {/* Mobile Form Header */}
            <div className="sticky top-0 z-10 bg-nxl-black/95 backdrop-blur-lg border-b border-nxl-gold/20 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-nxl-gold/20 border-2 border-nxl-gold flex items-center justify-center">
                            <span className="text-xs font-bold text-nxl-gold">{currentStep}</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-nxl-gold">Shipping Address</h2>
                            <p className="text-xs text-nxl-ivory/70">Step {currentStep} of {totalSteps}</p>
                        </div>
                    </div>

                    {/* Progress Ring */}
                    <div className="relative w-12 h-12">
                        <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                            <path
                                className="text-nxl-gold/20"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                                className="text-nxl-gold"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="none"
                                strokeDasharray={`${(currentStep / totalSteps) * 100}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-medium text-nxl-gold">
                                {Math.round((currentStep / totalSteps) * 100)}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Form */}
            <form ref={formRef} onSubmit={handleSubmit} className="p-6">
                <div className="space-y-5">
                    {formFields.map((field, index) => (
                        <div key={field.name} className="relative">
                            {/* Field Label */}
                            <div className="flex items-center gap-2 mb-3">
                                <label className="text-sm font-medium text-nxl-ivory">
                                    {field.label}
                                    {field.required && <span className="text-red-400 ml-1">*</span>}
                                </label>
                                {isFieldValid(field.name) && (
                                    <div className="ml-auto">
                                        <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                                            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Enhanced Input */}
                            <div className="relative">
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={formData[field.name] || ''}
                                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                    onFocus={() => handleFieldFocus(field.name)}
                                    onBlur={() => handleFieldBlur(field.name)}
                                    placeholder={field.placeholder}
                                    autoComplete={field.autoComplete}
                                    inputMode={field.inputMode as any}
                                    className={`
                    w-full h-14 px-4 py-3 rounded-xl border-2 transition-all duration-300 
                    text-nxl-ivory placeholder-nxl-ivory/50 bg-nxl-black/60 backdrop-blur-sm
                    focus:outline-none focus:ring-0 touch-target text-base
                    ${focusedField === field.name
                                            ? 'border-nxl-gold shadow-lg shadow-nxl-gold/25 bg-nxl-black/80'
                                            : getFieldError(field.name)
                                                ? 'border-red-400 bg-red-500/5'
                                                : isFieldValid(field.name)
                                                    ? 'border-green-400 bg-green-500/5'
                                                    : 'border-nxl-gold/30 hover:border-nxl-gold/50'
                                        }
                  `}
                                    required={field.required}
                                />

                                {/* Field Status Indicator */}
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    {focusedField === field.name && (
                                        <div className="w-2 h-2 bg-nxl-gold rounded-full animate-pulse" />
                                    )}
                                </div>
                            </div>

                            {/* Error Message */}
                            {getFieldError(field.name) && (
                                <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                                    <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm text-red-400">{getFieldError(field.name)}</span>
                                </div>
                            )}

                            {/* Field Suggestions/Help */}
                            {focusedField === field.name && field.name === 'email' && (
                                <div className="mt-2 p-3 bg-nxl-gold/10 border border-nxl-gold/20 rounded-lg">
                                    <p className="text-xs text-nxl-ivory/80">
                                        💡 We'll send order updates to this email address
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Form Actions */}
                <div className="mt-8 space-y-4">
                    {/* Continue Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`
                w-full h-14 rounded-xl font-semibold text-lg transition-all duration-300 
                flex items-center justify-center gap-3 touch-target relative overflow-hidden
                ${isLoading
                                ? 'bg-nxl-gold/50 text-nxl-black/50 cursor-not-allowed'
                                : 'bg-nxl-gold text-nxl-black hover:bg-nxl-gold/90 active:scale-95 shadow-lg shadow-nxl-gold/25'
                            }
              `}
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-nxl-black/30 border-t-nxl-black rounded-full animate-spin" />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <span>Continue to Delivery</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </>
                        )}
                    </button>

                    {/* Trust Indicators */}
                    <div className="flex items-center justify-center gap-6 text-xs text-nxl-ivory/60">
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span>SSL Secure</span>
                        </div>
                        <div className="w-px h-3 bg-nxl-ivory/20" />
                        <div className="flex items-center gap-1">
                            <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Encrypted</span>
                        </div>
                        <div className="w-px h-3 bg-nxl-ivory/20" />
                        <div className="flex items-center gap-1">
                            <span>🔒</span>
                            <span>Protected</span>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default MobileEnhancedForm 