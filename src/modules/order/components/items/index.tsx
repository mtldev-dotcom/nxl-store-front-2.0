import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Text, Heading } from "@medusajs/ui"

import Divider from "@modules/common/components/divider"
import Item from "@modules/order/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsProps = {
  order: HttpTypes.StoreOrder
}

const Items = ({ order }: ItemsProps) => {
  const items = order.items

  return (
    <div className="space-y-4">
      {/* Items Header */}
      <div className="flex items-center justify-between mb-4">
        <Heading level="h3" className="text-lg font-semibold text-nxl-gold font-display">
          Items Ordered
        </Heading>
        <Text className="text-sm text-nxl-ivory/60">
          {items?.length || 0} {items?.length === 1 ? 'item' : 'items'}
        </Text>
      </div>

      {/* Items List */}
      <div className="space-y-3">
        {items?.length
          ? items
            .sort((a, b) => {
              return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
            })
            .map((item, index) => (
              <div
                key={item.id}
                className="bg-nxl-black/30 border border-nxl-gold/10 rounded-lg p-4 hover:border-nxl-gold/20 transition-colors duration-200"
              >
                <Item
                  item={item}
                  currencyCode={order.currency_code}
                />
              </div>
            ))
          : repeat(5).map((i) => (
            <div key={i} className="bg-nxl-black/30 border border-nxl-gold/10 rounded-lg p-4">
              <SkeletonLineItem />
            </div>
          ))}
      </div>

      {/* Summary Note */}
      {items?.length && (
        <div className="mt-6 p-4 bg-nxl-gold/5 border border-nxl-gold/20 rounded-lg">
          <Text className="text-sm text-nxl-ivory/80 text-center">
            All items will be carefully packaged and shipped to your delivery address
          </Text>
        </div>
      )}
    </div>
  )
}

export default Items
