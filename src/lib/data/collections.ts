"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions, getAuthHeaders } from "./cookies"

export const retrieveCollection = async (id: string) => {
  const next = {
    ...(await getCacheOptions("collections")),
  }

  return sdk.client
    .fetch<{ collection: HttpTypes.StoreCollection }>(
      `/store/collections/${id}`,
      {
        next,
        cache: "force-cache",
      }
    )
    .then(({ collection }) => collection)
}

export const listCollections = async (
  queryParams: Record<string, string> = {}
): Promise<{ 
  collections: HttpTypes.StoreCollection[]; 
  count: number;
  offset: number;
  limit: number;
}> => {
  // Include auth headers
  const authHeaders = await getAuthHeaders()
  
  // Set default limit and offset if not provided
  const query = {
    limit: "100",
    offset: "0",
    ...queryParams, // Spread queryParams after defaults to allow overrides
  }

  try {
    // Make direct fetch call to ensure headers are properly set
    const response = await fetch(
      `${process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"}/store/collections?` + 
      new URLSearchParams(query).toString(), 
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
          ...authHeaders
        },
        cache: "no-store" // Avoid caching to get fresh data
      }
    )
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    // Return empty response structure on error
    return {
      collections: [],
      count: 0,
      offset: 0,
      limit: parseInt(query.limit)
    }
  }
}

export const getCollectionByHandle = async (
  handle: string
): Promise<HttpTypes.StoreCollection> => {
  const next = {
    ...(await getCacheOptions("collections")),
  }

  return sdk.client
    .fetch<HttpTypes.StoreCollectionListResponse>(`/store/collections`, {
      query: { handle, fields: "*products" },
      next,
      cache: "force-cache",
    })
    .then(({ collections }) => collections[0])
}
