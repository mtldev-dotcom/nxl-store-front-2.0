"use client"

import { useState, useEffect, useCallback } from "react"

interface ValidationRule {
    required?: boolean
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    custom?: (value: string) => string | null
}

interface FieldConfig {
    name: string
    rules?: ValidationRule
    suggestions?: string[]
    asyncValidator?: (value: string) => Promise<string | null>
}

interface SmartFormValidationProps {
    fields: FieldConfig[]
    onValidationChange?: (isValid: boolean, errors: Record<string, string>) => void
    className?: string
}

const SmartFormValidation = ({
    fields,
    onValidationChange,
    className = ""
}: SmartFormValidationProps) => {
    const [fieldStates, setFieldStates] = useState<Record<string, {
        value: string
        error: string | null
        warning: string | null
        isValidating: boolean
        isTouched: boolean
        suggestions: string[]
    }>>({})

    // Initialize field states
    useEffect(() => {
        const initialStates = fields.reduce((acc, field) => {
            acc[field.name] = {
                value: '',
                error: null,
                warning: null,
                isValidating: false,
                isTouched: false,
                suggestions: field.suggestions || []
            }
            return acc
        }, {} as typeof fieldStates)

        setFieldStates(initialStates)
    }, [fields])

    // Validate individual field
    const validateField = useCallback(async (fieldName: string, value: string) => {
        const field = fields.find(f => f.name === fieldName)
        if (!field?.rules) return null

        const { rules } = field

        // Required validation
        if (rules.required && !value.trim()) {
            return "This field is required"
        }

        // Length validations
        if (rules.minLength && value.length < rules.minLength) {
            return `Minimum ${rules.minLength} characters required`
        }

        if (rules.maxLength && value.length > rules.maxLength) {
            return `Maximum ${rules.maxLength} characters allowed`
        }

        // Pattern validation
        if (rules.pattern && !rules.pattern.test(value)) {
            return "Invalid format"
        }

        // Custom validation
        if (rules.custom) {
            const customError = rules.custom(value)
            if (customError) return customError
        }

        // Async validation
        if (field.asyncValidator) {
            try {
                const asyncError = await field.asyncValidator(value)
                return asyncError
            } catch (error) {
                return "Validation error occurred"
            }
        }

        return null
    }, [fields])

    // Handle field change with real-time validation
    const handleFieldChange = useCallback(async (fieldName: string, value: string) => {
        // Update field state immediately
        setFieldStates(prev => ({
            ...prev,
            [fieldName]: {
                ...prev[fieldName],
                value,
                isTouched: true,
                isValidating: true
            }
        }))

        // Debounced validation
        const timeoutId = setTimeout(async () => {
            const error = await validateField(fieldName, value)

            setFieldStates(prev => ({
                ...prev,
                [fieldName]: {
                    ...prev[fieldName],
                    error,
                    isValidating: false,
                    warning: generateWarning(fieldName, value)
                }
            }))

            // Notify parent of validation state
            if (onValidationChange) {
                const allErrors = { ...fieldStates }
                allErrors[fieldName] = { ...allErrors[fieldName], error }

                const hasErrors = Object.values(allErrors).some(state => state.error)
                const errors = Object.entries(allErrors).reduce((acc, [key, state]) => {
                    if (state.error) acc[key] = state.error
                    return acc
                }, {} as Record<string, string>)

                onValidationChange(!hasErrors, errors)
            }
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [fieldStates, validateField, onValidationChange])

    // Generate contextual warnings
    const generateWarning = useCallback((fieldName: string, value: string): string | null => {
        const field = fields.find(f => f.name === fieldName)
        if (!field) return null

        // Email field warnings
        if (fieldName.toLowerCase().includes('email')) {
            if (value && !value.includes('@')) {
                return "Don't forget the @ symbol"
            }
            if (value && value.includes('@') && !value.includes('.')) {
                return "Make sure to include the domain (.com, .org, etc.)"
            }
        }

        // Phone field warnings
        if (fieldName.toLowerCase().includes('phone')) {
            if (value && value.length < 10) {
                return "Phone numbers are usually 10+ digits"
            }
        }

        // Postal code warnings
        if (fieldName.toLowerCase().includes('postal') || fieldName.toLowerCase().includes('zip')) {
            if (value && value.length < 5) {
                return "Postal codes are usually 5+ characters"
            }
        }

        return null
    }, [fields])

    // Smart suggestions based on common patterns
    const getSmartSuggestions = useCallback((fieldName: string, value: string): string[] => {
        const field = fields.find(f => f.name === fieldName)
        if (!field) return []

        // Email suggestions
        if (fieldName.toLowerCase().includes('email') && value.includes('@') && !value.includes('.')) {
            const baseEmail = value.split('@')[0]
            return [
                `${baseEmail}@gmail.com`,
                `${baseEmail}@yahoo.com`,
                `${baseEmail}@hotmail.com`,
                `${baseEmail}@outlook.com`
            ]
        }

        return field.suggestions || []
    }, [fields])

    return (
        <div className={`smart-form-validation ${className}`}>
            {fields.map(field => {
                const state = fieldStates[field.name] || {}
                const suggestions = getSmartSuggestions(field.name, state.value)

                return (
                    <div key={field.name} className="mb-6">
                        {/* Field Input with Enhanced UI */}
                        <div className="relative">
                            <input
                                type="text"
                                value={state.value}
                                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                className={`w-full px-4 py-3 bg-nxl-black/40 border rounded-lg text-nxl-ivory placeholder-nxl-ivory/50 focus:outline-none focus:ring-2 transition-all duration-300 ${state.error
                                    ? 'border-red-500 focus:ring-red-500/30'
                                    : state.warning
                                        ? 'border-yellow-500 focus:ring-yellow-500/30'
                                        : state.isTouched && !state.error
                                            ? 'border-green-500 focus:ring-green-500/30'
                                            : 'border-nxl-gold/30 focus:ring-nxl-gold/30'
                                    }`}
                                placeholder={field.name}
                            />

                            {/* Loading Spinner */}
                            {state.isValidating && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <div className="w-4 h-4 border-2 border-nxl-gold/30 border-t-nxl-gold rounded-full animate-spin"></div>
                                </div>
                            )}

                            {/* Success Check */}
                            {state.isTouched && !state.error && !state.isValidating && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Error Display */}
                        {state.error && (
                            <div className="mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
                                <svg className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm text-red-400">{state.error}</span>
                            </div>
                        )}

                        {/* Warning Display */}
                        {state.warning && !state.error && (
                            <div className="mt-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-2">
                                <svg className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <span className="text-sm text-yellow-400">{state.warning}</span>
                            </div>
                        )}

                        {/* Smart Suggestions */}
                        {suggestions.length > 0 && state.isTouched && (
                            <div className="mt-2">
                                <p className="text-xs text-nxl-ivory/60 mb-2">Suggestions:</p>
                                <div className="flex flex-wrap gap-2">
                                    {suggestions.map((suggestion, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleFieldChange(field.name, suggestion)}
                                            className="px-3 py-1 bg-nxl-gold/20 text-nxl-gold text-xs rounded-full hover:bg-nxl-gold/30 transition-colors duration-200"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Success Message */}
                        {state.isTouched && !state.error && !state.warning && !state.isValidating && (
                            <div className="mt-2 flex items-center gap-2 text-green-400 text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Looks good!</span>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default SmartFormValidation 