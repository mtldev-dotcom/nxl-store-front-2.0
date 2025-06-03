import { retrieveCustomer } from "@lib/data/customer"
import { Toaster } from "@medusajs/ui"
import AccountLayout from "@modules/account/templates/account-layout"
import { getDictionary } from "@lib/i18n/get-dictionary"
import { Locale } from "@lib/i18n/config"

// Define our params interface
interface AccountLayoutParams {
  params: {
    locale: Locale
    countryCode: string
  }
}

export default async function AccountPageLayout({
  dashboard,
  login,
  params,
}: {
  dashboard?: React.ReactNode
  login?: React.ReactNode
} & AccountLayoutParams) {
  // Get customer and handle any error
  const customer = await retrieveCustomer().catch(() => null)
  
  // Get dictionary based on locale
  const dictionary = await getDictionary(params.locale)

  return (
    <AccountLayout customer={customer} dictionary={dictionary}>
      {customer ? dashboard : login}
      <Toaster />
    </AccountLayout>
  )
}
