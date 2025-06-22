"use client"

import { useState } from "react"
import { Locale } from "@lib/i18n/config"

interface WaitlistFormProps {
    dictionary: Record<string, any>
    locale: Locale
    countryCode: string
}

interface FormData {
    name: string
    email: string
}

export default function WaitlistForm({
    dictionary,
    locale,
    countryCode,
}: WaitlistFormProps) {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name.trim() || !formData.email.trim()) {
            setError('Please fill in all fields')
            return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            const response = await fetch('/api/waitlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.trim().toLowerCase(),
                    locale,
                    countryCode,
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to join waitlist')
            }

            setIsSuccess(true)
            setFormData({ name: "", email: "" })

        } catch (error) {
            setError('Something went wrong. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="max-w-md mx-auto text-center">
                <div className="bg-nxl-black-soft backdrop-blur-sm border border-nxl-gold border-opacity-30 rounded-lg p-8 space-y-6">
                    <div className="w-16 h-16 bg-nxl-gold bg-opacity-20 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-8 h-8 text-nxl-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-serif text-2xl text-nxl-gold">Welcome to the Club!</h3>
                        <p className="font-body text-nxl-ivory opacity-90">
                            You're officially on the Next X Level waitlist. We'll notify you with exclusive early access.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-md mx-auto">
            <div className="space-y-8">
                <div className="text-center space-y-4">
                    <h3 className="font-serif text-2xl md:text-3xl text-nxl-ivory">Join the Waitlist</h3>
                    <p className="font-body text-nxl-ivory opacity-75">
                        Be the first to experience Next X Level. Get exclusive early access and launch day offers.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="block font-body text-sm text-nxl-ivory opacity-90">
                            Full Name *
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full nxl-input"
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="email" className="block font-body text-sm text-nxl-ivory opacity-90">
                            Email Address *
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full nxl-input"
                            placeholder="Enter your email address"
                            required
                        />
                    </div>

                    {error && (
                        <div className="bg-status-error bg-opacity-10 border border-status-error rounded-lg p-4">
                            <p className="text-status-error text-sm font-body text-center">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full nxl-btn-primary"
                    >
                        {isSubmitting ? 'Joining...' : 'Join the Exclusive Waitlist'}
                    </button>

                    <p className="text-xs text-nxl-ivory opacity-50 text-center">
                        We respect your privacy and will never spam you.
                    </p>
                </form>
            </div>
        </div>
    )
} 