"use client"

import { setAddresses } from "@lib/data/cart"
import compareAddresses from "@lib/util/compare-addresses"
import { CheckCircleSolid } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text, useToggleState } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import Spinner from "@modules/common/icons/spinner"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useActionState } from "react"
import BillingAddress from "../billing_address"
import ErrorMessage from "../error-message"
import ShippingAddress from "../shipping-address"
import { SubmitButton } from "../submit-button"
import { useTranslation } from "@lib/context/translation-context"

const Addresses = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const { translate } = useTranslation()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "address"

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  const handleEdit = () => {
    router.push(pathname + "?step=address")
  }

  const [message, formAction] = useActionState(setAddresses, null)

  return (
    <div className="bg-nxl-black/80 backdrop-blur-sm border border-nxl-gold/30 rounded-xl p-6 shadow-xl">
      <div className="flex flex-row items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            !isOpen && cart?.shipping_address 
              ? 'bg-green-500 text-white' 
              : 'bg-nxl-gold/20 text-nxl-gold border border-nxl-gold/30'
          }`}>
            {!isOpen && cart?.shipping_address ? (
              <CheckCircleSolid className="w-5 h-5" />
            ) : (
              <span className="text-sm font-semibold">1</span>
            )}
          </div>
          <Heading
            level="h2"
            className="text-2xl font-semibold text-nxl-gold font-display"
          >
            {translate("checkout", "shippingAddress")}
          </Heading>
        </div>
        {!isOpen && cart?.shipping_address && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-nxl-gold hover:text-nxl-gold/80 font-medium transition-colors duration-200"
              data-testid="edit-address-button"
            >
              {translate("checkout", "edit")}
            </button>
            
          </Text>
        )}
      </div>
      {isOpen ? (
        <form action={formAction}>
          <div className="pb-8">
            <ShippingAddress
              customer={customer}
              checked={sameAsBilling}
              onChange={toggleSameAsBilling}
              cart={cart}
            />

            {!sameAsBilling && (
              <div>
                <Heading
                  level="h2"
                  className="text-xl font-semibold text-nxl-gold font-display pb-6 pt-8"
                >
                  {translate("checkout", "billingAddress")}
                </Heading>

                <BillingAddress cart={cart} />
              </div>
            )}
            <SubmitButton className="mt-6 bg-nxl-gold hover:bg-nxl-gold/90 text-nxl-black font-semibold transition-all duration-300" data-testid="submit-address-button">
              {translate("checkout", "continueToDelivery")}
            </SubmitButton>
            <ErrorMessage error={message} data-testid="address-error-message" />
          </div>
        </form>
      ) : (
        <div>
          <div className="text-small-regular">
            {cart && cart.shipping_address ? (
              <div className="flex items-start gap-x-8">
                <div className="flex items-start gap-x-1 w-full">
                  <div
                    className="flex flex-col w-1/3"
                    data-testid="shipping-address-summary"
                  >
                    <Text className="txt-medium-plus text-nxl-gold mb-1 font-semibold">
                      {translate("checkout", "shippingAddress")}
                    </Text>
                    <Text className="txt-medium text-nxl-ivory/80">
                      {cart.shipping_address.first_name}{" "}
                      {cart.shipping_address.last_name}
                    </Text>
                    <Text className="txt-medium text-nxl-ivory/80">
                      {cart.shipping_address.address_1}{" "}
                      {cart.shipping_address.address_2}
                    </Text>
                    <Text className="txt-medium text-nxl-ivory/80">
                      {cart.shipping_address.postal_code},{" "}
                      {cart.shipping_address.city}
                    </Text>
                    <Text className="txt-medium text-nxl-ivory/80">
                      {cart.shipping_address.country_code?.toUpperCase()}
                    </Text>
                  </div>

                  <div
                    className="flex flex-col w-1/3 "
                    data-testid="shipping-contact-summary"
                  >
                    <Text className="txt-medium-plus text-nxl-gold mb-1 font-semibold">
                      Contact
                    </Text>
                    <Text className="txt-medium text-nxl-ivory/80">
                      {cart.shipping_address.phone}
                    </Text>
                    <Text className="txt-medium text-nxl-ivory/80">
                      {cart.email}
                    </Text>
                  </div>

                  <div
                    className="flex flex-col w-1/3"
                    data-testid="billing-address-summary"
                  >
                    <Text className="txt-medium-plus text-nxl-gold mb-1 font-semibold">
                      {translate("checkout", "billingAddress")}
                    </Text>

                    {sameAsBilling ? (
                      <Text className="txt-medium text-nxl-ivory/80">
                        {translate("checkout", "sameAsBilling")}
                      </Text>
                    ) : (
                      <>
                        <Text className="txt-medium text-nxl-ivory/80">
                          {cart.billing_address?.first_name}{" "}
                          {cart.billing_address?.last_name}
                        </Text>
                        <Text className="txt-medium text-nxl-ivory/80">
                          {cart.billing_address?.address_1}{" "}
                          {cart.billing_address?.address_2}
                        </Text>
                        <Text className="txt-medium text-nxl-ivory/80">
                          {cart.billing_address?.postal_code},{" "}
                          {cart.billing_address?.city}
                        </Text>
                        <Text className="txt-medium text-nxl-ivory/80">
                          {cart.billing_address?.country_code?.toUpperCase()}
                        </Text>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <Spinner />
              </div>
            )}
          </div>
        </div>
      )}
      <Divider className="mt-8" />
    </div>
  )
}

export default Addresses
