"use client"

import { Table, Text, clx } from "@medusajs/ui"
import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import CartItemSelect from "@modules/cart/components/cart-item-select"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import { useState } from "react"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
  dictionary?: any
}

const Item = ({ item, type = "full", currencyCode, dictionary }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)

    await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setUpdating(false)
      })
  }

  // TODO: Update this to grab the actual max inventory
  const maxQtyFromInventory = 10
  const maxQuantity = item.variant?.manage_inventory ? 10 : maxQtyFromInventory

  return (
    <Table.Row className="w-full hover:bg-nxl-gold/5 transition-colors duration-200 border-b border-nxl-gold/20 last:border-b-0" data-testid="product-row">
      {/* Product Image & Info */}
      <Table.Cell className="!pl-4 py-6 pr-4">
        <div className="flex items-start gap-4">
          <LocalizedClientLink
            href={`/products/${item.product_handle}`}
            className="flex-shrink-0"
          >
            <div className={clx("rounded-lg overflow-hidden border border-nxl-gold/20", {
              "w-16 h-16": type === "preview",
              "w-20 h-20": type === "full",
            })}>
              <Thumbnail
                thumbnail={item.thumbnail}
                images={item.variant?.product?.images}
                size="square"
              />
            </div>
          </LocalizedClientLink>
          
          <div className="flex-1 min-w-0">
            <LocalizedClientLink href={`/products/${item.product_handle}`}>
              <Text
                className="text-base font-semibold text-nxl-gold hover:text-nxl-gold/80 transition-colors line-clamp-2"
                data-testid="product-title"
              >
                {item.product_title}
              </Text>
            </LocalizedClientLink>
            <div className="mt-1">
              <LineItemOptions variant={item.variant} data-testid="product-variant" />
            </div>
            {/* Mobile: Show price under product info */}
            <div className="mt-2 block small:hidden">
              <LineItemPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </div>
          </div>
        </div>
      </Table.Cell>

      {/* Empty spacer cell */}
      <Table.Cell className="w-0 p-0"></Table.Cell>

      {/* Quantity Controls */}
      {type === "full" && (
        <Table.Cell className="py-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <DeleteButton id={item.id} data-testid="product-delete-button" />
              <div className="flex items-center border border-nxl-gold/40 rounded-lg bg-nxl-black/50 shadow-sm">
                <button
                  onClick={() => changeQuantity(Math.max(1, item.quantity - 1))}
                  disabled={updating || item.quantity <= 1}
                  className="w-8 h-8 flex items-center justify-center text-nxl-black hover:bg-nxl-gold/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-l-lg font-medium"
                  data-testid="quantity-decrease"
                >
                  −
                </button>
                <span className="w-12 h-8 flex items-center justify-center text-nxl-black font-semibold text-sm border-x border-nxl-gold/20">
                  {item.quantity}
                </span>
                <button
                  onClick={() => changeQuantity(Math.min(maxQuantity, item.quantity + 1))}
                  disabled={updating || item.quantity >= maxQuantity}
                  className="w-8 h-8 flex items-center justify-center text-nxl-black hover:bg-nxl-gold/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-r-lg font-medium"
                  data-testid="quantity-increase"
                >
                  +
                </button>
              </div>
              {updating && <Spinner />}
            </div>
            <div className="text-xs text-nxl-ivory/65 font-medium">
              {dictionary?.cart?.quantityControls?.max || "Max"}: {maxQuantity}
            </div>
            <ErrorMessage error={error} data-testid="product-error-message" />
          </div>
        </Table.Cell>
      )}

      {/* Unit Price - Desktop only */}
      {type === "full" && (
        <Table.Cell className="hidden small:table-cell py-6 text-right">
          <div className="text-right">
            <LineItemUnitPrice
              item={item}
              style="default"
              currencyCode={currencyCode}
            />
          </div>
        </Table.Cell>
      )}

      {/* Total Price */}
      <Table.Cell className="!pr-4 py-6 text-right">
        <div className="text-right">
          {type === "preview" && (
            <div className="flex items-center justify-end gap-1 mb-1">
              <Text className="text-sm text-nxl-ivory/70">{item.quantity}× </Text>
              <LineItemUnitPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </div>
          )}
          <div className="font-semibold">
            <LineItemPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
            />
          </div>
        </div>
      </Table.Cell>
    </Table.Row>
  )
}

export default Item
