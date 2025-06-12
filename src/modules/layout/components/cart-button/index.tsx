"use client"

import { useCart } from "@lib/context/cart-context"
import CartDropdown from "../cart-dropdown"

interface CartButtonProps {
  dictionary?: Record<string, any>
}

export default function CartButton({ dictionary }: CartButtonProps) {
  const { cart, isLoading } = useCart()

  // Don't render until we have attempted to load the cart
  if (isLoading) {
    return <CartDropdown cart={null} dictionary={dictionary} />
  }

  return <CartDropdown cart={cart} dictionary={dictionary} />
}
