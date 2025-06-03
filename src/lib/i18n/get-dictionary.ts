import { Locale } from './config';

interface Dictionary {
  [key: string]: {
    [key: string]: string;
  };
}

// This is a utility function to get the dictionary for the specified locale
export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  try {
    return (await import(`./dictionaries/${locale}.json`)).default;
  } catch (error) {
    console.error(`Error loading dictionary for locale ${locale}:`, error);
    
    // Fallback to English if the requested dictionary cannot be loaded
    return (await import('./dictionaries/en.json')).default;
  }
};
