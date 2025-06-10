import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"

type ProductRailProps = {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}

export default async function ProductRail({
  collection,
  region,
}: ProductRailProps) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      // @ts-ignore: collection_id not in TS type but supported by backend
      collection_id: collection.id,
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts || pricedProducts.length === 0) {
    return null
  }

  return (
    <div className="bg-nxl-white">
      <div className="content-container py-20 small:py-32">
        <ul className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-3 gap-x-10 gap-y-24 small:gap-y-36">
          {pricedProducts.map((product) => (
            <li key={product.id} className="group relative">
              <div className="absolute -inset-3 bg-gradient-to-r from-nxl-green/5 via-nxl-gold/5 to-nxl-navy/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative">
                <ProductPreview product={product} region={region} isFeatured />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
