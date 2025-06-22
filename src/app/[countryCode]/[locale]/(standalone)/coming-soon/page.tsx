import { Metadata } from "next"
import { getDictionary } from "@lib/i18n/get-dictionary"
import { Locale } from "@lib/i18n/config"
import ComingSoonTemplate from "@modules/coming-soon/templates"

export async function generateMetadata({
    params: paramsPromise,
}: {
    params: Promise<{ locale: Locale; countryCode: string }>
}): Promise<Metadata> {
    const params = await paramsPromise
    const dictionary = await getDictionary(params.locale)

    return {
        title: `${dictionary.general.title} - Coming Soon`,
        description: "Next X Level luxury streetwear is launching soon. Join our exclusive waitlist for early access and special offers.",
        robots: "noindex, nofollow", // Prevent search engine indexing of coming soon page
    }
}

export default async function ComingSoonPage({
    params: paramsPromise,
}: {
    params: Promise<{ countryCode: string; locale: Locale }>
}) {
    const params = await paramsPromise
    const { countryCode, locale } = params
    const dictionary = await getDictionary(locale)

    return (
        <ComingSoonTemplate
            dictionary={dictionary}
            locale={locale}
            countryCode={countryCode}
        />
    )
} 