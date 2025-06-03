import { Metadata } from "next"

import { listCartOptions, retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getBaseURL } from "@lib/util/env"
import { getDictionary } from "@lib/i18n/get-dictionary"
import { Locale } from "@lib/i18n/config"
import { StoreCartShippingOption } from "@medusajs/types"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import FreeShippingPriceNudge from "@modules/shipping/components/free-shipping-price-nudge"
import ClientLayout from "../client-layout"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { 
  children: React.ReactNode,
  params: Promise<{ countryCode: string, locale: Locale }> | { countryCode: string, locale: Locale }
}) {
  // Await params before using
  const params = await props.params

  const customer = await retrieveCustomer()
  const cart = await retrieveCart()
  const dictionary = await getDictionary(params.locale)
  let shippingOptions: StoreCartShippingOption[] = []

  if (cart) {
    const { shipping_options } = await listCartOptions()

    shippingOptions = shipping_options
  }

  return (
    <ClientLayout>
      <Nav params={{ locale: params.locale }} />
      {customer && cart && (
        <CartMismatchBanner customer={customer} cart={cart} dictionary={dictionary} />
      )}

      {cart && (
        <FreeShippingPriceNudge
          variant="popup"
          cart={cart}
          shippingOptions={shippingOptions}
          dictionary={dictionary}
        />
      )}
      {props.children}
      <Footer params={{ locale: params.locale }} />
    </ClientLayout>
  )
}
