import { Text, clx } from "@medusajs/ui"
import { VariantPrice } from "types/global"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  const isOnSale = price.price_type === "sale"
  const hasOriginalPrice = price.original_price && price.original_price !== price.calculated_price

  return (
    <div className="flex items-center gap-2">
      {/* Original Price (crossed out when on sale) */}
      {isOnSale && hasOriginalPrice && (
        <Text
          className="line-through text-nxl-ivory/40 font-body text-sm transition-colors duration-300"
          data-testid="original-price"
        >
          {price.original_price}
        </Text>
      )}
      
      {/* Current Price */}
      <Text
        className={clx("font-sans transition-colors duration-300 text-sm", {
          "text-nxl-gold font-semibold": isOnSale,
          "text-nxl-ivory font-medium": !isOnSale,
        })}
        data-testid="price"
      >
       {price.calculated_price}
      </Text>

      {/* Sale Indicator */}
      {isOnSale && (
        <span className="bg-nxl-gold/20 text-nxl-gold px-1.5 py-0.5 text-xs font-button uppercase tracking-wider rounded-sm border border-nxl-gold/30">
          Sale
        </span>
      )}
    </div>
  )
}
