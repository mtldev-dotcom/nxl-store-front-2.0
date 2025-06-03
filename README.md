<p align="center">
  <img src="/public/nxl-gold-logo.png" alt="Next X Level Logo" width="200" />
</p>

<h1 align="center">
  Next X Level Golf Apparel Store
</h1>

<p align="center">
A premium e-commerce experience for golf enthusiasts, built with modern web technologies and luxury design principles.</p>

<p align="center">
  <a href="https://github.com/medusajs/medusa/blob/master/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
  <a href="https://discord.gg/xpCwq3Kfn8">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289DA.svg" alt="Discord Chat" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=nextxlevel">
    <img src="https://img.shields.io/twitter/follow/nextxlevel.svg?label=Follow%20@nextxlevel" alt="Follow @nextxlevel" />
  </a>
</p>

# Overview

The Next X Level Golf Apparel Store is built with:

- [Next.js 15](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Typescript](https://www.typescriptlang.org/)
- [Medusa](https://medusajs.com/) (Commerce Backend)

## Features

- **Premium E-commerce Experience**:
  - Elegant Product Detail Pages
  - Luxury Product Collections
  - Seamless Cart Experience
  - Streamlined Checkout Process
  - User Account Management
  - Order Tracking
  - Responsive Luxury Design

- **Home Page Sections**:
  - Hero Banner with Brand Showcase
  - Featured Products Gallery
  - Brand Story Section
  - Product Categories (Polos, Hoodies, Joggers, Caps)
  - Lifestyle Benefits Highlights
  - Newsletter Subscription

- **Internationalization**:
  - Multi-language support (English and French)
  - Country-based region selection
  - Nested URL structure (`/{countryCode}/{locale}/...`)
  - Language and region selection in both navigation and footer
  - Server-side and client-side translation management

- **Advanced Technical Features**:
  - App Router Architecture
  - Next.js Fetching/Caching
  - Server Components
  - Server Actions
  - Streaming Content
  - Static Pre-Rendering
  - Custom Luxury UI Components

# Quickstart

### Setting up the environment variables

Navigate into your projects directory and get your environment variables ready:

```shell
cd next-x-level-front-store/
mv .env.template .env.local
```

### Install dependencies

Use Yarn to install all dependencies.

```shell
yarn
```

### Start developing

You are now ready to start up your project.

```shell
yarn dev
```

### Open the code and start customizing

Your site is now running at http://localhost:8000!

# Brand Design System

The Next X Level store features a custom luxury design system:

- **Color Palette**:
  - Black (`#0E0E0E`) - Primary background
  - Navy (`#1A2436`) - Secondary background and accents
  - Green (`#1C2B22`) - Tertiary accents
  - Gold (`#C6A94C`) - Primary brand accent
  - Ivory (`#F0ECE6`) - Primary text color

- **Typography**:
  - Display: Cinzel - Used for brand name and primary headings
  - Serif: Playfair Display - Used for subheadings
  - Body: Libre Baskerville - Used for body text
  - Button: Cormorant Garamond - Used for buttons and calls-to-action

- **UI Components**:
  - Custom button styles with subtle shimmer effects
  - Elegant card designs with gold accents
  - Luxury form elements with gold focus states
  - Premium image hover effects

# Internationalization

The Next X Level store comes with built-in support for multiple languages and regions:

- **Supported Languages**: 
  - English (en)
  - French (fr)

- **URL Structure**:
  - `/{countryCode}/{locale}/...`
  - Examples: 
    - `/ca/en/` (Canada region, English language)
    - `/ca/fr/` (Canada region, French language)
    - `/us/en/` (US region, English language)

- **How it works**:
  - The middleware automatically detects and redirects users based on their browser language and location
  - Users can manually switch languages using the language selector in the navigation or footer
  - Translations are managed through JSON dictionaries in `src/lib/i18n/dictionaries/`

- **Adding a new language**:
  1. Add a new dictionary file in `src/lib/i18n/dictionaries/`
  2. Add the locale code to the `locales` array in `src/lib/i18n/config.ts`
  3. Update the language selector component to include the new language

# Payment integrations

By default this store supports the following payment integrations:

- [Stripe](https://stripe.com/)

To enable the integrations you need to add the following to your `.env.local` file:

```shell
NEXT_PUBLIC_STRIPE_KEY=<your-stripe-public-key>
```

You'll also need to setup the integrations in your Medusa server. See the [Medusa documentation](https://docs.medusajs.com) for more information on how to configure [Stripe](https://docs.medusajs.com/resources/commerce-modules/payment/payment-provider/stripe#main).

# Resources

## Learn more about Medusa

- [Website](https://www.medusajs.com/)
- [GitHub](https://github.com/medusajs)
- [Documentation](https://docs.medusajs.com/)

## Learn more about Next.js

- [Website](https://nextjs.org/)
- [GitHub](https://github.com/vercel/next.js)
- [Documentation](https://nextjs.org/docs)
