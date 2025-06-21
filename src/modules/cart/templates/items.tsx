import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Heading, Table } from "@medusajs/ui"

import Item from "@modules/cart/components/item"
import MobileCartItem from "@modules/cart/components/mobile-cart-item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
  dictionary: any
}

const ItemsTemplate = ({ cart, dictionary }: ItemsTemplateProps) => {
  const items = cart?.items

  return (
    <div>
      <div className="pb-4 flex items-center">
        <Heading className="text-[2rem] leading-[2.75rem] text-nxl-gold font-serif tracking-wide">
          {dictionary.general.cart}
        </Heading>
      </div>

      {/* Mobile: Card Layout */}
      <div className="block lg:hidden space-y-4">
        {items
          ? items
            .sort((a, b) => {
              return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
            })
            .map((item) => {
              return (
                <MobileCartItem
                  key={item.id}
                  item={item}
                  currencyCode={cart?.currency_code || "USD"}
                  dictionary={dictionary}
                />
              )
            })
          : repeat(5).map((i) => {
            return (
              <div key={i} className="bg-nxl-black/40 border border-nxl-gold/20 rounded-xl p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-nxl-gold/20 rounded-xl"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-nxl-gold/20 rounded w-3/4"></div>
                    <div className="h-4 bg-nxl-gold/10 rounded w-1/2"></div>
                    <div className="h-8 bg-nxl-gold/20 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            )
          })}
      </div>

      {/* Desktop: Table Layout */}
      <div className="hidden lg:block">
        <Table>
          <Table.Header className="border-t-0 border-b border-nxl-gold/40">
            <Table.Row className="text-nxl-gold txt-medium-plus font-medium">
              <Table.HeaderCell className="!pl-4 pb-4 font-semibold text-left">
                Item
              </Table.HeaderCell>
              <Table.HeaderCell className="pb-4 w-0"></Table.HeaderCell>
              <Table.HeaderCell className="pb-4 font-semibold text-center min-w-[120px]">
                {dictionary.cart.quantity}
              </Table.HeaderCell>
              <Table.HeaderCell className="pb-4 font-semibold text-right min-w-[100px]">
                {dictionary.cart.itemDetails.unitPrice}
              </Table.HeaderCell>
              <Table.HeaderCell className="!pr-4 text-right pb-4 font-semibold min-w-[100px]">
                {dictionary.cart.itemDetails.total}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {items
              ? items
                .sort((a, b) => {
                  return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                })
                .map((item) => {
                  return (
                    <Item
                      key={item.id}
                      item={item}
                      currencyCode={cart?.currency_code}
                      dictionary={dictionary}
                    />
                  )
                })
              : repeat(5).map((i) => {
                return <SkeletonLineItem key={i} />
              })}
          </Table.Body>
        </Table>
      </div>
    </div>
  )
}

export default ItemsTemplate
