"use client"

import { useState, FormEvent } from "react"

/**
 * ContactForm Component
 * -----------------------------------------------------------------------------
 * Client component that renders and handles a contact form.
 * Includes form validation and submission.
 */
export default function ContactForm({ dictionary }: { dictionary: any }) {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")

  // Extract dictionary values with fallbacks
  const formLabels = {
    name: dictionary?.contact?.form?.name || "Full Name",
    email: dictionary?.contact?.form?.email || "Email Address",
    subject: dictionary?.contact?.form?.subject || "Subject",
    message: dictionary?.contact?.form?.message || "Your Message",
    submit: dictionary?.contact?.form?.submit || "Send Message",
    sending: dictionary?.contact?.form?.sending || "Sending...",
    successTitle: dictionary?.contact?.form?.successTitle || "Message Sent",
    successMessage: dictionary?.contact?.form?.successMessage || "Thank you for contacting us. We'll respond to your inquiry as soon as possible.",
    errorTitle: dictionary?.contact?.form?.errorTitle || "Error",
    errorMessage: dictionary?.contact?.form?.errorMessage || "There was a problem sending your message. Please try again later.",
    required: dictionary?.contact?.form?.required || "This field is required",
    invalidEmail: dictionary?.contact?.form?.invalidEmail || "Please enter a valid email address",
  }

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = formLabels.required
    }
    
    if (!formData.email.trim()) {
      newErrors.email = formLabels.required
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = formLabels.invalidEmail
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = formLabels.required
    }
    
    if (!formData.message.trim()) {
      newErrors.message = formLabels.required
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setSubmitStatus("submitting")
    
    // Simulate API call
    try {
      // In a real implementation, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSubmitStatus("success")
      
      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitStatus("error")
    }
  }

  if (submitStatus === "success") {
    return (
      <div className="text-center p-6 bg-nxl-forest/30 border border-nxl-gold/20 rounded-sm">
        <h3 className="font-display text-xl text-nxl-gold mb-4">{formLabels.successTitle}</h3>
        <p className="font-body text-nxl-ivory/90">{formLabels.successMessage}</p>
        <button 
          onClick={() => setSubmitStatus("idle")}
          className="mt-6 bg-nxl-gold hover:bg-nxl-gold/80 text-nxl-black font-serif py-2 px-6 uppercase text-sm tracking-wider transition-colors rounded-sm"
        >
          {dictionary?.general?.backToForm || "Back to Form"}
        </button>
      </div>
    )
  }

  if (submitStatus === "error") {
    return (
      <div className="text-center p-6 bg-red-900/20 border border-red-500/30 rounded-sm">
        <h3 className="font-display text-xl text-red-400 mb-4">{formLabels.errorTitle}</h3>
        <p className="font-body text-nxl-ivory/90">{formLabels.errorMessage}</p>
        <button 
          onClick={() => setSubmitStatus("idle")}
          className="mt-6 bg-nxl-gold hover:bg-nxl-gold/80 text-nxl-black font-serif py-2 px-6 uppercase text-sm tracking-wider transition-colors rounded-sm"
        >
          {dictionary?.general?.tryAgain || "Try Again"}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block font-serif text-nxl-ivory mb-2">
          {formLabels.name} <span className="text-nxl-gold">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full bg-nxl-black border ${errors.name ? 'border-red-500/70' : 'border-nxl-gold/30'} 
            focus:border-nxl-gold/60 focus:ring-1 focus:ring-nxl-gold/50 rounded-sm px-4 py-3
            font-body text-nxl-ivory placeholder-nxl-ivory/50 focus:outline-none transition-colors`}
        />
        {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
      </div>
      
      <div>
        <label htmlFor="email" className="block font-serif text-nxl-ivory mb-2">
          {formLabels.email} <span className="text-nxl-gold">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full bg-nxl-black border ${errors.email ? 'border-red-500/70' : 'border-nxl-gold/30'} 
            focus:border-nxl-gold/60 focus:ring-1 focus:ring-nxl-gold/50 rounded-sm px-4 py-3
            font-body text-nxl-ivory placeholder-nxl-ivory/50 focus:outline-none transition-colors`}
        />
        {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
      </div>
      
      <div>
        <label htmlFor="subject" className="block font-serif text-nxl-ivory mb-2">
          {formLabels.subject} <span className="text-nxl-gold">*</span>
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className={`w-full bg-nxl-black border ${errors.subject ? 'border-red-500/70' : 'border-nxl-gold/30'} 
            focus:border-nxl-gold/60 focus:ring-1 focus:ring-nxl-gold/50 rounded-sm px-4 py-3
            font-body text-nxl-ivory placeholder-nxl-ivory/50 focus:outline-none transition-colors`}
        />
        {errors.subject && <p className="mt-1 text-sm text-red-400">{errors.subject}</p>}
      </div>
      
      <div>
        <label htmlFor="message" className="block font-serif text-nxl-ivory mb-2">
          {formLabels.message} <span className="text-nxl-gold">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          className={`w-full bg-nxl-black border ${errors.message ? 'border-red-500/70' : 'border-nxl-gold/30'} 
            focus:border-nxl-gold/60 focus:ring-1 focus:ring-nxl-gold/50 rounded-sm px-4 py-3
            font-body text-nxl-ivory placeholder-nxl-ivory/50 focus:outline-none transition-colors`}
        />
        {errors.message && <p className="mt-1 text-sm text-red-400">{errors.message}</p>}
      </div>
      
      <button
        type="submit"
        disabled={submitStatus === "submitting"}
        className="w-full bg-nxl-gold hover:bg-nxl-gold/80 text-nxl-black font-serif py-3 
          uppercase text-sm tracking-wider transition-colors rounded-sm disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {submitStatus === "submitting" ? formLabels.sending : formLabels.submit}
      </button>
    </form>
  )
}
