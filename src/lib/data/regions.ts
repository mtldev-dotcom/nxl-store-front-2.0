"use server"

// Import the sdk configuration from the config module
import { sdk } from "@lib/config"
// Import a custom error handler for Medusa errors
import medusaError from "@lib/util/medusa-error"
// Import HTTP types from Medusa's type definitions
import { HttpTypes } from "@medusajs/types"
// Import a function to get cache options from the cookies module
import { getCacheOptions } from "./cookies"

// Function to list all regions
export const listRegions = async () => {
  // Get cache options for 'regions'
  const next = {
    ...(await getCacheOptions("regions")),
  }

  // Fetch regions data from the store API
  return sdk.client
    .fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ regions }) => regions) // Return the list of regions
    .catch(medusaError) // Handle any errors using the medusaError function
}

// Function to retrieve a specific region by ID
export const retrieveRegion = async (id: string) => {
  // Get cache options for the specific region ID
  const next = {
    ...(await getCacheOptions(["regions", id].join("-"))),
  }

  // Fetch the specific region data from the store API
  return sdk.client
    .fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ region }) => region) // Return the region data
    .catch(medusaError) // Handle any errors using the medusaError function
}

// Create a map to store region data keyed by country code
const regionMap = new Map<string, HttpTypes.StoreRegion>()

// Function to get a region based on the country code
export const getRegion = async (countryCode: string) => {
  try {
    // Check if the region for the given country code is already in the map
    if (regionMap.has(countryCode)) {
      return regionMap.get(countryCode)
    }
    // Fetch all regions
    const regions = await listRegions()
    // If regions data is not available, return null
    if (!regions) {
      return null
    }

    // Populate the regionMap with country codes and their corresponding regions
    regions.forEach((region) => {
      region.countries?.forEach((c) => {
        regionMap.set(c?.iso_2 ?? "", region)
      })
    })

    // Get the region based on the country code, default to 'us' if no countryCode is provided
    const region = countryCode
      ? regionMap.get(countryCode)
      : regionMap.get("us")

    return region // Return the region
  } catch (e: any) {
    return null // Return null if any error occurs
  }
}
