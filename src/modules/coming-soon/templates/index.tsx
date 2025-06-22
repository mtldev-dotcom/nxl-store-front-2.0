"use client"

import { useState, useEffect } from "react"
import { Locale } from "@lib/i18n/config"
import CountdownTimer from "../components/countdown-timer"
import WaitlistForm from "../components/waitlist-form"

interface ComingSoonTemplateProps {
    dictionary: Record<string, any>
    locale: Locale
    countryCode: string
}

export default function ComingSoonTemplate({
    dictionary,
    locale,
    countryCode,
}: ComingSoonTemplateProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // June 25, 2025 at noon (12:00 PM)
    const launchDate = new Date('2025-06-25T12:00:00')

    if (!mounted) {
        return null // Prevent hydration mismatch
    }

    return (
        <html lang={locale} className="h-full">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body className="h-full">
                <main className="min-h-screen relative overflow-hidden">
                    {/* Background with luxury gradient and images */}
                    <div className="absolute inset-0 bg-gradient-to-br from-nxl-black via-nxl-navy to-nxl-green">
                        {/* Hero background image */}
                        <div className="absolute inset-0 opacity-10">
                            <img
                                src="/hero1.png"
                                alt="Next X Level lifestyle"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Animated background elements */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-nxl-gold rounded-full blur-3xl animate-pulse" />
                            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-nxl-gold rounded-full blur-2xl animate-pulse delay-1000" />
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-nxl-gold opacity-5 rounded-full" />
                        </div>

                        {/* Product showcase images */}
                        <div className="absolute inset-0 opacity-5">
                            <div className="absolute top-20 left-10 w-32 h-32 lg:w-48 lg:h-48">
                                <img
                                    src="/polo.png"
                                    alt="Next X Level polo"
                                    className="w-full h-full object-contain transform rotate-12 animate-pulse"
                                />
                            </div>
                            <div className="absolute bottom-20 right-10 w-28 h-28 lg:w-40 lg:h-40">
                                <img
                                    src="/cap.png"
                                    alt="Next X Level cap"
                                    className="w-full h-full object-contain transform -rotate-12 animate-pulse delay-500"
                                />
                            </div>
                            <div className="absolute top-1/2 right-20 w-24 h-24 lg:w-36 lg:h-36">
                                <img
                                    src="/hoodie.png"
                                    alt="Next X Level hoodie"
                                    className="w-full h-full object-contain transform rotate-6 animate-pulse delay-1000"
                                />
                            </div>
                        </div>

                        {/* Subtle pattern overlay */}
                        <div
                            className="absolute inset-0 opacity-[0.02]"
                            style={{
                                backgroundImage: `radial-gradient(circle at 2px 2px, var(--color-nxl-gold) 1px, transparent 0)`,
                                backgroundSize: '40px 40px'
                            }}
                        />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 content-container flex flex-col items-center justify-center min-h-screen py-12">
                        <div className="max-w-4xl mx-auto text-center space-y-16">

                            {/* Brand Logo and Title */}
                            <div className="space-y-8 animate-fade-in-up">
                                <div className="space-y-6">
                                    {/* NXL Logo */}
                                    <div className="flex justify-center mb-6">
                                        <img
                                            src="/nxl-gold-logo.png"
                                            alt="Next X Level Logo"
                                            className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain"
                                        />
                                    </div>

                                    <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-nxl-gold uppercase tracking-wider">
                                        Next <span className="text-nxl-ivory">X</span> Level
                                    </h1>
                                    <div className="w-32 h-px bg-gradient-to-r from-transparent via-nxl-gold to-transparent mx-auto" />
                                </div>

                                <div className="space-y-6">
                                    <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-nxl-ivory leading-tight">
                                        Luxury Streetwear.<br />
                                        <span className="text-nxl-gold">Elevated Performance.</span>
                                    </h2>

                                    <p className="font-body text-lg md:text-xl text-nxl-ivory opacity-90 max-w-2xl mx-auto leading-relaxed">
                                        We're crafting the next generation of premium athletic streetwear.
                                        From chalet to city, our collection elevates your style and performance.
                                    </p>
                                </div>
                            </div>

                            {/* Countdown Timer */}
                            <div className="animate-fade-in-up delay-300">
                                <CountdownTimer launchDate={launchDate} />
                            </div>

                            {/* Value Propositions */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up delay-500">
                                <div className="space-y-4 relative group">
                                    <div className="w-16 h-16 bg-nxl-gold bg-opacity-10 rounded-full flex items-center justify-center mx-auto relative overflow-hidden">
                                        <img
                                            src="/polo.png"
                                            alt="Premium polo"
                                            className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-300"
                                        />
                                        <svg className="w-8 h-8 text-nxl-gold relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-serif text-xl text-nxl-ivory">Premium Materials</h3>
                                    <p className="font-body text-nxl-ivory opacity-75 text-sm">
                                        Japanese cotton blends and technical fabrics for ultimate comfort and durability.
                                    </p>
                                </div>

                                <div className="space-y-4 relative group">
                                    <div className="w-16 h-16 bg-nxl-gold bg-opacity-10 rounded-full flex items-center justify-center mx-auto relative overflow-hidden">
                                        <img
                                            src="/jogger.png"
                                            alt="Performance joggers"
                                            className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-300"
                                        />
                                        <svg className="w-8 h-8 text-nxl-gold relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-serif text-xl text-nxl-ivory">Performance First</h3>
                                    <p className="font-body text-nxl-ivory opacity-75 text-sm">
                                        Moisture-wicking, four-way stretch, and odor control technology in every piece.
                                    </p>
                                </div>

                                <div className="space-y-4 relative group">
                                    <div className="w-16 h-16 bg-nxl-gold bg-opacity-10 rounded-full flex items-center justify-center mx-auto relative overflow-hidden">
                                        <img
                                            src="/hoodie-brandstory.png"
                                            alt="Canadian crafted hoodie"
                                            className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-300"
                                        />
                                        <svg className="w-8 h-8 text-nxl-gold relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-serif text-xl text-nxl-ivory">Canadian Crafted</h3>
                                    <p className="font-body text-nxl-ivory opacity-75 text-sm">
                                        Ethically manufactured in Canada with sustainable practices and transparent supply chain.
                                    </p>
                                </div>
                            </div>

                            {/* Waitlist Form */}
                            <div className="animate-fade-in-up delay-700">
                                <WaitlistForm
                                    dictionary={dictionary}
                                    locale={locale}
                                    countryCode={countryCode}
                                />
                            </div>

                            {/* Social Proof & Trust Signals */}
                            <div className="space-y-8 animate-fade-in-up delay-1000">
                                <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-5 h-5 text-nxl-gold" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="font-body text-sm text-nxl-ivory">SSL Secured</span>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <svg className="w-5 h-5 text-nxl-gold" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="font-body text-sm text-nxl-ivory">Privacy Protected</span>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <svg className="w-5 h-5 text-nxl-gold" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="font-body text-sm text-nxl-ivory">No Spam Guarantee</span>
                                    </div>
                                </div>

                                <p className="font-body text-xs text-nxl-ivory opacity-50 max-w-md mx-auto">
                                    Join thousands of style enthusiasts waiting for the launch.
                                    Be the first to experience Next X Level quality.
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </body>
        </html>
    )
} 