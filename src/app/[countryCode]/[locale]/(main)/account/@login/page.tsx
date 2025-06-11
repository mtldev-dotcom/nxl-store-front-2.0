import { Metadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"
import { getDictionary } from "@lib/i18n/get-dictionary"
import { Locale } from "@lib/i18n/config"

interface LoginPageProps {
  params: {
    locale: Locale
    countryCode: string
  }
}

export async function generateMetadata({ params }: LoginPageProps): Promise<Metadata> {
  const dictionary = await getDictionary(params.locale)
  
  return {
    title: dictionary?.account?.login || "Sign in",
    description: dictionary?.account?.loginDescription || "Sign in to your premium shopping experience",
  }
}

export default async function Login({ params }: LoginPageProps) {
  const dictionary = await getDictionary(params.locale)
  
  return <LoginTemplate dictionary={dictionary} />
}
