/*****************************************************************************************
 * Contact Page ([countryCode]/[locale]/(main)/contact/page.tsx)
 * ---------------------------------------------------------------------------------------
 * Purpose:
 *   • Render the localized contact page for a given country and locale.
 *   • Provide SEO metadata based on locale-specific dictionary.
 *   • Display contact information, form, location, and FAQs.
 *
 * High-level flow:
 *   1. generateMetadata() → Build page <head> tags (title + description) using i18n.
 *   2. default export Contact() → Async server component:
 *        a. Await route params (countryCode, locale).
 *        b. Load dictionary for translations.
 *        c. Render page sections in order.
 *****************************************************************************************/

import { Metadata } from "next" // Next.js type for metadata export
import Image from "next/image"

// Internationalization helpers
import { getDictionary } from "@lib/i18n/get-dictionary" // Load locale-specific texts
import { Locale } from "@lib/i18n/config"                // Locale type

/**
 * generateMetadata
 * -----------------------------------------------------------------------------
 * Called by Next.js App Router to generate <head> metadata for the contact page.
 * Uses the locale to load the appropriate dictionary for title and description.
 *
 * @param paramsPromise - Promise or object containing locale and countryCode
 * @returns Metadata object with localized title & description
 */
export async function generateMetadata({
  params: paramsPromise,
}: {
  params: Promise<{ locale: Locale; countryCode: string }>
}): Promise<Metadata> {
  // Wait for route params to resolve
  const params = await paramsPromise

  // Load translation dictionary for the given locale
  const dictionary = await getDictionary(params.locale)

  // Return metadata using locale-specific text
  return {
    title: `${dictionary.navigation.contact} | ${dictionary.general.title}`,
    description: "Get in touch with Next X Level - the premium golf apparel brand. Contact our team for product inquiries, wholesale opportunities, or visit our showroom.",
  }
}

/**
 * Safe way to access potentially nested dictionary values
 * Provides proper type checking and fallbacks
 */
function getDictValue(obj: any, path: string[], fallback: string): string {
  try {
    let current = obj;
    for (const key of path) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return fallback;
      }
    }
    
    return typeof current === 'string' ? current : fallback;
  } catch (e) {
    return fallback;
  }
}

/**
 * Contact Component (default export)
 * -----------------------------------------------------------------------------
 * Async server component that renders the contact page.
 *
 * @param props.params - Promise or object with { countryCode, locale }
 * @returns JSX for the contact page layout and sections
 */
export default async function Contact(props: {
  params:
    | Promise<{ countryCode: string; locale: Locale }>
    | { countryCode: string; locale: Locale }
}) {
  // 1. Await dynamic route params (country and locale)
  const params = await props.params
  const { locale } = params
  
  // 2. Load localized text dictionary
  const dictionary = await getDictionary(locale)

  return (
    <>
      {/* Hero Section with large image and title overlay */}
      <section className="relative h-[50vh] min-h-[400px] bg-nxl-black">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover object-center opacity-70"
          >
            <source src="/golf-background.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-nxl-black via-nxl-black/40 to-transparent"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center p-8">
            <h1 className="font-display text-5xl md:text-6xl text-nxl-gold uppercase tracking-wider mb-6">
              {dictionary.navigation.contact}
            </h1>
            <p className="font-serif text-xl md:text-2xl text-nxl-ivory max-w-2xl mx-auto">
              {getDictValue(dictionary, ['contact', 'hero', 'subtitle'], "We'd love to hear from you")}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-16 md:py-24 bg-nxl-black">
        <div className="content-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-nxl-gold uppercase tracking-wider mb-10">
                {getDictValue(dictionary, ['contact', 'info', 'title'], "Get In Touch")}
              </h2>
              
              <div className="space-y-12">
                {/* Phone */}
                <div className="flex items-start space-x-6">
                  <div className="p-4 rounded-full bg-nxl-gold/10 border border-nxl-gold/30 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-nxl-gold">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl text-nxl-gold mb-2">
                      {getDictValue(dictionary, ['contact', 'info', 'phone', 'title'], "Phone")}
                    </h3>
                    <p className="font-body text-nxl-ivory/90 text-lg mb-1">
                      {getDictValue(dictionary, ['contact', 'info', 'phone', 'number'], "+1 (888) 555-GOLF")}
                    </p>
                    <p className="font-body text-nxl-ivory/70 text-sm">
                      {getDictValue(dictionary, ['contact', 'info', 'phone', 'hours'], "Monday-Friday, 9am-5pm EST")}
                    </p>
                  </div>
                </div>
                
                {/* Email */}
                <div className="flex items-start space-x-6">
                  <div className="p-4 rounded-full bg-nxl-gold/10 border border-nxl-gold/30 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-nxl-gold">
                      <rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl text-nxl-gold mb-2">
                      {getDictValue(dictionary, ['contact', 'info', 'email', 'title'], "Email")}
                    </h3>
                    <p className="font-body text-nxl-ivory/90 text-lg mb-1">
                      {getDictValue(dictionary, ['contact', 'info', 'email', 'address'], "info@nextxlevel.com")}
                    </p>
                    <p className="font-body text-nxl-ivory/70 text-sm">
                      {getDictValue(dictionary, ['contact', 'info', 'email', 'response'], "We'll respond within 24 hours")}
                    </p>
                  </div>
                </div>
                
                {/* Address */}
                <div className="flex items-start space-x-6">
                  <div className="p-4 rounded-full bg-nxl-gold/10 border border-nxl-gold/30 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-nxl-gold">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl text-nxl-gold mb-2">
                      {getDictValue(dictionary, ['contact', 'info', 'address', 'title'], "Address")}
                    </h3>
                    <p className="font-body text-nxl-ivory/90">
                      {getDictValue(dictionary, ['contact', 'info', 'address', 'line1'], "123 Fairway Drive")}
                    </p>
                    <p className="font-body text-nxl-ivory/90">
                      {getDictValue(dictionary, ['contact', 'info', 'address', 'line2'], "Toronto, Ontario M5V 2K7")}
                    </p>
                    <p className="font-body text-nxl-ivory/90">
                      {getDictValue(dictionary, ['contact', 'info', 'address', 'line3'], "Canada")}
                    </p>
                  </div>
                </div>
                
                {/* Social Media */}
                <div>
                  <h3 className="font-serif text-xl text-nxl-gold mb-4">
                    {getDictValue(dictionary, ['contact', 'info', 'follow'], "Follow Us")}
                  </h3>
                  <div className="flex space-x-4">
                    {/* Instagram */}
                    <a href="https://instagram.com" className="p-3 rounded-full bg-nxl-gold/10 border border-nxl-gold/30 hover:bg-nxl-gold/20 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-nxl-gold">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                      </svg>
                    </a>
                    
                    {/* Facebook */}
                    <a href="https://facebook.com" className="p-3 rounded-full bg-nxl-gold/10 border border-nxl-gold/30 hover:bg-nxl-gold/20 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-nxl-gold">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    </a>
                    
                    {/* Twitter/X */}
                    <a href="https://twitter.com" className="p-3 rounded-full bg-nxl-gold/10 border border-nxl-gold/30 hover:bg-nxl-gold/20 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-nxl-gold">
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                      </svg>
                    </a>
                    
                    {/* LinkedIn */}
                    <a href="https://linkedin.com" className="p-3 rounded-full bg-nxl-gold/10 border border-nxl-gold/30 hover:bg-nxl-gold/20 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-nxl-gold">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-nxl-navy/50 p-8 rounded-sm border border-nxl-gold/20">
              <h3 className="font-display text-2xl md:text-3xl text-nxl-gold uppercase tracking-wider mb-8">
                {getDictValue(dictionary, ['contact', 'form', 'title'], "Send Us a Message")}
              </h3>
              
              <form className="space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block font-serif text-nxl-ivory/90 mb-2">
                    {getDictValue(dictionary, ['contact', 'form', 'name'], "Name")}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full p-3 bg-nxl-black border border-nxl-gold/30 rounded-sm text-nxl-ivory/90 focus:border-nxl-gold focus:outline-none"
                  />
                </div>
                
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block font-serif text-nxl-ivory/90 mb-2">
                    {getDictValue(dictionary, ['contact', 'form', 'email'], "Email")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full p-3 bg-nxl-black border border-nxl-gold/30 rounded-sm text-nxl-ivory/90 focus:border-nxl-gold focus:outline-none"
                  />
                </div>
                
                {/* Subject Field */}
                <div>
                  <label htmlFor="subject" className="block font-serif text-nxl-ivory/90 mb-2">
                    {getDictValue(dictionary, ['contact', 'form', 'subject'], "Subject")}
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full p-3 bg-nxl-black border border-nxl-gold/30 rounded-sm text-nxl-ivory/90 focus:border-nxl-gold focus:outline-none"
                  >
                    <option value="" className="bg-nxl-black">
                      {getDictValue(dictionary, ['contact', 'form', 'subjectPlaceholder'], "Please select a subject")}
                    </option>
                    <option value="order" className="bg-nxl-black">
                      {getDictValue(dictionary, ['contact', 'form', 'subjectOptions', 'order'], "Order Inquiry")}
                    </option>
                    <option value="product" className="bg-nxl-black">
                      {getDictValue(dictionary, ['contact', 'form', 'subjectOptions', 'product'], "Product Information")}
                    </option>
                    <option value="wholesale" className="bg-nxl-black">
                      {getDictValue(dictionary, ['contact', 'form', 'subjectOptions', 'wholesale'], "Wholesale Inquiry")}
                    </option>
                    <option value="other" className="bg-nxl-black">
                      {getDictValue(dictionary, ['contact', 'form', 'subjectOptions', 'other'], "Other")}
                    </option>
                  </select>
                </div>
                
                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block font-serif text-nxl-ivory/90 mb-2">
                    {getDictValue(dictionary, ['contact', 'form', 'message'], "Message")}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="w-full p-3 bg-nxl-black border border-nxl-gold/30 rounded-sm text-nxl-ivory/90 focus:border-nxl-gold focus:outline-none"
                  ></textarea>
                </div>
                
                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-nxl-gold text-nxl-black font-serif text-lg font-semibold rounded-sm hover:bg-nxl-gold/90 transition-colors"
                >
                  {getDictValue(dictionary, ['contact', 'form', 'submit'], "Send")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 md:py-24 bg-gradient-to-t from-nxl-navy to-nxl-black">
        <div className="content-container">
          <h2 className="font-display text-3xl md:text-4xl text-nxl-gold uppercase tracking-wider text-center mb-16">
            {getDictValue(dictionary, ['contact', 'location', 'title'], "Visit Our Showroom")}
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Map Placeholder - In a real app, integrate with Google Maps or similar */}
            <div className="h-[400px] bg-nxl-forest/30 border border-nxl-gold/20 rounded-sm relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-nxl-ivory/70 text-lg">
                  {getDictValue(dictionary, ['contact', 'location', 'mapPlaceholder'], "An Interactive Map Would Be Embedded Here")}
                </span>
              </div>
            </div>
            
            <div className="space-y-8">
              <div>
                <p className="font-body text-nxl-ivory/90 text-lg mb-4">
                  {getDictValue(dictionary, ['contact', 'location', 'hours'], "Our showroom is open Monday-Friday, 10am-6pm, and Saturday 11am-4pm.")}
                </p>
                <p className="font-body text-nxl-ivory/90 text-lg">
                  {getDictValue(dictionary, ['contact', 'location', 'appointment'], "Please call ahead to schedule a personal shopping appointment for the best experience.")}
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-nxl-black/50 p-6 rounded-sm border border-nxl-gold/20">
                  <h3 className="font-serif text-xl text-nxl-gold mb-3">Toronto</h3>
                  <p className="font-body text-nxl-ivory/90">123 Fairway Drive</p>
                  <p className="font-body text-nxl-ivory/90">Toronto, ON M5V 2K7</p>
                  <p className="font-body text-nxl-ivory/90">Canada</p>
                </div>
                
                <div className="bg-nxl-black/50 p-6 rounded-sm border border-nxl-gold/20">
                  <h3 className="font-serif text-xl text-nxl-gold mb-3">Vancouver</h3>
                  <p className="font-body text-nxl-ivory/90">456 Golf View Terrace</p>
                  <p className="font-body text-nxl-ivory/90">Vancouver, BC V6B 5K2</p>
                  <p className="font-body text-nxl-ivory/90">Canada</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-nxl-black">
        <div className="content-container">
          <h2 className="font-display text-3xl md:text-4xl text-nxl-gold uppercase tracking-wider text-center mb-16">
            {getDictValue(dictionary, ['contact', 'faq', 'title'], "Frequently Asked Questions")}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* FAQ 1 */}
            <div className="bg-nxl-navy/30 p-6 rounded-sm border border-nxl-gold/20">
              <h3 className="font-serif text-xl text-nxl-gold mb-3">
                {getDictValue(dictionary, ['contact', 'faq', 'shipping', 'question'], "What are your shipping rates?")}
              </h3>
              <p className="font-body text-nxl-ivory/90">
                {getDictValue(dictionary, ['contact', 'faq', 'shipping', 'answer'], 
                  "We offer free shipping on all Canadian orders over $150. For orders under $150, a flat shipping fee of $12 applies. International shipping rates vary by destination.")}
              </p>
            </div>
            
            {/* FAQ 2 */}
            <div className="bg-nxl-navy/30 p-6 rounded-sm border border-nxl-gold/20">
              <h3 className="font-serif text-xl text-nxl-gold mb-3">
                {getDictValue(dictionary, ['contact', 'faq', 'tracking', 'question'], "How can I track my order?")}
              </h3>
              <p className="font-body text-nxl-ivory/90">
                {getDictValue(dictionary, ['contact', 'faq', 'tracking', 'answer'], 
                  "Once your order ships, you'll receive a confirmation email with tracking information. You can also log into your account to see order status at any time.")}
              </p>
            </div>
            
            {/* FAQ 3 */}
            <div className="bg-nxl-navy/30 p-6 rounded-sm border border-nxl-gold/20">
              <h3 className="font-serif text-xl text-nxl-gold mb-3">
                {getDictValue(dictionary, ['contact', 'faq', 'returns', 'question'], "What is your return policy?")}
              </h3>
              <p className="font-body text-nxl-ivory/90">
                {getDictValue(dictionary, ['contact', 'faq', 'returns', 'answer'], 
                  "We accept returns within 30 days of purchase for unworn items with original tags attached. Returns are processed within 5-7 business days after receipt.")}
              </p>
            </div>
            
            {/* FAQ 4 */}
            <div className="bg-nxl-navy/30 p-6 rounded-sm border border-nxl-gold/20">
              <h3 className="font-serif text-xl text-nxl-gold mb-3">
                {getDictValue(dictionary, ['contact', 'faq', 'wholesale', 'question'], "Do you offer wholesale opportunities?")}
              </h3>
              <p className="font-body text-nxl-ivory/90">
                {getDictValue(dictionary, ['contact', 'faq', 'wholesale', 'answer'], 
                  "Yes, we work with professional golf shops and select retailers. Please contact our wholesale department at wholesale@nextxlevel.com for more information.")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
