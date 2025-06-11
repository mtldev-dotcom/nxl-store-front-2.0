"use client"

import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"
import { useTranslation } from "@lib/context/translation-context"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const { translate } = useTranslation()
  
  const tabs = [
    {
      label: translate("product", "productInformation", "Product Information"),
      component: <ProductInfoTab product={product} />,
    },
    {
      label: translate("product", "shippingReturns", "Shipping & Returns"),
      component: <ShippingInfoTab />,
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  const { translate } = useTranslation()
  
  return (
    <div className="text-small-regular py-8 text-nxl-gold">
      <div className="grid grid-cols-2 gap-x-8">
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold text-nxl-gold">{translate("product", "material", "Material")}</span>
            <p>{product.material ? product.material : "-"}</p>
          </div>
          <div>
            <span className="font-semibold text-nxl-gold">{translate("product", "countryOfOrigin", "Country of origin")}</span>
            <p>{product.origin_country ? product.origin_country : "-"}</p>
          </div>
          <div>
            <span className="font-semibold text-nxl-gold">{translate("product", "type", "Type")}</span>
            <p>{product.type ? product.type.value : "-"}</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold text-nxl-gold">{translate("product", "weight", "Weight")}</span>
            <p>{product.weight ? `${product.weight} g` : "-"}</p>
          </div>
          <div>
            <span className="font-semibold text-nxl-gold">{translate("product", "dimensions", "Dimensions")}</span>
            <p>
              {product.length && product.width && product.height
                ? `${product.length}L x ${product.width}W x ${product.height}H`
                : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const ShippingInfoTab = () => {
  const { translate } = useTranslation()
  
  return (
    <div className="text-small-regular py-8 text-nxl-gold">
      <div className="grid grid-cols-1 gap-y-8">
        <div className="flex items-start gap-x-2">
          <FastDelivery />
          <div>
            <span className="font-semibold text-nxl-gold">{translate("product", "fastDelivery", "Fast delivery")}</span>
            <p className="max-w-sm">
              {translate("product", "fastDeliveryDesc", "Your package will arrive in 3-5 business days at your pick up location or in the comfort of your home.")}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Refresh />
          <div>
            <span className="font-semibold text-nxl-gold">{translate("product", "simpleExchanges", "Simple exchanges")}</span>
            <p className="max-w-sm">
              {translate("product", "simpleExchangesDesc", "Is the fit not quite right? No worries - we'll exchange your product for a new one.")}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Back />
          <div>
            <span className="font-semibold text-nxl-gold">{translate("product", "easyReturns", "Easy returns")}</span>
            <p className="max-w-sm">
              {translate("product", "easyReturnsDesc", "Just return your product and we'll refund your money. No questions asked – we'll do our best to make sure your return is hassle-free.")}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
