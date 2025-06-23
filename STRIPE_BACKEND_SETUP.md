# Stripe Backend Setup Guide

## Issue Identified
Your frontend is correctly configured, but your Medusa backend (`https://nxladmin.aiaa.dev`) only returns `pp_system_default` (Manual Payment) instead of Stripe payment providers.

## Required Backend Configuration

### Step 1: Install Stripe Plugin on Backend

Connect to your Medusa backend server and run:

```bash
# Navigate to your Medusa backend directory
cd /path/to/your/medusa-backend

# Install the Stripe payment plugin
npm install @medusajs/medusa-payment-stripe

# Or with yarn
yarn add @medusajs/medusa-payment-stripe
```

### Step 2: Update medusa-config.js

Add the Stripe plugin to your `medusa-config.js` file:

```javascript
const plugins = [
  // ... your existing plugins
  {
    resolve: "@medusajs/medusa-payment-stripe",
    options: {
      api_key: process.env.STRIPE_SECRET_KEY,
      webhook_secret: process.env.STRIPE_WEBHOOK_SECRET, // Optional
      automatic_payment_methods: true, // Enable modern payment methods
      payment_description: "NXL Store Payment",
    },
  },
]

module.exports = {
  // ... rest of your config
  plugins,
}
```

### Step 3: Add Environment Variables to Backend

Add these to your backend's `.env` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Make sure you also have
DATABASE_URL=your_database_url
REDIS_URL=your_redis_url
```

### Step 4: Run Database Migrations

After installing the plugin, run migrations to create the necessary tables:

```bash
# In your backend directory
npx medusa migrations run

# Start your backend
npm run start
```

### Step 5: Configure Payment Providers via Admin

1. **Access Medusa Admin** (usually at `https://nxladmin.aiaa.dev/app`)
2. **Go to Settings → Regions**
3. **Edit your region** (`reg_01JT941T3TDA36FHWDYNFVQRBE` - Canada region)
4. **Add Payment Providers**:
   - Enable `pp_stripe_stripe` (Credit Card)
   - Enable `pp_stripe-ideal_stripe` (iDeal) if needed
   - Enable `pp_stripe-bancontact_stripe` (Bancontact) if needed

### Step 6: Alternative - API Configuration

If you can't access the admin, use the Admin API:

```bash
# Get admin token first
curl -X POST https://nxladmin.aiaa.dev/admin/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-admin-email@example.com",
    "password": "your-admin-password"
  }'

# Add payment provider to region
curl -X POST https://nxladmin.aiaa.dev/admin/regions/reg_01JT941T3TDA36FHWDYNFVQRBE/payment-providers \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "provider_id": "pp_stripe_stripe"
  }'
```

## Expected Result

After configuration, your payment providers API should return:

```json
{
  "payment_providers": [
    {
      "id": "pp_stripe_stripe",
      "is_enabled": true
    },
    {
      "id": "pp_system_default", 
      "is_enabled": true
    }
  ]
}
```

## Verification Steps

1. **Restart your backend** after configuration
2. **Clear your browser cache** and refresh checkout
3. **Check the debug logs** - you should see Stripe providers
4. **The checkout should show** Credit Card payment option

## Troubleshooting

### If Stripe still doesn't appear:
1. Check backend logs for errors
2. Verify Stripe secret key is correct
3. Ensure migrations ran successfully
4. Check that payment providers are associated with the correct region

### Common Issues:
- **Wrong region**: Make sure you're configuring the region your cart uses
- **Plugin not installed**: Ensure the Stripe plugin is properly installed
- **Environment variables**: Double-check your Stripe keys
- **Database not migrated**: Run migrations after installing the plugin

## Quick Test

You can test if Stripe is configured by calling the API directly:

```bash
curl "https://nxladmin.aiaa.dev/store/payment-providers?region_id=reg_01JT941T3TDA36FHWDYNFVQRBE" \
  -H "x-publishable-api-key: pk_7464c54198d041d62c91f7747dce4b188953961ba333b2b416a3bb1d0c515a94"
```

This should return Stripe payment providers once configured. 