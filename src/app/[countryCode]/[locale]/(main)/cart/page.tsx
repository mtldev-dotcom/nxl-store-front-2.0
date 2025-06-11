import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import CartTemplate from "@modules/cart/templates"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Locale } from "@lib/i18n/config"

export const metadata: Metadata = {
  title: "Cart",
  description: "View your cart",
}

type Props = {
  params: {
    countryCode: string
    locale: Locale
  }
}

export default async function Cart({ params }: Props) {
  const cart = await retrieveCart().catch((error) => {
    console.error(error)
    return notFound()
  })

  const customer = await retrieveCustomer()

  return <CartTemplate cart={cart} customer={customer} params={params} />
}
