"use client"

import { Button } from "@medusajs/ui"
import Image from "next/image"
import { useTranslation } from "@lib/context/translation-context"

interface BrandStoryProps {
  dictionary?: Record<string, any>
}

const BrandStory = ({ dictionary }: BrandStoryProps) => {
  const { translate } = useTranslation()
  
  // If dictionary isn't passed as a prop, use defaults
  const brandStory = dictionary?.brandStory || {
    title: "Our Brand Story",
    subtitle: "From Passion to Premium",
    paragraph1: "Founded in Canada by golf enthusiasts, Next X Level was born from a desire to create golf apparel that combines performance, style, and comfort without compromise.",
    paragraph2: "We recognized that golf apparel often forced players to choose between functionality and fashion. Our mission became clear: design premium golf wear that performs under pressure while making you look and feel your best on and off the course.",
    learnMore: "Learn More",
    tagline: "Elevate your game"
  }

  return (
    <section className="py-16 bg-gradient-to-b from-nxl-black to-nxl-navy">
      <div className="content-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column: Image */}
          <div className="relative aspect-square w-full max-w-xl mx-auto lg:mx-0">
            <div className="absolute inset-0 border border-nxl-gold/20 -m-3 z-0"></div>
            <div className="w-full h-full relative z-10 overflow-hidden">
              <Image 
                src="/product-samples/nxl-hoodie-gray-green-logo.png"
                alt="Next X Level Brand Story"
                fill
                className="object-cover object-center"
              />
            </div>
          </div>
          
          {/* Right column: Content */}
          <div className="max-w-xl">
            <h2 className="font-display text-3xl md:text-4xl text-nxl-gold uppercase tracking-wider mb-6">{brandStory.title}</h2>
            
            <h3 className="font-serif text-xl md:text-2xl text-nxl-ivory mb-4">{brandStory.subtitle}</h3>
            
            <p className="font-body text-nxl-ivory/90 mb-6 leading-relaxed">
              {brandStory.paragraph1}
            </p>
            
            <p className="font-body text-nxl-ivory/90 mb-8 leading-relaxed">
              {brandStory.paragraph2}
            </p>
            
            <div className="flex flex-wrap gap-4 items-center">
              <Button 
                className="nxl-btn-secondary"
              >
                {brandStory.learnMore}
              </Button>
              
              <span className="text-nxl-gold font-button text-xl italic">
                "{brandStory.tagline}"
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BrandStory
