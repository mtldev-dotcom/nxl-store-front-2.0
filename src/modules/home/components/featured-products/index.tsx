import { HttpTypes } from "@medusajs/types"
import ProductRail from "./product-rail"

type FeaturedProductsProps = {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
}

export default function FeaturedProducts({
  collections,
  region,
}: FeaturedProductsProps) {
  if (!collections?.length) {
    return null
  }

  return (
    <div className="space-y-10">
      {collections.map((collection) => (
        <ProductRail key={collection.id} collection={collection} region={region} />
      ))}
    </div>
  )
}
