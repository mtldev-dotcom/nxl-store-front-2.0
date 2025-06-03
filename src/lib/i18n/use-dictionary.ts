'use client';

import { useEffect, useState } from 'react';
import { Locale } from './config';

// Add type declaration for window.__DICTIONARY__
declare global {
  interface Window {
    __DICTIONARY__?: Dictionary;
  }
}

// Type for dictionary structure
export interface Dictionary {
  [key: string]: {
    [key: string]: string;
  };
}

/**
 * Client-side hook to access the dictionary for translations
 * Retrieves the dictionary from the window.__DICTIONARY__ object
 * which is set by the script in the layout component
 */
export function useDictionary(): Dictionary {
  const [dictionary, setDictionary] = useState<Dictionary>({});

  useEffect(() => {
    // Access the dictionary from the window object
    if (window.__DICTIONARY__) {
      setDictionary(window.__DICTIONARY__);
    } else {
      console.warn('Dictionary not found in window object');
    }
  }, []);

  return dictionary;
}

/**
 * Helper function to get a specific translation value from the dictionary
 * @param dictionary The dictionary object
 * @param section The section in the dictionary (e.g., 'general', 'product')
 * @param key The key within the section (e.g., 'title', 'description')
 * @param fallback Optional fallback text if translation is not found
 */
export function getTranslation(
  dictionary: Dictionary,
  section: string,
  key: string,
  fallback?: string
): string {
  try {
    const translation = dictionary[section]?.[key];
    if (translation) return translation;
    
    // Return fallback or key if translation not found
    return fallback || key;
  } catch (error) {
    console.error(`Translation error for ${section}.${key}:`, error);
    return fallback || key;
  }
}
