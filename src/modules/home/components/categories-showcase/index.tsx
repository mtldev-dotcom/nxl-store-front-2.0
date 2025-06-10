"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import { useIntersection } from "@lib/hooks/use-in-view"
import { useRef } from "react"

interface CategoriesShowcaseProps {
  dictionary?: Record<string, any>
}

const CategoriesShowcase = ({ dictionary }: CategoriesShowcaseProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useIntersection(ref, "0px 0px -20% 0px")
  
  // Enhanced content with better defaults
  const categoriesText = dictionary?.categories || {
    title: "Shop by Category",
    subtitle: "Explore our premium golf apparel collection designed for style and performance on and off the course",
    polos: {
      name: "Polos",
      description: "Classic style meets modern functionality—ideal for any casual or semi-formal occasion"
    },
    hoodies: {
      name: "Hoodies", 
      description: "Cozy and refined, perfect for cooler days by the fire or active moments on the go"
    },
    joggers: {
      name: "Joggers",
      description: "Athletic yet sophisticated fit for unrestricted movement—day or night"
    },
    caps: {
      name: "Caps",
      description: "Top off your look with signature style and premium materials"
    },
    shopNow: "Shop Now"
  }
  
  // Enhanced categories with better styling and links
  const categories = [
    {
      key: "polos",
      image: "/product-samples/nxl-polo-blue-gray-logo.png",
      slug: "/store?category=polos",
      name: categoriesText.polos.name,
      description: categoriesText.polos.description,
      accent: "from-blue-500/20 to-gray-500/20"
    },
    {
      key: "hoodies",
      image: "/product-samples/nxl-hoodie-gray-green-logo.png",
      slug: "/store?category=hoodies",
      name: categoriesText.hoodies.name,
      description: categoriesText.hoodies.description,
      accent: "from-gray-500/20 to-green-500/20"
    },
    {
      key: "joggers",
      image: "/product-samples/nxl-joggers-blk-yellow-logo.png",
      slug: "/store?category=joggers",
      name: categoriesText.joggers.name,
      description: categoriesText.joggers.description,
      accent: "from-yellow-500/20 to-black/20"
    },
    {
      key: "caps",
      image: "/product-samples/nxl-cap-blk-green-logo.png",
      slug: "/store?category=caps",
      name: categoriesText.caps.name,
      description: categoriesText.caps.description,
      accent: "from-green-500/20 to-black/20"
    }
  ]

  return (
    <section 
      ref={ref}
      className="py-16 lg:py-24 bg-gradient-to-b from-nxl-navy to-nxl-black relative overflow-hidden"
      aria-labelledby="categories-heading"
    >
      {/* Background decorative pattern */}
      <div className="absolute inset-0 opacity-5" aria-hidden="true">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23C6A94C%22 fill-opacity=%220.1%22%3E%3Cpath d=%22M30 30c0-16.569 13.431-30 30-30v60c-16.569 0-30-13.431-30-30z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
      </div>

      <div className="content-container relative z-10">
        {/* Enhanced Header */}
        <header 
          className={`text-center mb-16 transition-all duration-1000 ${
            inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <h2 
            id="categories-heading"
            className="font-display text-3xl md:text-4xl lg:text-5xl text-nxl-gold uppercase tracking-wider mb-6"
          >
            {categoriesText.title}
          </h2>
          <p className="font-body text-lg text-white max-w-2xl mx-auto leading-relaxed">
            {categoriesText.subtitle}
          </p>
          {/* Decorative line */}
          <div className="w-24 h-px bg-nxl-gold mx-auto mt-6" />
        </header>

        {/* Enhanced Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <article 
              key={category.key}
              className={`transition-all duration-1000 ${
                inView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <LocalizedClientLink 
                href={category.slug}
                className="group block"
                aria-label={`Shop ${category.name} - ${category.description}`}
              >
                <div className="relative bg-nxl-black border border-nxl-gold/20 rounded-lg overflow-hidden transition-all duration-500 hover:border-nxl-gold/60 hover:shadow-luxury group-hover:-translate-y-2">
                  {/* Image Section with Enhanced Effects */}
                  <div className="relative h-80 overflow-hidden">
                    <Image
                      src={category.image}
                      alt={`${category.name} - Premium golf apparel`}
                      fill
                      className="object-cover object-center transition-all duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    
                    {/* Gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${category.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-nxl-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Category badge */}
                    <div className="absolute top-4 left-4 bg-nxl-gold/90 text-nxl-black px-3 py-1 rounded-full font-button text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
                      Premium
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 space-y-4">
                    <header className="space-y-2">
                      <h3 className="font-display text-xl text-nxl-gold uppercase tracking-wider group-hover:text-nxl-gold-light transition-colors duration-300">
                        {category.name}
                      </h3>
                      <p className="font-body text-white text-sm leading-relaxed">
                        {category.description}
                      </p>
                    </header>
                    
                    {/* CTA with enhanced animation */}
                    <div className="flex items-center justify-between pt-4 border-t border-nxl-gold/20">
                      <span className="font-button text-nxl-gold text-sm uppercase tracking-wider group-hover:text-nxl-gold-light transition-colors duration-300">
                        {categoriesText.shopNow}
                      </span>
                      <div className="flex items-center text-nxl-gold group-hover:translate-x-2 transition-transform duration-300">
                        <svg 
                          className="w-5 h-5" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Bottom accent line */}
                  <div className="h-1 bg-nxl-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </div>
              </LocalizedClientLink>
            </article>
          ))}
        </div>

        {/* Call to action */}
        <div 
          className={`text-center mt-16 transition-all duration-1000 delay-700 ${
            inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <LocalizedClientLink href="/store">
            <button className="nxl-btn-secondary group">
              <span>View All Products</span>
              <svg 
                className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}

export default CategoriesShowcase
