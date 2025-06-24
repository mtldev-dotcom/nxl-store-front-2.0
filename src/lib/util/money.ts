import { isEmpty } from "./isEmpty"

type ConvertToLocaleParams = {
  amount: number
  currency_code: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

export const convertToLocale = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale = "en-US",
}: ConvertToLocaleParams) => {
  return currency_code && !isEmpty(currency_code)
    ? new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency_code,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(amount)
    : amount.toString()
}

/**
 * Enhanced price formatting function that formats prices as: $110.00 (CAD) or $90.00 (USD)
 * Removes country prefixes and adds currency code in parentheses
 */
export const formatPrice = ({
  amount,
  currency_code,
  minimumFractionDigits = 2,
  maximumFractionDigits = 2,
  locale = "en-US",
}: ConvertToLocaleParams) => {
  if (!currency_code || isEmpty(currency_code)) {
    return amount.toString()
  }

  // Format the price using Intl.NumberFormat
  const formattedPrice = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency_code,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount)

  // Remove country prefixes (like "CA", "US", etc.) and add currency code in parentheses
  const priceWithoutPrefix = formattedPrice.replace(/^[A-Z]{2}/, '')
  return `${priceWithoutPrefix} (${currency_code.toUpperCase()})`
}

/**
 * Enhanced price formatting that returns price and currency separately for custom styling
 * Returns: { price: "$110.00", currency: "CAD" }
 */
export const formatPriceWithSmallCurrency = ({
  amount,
  currency_code,
  minimumFractionDigits = 2,
  maximumFractionDigits = 2,
  locale = "en-US",
}: ConvertToLocaleParams) => {
  if (!currency_code || isEmpty(currency_code)) {
    return { price: amount.toString(), currency: "" }
  }

  // Format the price using Intl.NumberFormat
  const formattedPrice = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency_code,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount)

  // Remove country prefixes (like "CA", "US", etc.)
  const priceWithoutPrefix = formattedPrice.replace(/^[A-Z]{2}/, '')

  return {
    price: priceWithoutPrefix,
    currency: currency_code.toUpperCase()
  }
}
