import { retrieveCart } from "@lib/data/cart"
import CartDropdown from "../cart-dropdown"

interface CartButtonProps {
  dictionary?: Record<string, any>
}

export default async function CartButton({ dictionary }: CartButtonProps) {
  const cart = await retrieveCart().catch(() => null)

  return <CartDropdown cart={cart} dictionary={dictionary} />
}
