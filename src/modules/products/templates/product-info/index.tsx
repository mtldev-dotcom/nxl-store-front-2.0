import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-medium text-nxl-gold hover:text-nxl-gold/80"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}
        <Heading
          level="h2"
          className="text-3xl leading-10 text-nxl-gold"
          data-testid="product-title"
        >
          {product.title}
        </Heading>

<Text
  className="text-medium text-nxl-gold whitespace-pre-line"
  data-testid="product-description"
>
  {product.description}
</Text>
      </div>
    </div>
  )
}

export default ProductInfo
