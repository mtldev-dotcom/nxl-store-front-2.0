import { HttpTypes } from "@medusajs/types"

// Extended product interface with translations
export interface StoreProductWithTranslations extends HttpTypes.StoreProduct {
  translations?: {
    [locale: string]: {
      title?: string
      subtitle?: string
      description?: string
      [key: string]: any
    }
  }
}

// Extended variant interface with translations
export interface StoreVariantWithTranslations extends HttpTypes.StoreProductVariant {
  translations?: {
    [locale: string]: {
      title?: string
      [key: string]: any
    }
  }
}

// Extended option interface with translations
export interface StoreOptionWithTranslations extends HttpTypes.StoreProductOption {
  translations?: {
    [locale: string]: {
      title?: string
      [key: string]: any
    }
  }
  values?: StoreOptionValueWithTranslations[]
}

// Extended option value interface with translations
export interface StoreOptionValueWithTranslations extends HttpTypes.StoreProductOptionValue {
  translations?: {
    [locale: string]: {
      value?: string
      [key: string]: any
    }
  }
}

/**
 * Get translated product data from Tolgee translations
 * Falls back to original data if translation not found
 */
export function getTranslatedProduct(
  product: StoreProductWithTranslations,
  locale: string
): StoreProductWithTranslations {
  if (!product.translations?.[locale]) {
    return product
  }

  const translation = product.translations[locale]

  return {
    ...product,
    title: translation.title || product.title,
    subtitle: translation.subtitle || product.subtitle,
    description: translation.description || product.description,
  }
}

/**
 * Get translated variant data from Tolgee translations
 * Falls back to original data if translation not found
 */
export function getTranslatedVariant(
  variant: StoreVariantWithTranslations,
  locale: string
): StoreVariantWithTranslations {
  if (!variant.translations?.[locale]) {
    return variant
  }

  const translation = variant.translations[locale]

  return {
    ...variant,
    title: translation.title || variant.title,
  }
}

/**
 * Get translated option data from Tolgee translations
 * Falls back to original data if translation not found
 */
export function getTranslatedOption(
  option: StoreOptionWithTranslations,
  locale: string
): StoreOptionWithTranslations {
  if (!option.translations?.[locale]) {
    return {
      ...option,
      values: option.values?.map(value => getTranslatedOptionValue(value, locale))
    }
  }

  const translation = option.translations[locale]

  return {
    ...option,
    title: translation.title || option.title,
    values: option.values?.map(value => getTranslatedOptionValue(value, locale))
  }
}

/**
 * Get translated option value data from Tolgee translations
 * Falls back to original data if translation not found
 */
export function getTranslatedOptionValue(
  optionValue: StoreOptionValueWithTranslations,
  locale: string
): StoreOptionValueWithTranslations {
  if (!optionValue.translations?.[locale]) {
    return optionValue
  }

  const translation = optionValue.translations[locale]

  return {
    ...optionValue,
    value: translation.value || optionValue.value,
  }
}

/**
 * Get translated product collection data
 * Falls back to original data if translation not found
 */
export function getTranslatedCollection(
  collection: any,
  locale: string
): any {
  if (!collection?.translations?.[locale]) {
    return collection
  }

  const translation = collection.translations[locale]

  return {
    ...collection,
    title: translation.title || collection.title,
    description: translation.description || collection.description,
  }
}

/**
 * Get translated product category data
 * Falls back to original data if translation not found
 */
export function getTranslatedCategory(
  category: any,
  locale: string
): any {
  if (!category?.translations?.[locale]) {
    return category
  }

  const translation = category.translations[locale]

  return {
    ...category,
    name: translation.name || category.name,
    description: translation.description || category.description,
  }
}
