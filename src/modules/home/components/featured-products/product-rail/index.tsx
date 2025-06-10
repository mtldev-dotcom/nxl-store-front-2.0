import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function ProductRail({
  collection,
  region,
  locale,
  countryCode,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
  locale?: string
  countryCode: string
}) {
  // Build translation fields based on locale
  const translationsField = locale ? `,+translations.${locale},+variants.translations.${locale}` : ""

  const {
    response: { products: allProducts },
  } = await listProducts({
    countryCode: countryCode,
    locale: locale,
    queryParams: {
      fields: `*variants.calculated_price,+metadata,+tags${translationsField}`,
      limit: 100,
    },
  })

  // Filter products by collection since collection_id queryParam has TypeScript issues
  const pricedProducts = allProducts.filter(product => 
    product.collection_id === collection.id
  )

  if (!pricedProducts) {
    return null
  }

  return (
    <div className="bg-nxl-black">
      <div className="content-container py-20 small:py-32">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 pb-6 border-b border-nxl-gold/30">
          <div>
            <Text className="font-serif text-sm uppercase tracking-widest text-nxl-gold mb-2">Featured Collection</Text>
            <Text className="font-serif text-3xl sm:text-4xl text-nxl-ivory">{collection.title}</Text>
          </div>
          <InteractiveLink 
            href={`/collections/${collection.handle}`}
            className="font-button text-nxl-gold hover:text-nxl-gold/80 uppercase tracking-wider mt-4 sm:mt-0"
          >
            View all
          </InteractiveLink>
        </div>
        <ul className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-3 gap-x-10 gap-y-24 small:gap-y-36">
          {pricedProducts &&
            pricedProducts.map((product) => (
              <li key={product.id} className="group relative">
                <div className="absolute -inset-3 bg-gradient-to-r from-nxl-green/5 via-nxl-gold/5 to-nxl-navy/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative">
                  <ProductPreview product={product} region={region} isFeatured locale={locale} />
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}
