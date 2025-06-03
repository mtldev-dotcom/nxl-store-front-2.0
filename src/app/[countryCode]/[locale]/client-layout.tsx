"use client"

import { ReactNode } from "react"
import { TranslationProvider } from "@lib/context/translation-context"

/**
 * Client-side layout wrapper that provides translation context to client components
 * This component should be used within the server components to wrap client components
 * that need access to translations.
 */
export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <TranslationProvider>
      {children}
    </TranslationProvider>
  )
}
