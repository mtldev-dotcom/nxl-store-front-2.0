"use client"

import { retrieveCart } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { createContext, useContext, useEffect, useState, ReactNode } from "react"

interface CartContextType {
  cart: HttpTypes.StoreCart | null
  isLoading: boolean
  refreshCart: () => Promise<void>
  updateCart: (cart: HttpTypes.StoreCart | null) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

interface CartProviderProps {
  children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<HttpTypes.StoreCart | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshCart = async () => {
    try {
      setIsLoading(true)
      const updatedCart = await retrieveCart()
      setCart(updatedCart)
    } catch (error) {
      console.error('Failed to fetch cart:', error)
      setCart(null)
    } finally {
      setIsLoading(false)
    }
  }

  const updateCart = (newCart: HttpTypes.StoreCart | null) => {
    setCart(newCart)
  }

  useEffect(() => {
    refreshCart()
  }, [])

  return (
    <CartContext.Provider value={{ cart, isLoading, refreshCart, updateCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
