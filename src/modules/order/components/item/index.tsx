import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import Thumbnail from "@modules/products/components/thumbnail"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  currencyCode: string
}

const Item = ({ item, currencyCode }: ItemProps) => {
  return (
    <div className="flex items-start gap-4 w-full" data-testid="product-row">
      {/* Product Image */}
      <div className="flex-shrink-0">
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-nxl-black/40 border border-nxl-gold/20">
          <Thumbnail thumbnail={item.thumbnail} size="square" />
        </div>
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <Text
          className="font-semibold text-nxl-ivory mb-1 truncate"
          data-testid="product-name"
        >
          {item.product_title}
        </Text>

        <div className="mb-2">
          <LineItemOptions
            variant={item.variant}
            data-testid="product-variant"
          />
        </div>

        {/* Mobile: Quantity and Price */}
        <div className="flex items-center justify-between sm:hidden">
          <Text className="text-sm text-nxl-ivory/60">
            Qty: <span data-testid="product-quantity" className="font-medium text-nxl-ivory">{item.quantity}</span>
          </Text>
          <div className="text-right">
            <LineItemPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
            />
          </div>
        </div>
      </div>

      {/* Desktop: Quantity and Price */}
      <div className="hidden sm:flex flex-col items-end text-right min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Text className="text-sm text-nxl-ivory/60">
            <span data-testid="product-quantity" className="font-medium text-nxl-ivory">{item.quantity}</span>
            <span className="mx-1">×</span>
          </Text>
          <LineItemUnitPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </div>

        <div className="text-lg font-semibold text-nxl-gold">
          <LineItemPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </div>
      </div>
    </div>
  )
}

export default Item
