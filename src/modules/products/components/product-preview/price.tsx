import { Text, clx } from "@medusajs/ui"
import { VariantPrice } from "types/global"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  const isOnSale = price.price_type === "sale"
  const hasOriginalPrice = price.original_price && price.original_price !== price.calculated_price

  return (
    <div className="flex items-baseline gap-2 flex-wrap">
      {/* Current Price - Primary display */}
      <Text
        className={clx("font-semibold transition-colors duration-200", {
          "text-red-600 text-lg": isOnSale,
          "text-gray-900 text-base": !isOnSale,
        })}
        data-testid="price"
      >
        {price.calculated_price}
      </Text>

      {/* Original Price (crossed out when on sale) */}
      {isOnSale && hasOriginalPrice && (
        <Text
          className="line-through text-gray-500 text-sm"
          data-testid="original-price"
        >
          {price.original_price}
        </Text>
      )}

      {/* Sale Percentage - if available */}
      {isOnSale && price.percentage_diff && (
        <span className="bg-red-100 text-red-700 px-2 py-0.5 text-xs font-medium rounded-md">
          -{price.percentage_diff}%
        </span>
      )}
    </div>
  )
}
