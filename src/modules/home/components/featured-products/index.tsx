/**
 * FeaturedProducts Component
 * --------------------------
 * Purpose:
 *   • Display a list of featured product rails, one per collection.
 *
 * Props:
 *   - collections: Array of StoreCollection objects (each defines a group of products).
 *   - region:      StoreRegion object for pricing and localization context.
 *   - locale:      Current locale for translations
 *   - countryCode: Country code for region-specific content
 *
 * Flow:
 *   1. Iterate over each collection in the `collections` array.
 *   2. For each collection, render a <li> element with a unique key.
 *   3. Inside each <li>, render ProductRail, passing the collection and region props.
 *   4. ProductRail handles displaying the product items for that collection and fetches its own translations.
 */

import { HttpTypes } from "@medusajs/types"
import { Locale } from "@lib/i18n/config"
import ProductRail from "@modules/home/components/featured-products/product-rail"

export default async function FeaturedProducts({
  collections,
  region,
  locale,
  countryCode,
}: {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
  locale: Locale
  countryCode: string
}) {
  // Map each collection to a list item containing its product rail
  return collections.map((collection) => (
    <li key={collection.id}>
      <ProductRail
        collection={collection}
        region={region}
        countryCode={countryCode}
        locale={locale}
      />
    </li>
  ))
}
