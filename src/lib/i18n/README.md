# Internationalization (i18n) in The Medusa Kiki Shop

This directory contains the internationalization implementation for the The Medusa Kiki Shop based on Medusa.js.

## Structure

- **config.ts**: Configuration for i18n, defining supported locales and default locale
- **get-dictionary.ts**: Server-side utility to load dictionary files
- **use-dictionary.ts**: Client-side hook to access translations
- **dictionaries/**: JSON files containing translations for each supported language

## Usage

### In Server Components

```tsx
import { getDictionary } from "@lib/i18n/get-dictionary"
import { Locale } from "@lib/i18n/config"

// In a Server Component that receives locale from params
export default async function MyServerComponent({ 
  params 
}: { 
  params: { locale: Locale } 
}) {
  // Get dictionary for the current locale
  const dictionary = await getDictionary(params.locale)
  
  return (
    <div>
      <h1>{dictionary.general.title}</h1>
      <p>{dictionary.general.description}</p>
    </div>
  )
}
```

### In Client Components

```tsx
"use client"

import { useTranslation } from "@lib/context/translation-context"

export default function MyClientComponent() {
  // Access translations through the useTranslation hook
  const { translate } = useTranslation()
  
  return (
    <div>
      <h1>{translate("general", "title")}</h1>
      <button>{translate("general", "addToCart")}</button>
    </div>
  )
}
```

### Adding New Languages

1. Create a new JSON file in the `dictionaries` directory (e.g., `es.json` for Spanish)
2. Add the locale to the `locales` array in `config.ts`
3. Update the `getLanguageName` function in the `LanguageSelect` component to display the new language name

## URL Structure

The app uses a nested URL structure to handle both regions and locales:

```
/{countryCode}/{locale}/...
```

For example:
- `/us/en/` - US region with English language
- `/ca/fr/` - Canada region with French language

The middleware.ts file handles redirecting users to the appropriate URL based on:
1. The country code from their current URL or IP address
2. Their browser's preferred language settings
