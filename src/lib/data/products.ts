"use server"

import { sdk } from "@lib/config"
import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
  locale,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams & {
    collection_id?: string[]
    category_id?: string[]
  }
  countryCode?: string
  regionId?: string
  locale?: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = (_pageParam === 1) ? 0 : (_pageParam - 1) * limit;

  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("products")),
  }

  // Build translation fields based on locale
  const translationsField = locale ? `,+translations.${locale},+variants.translations.${locale},+options.translations.${locale},+options.values.translations.${locale}` : ""

  // Clean and validate query parameters
  const cleanQueryParams: any = { ...queryParams }

  // Handle collection_id array properly
  if (cleanQueryParams.collection_id && Array.isArray(cleanQueryParams.collection_id)) {
    // Only keep valid collection IDs
    const validCollectionIds = cleanQueryParams.collection_id.filter((id: string) =>
      id && typeof id === 'string' && id.trim().length > 0
    )

    if (validCollectionIds.length === 0) {
      delete cleanQueryParams.collection_id
    } else {
      cleanQueryParams.collection_id = validCollectionIds
    }
  }

  // Handle category_id array properly
  if (cleanQueryParams.category_id && Array.isArray(cleanQueryParams.category_id)) {
    // Only keep valid category IDs
    const validCategoryIds = cleanQueryParams.category_id.filter((id: string) =>
      id && typeof id === 'string' && id.trim().length > 0
    )

    if (validCategoryIds.length === 0) {
      delete cleanQueryParams.category_id
    } else {
      cleanQueryParams.category_id = validCategoryIds
    }
  }

  try {
    return sdk.client
      .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
        `/store/products`,
        {
          method: "GET",
          query: {
            limit,
            offset,
            region_id: region?.id,
            fields:
              `*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags${translationsField}`,
            ...cleanQueryParams,
          },
          headers,
          next,
          cache: "force-cache",
        }
      )
      .then(({ products, count }) => {
        const nextPage = count > offset + limit ? pageParam + 1 : null

        return {
          response: {
            products,
            count,
          },
          nextPage: nextPage,
          queryParams,
        }
      })
  } catch (error) {
    console.error("Error fetching products:", error)
    console.error("Query params that caused error:", cleanQueryParams)

    // Return empty result instead of throwing
    return {
      response: { products: [], count: 0 },
      nextPage: null,
      queryParams,
    }
  }
}

/**
 * This will fetch 100 products to the Next.js cache and sort them based on the sortBy parameter.
 * It will then return the paginated products based on the page and limit parameters.
 */
export const listProductsWithSort = async ({
  page = 0,
  queryParams,
  sortBy = "price_asc",
  countryCode,
  locale,
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams & {
    collection_id?: string[]
    category_id?: string[]
  }
  sortBy?: SortOptions
  countryCode: string
  locale?: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  const limit = queryParams?.limit || 12

  try {
    const {
      response: { products, count },
    } = await listProducts({
      pageParam: 0,
      queryParams: {
        ...queryParams,
        limit: 100,
      },
      countryCode,
      locale,
    })

    const sortedProducts = sortProducts(products, sortBy)

    const pageParam = (page - 1) * limit

    const nextPage = count > pageParam + limit ? pageParam + limit : null

    const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit)

    return {
      response: {
        products: paginatedProducts,
        count,
      },
      nextPage,
      queryParams,
    }
  } catch (error) {
    console.error("Error in listProductsWithSort:", error)

    // Return empty result instead of throwing
    return {
      response: { products: [], count: 0 },
      nextPage: null,
      queryParams,
    }
  }
}

/**
 * Retrieve a single product by its handle with translations
 */
export const retrieveProduct = async (
  handle: string,
  countryCode: string,
  locale?: string
): Promise<HttpTypes.StoreProduct | null> => {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("products")),
  }

  // Build translation fields based on locale
  const translationsField = locale ? `,+translations.${locale},+variants.translations.${locale},+options.translations.${locale},+options.values.translations.${locale}` : ""

  try {
    const { product } = await sdk.client.fetch<{ product: HttpTypes.StoreProduct }>(
      `/store/products/${handle}`,
      {
        method: "GET",
        query: {
          region_id: region.id,
          fields: `*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags${translationsField}`,
        },
        headers,
        next,
        cache: "force-cache",
      }
    )

    return product
  } catch (error) {
    console.error("Error retrieving product:", error)
    return null
  }
}
