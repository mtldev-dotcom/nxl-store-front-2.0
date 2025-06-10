"use client"

import { Button } from "@medusajs/ui"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useIntersection } from "@lib/hooks/use-in-view"
import { useRef } from "react"

interface BrandStoryProps {
  dictionary?: Record<string, any>
}

const BrandStory = ({ dictionary }: BrandStoryProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useIntersection(ref, "0px 0px -30% 0px")
  
  // Enhanced content with better defaults
  const brandStory = dictionary?.brandStory || {
    title: "Our Brand Story",
    subtitle: "From Passion to Premium",
    paragraph1: "Founded in Canada by passionate designers, Next X Level emerged from a desire to create golf apparel that seamlessly blends luxury materials with everyday functionality. Our journey began with a simple question: why compromise between style and performance?",
    paragraph2: "We recognized that the modern golfer demands more than just functional clothing—they want pieces that transition effortlessly from the course to cocktails, from business meetings to weekend getaways. Our mission became creating premium apparel that performs under pressure while elevating your confidence in every setting.",
    learnMore: "Discover Our Story",
    tagline: "Elevate your game, elevate your life"
  }

  return (
    <section 
      ref={ref}
      className="py-16 lg:py-24 bg-gradient-to-br from-nxl-black via-nxl-navy to-nxl-green relative overflow-hidden"
      aria-labelledby="brand-story-heading"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5" aria-hidden="true">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-nxl-gold rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-nxl-gold rounded-full blur-2xl" />
      </div>

      <div className="content-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Enhanced Image Section */}
          <div 
            className={`relative transition-all duration-1000 ${
              inView ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
            }`}
          >
            <div className="relative aspect-[4/5] w-full max-w-lg mx-auto lg:mx-0">
              {/* Decorative frame */}
              <div className="absolute -inset-4 border border-nxl-gold/30 z-0 transform -rotate-1" />
              <div className="absolute -inset-2 border border-nxl-gold/20 z-0 transform rotate-1" />
              
              {/* Main image */}
              <div className="relative w-full h-full z-10 overflow-hidden rounded-lg shadow-luxury">
                <Image 
                  src="/product-samples/nxl-hoodie-gray-green-logo.png"
                  alt="Premium Next X Level hoodie showcasing luxury golf apparel design"
                  fill
                  className="object-cover object-center transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-nxl-black/20 via-transparent to-transparent" />
              </div>

              {/* Floating elements */}
              <div className="absolute -bottom-6 -right-6 bg-nxl-gold text-nxl-black px-4 py-2 rounded-lg font-button text-sm uppercase tracking-wider shadow-lg">
                Est. Canada
              </div>
            </div>
          </div>
          
          {/* Enhanced Content Section */}
          <div 
            className={`space-y-6 transition-all duration-1000 delay-300 ${
              inView ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
            }`}
          >
            <header className="space-y-4">
              <h2 
                id="brand-story-heading"
                className="font-display text-3xl md:text-4xl lg:text-5xl text-nxl-gold uppercase tracking-wider"
              >
                {brandStory.title}
              </h2>
              
              <h3 className="font-serif text-xl md:text-2xl text-white">
                {brandStory.subtitle}
              </h3>
            </header>
            
            <div className="space-y-6">
              <p className="font-body text-lg leading-relaxed text-white">
                {brandStory.paragraph1}
              </p>
              
              <p className="font-body text-lg leading-relaxed text-white">
                {brandStory.paragraph2}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center pt-4">
              <LocalizedClientLink href="/store">
                <Button className="nxl-btn-secondary group">
                  <span>{brandStory.shopNow}</span>
                  <svg 
                    className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </LocalizedClientLink>
              
              <blockquote className="text-nxl-gold font-button text-lg italic border-l-2 border-nxl-gold/30 pl-4">
                "{brandStory.tagline}"
              </blockquote>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 pt-6 border-t border-nxl-gold/20">
              <div className="text-center">
                <div className="font-display text-2xl text-nxl-gold">2023</div>
                <div className="text-sm text-nxl-ivory/60 font-body">Founded</div>
              </div>
              <div className="w-px h-8 bg-nxl-gold/20" />
              <div className="text-center">
                <div className="font-display text-2xl text-nxl-gold">100%</div>
                <div className="text-sm text-nxl-ivory/60 font-body">Canadian</div>
              </div>
              <div className="w-px h-8 bg-nxl-gold/20" />
              <div className="text-center">
                <div className="font-display text-2xl text-nxl-gold">∞</div>
                <div className="text-sm text-nxl-ivory/60 font-body">Style</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BrandStory
