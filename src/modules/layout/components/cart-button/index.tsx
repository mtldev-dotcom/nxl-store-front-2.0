"use client"

import { useEffect, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import CartDropdown from "../cart-dropdown"

interface CartButtonProps {
  dictionary?: Record<string, any>
}

export default function CartButton({ dictionary }: CartButtonProps) {
  const [cart, setCart] = useState<HttpTypes.StoreCart | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch cart data on client side
    const fetchCart = async () => {
      try {
        const response = await fetch('/api/cart', {
          method: 'GET',
          credentials: 'include',
        })
        
        if (response.ok) {
          const data = await response.json()
          setCart(data.cart || null)
        }
      } catch (error) {
        console.error('Failed to fetch cart:', error)
        setCart(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCart()
  }, [])

  // Don't render until we have attempted to load the cart
  if (isLoading) {
    return <CartDropdown cart={null} dictionary={dictionary} />
  }

  return <CartDropdown cart={cart} dictionary={dictionary} />
}
