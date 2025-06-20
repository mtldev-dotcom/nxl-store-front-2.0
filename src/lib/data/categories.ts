import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

export const listCategories = async (query?: Record<string, any>) => {
  const next = {
    ...(await getCacheOptions("categories")),
  }

  const limit = query?.limit || 100

  return sdk.client
    .fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
      "/store/product-categories",
      {
        query: {
          fields:
            "*category_children, *products, *parent_category, *parent_category.parent_category",
          limit,
          ...query,
        },
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_categories }) => product_categories)
}

// New function to get categories with product counts for filtering sidebar
export const listCategoriesWithCounts = async (query?: Record<string, any>) => {
  const next = {
    ...(await getCacheOptions("categories")),
  }

  const limit = query?.limit || 100

  return sdk.client
    .fetch<{ product_categories: HttpTypes.StoreProductCategory[], count: number }>(
      "/store/product-categories",
      {
        query: {
          fields: "*products",
          limit,
          include_descendants_tree: true,
          ...query,
        },
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_categories, count }) => {
      // Calculate product counts for each category and filter out empty ones
      const categoriesWithCounts = product_categories
        .map(category => ({
          id: category.id,
          name: category.name,
          handle: category.handle,
          description: category.description,
          parent_category_id: category.parent_category_id,
          category_children: category.category_children,
          product_count: category.products?.length || 0,
        }))
        .filter(category => category.product_count > 0) // Only show categories with products

      return { categories: categoriesWithCounts, total: count }
    })
}

// Get all categories with products for filtering (not just top-level)
export const listMainCategories = async () => {
  return listCategoriesWithCounts({
    limit: 50, // Increased limit
    order: "name"
    // Removed parent_category_id filter to show all categories with products
  })
}

export const getCategoryByHandle = async (categoryHandle: string[]) => {
  const handle = `${categoryHandle.join("/")}`

  const next = {
    ...(await getCacheOptions("categories")),
  }

  return sdk.client
    .fetch<HttpTypes.StoreProductCategoryListResponse>(
      `/store/product-categories`,
      {
        query: {
          fields: "*category_children, *products",
          handle,
        },
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_categories }) => product_categories[0])
}
