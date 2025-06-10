"use client"

import { useState, useEffect } from "react"
import { getDictionary } from "@lib/i18n/get-dictionary"
import { Locale } from "@lib/i18n/config"

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

interface ContactFormProps {
  locale?: Locale
}

const ContactForm = ({ locale = "en" }: ContactFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [dictionary, setDictionary] = useState<any>(null)

  useEffect(() => {
    const loadTranslations = async () => {
      const dict = await getDictionary(locale)
      setDictionary(dict)
    }
    loadTranslations()
  }, [locale])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = dictionary?.contact?.form?.validation?.nameRequired || "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = dictionary?.contact?.form?.validation?.emailRequired || "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = dictionary?.contact?.form?.validation?.emailInvalid || "Please enter a valid email address"
    }

    if (!formData.subject.trim()) {
      newErrors.subject = dictionary?.contact?.form?.validation?.subjectRequired || "Please select a subject"
    }

    if (!formData.message.trim()) {
      newErrors.message = dictionary?.contact?.form?.validation?.messageRequired || "Message is required"
    } else if (formData.message.trim().length < 10) {
      newErrors.message = dictionary?.contact?.form?.validation?.messageMinLength || "Message must be at least 10 characters long"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Here you would typically send the form data to your API
      console.log("Form submitted:", formData)
      
      setIsSubmitted(true)
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      })
    } catch (error) {
      console.error("Form submission error:", error)
      // Handle error appropriately
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!dictionary) {
    return <div className="bg-nxl-navy/50 p-8 rounded-sm border border-nxl-gold/20 h-96 animate-pulse"></div>
  }

  if (isSubmitted) {
    return (
      <div className="bg-nxl-navy/50 p-8 rounded-sm border border-nxl-gold/20 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-nxl-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-nxl-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-display text-2xl text-white drop-shadow-lg uppercase tracking-wider mb-4">
            {dictionary.contact?.form?.success?.title || "Message Sent Successfully"}
          </h3>
          <p className="font-body text-white/90 drop-shadow-md text-lg mb-6">
            {dictionary.contact?.form?.success?.description || "Thank you for reaching out to us. We'll get back to you within 24 hours."}
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="px-6 py-3 bg-nxl-gold text-nxl-black font-button uppercase tracking-wider hover:bg-nxl-gold/90 transition-colors duration-200"
          >
            {dictionary.contact?.form?.success?.sendAnother || "Send Another Message"}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-nxl-navy/50 p-8 rounded-sm border border-nxl-gold/20">
      <h3 className="font-display text-2xl md:text-3xl text-white drop-shadow-lg uppercase tracking-wider mb-8">
        {dictionary.contact?.form?.title || "Send Us a Message"}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block font-serif text-white/90 drop-shadow-sm mb-2">
            {dictionary.contact?.form?.name || "Name"} *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full p-3 bg-nxl-black border rounded-sm text-white/95 focus:outline-none transition-colors duration-200 ${
              errors.name 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-nxl-gold/30 focus:border-nxl-gold'
            }`}
            placeholder={dictionary.contact?.form?.placeholders?.name || "Enter your full name"}
          />
          {errors.name && (
            <p className="mt-1 text-red-400 text-sm font-body">{errors.name}</p>
          )}
        </div>
        
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block font-serif text-white/90 drop-shadow-sm mb-2">
            {dictionary.contact?.form?.email || "Email"} *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full p-3 bg-nxl-black border rounded-sm text-white/95 focus:outline-none transition-colors duration-200 ${
              errors.email 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-nxl-gold/30 focus:border-nxl-gold'
            }`}
            placeholder={dictionary.contact?.form?.placeholders?.email || "Enter your email address"}
          />
          {errors.email && (
            <p className="mt-1 text-red-400 text-sm font-body">{errors.email}</p>
          )}
        </div>
        
        {/* Subject Field */}
        <div>
          <label htmlFor="subject" className="block font-serif text-white/90 drop-shadow-sm mb-2">
            {dictionary.contact?.form?.subject || "Subject"} *
          </label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className={`w-full p-3 bg-nxl-black border rounded-sm text-white/95 focus:outline-none transition-colors duration-200 ${
              errors.subject 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-nxl-gold/30 focus:border-nxl-gold'
            }`}
          >
            <option value="" className="bg-nxl-black">
              {dictionary.contact?.form?.subjectPlaceholder || "Please select a subject"}
            </option>
            <option value="order" className="bg-nxl-black">
              {dictionary.contact?.form?.subjectOptions?.order || "Order Inquiry"}
            </option>
            <option value="product" className="bg-nxl-black">
              {dictionary.contact?.form?.subjectOptions?.product || "Product Information"}
            </option>
            <option value="wholesale" className="bg-nxl-black">
              {dictionary.contact?.form?.subjectOptions?.wholesale || "Wholesale Inquiry"}
            </option>
            <option value="partnership" className="bg-nxl-black">
              {dictionary.contact?.form?.subjectOptions?.partnership || "Partnership Opportunities"}
            </option>
            <option value="feedback" className="bg-nxl-black">
              {dictionary.contact?.form?.subjectOptions?.feedback || "Feedback & Suggestions"}
            </option>
            <option value="other" className="bg-nxl-black">
              {dictionary.contact?.form?.subjectOptions?.other || "Other"}
            </option>
          </select>
          {errors.subject && (
            <p className="mt-1 text-red-400 text-sm font-body">{errors.subject}</p>
          )}
        </div>
        
        {/* Message Field */}
        <div>
          <label htmlFor="message" className="block font-serif text-white/90 drop-shadow-sm mb-2">
            {dictionary.contact?.form?.message || "Message"} *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={5}
            className={`w-full p-3 bg-nxl-black border rounded-sm text-white/95 focus:outline-none transition-colors duration-200 resize-y ${
              errors.message 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-nxl-gold/30 focus:border-nxl-gold'
            }`}
            placeholder={dictionary.contact?.form?.placeholders?.message || "Tell us about your inquiry, feedback, or how we can help you..."}
          />
          {errors.message && (
            <p className="mt-1 text-red-400 text-sm font-body">{errors.message}</p>
          )}
          <p className="mt-1 text-white/70 drop-shadow-sm text-sm font-body">
            {dictionary.contact?.form?.characterCount?.replace("{count}", formData.message.length.toString()) || `${formData.message.length}/500 characters`}
          </p>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-6 font-serif text-lg font-semibold rounded-sm transition-all duration-200 ${
            isSubmitting
              ? 'bg-nxl-gold/50 text-nxl-black/50 cursor-not-allowed'
              : 'bg-nxl-gold text-nxl-black hover:bg-nxl-gold/90 hover:transform hover:scale-[1.02]'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-nxl-black/30 border-t-nxl-black rounded-full animate-spin"></div>
              <span>{dictionary.contact?.form?.submitting || "Sending..."}</span>
            </div>
          ) : (
            dictionary.contact?.form?.submit || "Send Message"
          )}
        </button>
        
        {/* Required fields note */}
        <p className="text-white/70 drop-shadow-sm text-sm font-body text-center">
          * {dictionary.contact?.form?.required || "Required fields"}
        </p>
      </form>
    </div>
  )
}

export default ContactForm
