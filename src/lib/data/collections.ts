"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions, getAuthHeaders } from "./cookies"

export const retrieveCollection = async (id: string) => {
  const next = {
    ...(await getCacheOptions("collections")),
  }

  return sdk.client
    .fetch<HttpTypes.StoreCollectionResponse>(`/store/collections/${id}`, {
      query: {
        fields: "*products",
      },
      next,
      cache: "force-cache",
    })
    .then(({ collection }) => collection)
}

export const listCollections = async (query?: Record<string, any>) => {
  const next = {
    ...(await getCacheOptions("collections")),
  }

  return sdk.client
    .fetch<HttpTypes.StoreCollectionListResponse>(`/store/collections`, {
      query: {
        fields: "id,title,handle,*products",
        limit: 100,
        ...query,
      },
      next,
      cache: "force-cache",
    })
    .then(({ collections }) => collections)
}

// New function to get collections with product counts for filtering sidebar
export const listCollectionsWithCounts = async (query?: Record<string, any>) => {
  const next = {
    ...(await getCacheOptions("collections")),
  }

  return sdk.client
    .fetch<HttpTypes.StoreCollectionListResponse>(`/store/collections`, {
      query: {
        fields: "id,title,handle,*products",
        limit: 50,
        ...query,
      },
      next,
      cache: "force-cache",
    })
    .then(({ collections }) => {
      // Calculate product counts for each collection
      const collectionsWithCounts = collections.map(collection => ({
        id: collection.id,
        title: collection.title,
        handle: collection.handle,
        product_count: collection.products?.length || 0,
      }))

      return { collections: collectionsWithCounts, total: collections.length }
    })
}

// Get collections for main navigation/filtering
export const listMainCollections = async () => {
  return listCollectionsWithCounts({
    limit: 10,
  })
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
