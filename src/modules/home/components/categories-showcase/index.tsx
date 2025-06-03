"use client"

import { useTranslation } from "@lib/context/translation-context"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

interface CategoriesShowcaseProps {
  dictionary?: Record<string, any>
}

const CategoriesShowcase = ({ dictionary }: CategoriesShowcaseProps) => {
  const { translate } = useTranslation()
  
  // If dictionary isn't passed as a prop, use defaults
  const categoriesText = dictionary?.categories || {
    title: "Shop by Category",
    subtitle: "Explore our premium golf apparel collection designed for style and performance",
    polos: {
      name: "Polos",
      description: "Classic style with modern performance"
    },
    hoodies: {
      name: "Hoodies",
      description: "Comfort for cooler days on the course"
    },
    joggers: {
      name: "Joggers",
      description: "Athletic fit for unrestricted movement"
    },
    caps: {
      name: "Caps",
      description: "Top off your look with signature style"
    },
    shopNow: "Shop Now"
  }
  
  // Define categories with translations
  const categories = [
    {
      key: "polos",
      image: "/product-samples/nxl-polo-blue-gray-logo.png",
      slug: "/categories/polos",
      name: categoriesText.polos.name,
      description: categoriesText.polos.description
    },
    {
      key: "hoodies",
      image: "/product-samples/nxl-hoodie-gray-green-logo.png",
      slug: "/categories/hoodies",
      name: categoriesText.hoodies.name,
      description: categoriesText.hoodies.description
    },
    {
      key: "joggers",
      image: "/product-samples/nxl-joggers-blk-yellow-logo.png",
      slug: "/categories/joggers",
      name: categoriesText.joggers.name,
      description: categoriesText.joggers.description
    },
    {
      key: "caps",
      image: "/product-samples/nxl-cap-blk-green-logo.png",
      slug: "/categories/caps",
      name: categoriesText.caps.name,
      description: categoriesText.caps.description
    }
  ]

  return (
    <section className="py-16 bg-nxl-black">
      <div className="content-container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl text-nxl-gold uppercase tracking-wider mb-4">
            {categoriesText.title}
          </h2>
          <p className="font-body text-nxl-ivory/80 max-w-xl mx-auto">
            {categoriesText.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <LocalizedClientLink 
              key={category.key} 
              href={category.slug}
              className="group"
            >
              <div className="nxl-card h-full flex flex-col hover:border-nxl-gold/60 hover:shadow-lg hover:shadow-nxl-gold/5 transition-all duration-300">
                <div className="relative h-80 mb-4 overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-button text-nxl-gold text-xl uppercase mb-2 group-hover:text-nxl-gold/80 transition-colors">
                    {category.name}
                  </h3>
                  <p className="font-body text-nxl-ivory/80 text-sm mb-4">
                    {category.description}
                  </p>
                  <div className="mt-auto flex items-center text-nxl-gold group-hover:translate-x-1 transition-transform">
                    <span className="font-button text-sm uppercase mr-2">{categoriesText.shopNow}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoriesShowcase
