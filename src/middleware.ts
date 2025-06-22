import { HttpTypes } from "@medusajs/types"
import { NextRequest, NextResponse } from "next/server"
import { i18nConfig } from "@lib/i18n/config"

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"
const DEFAULT_LOCALE = i18nConfig.defaultLocale

const regionMapCache = {
  regionMap: new Map<string, HttpTypes.StoreRegion>(),
  regionMapUpdated: Date.now(),
}

async function getRegionMap(cacheId: string) {
  const { regionMap, regionMapUpdated } = regionMapCache

  if (!BACKEND_URL) {
    throw new Error(
      "Middleware.ts: Error fetching regions. Did you set up regions in your Medusa Admin and define a MEDUSA_BACKEND_URL environment variable? Note that the variable is no longer named NEXT_PUBLIC_MEDUSA_BACKEND_URL."
    )
  }

  if (
    !regionMap.keys().next().value ||
    regionMapUpdated < Date.now() - 3600 * 1000
  ) {
    // Fetch regions from Medusa. We can't use the JS client here because middleware is running on Edge and the client needs a Node environment.
    const { regions } = await fetch(`${BACKEND_URL}/store/regions`, {
      headers: {
        "x-publishable-api-key": PUBLISHABLE_API_KEY!,
      },
      next: {
        revalidate: 3600,
        tags: [`regions-${cacheId}`],
      },
      cache: "force-cache",
    }).then(async (response) => {
      const json = await response.json()

      if (!response.ok) {
        throw new Error(json.message)
      }

      return json
    })

    if (!regions?.length) {
      throw new Error(
        "No regions found. Please set up regions in your Medusa Admin."
      )
    }

    // Create a map of country codes to regions.
    regions.forEach((region: HttpTypes.StoreRegion) => {
      region.countries?.forEach((c) => {
        regionMapCache.regionMap.set(c.iso_2 ?? "", region)
      })
    })

    regionMapCache.regionMapUpdated = Date.now()
  }

  return regionMapCache.regionMap
}

/**
 * Determines the appropriate locale based on browser preferences and available locales.
 * Falls back to the default locale if none match.
 */
function getLocaleFromRequest(request: NextRequest): string {
  // Check if locale is specified in the URL
  const pathSegments = request.nextUrl.pathname.split("/")
  if (pathSegments.length > 2) {
    const urlLocale = pathSegments[2]?.toLowerCase()

    if (i18nConfig.locales.includes(urlLocale as any)) {
      return urlLocale
    }
  }

  // Get locale from Accept-Language header
  const acceptLanguage = request.headers.get("accept-language")
  if (acceptLanguage) {
    const requestedLocales = acceptLanguage
      .split(",")
      .map(locale => locale.split(";")[0].trim().substring(0, 2).toLowerCase())

    // Find the first locale that matches our supported locales
    const matchedLocale = requestedLocales.find(locale =>
      i18nConfig.locales.includes(locale as any)
    )

    if (matchedLocale) {
      return matchedLocale
    }
  }

  // Fall back to default locale
  return DEFAULT_LOCALE
}

/**
 * Fetches regions from Medusa and sets the region cookie.
 * @param request
 * @param response
 */
async function getCountryCode(
  request: NextRequest,
  regionMap: Map<string, HttpTypes.StoreRegion | number>
) {
  try {
    let countryCode

    const vercelCountryCode = request.headers
      .get("x-vercel-ip-country")
      ?.toLowerCase()

    const urlCountryCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase()

    if (urlCountryCode && regionMap.has(urlCountryCode)) {
      countryCode = urlCountryCode
    } else if (vercelCountryCode && regionMap.has(vercelCountryCode)) {
      countryCode = vercelCountryCode
    } else if (regionMap.has(DEFAULT_REGION)) {
      countryCode = DEFAULT_REGION
    } else if (regionMap.keys().next().value) {
      countryCode = regionMap.keys().next().value
    }

    return countryCode
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "Middleware.ts: Error getting the country code. Did you set up regions in your Medusa Admin and define a MEDUSA_BACKEND_URL environment variable? Note that the variable is no longer named NEXT_PUBLIC_MEDUSA_BACKEND_URL."
      )
    }
  }
}

/**
 * Middleware to handle region selection, locale selection, and onboarding status.
 */
export async function middleware(request: NextRequest) {
  let redirectUrl = request.nextUrl.href
  let response = NextResponse.redirect(redirectUrl, 307)
  let cacheIdCookie = request.cookies.get("_medusa_cache_id")
  let cacheId = cacheIdCookie?.value || crypto.randomUUID()

  const regionMap = await getRegionMap(cacheId)
  const countryCode = regionMap && (await getCountryCode(request, regionMap))
  const locale = getLocaleFromRequest(request)

  const pathSegments = request.nextUrl.pathname.split("/")
  const urlHasCountryCode = countryCode && pathSegments[1]?.includes(countryCode)
  const urlHasLocale = pathSegments[2] && i18nConfig.locales.includes(pathSegments[2] as any)

  // If the URL has both country code and locale, and the cache ID is set, continue
  if (urlHasCountryCode && urlHasLocale && cacheIdCookie) {
    return NextResponse.next()
  }

  // If the URL has both country code and locale, but cache ID is not set, set it and redirect
  if (urlHasCountryCode && urlHasLocale && !cacheIdCookie) {
    response.cookies.set("_medusa_cache_id", cacheId, {
      maxAge: 60 * 60 * 24,
    })
    return response
  }

  // Check if the URL is a static asset
  if (request.nextUrl.pathname.includes(".")) {
    return NextResponse.next()
  }

  // Coming Soon Mode - Redirect to coming soon page if enabled
  const isComingSoonMode = process.env.COMING_SOON_MODE === 'true'

  if (isComingSoonMode) {
    const pathname = request.nextUrl.pathname
    const isAlreadyOnComingSoon = pathname.includes('/coming-soon')
    const isApiRoute = pathname.startsWith('/api')

    // Don't redirect if already on coming soon page or API routes
    if (!isAlreadyOnComingSoon && !isApiRoute) {
      // Ensure we have proper country code and locale for coming soon redirect
      const finalCountryCode = countryCode || DEFAULT_REGION
      const finalLocale = locale || DEFAULT_LOCALE

      const comingSoonUrl = `${request.nextUrl.origin}/${finalCountryCode}/${finalLocale}/coming-soon`
      return NextResponse.redirect(comingSoonUrl, 307)
    }
  }

  // Handle the case where country code exists but locale is missing
  if (urlHasCountryCode && !urlHasLocale) {
    const redirectPath = pathSegments.slice(1).join("/")
    redirectUrl = `${request.nextUrl.origin}/${countryCode}/${locale}${redirectPath ? `/${redirectPath}` : ""}`
    redirectUrl += request.nextUrl.search ? request.nextUrl.search : ""
    response = NextResponse.redirect(redirectUrl, 307)
    return response
  }

  // If no country code is set, we redirect to the relevant region with locale
  if (!urlHasCountryCode && countryCode) {
    const redirectPath = request.nextUrl.pathname === "/"
      ? ""
      : request.nextUrl.pathname

    redirectUrl = `${request.nextUrl.origin}/${countryCode}/${locale}${redirectPath}`
    redirectUrl += request.nextUrl.search ? request.nextUrl.search : ""

    response = NextResponse.redirect(redirectUrl, 307)
  }

  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}
