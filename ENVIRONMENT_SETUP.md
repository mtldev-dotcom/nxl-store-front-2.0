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
- Email service configuration (for waitlist)

## Security Notes

- Never commit `.env.local` to version control
- Use different keys for development and production
- Ensure SSL/HTTPS in production

## Troubleshooting

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