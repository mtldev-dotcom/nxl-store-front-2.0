"use client"

import { clx } from "@medusajs/ui"

import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import { useTranslation } from "@lib/context/translation-context"

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { translate } = useTranslation()
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />
  }

  return (
    <div className="flex flex-col text-nxl-ivory">
      <span
        className={clx("text-xl-semi", {
          "text-nxl-gold": selectedPrice.price_type === "sale",
        })}
      >
        {!variant && `${translate("product", "from", "From")} `}
        <span
          data-testid="product-price"
          data-value={selectedPrice.calculated_price_number}
        >
          {selectedPrice.calculated_price}
        </span>
      </span>
      {selectedPrice.price_type === "sale" && (
        <>
          <p>
            <span className="text-nxl-ivory/70">{translate("product", "original", "Original")}: </span>
            <span
              className="line-through text-nxl-ivory/70"
              data-testid="original-product-price"
              data-value={selectedPrice.original_price_number}
            >
              {selectedPrice.original_price}
            </span>
          </p>
          <span className="text-nxl-gold">
            -{selectedPrice.percentage_diff}%
          </span>
        </>
      )}
    </div>
  )
}
