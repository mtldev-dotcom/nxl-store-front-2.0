/**
 * FeaturedProducts Component
 * --------------------------
 * Purpose:
 *   • Display a list of featured product rails, one per collection.
 *
 * Props:
 *   - collections: Array of StoreCollection objects (each defines a group of products).
 *   - region:      StoreRegion object for pricing and localization context.
 *
 * Flow:
 *   1. Iterate over each collection in the `collections` array.
 *   2. For each collection, render a <li> element with a unique key.
 *   3. Inside each <li>, render ProductRail, passing the collection and region props.
 *   4. ProductRail handles displaying the product items for that collection.
 */

import { HttpTypes } from "@medusajs/types"
import ProductRail from "@modules/home/components/featured-products/product-rail"

export default async function FeaturedProducts({
  collections,
  region,
}: {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
}) { console.log("FeaturedProducts", collections, region)
  // Map each collection to a list item containing its product rail
  return collections.map((collection) => (
    <li key={collection.id}>
      <ProductRail collection={collection} region={region} />
    </li>
  ))
}
