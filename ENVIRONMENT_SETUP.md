# Environment Setup Guide

## Quick Start

1. **Create `.env.local` file** in the project root
2. **Copy the configuration below** and update with your values
3. **Restart your development server**

## Environment Variables

```bash
# === Coming Soon Mode ===
# Set to 'true' to enable coming soon page redirect for all visitors
# Set to 'false' or remove to disable and show normal site
COMING_SOON_MODE=false

# === Medusa Backend Configuration ===
# Your Medusa backend URL (required)
MEDUSA_BACKEND_URL=https://your-medusa-backend.com

# Medusa Publishable API Key (required)
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_your_publishable_key_here

# Default region for users (optional, defaults to 'us')
NEXT_PUBLIC_DEFAULT_REGION=ca

# === Stripe Payment Configuration ===
# Stripe Publishable Key (required for Stripe payments)
# Get this from your Stripe Dashboard -> Developers -> API Keys
NEXT_PUBLIC_STRIPE_KEY=pk_test_your_stripe_publishable_key_here

# NOTE: Your Medusa backend also needs Stripe configuration:
# - Install @medusajs/medusa-payment-stripe plugin
# - Add Stripe secret key to backend environment
# - Configure payment providers for your regions

# === Email Configuration (for waitlist notifications) ===
# Admin email for waitlist notifications
ADMIN_EMAIL=admin@nextxlevel.com

# SendGrid API Key (if using SendGrid for emails)
SENDGRID_API_KEY=your_sendgrid_api_key

# Mailgun Configuration (if using Mailgun for emails)
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_mailgun_domain

# === Analytics & Tracking ===
# Google Analytics Measurement ID
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# === Other Configuration ===
# Node environment
NODE_ENV=development

# Enable debug logging
DEBUG=false
```

## Stripe Payment Setup

### Frontend Configuration (This App)

1. **Get your Stripe Publishable Key**:
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/)
   - Navigate to **Developers** → **API Keys**
   - Copy the **Publishable key** (starts with `pk_test_` for test mode)

2. **Add to .env.local**:
   ```bash
   NEXT_PUBLIC_STRIPE_KEY=pk_test_your_actual_key_here
   ```

### Backend Configuration (Medusa)

**Your Medusa backend must also be configured for Stripe payments:**

1. **Install Stripe Plugin**:
   ```bash
   npm install @medusajs/medusa-payment-stripe
   ```

2. **Add to medusa-config.js**:
   ```javascript
   const plugins = [
     // ... other plugins
     {
       resolve: "@medusajs/medusa-payment-stripe",
       options: {
         api_key: process.env.STRIPE_SECRET_KEY,
         webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
       },
     },
   ]
   ```

3. **Backend Environment Variables**:
   ```bash
   # In your Medusa backend .env file
   STRIPE_SECRET_KEY=sk_test_your_secret_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```

4. **Configure Payment Providers**:
   - Use Medusa Admin or API to associate Stripe payment provider with your regions
   - Ensure the payment provider is enabled for the regions you're selling to

### Troubleshooting Payment Issues

If you don't see Stripe payment options at checkout:

1. **Check Browser Console** for debug messages (in development mode)
2. **Verify Frontend Environment**:
   - `NEXT_PUBLIC_STRIPE_KEY` is set correctly
   - Key starts with `pk_test_` or `pk_live_`
3. **Verify Backend Configuration**:
   - Medusa backend is running and accessible
   - Stripe plugin is installed and configured
   - Payment providers are associated with your regions
4. **Check Network Tab** for API calls to `/store/payment-providers`

## Coming Soon Mode

### Enable Coming Soon
```bash
COMING_SOON_MODE=true
```

### Disable Coming Soon
```bash
COMING_SOON_MODE=false
```

## Required for Production

- `MEDUSA_BACKEND_URL`
- `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_STRIPE_KEY` (for Stripe payments)
- Email service configuration (for waitlist)
- Backend Stripe configuration

## Security Notes

- Never commit `.env.local` to version control
- Use different keys for development and production
- Ensure SSL/HTTPS in production
- Use test keys (`pk_test_`, `sk_test_`) in development

## Troubleshooting

### Stripe Payments Not Appearing
- Check browser console for debug messages
- Verify `NEXT_PUBLIC_STRIPE_KEY` is set
- Ensure Medusa backend has Stripe configured
- Check that payment providers are associated with your regions

### Coming Soon Not Working
- Check that `COMING_SOON_MODE=true` is set
- Restart the development server
- Clear browser cache
- Check middleware logs in terminal

### Email Not Sending
- Verify email service API keys
- Check `ADMIN_EMAIL` is set
- Review waitlist API logs

### Backend Connection Issues
- Verify `MEDUSA_BACKEND_URL` is correct
- Check `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`
- Ensure backend is running and accessible

## Development Debug Mode

In development mode, the checkout page will show a debug panel with:
- Cart information
- Available payment methods
- Configuration status
- Helpful error messages

This helps identify configuration issues quickly during development. 