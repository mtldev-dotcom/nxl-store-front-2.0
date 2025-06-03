"use client"

import { Button } from "@medusajs/ui"
import { useTranslation } from "@lib/context/translation-context"
import Image from "next/image"

interface HeroProps {
  dictionary?: Record<string, any>
}

const Hero = ({ dictionary }: HeroProps) => {
  const { translate } = useTranslation()
  
  // If dictionary isn't passed as a prop, use the translate function from context
  const hero = dictionary?.hero || {
    title: "Next X Level",
    subtitle: "Premium Canadian Golf Apparel",
    description: "Elevate your golf game with modern, high-performance apparel designed in Canada. Our clothing merges style, comfort, and function—perfect for golfers of all levels.",
    shopCollection: "Shop Collection",
    ourStory: "Our Story",
    tagline: "Take your game—and your style—to the Next Level."
  }

  return (
    <div className="relative h-[90vh] w-full bg-nxl-black overflow-hidden">
      {/* Background video */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/golf-background.mp4" type="video/mp4" />
        </video>
      </div>
      
      {/* Animated golden gradient lines overlay */}
      <div className="absolute inset-0 z-5 overflow-hidden opacity-60">
        {/* Diagonal line 1 */}
        <div className="absolute -top-10 -left-20 w-[120%] h-[2px] bg-gradient-to-r from-transparent via-nxl-gold to-transparent transform rotate-[25deg] animate-line-slide-1"></div>
        
        {/* Diagonal line 2 */}
        <div className="absolute top-1/3 -right-20 w-[120%] h-[2px] bg-gradient-to-r from-transparent via-nxl-gold to-transparent transform -rotate-[15deg] animate-line-slide-2"></div>
        
        {/* Horizontal line */}
        <div className="absolute top-2/3 -left-10 w-[110%] h-[2px] bg-gradient-to-r from-transparent via-nxl-gold to-transparent animate-line-slide-3"></div>
        
        {/* Vertical line */}
        <div className="absolute -top-10 right-1/4 w-[2px] h-[120%] bg-gradient-to-b from-transparent via-nxl-gold to-transparent animate-line-slide-vertical"></div>
        
        {/* Additional diagonal line */}
        <div className="absolute bottom-1/4 -left-20 w-[120%] h-[2px] bg-gradient-to-r from-transparent via-nxl-gold to-transparent transform rotate-[10deg] animate-line-slide-2" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-nxl-black/90 to-nxl-black/50 z-10"></div>
      
      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-center items-center px-6 lg:px-8">
        <div className="max-w-2xl text-center">
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-nxl-gold tracking-wide uppercase mb-6">
            {hero.title.split(" ").map((word: string, i: number) => 
              word.toLowerCase() === "x" ? 
                <span key={i} className="text-nxl-ivory"> X</span> : 
                <span key={i}>{i > 0 ? " " : ""}{word}</span>
            )}
          </h1>
          
          <h2 className="font-serif text-2xl md:text-3xl text-nxl-ivory mb-8 mx-auto">
            {hero.subtitle}
          </h2>
          
          <p className="font-body text-lg md:text-xl text-nxl-ivory/80 mb-10 mx-auto leading-relaxed">
            {hero.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-nxl-gold hover:bg-nxl-gold/80 text-nxl-black font-button py-3 px-8 tracking-wider uppercase text-base"
              size="large"
            >
              {hero.shopCollection}
            </Button>
            <Button 
              variant="secondary"
              className="border-nxl-gold text-nxl-gold hover:bg-nxl-gold/10 font-button py-3 px-8 tracking-wider uppercase text-base"
              size="large"
            >
              {hero.ourStory}
            </Button>
          </div>
        </div>
        
        {/* Tagline at bottom */}
        <div className="absolute bottom-16 md:bottom-24 left-0 right-0 text-center">
          <p className="font-button text-nxl-gold text-xl md:text-2xl italic px-6">
            "{hero.tagline}"
          </p>
        </div>
      </div>
    </div>
  )
}

export default Hero
