"use client";

import { Button } from "@medusajs/ui";
import { useTranslation } from "@lib/context/translation-context";

interface HeroProps {
  dictionary?: Record<string, any>;
}

const Hero = ({ dictionary }: HeroProps) => {
  const { translate } = useTranslation();

  const hero = dictionary?.hero || {
    title: "Next X Level",
    subtitle: "Premium Canadian Fashion Apparel",
    description:
      "Elevate your style with modern, high-performance apparel designed in Canada. Our pieces are crafted from the same materials used by top luxury brands—Hugo Boss, Under Armour, Louis Vuitton—and offered at an accessible price point. Whether you’re at a chalet around the fire, a 5 à 7 cocktail, on the golf course, the tennis court, at work, or a high-end nightclub, Next X Level has you covered.",
    shopCollection: "Shop Collection",
    ourStory: "Our Story",
    tagline: "Take your look—and your lifestyle—to the Next Level.",
  };

  return (
      <div className="fix h-screen w-full overflow-hidden">
      <img
      src="/hero1.png"
      alt="Hero background"
      className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Animated golden gradient lines overlay */}
      <div className="absolute inset-0 z-10 overflow-hidden opacity-60">
      <div className="absolute -top-10 -left-20 w-[120%] h-[2px] bg-gradient-to-r from-transparent via-nxl-gold to-transparent transform rotate-[25deg] animate-line-slide-1" />
      <div className="absolute top-1/3 -right-20 w-[120%] h-[2px] bg-gradient-to-r from-transparent via-nxl-gold to-transparent transform -rotate-[15deg] animate-line-slide-2" />
      <div className="absolute top-2/3 -left-10 w-[110%] h-[2px] bg-gradient-to-r from-transparent via-nxl-gold to-transparent animate-line-slide-3" />
      <div className="absolute -top-10 right-1/4 w-[2px] h-[120%] bg-gradient-to-b from-transparent via-nxl-gold to-transparent animate-line-slide-vertical" />
      <div
        className="absolute bottom-1/4 -left-20 w-[120%] h-[2px] bg-gradient-to-r from-transparent via-nxl-gold to-transparent transform rotate-[10deg] animate-line-slide-2"
        style={{ animationDelay: "2s" }}
      />
      </div>

      {/* Content */}
      <div className="relative z-20 h-full content-container flex flex-col lg:flex-row justify-start items-start px-6 lg:px-8">
      <div className="w-full lg:w-1/2 text-left flex flex-col justify-center h-full">
        <h1 className="hero-title mb-6 text-white">{hero.subtitle}</h1>
        <p className="text-lg mb-8 text-white">{hero.description}</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button className="nxl-btn-primary" size="large">
        {hero.shopCollection}
          </Button>
          <Button className="nxl-btn-secondary" size="large">
        {hero.ourStory}
          </Button>
        </div>
      </div>
      </div>

      {/* Tagline */}
      <div className="relative bottom-16 md:bottom-24 w-full text-center z-20">
      <p className="font-button text-nxl-gold text-xl md:text-2xl italic">
        "{hero.tagline}"
      </p>
      </div>
    </div>
  );
};

export default Hero;
