"use client"

import { useState } from "react"
import { useTranslation } from "@lib/context/translation-context"
import { Button } from "@medusajs/ui"

interface NewsletterProps {
  dictionary?: Record<string, any>
}

const Newsletter = ({ dictionary }: NewsletterProps) => {
  const { translate } = useTranslation()
  
  // If dictionary isn't passed as a prop, use defaults
  const newsletterText = dictionary?.newsletter || {
    title: "Join The Next Level",
    subtitle: "Stay updated on new collections, exclusive offers, and golf lifestyle content",
    placeholder: "Your email address",
    subscribe: "Subscribe",
    processing: "Processing...",
    disclaimer: "By subscribing, you agree to receive marketing emails from Next X Level. You can unsubscribe at any time.",
    success: {
      title: "Thank You for Subscribing",
      message: "We've added you to our newsletter. Watch your inbox for exclusive updates and offers."
    }
  }
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
      setEmail("")
    }, 1000)
  }

  return (
    <section className="py-16 bg-nxl-black border-t border-nxl-gold/20">
      <div className="content-container max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl text-nxl-gold uppercase tracking-wider mb-4">
            {newsletterText.title}
          </h2>
          <p className="font-body text-nxl-ivory/80 max-w-xl mx-auto mb-6">
            {newsletterText.subtitle}
          </p>
        </div>

        {isSubmitted ? (
          <div className="text-center p-8 nxl-card max-w-xl mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-nxl-gold mx-auto mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <h3 className="font-serif text-xl text-nxl-ivory mb-2">{newsletterText.success.title}</h3>
            <p className="font-body text-nxl-ivory/80">
              {newsletterText.success.message}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
            <div className="p-8 nxl-card">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-grow">
                  <label htmlFor="email" className="sr-only">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={newsletterText.placeholder}
                    className="nxl-input w-full"
                    required
                  />
                </div>
                <Button 
                  type="submit"
                  className="nxl-btn-primary flex items-center justify-center min-w-[150px]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg aria-hidden="true" className="w-5 h-5 mr-2 text-nxl-black animate-spin fill-nxl-gold" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                      </svg>
                      Processing...
                    </>
                  ) : newsletterText.subscribe}
                </Button>
              </div>
              <p className="text-nxl-ivory/50 text-xs font-body text-center">
                {newsletterText.disclaimer}
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}

export default Newsletter
