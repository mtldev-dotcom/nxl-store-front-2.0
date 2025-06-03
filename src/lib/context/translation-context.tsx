"use client"

import { 
  createContext, 
  useContext, 
  ReactNode,
} from "react"
import { useDictionary, Dictionary, getTranslation } from "@lib/i18n/use-dictionary"

/**
 * Context for accessing translations
 */
interface TranslationContextType {
  dictionary: Dictionary
  translate: (section: string, key: string, fallback?: string) => string
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

/**
 * Provider component for translations
 * Wraps your components to provide translation functionality
 */
export function TranslationProvider({ children }: { children: ReactNode }) {
  const dictionary = useDictionary()

  // Function to get translation by section and key
  const translate = (section: string, key: string, fallback?: string): string => {
    return getTranslation(dictionary, section, key, fallback)
  }

  const value = {
    dictionary,
    translate,
  }

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  )
}

/**
 * Hook to use translations in client components
 * @returns {Object} { dictionary, translate }
 * 
 * Example usage:
 * ```
 * const { translate } = useTranslation()
 * return <h1>{translate('general', 'title')}</h1>
 * ```
 */
export function useTranslation() {
  const context = useContext(TranslationContext)
  
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider")
  }
  
  return context
}
