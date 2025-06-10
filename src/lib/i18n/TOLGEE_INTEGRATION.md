# Tolgee Integration Guide for Product Data Translation

This guide explains how to integrate Tolgee with your Medusa storefront to provide dynamic product data translations alongside your existing dictionary-based translations.

## Overview

Your current setup already includes:
- ✅ English/French locale support via JSON dictionaries
- ✅ URL structure with country/locale (`/ca/fr`, `/ca/en`)
- ✅ Middleware handling locale detection and routing
- ✅ Dictionary system for static content translations

This integration adds:
- 🆕 Tolgee-powered product data translation (titles, descriptions, variants, options)
- 🆕 Automatic fallback to original content if translations are missing
- 🆕 Support for collections, categories, and product variants translations

## Backend Setup (Medusa)

### 1. Install the Tolgee Plugin

```bash
npm install medusa-plugin-tolgee
```

### 2. Configure the Plugin

Add to your `medusa-config.js`:

```javascript
import { TolgeeModuleConfig } from 'medusa-plugin-tolgee'

const plugins = [
  {
    resolve: `medusa-plugin-tolgee`,
    options: {
      baseURL: process.env.TOLGEE_API_URL,
      apiKey: process.env.TOLGEE_API_KEY,
      projectId: "your_tolgee_project_id",
      keys: { // Optional - specify which properties to translate
        product: ["title", "subtitle", "description"],
        product_variant: ["title"],
        product_option: ["title"],
        product_option_value: ["value"],
        product_collection: ["title", "description"],
        product_category: ["name", "description"]
      },
      tags: { // Optional - add custom tags
        product: ["ecommerce", "product"]
      }
    } satisfies TolgeeModuleConfig,
  },
];
```

### 3. Environment Variables

Set in your Medusa backend `.env`:

```env
TOLGEE_API_URL=https://app.tolgee.io
TOLGEE_API_KEY=your_tolgee_api_key
```

### 4. Sync Your Data

1. Restart your Medusa server
2. Go to any product edit page in your admin panel
3. Scroll to the "Translations" section
4. Click "Sync all" to create translations for all products
5. Go to Tolgee dashboard to add your translations

## Frontend Integration

### 1. Updated Product Fetching

The following functions now support locale-based translation fetching:

```typescript
// Fetch products with translations
const products = await listProducts({
  countryCode: 'ca',
  locale: 'fr', // This will fetch French translations
  queryParams: { limit: 12 }
});

// Retrieve single product with translations
const product = await retrieveProduct(
  'product-handle',
  'ca',
  'fr'
);
```

### 2. Translation Utilities

Use the provided utilities to get translated content:

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

## API Response Structure

When you fetch products with translations, the response includes a `translations` object:

```json
{
  "id": "prod_123",
  "title": "Original Product Title",
  "description": "Original description",
  "translations": {
    "fr": {
      "title": "Titre du Produit Traduit",
      "description": "Description traduite"
    },
    "en": {
      "title": "English Product Title",  
      "description": "English description"
    }
  },
  "variants": [
    {
      "id": "variant_123",
      "title": "Original Variant",
      "translations": {
        "fr": {
          "title": "Variante Traduite"
        }
      }
    }
  ]
}
```

## Component Usage Examples

### Product Info Component

```typescript
import { getTranslatedProduct, StoreProductWithTranslations } from "@lib/util/translations";

const ProductInfo = ({ product, locale }: { product: HttpTypes.StoreProduct, locale?: string }) => {
  const translatedProduct = locale 
    ? getTranslatedProduct(product as StoreProductWithTranslations, locale) 
    : product;

  return (
    <div>
      <h1>{translatedProduct.title}</h1>
      <p>{translatedProduct.description}</p>
    </div>
  );
};
```

### Product Listing Page

```typescript
// In your page component
const ProductsPage = async ({ params }: { params: { countryCode: string, locale: string } }) => {
  const { products } = await listProducts({
    countryCode: params.countryCode,
    locale: params.locale,
    queryParams: { limit: 12 }
  });

  return (
    <div>
      {products.map(product => (
        <ProductCard 
          key={product.id} 
          product={product} 
          locale={params.locale} 
        />
      ))}
    </div>
  );
};
```

## Supported Models

The integration supports translations for:

| Model | Properties | Status |
|-------|------------|---------|
| Products | `title`, `subtitle`, `description` | ✅ |
| Product Variants | `title` | ✅ |
| Product Options | `title` | ✅ |
| Product Option Values | `value` | ✅ |
| Product Collections | `title`, `description` | ✅ |
| Product Categories | `name`, `description` | ✅ |
| Product Types | `value` | ✅ |
| Product Tags | `value` | ✅ |
| Shipping Options | `name` | ✅ |

## Translation Workflow

1. **Content Creation**: Create products in your Medusa admin
2. **Sync**: Use the Tolgee plugin to sync product data to Tolgee
3. **Translate**: Add translations in the Tolgee dashboard
4. **Automatic Delivery**: Translations are automatically served via the API

## Advanced Features

### Custom Translation Keys

You can specify which properties to translate in the plugin configuration:

```javascript
keys: {
  product: ["title", "subtitle", "description", "custom_field"],
  product_variant: ["title", "custom_variant_field"]
}
```

### Fallback Behavior

The translation utilities automatically fall back to original content if:
- No translation exists for the requested locale
- The translation is empty
- There's an error fetching translations

### Shipping Options

For shipping options, use the special endpoint:

```typescript
const shippingOptions = await sdk.client.fetch(
  `/store/shipping-options/tolgee`,
  {
    method: "GET",
    query: { cart_id: cartId, country_code: countryCode },
  }
);
```

## Performance Considerations

1. **Caching**: Product translations are cached along with product data
2. **Field Selection**: Only fetch translation fields when needed
3. **Batch Operations**: Use the sync functionality to handle large product catalogs
4. **CDN**: Tolgee provides CDN-backed translation delivery

## Testing Your Integration

1. Create a test product in Medusa admin
2. Add translations in Tolgee dashboard
3. Visit your storefront URLs:
   - English: `https://your-domain.com/ca/en/products/test-product`
   - French: `https://your-domain.com/ca/fr/products/test-product`
4. Verify that content shows in the correct language

## Troubleshooting

### Common Issues

1. **Translations not appearing**: 
   - Check if translations exist in Tolgee dashboard
   - Verify locale parameter is being passed correctly
   - Check browser network tab for translation fields in API response

2. **API errors**:
   - Verify TOLGEE_API_KEY is set correctly
   - Check Tolgee project ID matches configuration
   - Ensure Tolgee API URL is accessible

3. **Missing fields**:
   - Verify field names in the `keys` configuration
   - Check if fields are marked as translatable in Tolgee

### Debug Mode

Enable debug logging in your Medusa backend:

```javascript
// In medusa-config.js
const plugins = [
  {
    resolve: `medusa-plugin-tolgee`,
    options: {
      // ... other options
      debug: true, // Enable debug logging
    }
  }
];
```

## Next Steps

1. **Set up your Tolgee project**: Create account at https://app.tolgee.io
2. **Install the backend plugin**: Follow the backend setup instructions
3. **Configure translations**: Add your product translations in Tolgee
4. **Test the integration**: Verify translations appear on your storefront

For more information, visit the [Tolgee documentation](https://docs.tolgee.io/) and [Medusa Tolgee plugin documentation](https://medusajs.com/integrations/medusa-plugin-tolgee/).
