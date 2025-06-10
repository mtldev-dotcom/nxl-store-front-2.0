"use client"

import { useState } from "react"
import { useIntersection } from "@lib/hooks/use-in-view"
import { useRef } from "react"
import { Button } from "@medusajs/ui"

interface NewsletterProps {
  dictionary?: Record<string, any>
}

const Newsletter = ({ dictionary }: NewsletterProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useIntersection(ref, "0px 0px -20% 0px")
  
  // Enhanced content with better defaults
  const newsletterText = dictionary?.newsletter || {
    title: "Join The Next Level",
    subtitle: "Stay updated on new collections, exclusive offers, and lifestyle inspiration",
    placeholder: "Your email address",
    subscribe: "Subscribe",
    processing: "Processing...",
    disclaimer: "By subscribing, you agree to receive marketing emails from Next X Level. You can unsubscribe at any time.",
    success: {
      title: "Thank You for Subscribing",
      message: "You've been added to our newsletter. Watch your inbox for exclusive updates and offers."
    }
  }
  
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }
    
    setIsLoading(true)
    
    try {
      // Simulate API call - replace with actual newsletter subscription logic
      await new Promise(resolve => setTimeout(resolve, 1500))
      setIsSubmitted(true)
      setEmail("")
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setIsSubmitted(false)
    setEmail("")
    setError("")
  }

  return (
    <section 
      ref={ref}
      className="py-16 lg:py-24 bg-gradient-to-t from-nxl-black via-nxl-navy/50 to-nxl-black relative overflow-hidden"
      aria-labelledby="newsletter-heading"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-nxl-gold rounded-full blur-3xl" />
      </div>

      {/* Top border */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-nxl-gold to-transparent" />

      <div className="content-container relative z-10">
        {/* Enhanced Header */}
        <header 
          className={`text-center mb-12 transition-all duration-1000 ${
            inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <h2 
            id="newsletter-heading"
            className="font-display text-3xl md:text-4xl lg:text-5xl text-nxl-gold uppercase tracking-wider mb-6"
          >
            {newsletterText.title}
          </h2>
          <p className="font-body text-lg text-white max-w-2xl mx-auto leading-relaxed">
            {newsletterText.subtitle}
          </p>
          
          {/* Newsletter benefits */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm font-body text-nxl-ivory/60">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-nxl-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Exclusive Offers</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-nxl-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>New Arrivals</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-nxl-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Style Tips</span>
            </div>
          </div>
        </header>

        {/* Newsletter Form/Success State */}
        <div 
          className={`max-w-2xl mx-auto transition-all duration-1000 delay-300 ${
            inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          {isSubmitted ? (
            <div className="text-center">
              {/* Success Animation */}
              <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
                <div className="absolute inset-0 bg-nxl-gold/20 rounded-full animate-ping" />
                <div className="relative bg-nxl-gold rounded-full p-4">
                  <svg className="w-8 h-8 text-nxl-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              
              <div className="bg-nxl-black/80 backdrop-blur-sm border border-nxl-gold/30 rounded-xl p-8 shadow-luxury">
                <h3 className="font-serif text-2xl text-nxl-gold mb-4">
                  {newsletterText.success.title}
                </h3>
                <p className="font-body text-nxl-ivory/80 mb-6 leading-relaxed">
                  {newsletterText.success.message}
                </p>
                <button
                  onClick={resetForm}
                  className="text-nxl-gold hover:text-nxl-gold-light font-button uppercase tracking-wider text-sm transition-colors duration-300"
                >
                  Subscribe Another Email
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-nxl-black/80 backdrop-blur-sm border border-nxl-gold/30 rounded-xl p-8 shadow-luxury">
                {/* Form Fields */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                  <div className="flex-grow">
                    <label htmlFor="newsletter-email" className="sr-only">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="newsletter-email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          if (error) setError("")
                        }}
                        placeholder={newsletterText.placeholder}
                        className={`w-full bg-nxl-navy/50 border ${
                          error ? 'border-status-error' : 'border-nxl-gold/30'
                        } text-nxl-ivory placeholder:text-nxl-ivory/50 px-6 py-4 rounded-lg font-body transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-nxl-gold/50 focus:border-nxl-gold`}
                        required
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <svg className="w-5 h-5 text-nxl-gold/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    {error && (
                      <p className="text-status-error text-sm mt-2 font-body">{error}</p>
                    )}
                  </div>
                  
                  <Button 
                    type="submit"
                    className="nxl-btn-primary group relative overflow-hidden min-w-[160px] lg:min-w-[200px] disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg 
                          className="w-5 h-5 mr-2 animate-spin" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>{newsletterText.processing}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span className="relative z-10">{newsletterText.subscribe}</span>
                        <svg 
                          className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    )}
                  </Button>
                </div>

                {/* Disclaimer */}
                <p className="text-nxl-ivory text-xs font-body text-center leading-relaxed">
                  {newsletterText.disclaimer}
                </p>

                {/* Social proof */}
                <div className="flex items-center justify-center mt-6 pt-6 border-t border-nxl-gold/20">
                  <div className="flex items-center gap-2 text-nxl-ivory/60 text-sm font-body">
                    <svg className="w-4 h-4 text-nxl-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                    <span>Join 5,000+ subscribers</span>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

export default Newsletter
