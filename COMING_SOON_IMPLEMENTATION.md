# Coming Soon Page Implementation

## Overview

A luxury Coming Soon page for Next X Level featuring:
- **Real-time countdown timer** to June 25, 2025 at noon EST
- **Waitlist form** with name and email collection
- **Premium NXL branding** with gold/black/ivory color scheme
- **Mobile-responsive design** with touch-optimized interactions
- **Internationalization support** (English/French)

## Features

### 🎯 **Countdown Timer**
- Live countdown to launch date (June 25, 2025 12:00 PM EST)
- Responsive grid layout with Days/Hours/Minutes/Seconds
- Elegant card design with NXL luxury styling
- Auto-updates every second with smooth animations

### 📝 **Waitlist Form**
- Collects name and email with validation
- Success state with welcome message
- Error handling with user-friendly messages
- Form submission to `/api/waitlist` endpoint

### 🎨 **Enhanced Visual Design**
- **Standalone page** - No header, footer, or navigation menu
- **Rich imagery** - Hero background, product showcases, brand logo
- **Premium animations** - Floating product images with subtle rotations
- **Interactive elements** - Hover effects on value proposition cards
- **Luxury aesthetics** - Gold accents, gradient overlays, animated elements

### 🖼️ **Image Integration**
- **Hero background** (`/hero1.png`) for lifestyle appeal
- **Brand logo** (`/nxl-gold-logo.png`) for brand recognition
- **Product showcases** (polo, cap, hoodie) as floating elements
- **Value propositions** enhanced with product imagery backgrounds

### 🌐 **Internationalization**
- English and French language support
- Localized content via dictionary system
- Country-specific routing support

### 🏗️ **Standalone Architecture**
- **Independent layout** - Bypasses main site header/footer/navigation
- **Complete HTML document** - Includes `<html>` and `<body>` tags
- **Full-screen experience** - Immersive, distraction-free design
- **Route group isolation** - Uses `(standalone)` route group to avoid layout inheritance

## File Structure

```
src/
├── app/[countryCode]/[locale]/(standalone)/coming-soon/
│   └── page.tsx                    # Standalone Coming Soon page (no header/footer)
├── modules/coming-soon/
│   ├── components/
│   │   ├── countdown-timer/
│   │   │   └── index.tsx          # Countdown component
│   │   └── waitlist-form/
│   │       └── index.tsx          # Waitlist form component
│   └── templates/
│       └── index.tsx              # Enhanced template with imagery
├── app/api/waitlist/
│   └── route.ts                   # API endpoint for form submission
├── lib/i18n/dictionaries/
│   ├── en.json                    # English translations
│   └── fr.json                    # French translations
└── public/
    ├── hero1.png                  # Hero background image
    ├── nxl-gold-logo.png          # Brand logo
    ├── polo.png                   # Product showcase
    ├── cap.png                    # Product showcase
    ├── hoodie.png                 # Product showcase
    └── hoodie-brandstory.png      # Brand story image
```

## Usage

### Accessing the Page

Navigate to any of these URLs:
- `/en/ca/coming-soon` (English/Canada)
- `/fr/ca/coming-soon` (French/Canada)
- `/en/us/coming-soon` (English/US)

### 🚀 **Quick Enable (Recommended)**

**To enable Coming Soon mode for all visitors:**

1. **Add environment variable** to your `.env.local` file:
```bash
COMING_SOON_MODE=true
```

2. **Restart your development server:**
```bash
npm run dev
# or
yarn dev
```

**To disable Coming Soon mode:**
```bash
COMING_SOON_MODE=false
```
or remove the variable entirely.

### Advanced Redirect Options

To redirect your main site to the Coming Soon page, you can:

1. **Update main page route** to redirect:
```typescript
// In src/app/[countryCode]/[locale]/(main)/page.tsx
import { redirect } from 'next/navigation'

export default async function Home({ params }: { params: any }) {
  const { countryCode, locale } = await params
  redirect(`/${countryCode}/${locale}/coming-soon`)
}
```

2. **Use middleware redirect** (recommended):
```typescript
// In src/middleware.ts - add before existing middleware
if (pathname.endsWith('/')) {
  return NextResponse.redirect(new URL(`${pathname}coming-soon`, request.url))
}
```

3. **Environment-based toggle**:
```typescript
// Add to your page component
const isComingSoonMode = process.env.COMING_SOON_MODE === 'true'
if (isComingSoonMode) {
  return <ComingSoonTemplate ... />
}
```

## API Integration

### Waitlist Endpoint (`/api/waitlist`)

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com", 
  "locale": "en",
  "countryCode": "ca"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Successfully joined the waitlist!"
}
```

**Response (Error):**
```json
{
  "error": "Name and email are required"
}
```

### Backend Integration TODO

The current implementation logs submissions. To fully integrate:

1. **MedusaJS Storage:**
```typescript
// Add to route.ts
const response = await sdk.client.fetch(`/store/waitlist`, {
  method: "POST",
  body: JSON.stringify(waitlistEntry),
})
```

2. **Email Integration:**
```typescript
// Configure email service (SendGrid, Mailgun, etc.)
await emailService.send({
  to: data.email,
  subject: "Welcome to Next X Level!",
  html: generateWelcomeEmailHTML(data)
})
```

3. **Database Schema:**
```sql
CREATE TABLE waitlist (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  locale VARCHAR(10),
  country_code VARCHAR(5),
  subscribed_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'active'
);
```

## Customization

### Countdown Date

Change the launch date in:
```typescript
// src/modules/coming-soon/templates/index.tsx
const launchDate = new Date('2025-06-25T12:00:00') // Modify this
```

### Styling

The page uses the existing NXL design system:
- Colors: `nxl-gold`, `nxl-black`, `nxl-ivory`, `nxl-navy`
- Typography: `font-display`, `font-serif`, `font-body`
- Components: `nxl-btn-primary`, `nxl-input`, `nxl-card`

### Content

Update translations in:
- `src/lib/i18n/dictionaries/en.json` (English)
- `src/lib/i18n/dictionaries/fr.json` (French)

## Mobile Optimization

- **Touch-friendly** form inputs with 44px minimum touch targets
- **Responsive countdown** with smaller cards on mobile
- **Optimized animations** with reduced motion support
- **Mobile-first** responsive design approach

## Analytics & Tracking

Add tracking to form submission:
```typescript
// In waitlist-form component
if (typeof window !== 'undefined' && (window as any).gtag) {
  (window as any).gtag('event', 'waitlist_signup', {
    event_category: 'engagement',
    event_label: 'coming_soon_page',
  })
}
```

## Security Considerations

- **Input validation** on both client and server
- **Email format validation** with regex
- **Rate limiting** recommended for API endpoint
- **CSRF protection** via Next.js built-in features
- **SSL/HTTPS** required for production

## Performance

- **Server-side rendering** for SEO and initial load speed
- **Optimized animations** with CSS transforms
- **Minimal JavaScript** for countdown timer only
- **Lazy loading** for background elements

## SEO Configuration

- **noindex, nofollow** meta tags (temporary page)
- **Structured data** for countdown event
- **Open Graph** meta tags for social sharing
- **Canonical URLs** for proper indexing

## Deployment Checklist

- [ ] Set environment variables for email service
- [ ] Configure MedusaJS backend endpoints
- [ ] Test form submission and validation
- [ ] Verify countdown accuracy across timezones
- [ ] Test mobile responsiveness
- [ ] Validate accessibility compliance
- [ ] Set up analytics tracking
- [ ] Configure email templates
- [ ] Test internationalization
- [ ] Verify SSL certificate

## Support

For technical support or questions:
- **Documentation**: Review the codebase comments
- **Issues**: Check the implementation for TODOs
- **Customization**: Modify the design system variables

---

**Next X Level Coming Soon Page**  
*Luxury Streetwear. Elevated Performance.*  
Launch: June 25, 2025 at 12:00 PM EST 