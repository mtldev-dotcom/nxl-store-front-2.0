import { Metadata } from "next"
import { getDictionary } from "@lib/i18n/get-dictionary"
import { Locale } from "@lib/i18n/config"
import { getBaseURL } from "@lib/util/env"
import Script from "next/script"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function LocaleLayout({
  children,
  params: paramsPromise,
}: {
  children: React.ReactNode
  params: Promise<{ locale: Locale; countryCode: string }> | { locale: Locale; countryCode: string }
}) {
  // Await the params first to avoid Next.js warnings
  const params = await paramsPromise
  
  // Get the dictionary for the current locale
  const dictionary = await getDictionary(params.locale)

  // Pass the dictionary to children through a script tag in the head
  return (
    <>
      <Script
        id="locale-dictionary"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.__DICTIONARY__ = ${JSON.stringify(dictionary)};`,
        }}
      />
      {children}
    </>
  )
}
