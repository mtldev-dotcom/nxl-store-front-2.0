import { getPercentageDiff } from "@lib/util/get-precentage-diff"
import { formatPriceWithSmallCurrency } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"

type LineItemPriceProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  style?: "default" | "tight"
  currencyCode: string
}

const LineItemPrice = ({
  item,
  style = "default",
  currencyCode,
}: LineItemPriceProps) => {
  const { total, original_total } = item
  const originalPrice = original_total
  const currentPrice = total
  const hasReducedPrice = currentPrice < originalPrice

  // Format prices using the new function
  const formattedCurrentPrice = formatPriceWithSmallCurrency({
    amount: currentPrice,
    currency_code: currencyCode,
  })

  const formattedOriginalPrice = formatPriceWithSmallCurrency({
    amount: originalPrice,
    currency_code: currencyCode,
  })

  return (
    <div className="flex flex-col gap-x-2 text-nxl-ivory/80 items-end">
      <div className="text-left">
        {hasReducedPrice && (
          <>
            <p>
              {style === "default" && (
                <span className="text-nxl-ivory/70">Original: </span>
              )}
              <span
                className="line-through text-nxl-ivory/70 inline-flex items-baseline gap-1"
                data-testid="product-original-price"
              >
                <span>{formattedOriginalPrice.price}</span>
                <span className="text-xs text-nxl-ivory/60">({formattedOriginalPrice.currency})</span>
              </span>
            </p>
            {style === "default" && (
              <span className="text-nxl-gold">
                -{getPercentageDiff(originalPrice, currentPrice || 0)}%
              </span>
            )}
          </>
        )}
        <span
          className="text-nxl-gold text-base-regular inline-flex items-baseline gap-1"
          data-testid="product-price"
        >
          <span>{formattedCurrentPrice.price}</span>
          <span className="text-xs text-nxl-ivory/60">({formattedCurrentPrice.currency})</span>
        </span>
      </div>
    </div>
  )
}

export default LineItemPrice
