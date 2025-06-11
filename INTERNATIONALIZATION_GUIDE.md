# Internationalization (i18n) Guide for Next X Level Store

This document provides a comprehensive guide to the internationalization implementation in the Next X Level e-commerce store, built with Next.js and Medusa.js.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Dictionary-Based Translations](#dictionary-based-translations)
4. [Tolgee Integration](#tolgee-integration)
5. [URL Structure & Routing](#url-structure--routing)
6. [Usage Examples](#usage-examples)
7. [Adding New Languages](#adding-new-languages)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

## Overview

The Next X Level store implements a comprehensive internationalization system that supports:

- **Multiple languages**: Currently English (en) and French (fr)
- **Regional support**: Country-specific routing and region detection
- **Static content translation**: Dictionary-based translations for UI text
- **Dynamic content translation**: Tolgee-powered product data translations
- **Automatic locale detection**: Based on browser preferences and geo-location
- **SEO-friendly URLs**: Structured as `/{countryCode}/{locale}/...`

### Supported Locales

| Language | Code | Status |
|----------|------|--------|
| English  | `en` | ✅ Default |
| French   | `fr` | ✅ Active |

## Architecture

The i18n system consists of several key components:

```
src/lib/i18n/
├── config.ts                    # i18n configuration
├── get-dictionary.ts           # Server-side dictionary loading
├── use-dictionary.ts           # Client-side dictionary hook
├── dictionaries/
│   ├── en.json                 # English translations
│   ├── fr.json                 # French translations
├── README.md                   # Basic usage guide
└── TOLGEE_INTEGRATION.md       # Tolgee setup guide

src/lib/context/
└── translation-context.tsx     # React context for translations

src/lib/util/
└── translations.ts             # Tolgee translation utilities

src/middleware.ts               # Routing and locale detection
```

## Dictionary-Based Translations

Dictionary-based translations handle static content like UI labels, navigation items, and marketing copy.

### Configuration

```typescript
// src/lib/i18n/config.ts
export const i18nConfig = {
  defaultLocale: 'en',
  locales: ['en', 'fr'],
} as const;

export type Locale = (typeof i18nConfig)['locales'][number];
```

### Dictionary Structure

The dictionary files are organized by sections for better maintainability:

```json
{
  "general": {
    "title": "Next X Level",
    "addToCart": "Add to Cart",
    "viewDetails": "View Details"
  },
  "navigation": {
    "home": "Home",
    "shop": "Shop",
    "about": "About"
  },
  "product": {
    "price": "Price",
    "quantity": "Quantity",
    "description": "Description"
  }
}
```

### Server-Side Usage

```typescript
import { getDictionary } from "@lib/i18n/get-dictionary"
import { Locale } from "@lib/i18n/config"

// In a Server Component
export default async function MyServerComponent({ 
  params 
}: { 
  params: { locale: Locale } 
}) {
  const dictionary = await getDictionary(params.locale)
  
  return (
    <div>
      <h1>{dictionary.general.title}</h1>
      <p>{dictionary.general.description}</p>
    </div>
  )
}
```

### Client-Side Usage

```typescript
"use client"
import { useTranslation } from "@lib/context/translation-context"

export default function MyClientComponent() {
  const { translate } = useTranslation()
  
  return (
    <div>
      <h1>{translate("general", "title")}</h1>
      <button>{translate("general", "addToCart")}</button>
    </div>
  )
}
```

### Translation Context

The `TranslationProvider` wraps your app to provide translation functionality:

```typescript
// In your layout component
<TranslationProvider>
  {children}
</TranslationProvider>
```

The context provides:
- `dictionary`: Complete dictionary object
- `translate(section, key, fallback?)`: Helper function for translations

## Tolgee Integration

Tolgee handles dynamic content translations, particularly for product data from your Medusa backend.

### What Tolgee Translates

| Content Type | Properties | Example |
|--------------|------------|---------|
| Products | `title`, `subtitle`, `description` | "Premium Polo Shirt" → "Polo Premium" |
| Product Variants | `title` | "Size Large" → "Taille Grande" |
| Product Options | `title` | "Color" → "Couleur" |
| Option Values | `value` | "Blue" → "Bleu" |
| Collections | `title`, `description` | "Summer Collection" → "Collection Été" |
| Categories | `name`, `description` | "Polo Shirts" → "Polos" |

### Backend Setup

1. **Install the Tolgee Plugin**:
```bash
npm install medusa-plugin-tolgee
```

2. **Configure in `medusa-config.js`**:
```javascript
const plugins = [
  {
    resolve: `medusa-plugin-tolgee`,
    options: {
      baseURL: process.env.TOLGEE_API_URL,
      apiKey: process.env.TOLGEE_API_KEY,
      projectId: "your_tolgee_project_id",
      keys: {
        product: ["title", "subtitle", "description"],
        product_variant: ["title"],
        product_option: ["title"],
        product_option_value: ["value"],
        product_collection: ["title", "description"],
        product_category: ["name", "description"]
      }
    }
  }
];
```

3. **Environment Variables**:
```env
TOLGEE_API_URL=https://app.tolgee.io
TOLGEE_API_KEY=your_tolgee_api_key
```

### Frontend Integration

The translation utilities provide fallback mechanisms:

```typescript
import { 
  getTranslatedProduct, 
  getTranslatedCollection,
  StoreProductWithTranslations 
} from "@lib/util/translations";

// Get translated product
const translatedProduct = getTranslatedProduct(
  product as StoreProductWithTranslations, 
  'fr'
);

// Get translated collection
const translatedCollection = getTranslatedCollection(
  product.collection, 
  'fr'
);
```

### API Response Structure

When fetching products with translations:

```json
{
  "id": "prod_123",
  "title": "Premium Polo Shirt",
  "description": "High-quality cotton polo",
  "translations": {
    "fr": {
      "title": "Polo Premium",
      "description": "Polo en coton de haute qualité"
    }
  },
  "variants": [
    {
      "id": "variant_123",
      "title": "Large",
      "translations": {
        "fr": {
          "title": "Grande"
        }
      }
    }
  ]
}
```

## URL Structure & Routing

The app uses a nested URL structure to handle both regions and locales:

```
/{countryCode}/{locale}/...
```

### Examples

- `/us/en/` - US region with English
- `/ca/fr/` - Canada region with French
- `/ca/en/products/polo-shirt` - Canadian English product page
- `/ca/fr/products/polo-shirt` - Canadian French product page

### Middleware Logic

The `middleware.ts` file handles:

1. **Country Detection**: Based on IP geolocation or URL
2. **Locale Detection**: From browser preferences or URL
3. **Automatic Redirects**: To proper URL structure
4. **Region Validation**: Against Medusa backend regions

### Locale Detection Priority

1. **URL Parameter**: If locale is in the URL path
2. **Browser Preference**: From `Accept-Language` header
3. **Default Fallback**: English (`en`)

```typescript
// Middleware locale detection
function getLocaleFromRequest(request: NextRequest): string {
  // 1. Check URL path
  const urlLocale = request.nextUrl.pathname.split("/")[2]
  if (i18nConfig.locales.includes(urlLocale)) {
    return urlLocale
  }
  
  // 2. Check Accept-Language header
  const acceptLanguage = request.headers.get("accept-language")
  const matchedLocale = parseAcceptLanguage(acceptLanguage)
  if (matchedLocale) return matchedLocale
  
  // 3. Default fallback
  return DEFAULT_LOCALE
}
```

## Usage Examples

### Product Display Component

```typescript
import { getTranslatedProduct } from "@lib/util/translations"
import { getDictionary } from "@lib/i18n/get-dictionary"

const ProductCard = async ({ 
  product, 
  locale 
}: { 
  product: StoreProduct, 
  locale: string 
}) => {
  const dictionary = await getDictionary(locale)
  const translatedProduct = getTranslatedProduct(product, locale)

  return (
    <div className="product-card">
      <h3>{translatedProduct.title}</h3>
      <p>{translatedProduct.description}</p>
      <button>
        {dictionary.general.addToCart}
      </button>
    </div>
  )
}
```

### Navigation Component

```typescript
"use client"
import { useTranslation } from "@lib/context/translation-context"

export default function Navigation() {
  const { translate } = useTranslation()
  
  return (
    <nav>
      <a href="/">{translate("navigation", "home")}</a>
      <a href="/shop">{translate("navigation", "shop")}</a>
      <a href="/about">{translate("navigation", "about")}</a>
    </nav>
  )
}
```

### Language Selector

```typescript
"use client"
import { useRouter, usePathname } from "next/navigation"
import { useTranslation } from "@lib/context/translation-context"

export default function LanguageSelector() {
  const { translate } = useTranslation()
  const router = useRouter()
  const pathname = usePathname()
  
  const switchLanguage = (newLocale: string) => {
    const segments = pathname.split("/")
    segments[2] = newLocale // Replace locale segment
    router.push(segments.join("/"))
  }
  
  return (
    <select onChange={(e) => switchLanguage(e.target.value)}>
      <option value="en">
        {translate("navigation", "languages", "english")}
      </option>
      <option value="fr">
        {translate("navigation", "languages", "french")}
      </option>
    </select>
  )
}
```

## Adding New Languages

### 1. Update Configuration

```typescript
// src/lib/i18n/config.ts
export const i18nConfig = {
  defaultLocale: 'en',
  locales: ['en', 'fr', 'es'], // Add new locale
} as const;
```

### 2. Create Dictionary File

```bash
# Create new dictionary file
cp src/lib/i18n/dictionaries/en.json src/lib/i18n/dictionaries/es.json
```

### 3. Translate Content

Update the new dictionary file with translations:

```json
{
  "general": {
    "title": "Next X Level",
    "addToCart": "Añadir al Carrito",
    "viewDetails": "Ver Detalles"
  }
}
```

### 4. Update Tolgee Configuration

Add the new locale to your Tolgee project and update the backend plugin configuration.

### 5. Update Language Selector

```typescript
// Add new language option
<option value="es">Español</option>
```

## Best Practices

### 1. Translation Keys

- Use descriptive, hierarchical keys
- Group related translations by section
- Avoid deeply nested structures

```json
// Good
{
  "product": {
    "addToCart": "Add to Cart",
    "viewDetails": "View Details"
  }
}

// Avoid
{
  "product": {
    "buttons": {
      "actions": {
        "add": "Add to Cart"
      }
    }
  }
}
```

### 2. Fallback Strategy

- Always provide fallback text
- Use the translation key as the ultimate fallback
- Log missing translations in development

```typescript
const translate = (section: string, key: string, fallback?: string) => {
  const translation = dictionary[section]?.[key]
  if (!translation) {
    console.warn(`Missing translation: ${section}.${key}`)
    return fallback || key
  }
  return translation
}
```

### 3. Performance Optimization

- Lazy load dictionaries
- Cache translations at build time
- Use static generation for translated pages

### 4. Content Management

- Keep translations in sync across languages
- Use translation memory tools
- Implement translation validation

### 5. SEO Considerations

- Use `hreflang` tags for language variants
- Implement proper canonical URLs
- Ensure consistent URL structure

```html
<link rel="alternate" hreflang="en" href="https://nextxlevel.com/ca/en/products/polo" />
<link rel="alternate" hreflang="fr" href="https://nextxlevel.com/ca/fr/products/polo" />
```

## Troubleshooting

### Common Issues

#### 1. Translations Not Appearing

**Symptoms**: UI shows translation keys instead of translated text

**Solutions**:
- Verify dictionary files exist and are properly formatted
- Check if `TranslationProvider` wraps your components
- Ensure translation keys match dictionary structure
- Verify locale parameter is passed correctly

#### 2. Tolgee Product Translations Missing

**Symptoms**: Product data shows in original language only

**Solutions**:
- Confirm Tolgee plugin is installed and configured
- Check API keys and project ID
- Verify translations exist in Tolgee dashboard
- Ensure locale parameter is passed to product fetch functions

#### 3. Middleware Redirect Loops

**Symptoms**: Infinite redirects between URLs

**Solutions**:
- Check region configuration in Medusa backend
- Verify `MEDUSA_BACKEND_URL` environment variable
- Ensure cache ID cookie is being set properly
- Check if static assets are being processed by middleware

#### 4. Missing Dictionary Files

**Symptoms**: Fallback to English for unsupported locales

**Solutions**:
```typescript
// Check if dictionary file exists
const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  try {
    return (await import(`./dictionaries/${locale}.json`)).default;
  } catch (error) {
    console.error(`Dictionary not found for locale: ${locale}`);
    return (await import('./dictionaries/en.json')).default;
  }
};
```

### Debug Mode

Enable debug logging for translation issues:

```typescript
// In development environment
if (process.env.NODE_ENV === 'development') {
  console.log('Current locale:', locale)
  console.log('Translation key:', `${section}.${key}`)
  console.log('Available translations:', Object.keys(dictionary))
}
```

### Validation Tools

Create a validation script to check translation completeness:

```typescript
// scripts/validate-translations.js
const fs = require('fs')
const path = require('path')

const englishDict = require('../src/lib/i18n/dictionaries/en.json')
const frenchDict = require('../src/lib/i18n/dictionaries/fr.json')

function validateTranslations(baseDict, compareDict, locale) {
  const missing = []
  
  function checkKeys(base, compare, keyPath = '') {
    for (const key in base) {
      const currentPath = keyPath ? `${keyPath}.${key}` : key
      
      if (typeof base[key] === 'object') {
        checkKeys(base[key], compare[key] || {}, currentPath)
      } else if (!compare[key]) {
        missing.push(currentPath)
      }
    }
  }
  
  checkKeys(baseDict, compareDict)
  
  if (missing.length > 0) {
    console.log(`Missing translations in ${locale}:`)
    missing.forEach(key => console.log(`  - ${key}`))
  } else {
    console.log(`All translations complete for ${locale}`)
  }
}

validateTranslations(englishDict, frenchDict, 'fr')
```

### Performance Monitoring

Monitor translation performance:

```typescript
// Track translation loading times
const startTime = performance.now()
const dictionary = await getDictionary(locale)
const loadTime = performance.now() - startTime

if (loadTime > 100) {
  console.warn(`Slow dictionary loading: ${loadTime}ms for ${locale}`)
}
```

## Conclusion

The Next X Level store's internationalization system provides a robust foundation for multi-language, multi-region e-commerce. By combining dictionary-based translations for static content with Tolgee's dynamic product translations, the system ensures consistent localization across all aspects of the user experience.

Key advantages of this approach:

- **Scalable**: Easy to add new languages and regions
- **Performant**: Optimized loading and caching strategies
- **Maintainable**: Clear separation of concerns and organized code structure
- **SEO-friendly**: Proper URL structure and language detection
- **Developer-friendly**: Comprehensive tooling and debugging capabilities

For additional support or questions, refer to the specific documentation files in the `src/lib/i18n/` directory or consult the [Tolgee documentation](https://docs.tolgee.io/) for advanced features.
