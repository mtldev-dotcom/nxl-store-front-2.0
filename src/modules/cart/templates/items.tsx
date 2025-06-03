import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Heading, Table } from "@medusajs/ui"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items
  return (
    <div>
      <div className="pb-3 flex items-center">
        <Heading className="text-[2rem] leading-[2.75rem] text-nxl-gold">Cart</Heading>
      </div>
      <Table>
        <Table.Header className="border-t-0 border-b border-nxl-gold/30">
          <Table.Row className="text-nxl-gold txt-medium-plus">
            <Table.HeaderCell className="!pl-0 pb-4">Item</Table.HeaderCell>
            <Table.HeaderCell className="pb-4"></Table.HeaderCell>
            <Table.HeaderCell className="pb-4">Quantity</Table.HeaderCell>
            <Table.HeaderCell className="hidden small:table-cell pb-4">
              Price
            </Table.HeaderCell>
            <Table.HeaderCell className="!pr-0 text-right pb-4">
              Total
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
