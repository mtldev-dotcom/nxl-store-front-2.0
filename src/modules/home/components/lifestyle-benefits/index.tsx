"use client"

import { useIntersection } from "@lib/hooks/use-in-view"
import { useRef } from "react"

interface LifestyleBenefitsProps {
  dictionary?: Record<string, any>
}

const LifestyleBenefits = ({ dictionary }: LifestyleBenefitsProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useIntersection(ref, "0px 0px -30% 0px")
  
  // Enhanced content with better defaults
  const benefitsText = dictionary?.benefits || {
    title: "The Next X Level Advantage",
    subtitle: "Our commitment to quality, versatility, and style sets us apart",
    quality: {
      title: "Premium Quality", 
      description: "Our apparel is crafted from the finest materials—think luxury blends used by top brands—for durability and comfort across all occasions."
    },
    performance: {
      title: "Versatile Design",
      description: "Engineered with advanced fabrics, moisture-wicking technology, and stretch for maximum comfort whether you're relaxing or on the move."
    },
    materialInnovation: {
      title: "Material Innovation",
      description: "We partner with leading textile manufacturers to integrate cutting-edge fabric technologies, ensuring garments that breathe, move, and last."
    },
    shipping: {
      title: "Fast Shipping",
      description: "Free delivery across Canada and expedited international shipping options available."
    }
  }
  
  // Enhanced benefits with better icons and descriptions
  const benefits = [
    {
      key: "quality",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      title: benefitsText.quality.title,
      description: benefitsText.quality.description,
      color: "from-yellow-500/20 to-amber-500/20"
    },
    {
      key: "performance",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: benefitsText.performance.title,
      description: benefitsText.performance.description,
      color: "from-blue-500/20 to-cyan-500/20"
    },
    {
      key: "materialInnovation",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: benefitsText.materialInnovation.title,
      description: benefitsText.materialInnovation.description,
      color: "from-purple-500/20 to-pink-500/20"
    },
    {
      key: "shipping",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      title: benefitsText.shipping.title,
      description: benefitsText.shipping.description,
      color: "from-green-500/20 to-emerald-500/20"
    }
  ]

  return (
    <section 
      ref={ref}
      className="py-16 lg:py-24 bg-gradient-to-br from-nxl-green via-nxl-navy to-nxl-black relative overflow-hidden"
      aria-labelledby="benefits-heading"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-nxl-gold rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-nxl-gold rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="content-container relative z-10">
        {/* Enhanced Header */}
        <header 
          className={`text-center mb-16 transition-all duration-1000 ${
            inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <h2 
            id="benefits-heading"
            className="font-display text-3xl md:text-4xl lg:text-5xl text-nxl-gold uppercase tracking-wider mb-6"
          >
            {benefitsText.title}
          </h2>
          <p className="font-body text-lg text-white max-w-2xl mx-auto leading-relaxed">
            {benefitsText.subtitle}
          </p>
          {/* Decorative divider */}
          <div className="flex items-center justify-center mt-8 space-x-4">
            <div className="w-12 h-px bg-nxl-gold/30" />
            <div className="w-3 h-3 bg-nxl-gold rounded-full" />
            <div className="w-12 h-px bg-nxl-gold/30" />
          </div>
        </header>

        {/* Enhanced Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {benefits.map((benefit, index) => (
            <article 
              key={benefit.key}
              className={`transition-all duration-1000 ${
                inView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="group relative">
                {/* Background gradient effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`} />
                
                {/* Card content */}
                <div className="relative bg-nxl-black/80 backdrop-blur-sm border border-nxl-gold/20 rounded-xl p-8 text-center transition-all duration-500 hover:border-nxl-gold/40 hover:shadow-luxury group-hover:-translate-y-2">
                  {/* Icon container */}
                  <div className="relative mb-6">
                    <div className="text-nxl-gold transition-all duration-500 group-hover:scale-110 group-hover:text-nxl-gold-light">
                      {benefit.icon}
                    </div>
                    {/* Icon glow effect */}
                    <div className="absolute inset-0 text-nxl-gold opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-sm">
                      {benefit.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <header className="mb-4">
                    <h3 className="font-display text-xl text-nxl-gold uppercase tracking-wider group-hover:text-nxl-gold-light transition-colors duration-300">
                      {benefit.title}
                    </h3>
                  </header>
                  
                  <p className="font-body text-white text-sm leading-relaxed">
                    {benefit.description}
                  </p>

                  {/* Accent line */}
                  <div className="mt-6 h-px bg-nxl-gold/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Additional trust signals */}
        <div 
          className={`mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8 pt-16 border-t border-nxl-gold/20 transition-all duration-1000 delay-1000 ${
            inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="text-center">
            <div className="font-display text-3xl text-nxl-gold mb-2">24/7</div>
            <div className="text-sm text-nxl-ivory/60 font-body">Customer Support</div>
          </div>
          <div className="text-center">
            <div className="font-display text-3xl text-nxl-gold mb-2">30</div>
            <div className="text-sm text-nxl-ivory/60 font-body">Day Returns</div>
          </div>
          <div className="text-center">
            <div className="font-display text-3xl text-nxl-gold mb-2">5★</div>
            <div className="text-sm text-nxl-ivory/60 font-body">Rating Average</div>
          </div>
          <div className="text-center">
            <div className="font-display text-3xl text-nxl-gold mb-2">100%</div>
            <div className="text-sm text-nxl-ivory/60 font-body">Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LifestyleBenefits
