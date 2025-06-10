"use client"

import { useState, useEffect } from "react"
import { getDictionary } from "@lib/i18n/get-dictionary"
import { Locale } from "@lib/i18n/config"

interface StoreHeaderProps {
  locale?: Locale
}

const StoreHeader = ({ locale = "en" }: StoreHeaderProps) => {
  const [isVisible, setIsVisible] = useState(true)
  const [dictionary, setDictionary] = useState<any>(null)

  useEffect(() => {
    const loadTranslations = async () => {
      const dict = await getDictionary(locale)
      setDictionary(dict)
    }
    loadTranslations()
  }, [locale])

  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 100)
      lastScrollY = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!dictionary) {
    return <div className="h-[40vh] min-h-[300px] bg-nxl-black"></div>
  }

  return (
    <section className="relative h-[40vh] min-h-[300px] bg-nxl-black overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover object-center opacity-50"
        >
          <source src="/golf-background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-nxl-black/80 via-nxl-black/60 to-nxl-black/40"></div>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-center z-10 pb-20">
        <div className="text-center p-8 max-w-4xl mx-auto">
          <div className="space-y-6">
            {/* Main Title */}
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-white drop-shadow-lg uppercase tracking-wider">
              {dictionary.store?.title || "Our Store"}
            </h1>
            
            {/* Subtitle */}
            <p className="font-serif text-lg md:text-xl text-white/95 drop-shadow-md max-w-2xl mx-auto leading-relaxed">
              {dictionary.store?.subtitle || "Premium Canadian apparel that elevates your everyday style"}
            </p>
            
            {/* Decorative Elements */}
            <div className="flex items-center justify-center space-x-4 pt-4">
              <div className="h-px w-16 bg-nxl-gold drop-shadow-sm"></div>
              <div className="w-2 h-2 bg-nxl-gold rotate-45 drop-shadow-sm"></div>
              <div className="h-px w-16 bg-nxl-gold drop-shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 transition-opacity duration-300 z-20 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex flex-col items-center space-y-2">
          <span className="font-body text-white/90 drop-shadow-md text-xs uppercase tracking-wider">
            {dictionary.store?.explore || "Explore"}
          </span>
          <div className="w-px h-6 bg-nxl-gold animate-pulse drop-shadow-sm"></div>
          <svg 
            className="w-3 h-3 text-nxl-gold animate-bounce drop-shadow-sm" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  )
}

export default StoreHeader
