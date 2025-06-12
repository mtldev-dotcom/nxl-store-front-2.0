"use client"

import { ReactNode } from "react"
import { TranslationProvider } from "@lib/context/translation-context"
import { CartProvider } from "@lib/context/cart-context"

/**
 * Client-side layout wrapper that provides translation and cart context to client components
 * This component should be used within the server components to wrap client components
 * that need access to translations and cart state.
 */
export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <TranslationProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </TranslationProvider>
  )
}
