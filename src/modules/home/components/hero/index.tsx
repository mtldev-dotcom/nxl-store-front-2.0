"use client";

import { useEffect, useState } from "react";
import { Button } from "@medusajs/ui";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import Image from "next/image";

interface HeroProps {
  dictionary?: Record<string, any>;
}

const Hero = ({ dictionary }: HeroProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
    
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const hero = dictionary?.hero || {
    title: "Next X Level",
    subtitle: "Premium Canadian Fashion Apparel",
    description:
      "Elevate your style with modern, high-performance apparel designed in Canada. Our pieces merge luxury materials, comfort, and versatility—perfect for any occasion from a chalet fireside to a cocktail soirée.",
    shopCollection: "Shop Collection",
    ourStory: "Our Story",
    tagline: "Take your look—and your lifestyle—to the Next Level.",
  };

  return (
    <section className="relative h-screen w-full overflow-hidden" role="banner">
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Background Image with Parallax Effect */}
      <div 
        className="absolute inset-0 z-0"
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      >
        <Image
          src="/hero1.png"
          alt="Next X Level premium golf apparel collection"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-nxl-black/20 z-10" />
      </div>

      {/* Animated decorative elements */}
      <div className="absolute inset-0 z-20 overflow-hidden opacity-40" aria-hidden="true">
        <div className="absolute -top-10 -left-20 w-[120%] h-[1px] bg-gradient-to-r from-transparent via-nxl-gold to-transparent transform rotate-[25deg] animate-line-slide-1" />
        <div className="absolute top-1/3 -right-20 w-[120%] h-[1px] bg-gradient-to-r from-transparent via-nxl-gold to-transparent transform -rotate-[15deg] animate-line-slide-2" />
        <div className="absolute top-2/3 -left-10 w-[110%] h-[1px] bg-gradient-to-r from-transparent via-nxl-gold to-transparent animate-line-slide-3" />
        <div className="absolute -top-10 right-1/4 w-[1px] h-[120%] bg-gradient-to-b from-transparent via-nxl-gold to-transparent animate-line-slide-vertical" />
        <div
          className="absolute bottom-1/4 -left-20 w-[120%] h-[1px] bg-gradient-to-r from-transparent via-nxl-gold to-transparent transform rotate-[10deg] animate-line-slide-2"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-30 h-full content-container flex flex-col justify-center items-start">
        <div className="max-w-3xl">
          {/* Animated heading */}
          <h1 
            className={`font-display text-4xl md:text-6xl lg:text-7xl text-nxl-white mb-6 leading-tight transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            {hero.subtitle}
          </h1>
          
          {/* Animated description */}
          <p 
            className={`font-body text-lg md:text-xl text-nxl-ivory mb-8 max-w-2xl leading-relaxed transition-all duration-1000 delay-300 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            {hero.description}
          </p>
          
          {/* Animated CTAs */}
          <div 
            className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-500 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            <LocalizedClientLink href="/store">
              <Button className="nxl-btn-primary group relative overflow-hidden" size="large">
                <span className="relative z-10">{hero.shopCollection}</span>
                <div className="absolute inset-0 bg-nxl-gold-light transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Button>
            </LocalizedClientLink>
            
          </div>
        </div>
      </div>

      {/* Floating tagline */}
      <div 
        className={`absolute bottom-8 md:bottom-16 left-1/2 transform -translate-x-1/2 z-30 transition-all duration-1000 delay-700 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <blockquote className="font-button text-nxl-gold text-lg md:text-xl italic text-center">
          "{hero.tagline}"
        </blockquote>
      </div>

      {/* Scroll indicator */}
      <div 
        className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 transition-all duration-1000 delay-1000 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
        aria-hidden="true"
      >
        <div className="animate-bounce">
          <svg 
            className="w-6 h-6 text-nxl-gold" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;
