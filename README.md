<p align="center">
  <img src="/public/nxl-gold-logo.png" alt="Next X Level Logo" width="200" />
</p>

<h1 align="center">
  Next X Level Premium Storefront
</h1>

<p align="center">
  <strong>Premium Canadian Apparel • Luxury Materials • Modern Performance • Versatile Style</strong>
</p>

<p align="center">
A luxury e-commerce experience that merges athletic performance with refined elegance, built with cutting-edge web technologies and optimized for mobile-first commerce.
</p>

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
  <img src="https://img.shields.io/badge/Mobile-Optimized-gold.svg" alt="Mobile Optimized" />
  <img src="https://img.shields.io/badge/Accessibility-WCAG%202.1-blue.svg" alt="WCAG 2.1 Compliant" />
</p>

---

## 🎯 **Brand Vision**

Next X Level is a **premium Canadian apparel brand** that seamlessly blends luxury materials, modern performance, and versatile style. Our mission is to deliver high-quality garments that look just as at home around a fire in a mountain chalet as they do at a 5 à 7 cocktail event, on the golf course, at the tennis court, or out on the town.

### **Our Promise**
*"Take your look—and your lifestyle—to the Next Level."*

We bridge the gap between everyday functionality and refined elegance by sourcing textiles used by top luxury labels (Hugo Boss, Under Armour, Louis Vuitton) and offering them at accessible price points.

---

## 🏗️ **Technical Foundation**

Built with modern web technologies for optimal performance and user experience:

- **[Next.js 15](https://nextjs.org/)** - App Router with React Server Components
- **[Medusa V2](https://medusajs.com/)** - Headless commerce backend
- **[Tailwind CSS](https://tailwindcss.com/)** - Mobile-first styling framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[React 19 RC](https://react.dev/)** - Latest React features

---

## ✨ **Key Features**

### **🛍️ Premium E-commerce Experience**
- **Mobile-First Design** - Optimized for touch interactions and mobile commerce
- **Luxury Product Galleries** - High-performance image optimization with Next.js Image
- **Advanced Product Discovery** - Enhanced search and filtering capabilities
- **Seamless Cart Experience** - Optimized for mobile checkout flows
- **One-Click Checkout** - Streamlined purchase process
- **Account Management** - Customer dashboard with order tracking
- **Wishlist & Favorites** - Save products for later

### **📱 Mobile Optimization Excellence**
- **Bottom Navigation** - Native app-like mobile navigation
- **Touch-Optimized Interactions** - 44px minimum touch targets
- **Safe Area Support** - iPhone notch and home indicator compatibility
- **Performance** - Optimized images, lazy loading, and prefetching
- **Gesture Support** - Swipe navigation and pull-to-refresh
- **Haptic Feedback** - Enhanced mobile interactions

### **🌍 Internationalization & Accessibility**
- **Multi-language Support** - English and French with easy expansion
- **Region-Specific Pricing** - Dynamic currency and shipping
- **WCAG 2.1 Compliance** - Full accessibility support
- **Screen Reader Optimized** - Semantic HTML and ARIA labels
- **Keyboard Navigation** - Complete keyboard accessibility
- **High Contrast Mode** - Support for visual accessibility preferences

### **🎨 Luxury Brand Experience**
- **Premium Design System** - Consistent luxury aesthetics
- **Custom Typography** - Cinzel, Playfair Display, Libre Baskerville
- **Sophisticated Animations** - Subtle micro-interactions
- **Gold Accent System** - Consistent luxury color palette
- **Dark Theme** - Premium dark mode experience

---

## 🎨 **Design System**

### **Color Palette**
Our sophisticated color system reflects luxury and athletic performance:

```css
/* Primary Brand Colors */
--color-nxl-black: #0A0A0A;     /* Primary backgrounds */
--color-nxl-gold: #D4B660;      /* Primary accent, CTAs */
--color-nxl-navy: #1E2A3A;      /* Secondary backgrounds */
--color-nxl-green: #1A2B20;     /* Subtle accents */
--color-nxl-ivory: #F8F6F1;     /* Light text, backgrounds */
--color-nxl-white: #FFFFFF;     /* Pure white elements */
```

### **Typography Scale**
Premium typography hierarchy designed for readability and luxury appeal:

- **Display**: Cinzel - Brand name and hero headings
- **Headings**: Playfair Display - Section headers and subheadings  
- **Body**: Libre Baskerville - Readable body text
- **UI**: Inter - Interface elements and navigation
- **Buttons**: Cormorant Garamond - Call-to-action elements

### **Mobile-First Approach**
All components are designed mobile-first with progressive enhancement:

```css
/* Mobile-first responsive design */
.mobile-touch-target {
  min-height: 44px;
  min-width: 44px;
}

/* Safe area support for modern devices */
.safe-area-bottom { 
  padding-bottom: env(safe-area-inset-bottom); 
}
```

---

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ and yarn/npm
- Medusa backend instance
- Environment variables configured

### **Installation**

1. **Clone and Setup**
```bash
git clone https://github.com/your-org/nxl-store-front-2.0.git
cd nxl-store-front-2.0
yarn install
```

2. **Environment Configuration**
```bash
mv .env.template .env.local
```

Configure your environment variables:
```env
# Medusa Backend
MEDUSA_BACKEND_URL=https://your-medusa-backend.com
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=your_publishable_key

# Region & Locale
NEXT_PUBLIC_DEFAULT_REGION=us
NEXT_PUBLIC_DEFAULT_LOCALE=en

# Payment Providers
NEXT_PUBLIC_STRIPE_KEY=your_stripe_publishable_key

# Revalidation
REVALIDATE_SECRET=your_secret_key
```

3. **Development Server**
```bash
yarn dev
```

Your luxury storefront is now running at **http://localhost:8000**! 🎉

---

## 🌐 **Internationalization**

### **Supported Regions & Languages**

| Region | Language | URL Structure | Currency |
|--------|----------|---------------|----------|
| 🇨🇦 Canada | English | `/ca/en/` | CAD |
| 🇨🇦 Canada | Français | `/ca/fr/` | CAD |
| 🇺🇸 United States | English | `/us/en/` | USD |

### **URL Architecture**
```
/{countryCode}/{locale}/{path}
```

Examples:
- `/ca/en/` - Canadian English homepage
- `/ca/fr/products/polo-premium` - French product page
- `/us/en/store` - US English store

### **Adding New Languages**

1. **Create Dictionary**
```bash
cp src/lib/i18n/dictionaries/en.json src/lib/i18n/dictionaries/es.json
```

2. **Update Configuration**
```typescript
// src/lib/i18n/config.ts
export const i18nConfig = {
  defaultLocale: 'en',
  locales: ['en', 'fr', 'es'], // Add new locale
} as const;
```

3. **Translate Content**
Update the new dictionary with translations following the established structure.

---

## 📱 **Mobile-First Architecture**

### **Performance Optimizations**

- **Image Optimization**: Next.js Image with WebP/AVIF support
- **Code Splitting**: Automatic route-based splitting
- **Prefetching**: Intelligent link prefetching
- **Caching**: Optimized API caching strategies
- **Bundle Analysis**: Built-in bundle analyzer

### **Mobile UX Enhancements**

- **Bottom Navigation**: Native app-like navigation
- **Touch Gestures**: Swipe and tap optimizations
- **Loading States**: Skeleton screens and progressive loading
- **Error Boundaries**: Graceful error handling
- **Offline Support**: Service worker implementation

### **Accessibility Features**

- **Screen Reader Support**: Complete ARIA implementation
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Logical focus flow
- **Color Contrast**: WCAG AA compliant colors
- **Motion Preferences**: Respects `prefers-reduced-motion`

---

## 🛠️ **Development Guidelines**

### **Component Architecture**

```
src/modules/
├── common/           # Shared components
├── layout/           # Header, footer, navigation
├── products/         # Product-related components
├── cart/            # Shopping cart functionality
├── checkout/        # Checkout process
├── account/         # User account management
└── home/            # Homepage sections
```

### **Styling Conventions**

```typescript
// Use mobile-first responsive classes
<button className="mobile-touch-target nxl-btn-primary">
  Add to Cart
</button>

// Apply luxury design tokens
<div className="nxl-card shadow-luxury">
  <h3 className="nxl-heading">Premium Product</h3>
</div>
```

### **Performance Best Practices**

- Use `next/image` for all images
- Implement proper loading states
- Optimize bundle size with dynamic imports
- Use React Server Components when possible
- Implement proper error boundaries

---

## 💳 **Payment Integration**

### **Supported Payment Methods**

- **Stripe** - Credit cards, digital wallets
- **PayPal** - PayPal accounts and guest checkout
- **Apple Pay** - iOS Safari integration
- **Google Pay** - Android Chrome integration

### **Setup Instructions**

1. **Stripe Configuration**
```env
NEXT_PUBLIC_STRIPE_KEY=pk_test_...
```

2. **Medusa Backend Setup**
Configure payment providers in your Medusa instance following the [official documentation](https://docs.medusajs.com/resources/commerce-modules/payment).

---

## 🚀 **Deployment**

### **Vercel Deployment** (Recommended)

1. **Connect Repository**
   - Import project to Vercel
   - Configure environment variables

2. **Build Settings**
```bash
# Build Command
yarn build

# Install Command  
yarn install

# Output Directory
.next
```

3. **Environment Variables**
Configure all production environment variables in Vercel dashboard.

### **Custom Deployment**

```bash
# Production Build
yarn build

# Start Production Server
yarn start
```

---

## 📊 **Analytics & Monitoring**

### **Performance Monitoring**
- **Core Web Vitals** tracking
- **Real User Monitoring** (RUM)
- **Error tracking** with detailed stack traces
- **Performance budgets** enforcement

### **E-commerce Analytics**
- **Conversion tracking**
- **Product performance** metrics
- **User journey** analysis
- **A/B testing** framework

---

## 🤝 **Contributing**

We welcome contributions that enhance the luxury shopping experience!

### **Development Setup**
1. Fork the repository
2. Create a feature branch
3. Follow our coding standards
4. Test on mobile devices
5. Submit a pull request

### **Code Standards**
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for formatting
- **Mobile-first** CSS approach
- **Accessibility** compliance

---

## 📖 **Documentation**

- [Internationalization Guide](./INTERNATIONALIZATION_GUIDE.md)
- [Style Guide](./STYLE_GUIDE.md)
- [Component Library](./docs/components.md)
- [API Documentation](./docs/api.md)

---

## 🆘 **Support**

### **Community**
- [Discord](https://discord.gg/xpCwq3Kfn8) - Real-time community support
- [GitHub Issues](https://github.com/your-org/nxl-store-front-2.0/issues) - Bug reports and feature requests
- [Discussions](https://github.com/your-org/nxl-store-front-2.0/discussions) - Community conversations

### **Resources**
- [Medusa Documentation](https://docs.medusajs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>Next X Level</strong><br/>
  <em>Take your look—and your lifestyle—to the Next Level.</em><br/>
  <br/>
  <sub>Built with ❤️ in Canada 🇨🇦</sub>
</p> 