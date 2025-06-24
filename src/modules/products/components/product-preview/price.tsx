import { Text, clx } from "@medusajs/ui"
import { VariantPrice } from "types/global"
import { formatPriceWithSmallCurrency } from "@lib/util/money"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  const isOnSale = price.price_type === "sale"
  const hasOriginalPrice = price.original_price && price.original_price !== price.calculated_price

  // Format the prices using the new formatPriceWithSmallCurrency function
  const formattedCurrentPrice = formatPriceWithSmallCurrency({
    amount: price.calculated_price_number,
    currency_code: price.currency_code,
  })

  const formattedOriginalPrice = price.original_price_number ? formatPriceWithSmallCurrency({
    amount: price.original_price_number,
    currency_code: price.currency_code,
  }) : null

  return (
    <div className="flex items-baseline gap-2 flex-wrap">
      {/* Current Price - Primary display */}
      <Text
        className={clx("font-semibold transition-colors duration-200 inline-flex items-baseline gap-1", {
          "text-red-600 text-lg": isOnSale,
          "text-gray-900 text-base": !isOnSale,
        })}
        data-testid="price"
      >
        <span>{formattedCurrentPrice.price}</span>
        <span className="text-xs text-gray-500">({formattedCurrentPrice.currency})</span>
      </Text>

      {/* Original Price (crossed out when on sale) */}
      {isOnSale && hasOriginalPrice && formattedOriginalPrice && (
        <Text
          className="line-through text-gray-500 text-sm inline-flex items-baseline gap-1"
          data-testid="original-price"
        >
          <span>{formattedOriginalPrice.price}</span>
          <span className="text-xs text-gray-400">({formattedOriginalPrice.currency})</span>
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
