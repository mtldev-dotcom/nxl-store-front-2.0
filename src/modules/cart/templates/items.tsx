import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Heading, Table } from "@medusajs/ui"

import Item from "@modules/cart/components/item"
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
            <Table.HeaderCell className="hidden small:table-cell pb-4 font-semibold text-right min-w-[100px]">
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
  )
}

export default ItemsTemplate
