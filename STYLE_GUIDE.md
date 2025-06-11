# Next X Level (NXL) Style Guide

A comprehensive design system for the luxury e-commerce brand Next X Level, featuring sophisticated typography, premium color palettes, and elegant interactions.

## Table of Contents

- [Brand Identity](#brand-identity)
- [Color Palette](#color-palette)
- [Typography](#typography)
- [Layout & Spacing](#layout--spacing)
- [Components](#components)
- [Animations & Effects](#animations--effects)
- [Accessibility](#accessibility)
- [Implementation Guidelines](#implementation-guidelines)

---

## Brand Identity

**Brand Name**: Next X Level (NXL)  
**Brand Personality**: Luxury, Premium, Sophisticated, Athletic Excellence  
**Design Philosophy**: Modern luxury with athletic performance undertones

### Logo Usage
```css
.logo {
  font-family: var(--font-display);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.logo .highlight {
  color: var(--color-nxl-gold);
}
```

---

## Color Palette

### Primary Brand Colors

| Color Name | Hex Code | CSS Variable | Usage |
|------------|----------|--------------|-------|
| **NXL Black** | `#0A0A0A` | `--color-nxl-black` | Primary backgrounds, text |
| **NXL Gold** | `#D4B660` | `--color-nxl-gold` | Primary accent, CTAs, highlights |
| **NXL Navy** | `#1E2A3A` | `--color-nxl-navy` | Secondary backgrounds, containers |
| **NXL Green** | `#1A2B20` | `--color-nxl-green` | Subtle accents, nature elements |
| **NXL Ivory** | `#F8F6F1` | `--color-nxl-ivory` | Light text, subtle backgrounds |
| **NXL White** | `#FFFFFF` | `--color-nxl-white` | Pure white elements |

### Color Variants

| Variant | CSS Variable | Usage |
|---------|--------------|-------|
| **Gold Light** | `--color-nxl-gold-light` | Hover states, lighter accents |
| **Gold Dark** | `--color-nxl-gold-dark` | Active states, pressed buttons |
| **Gold Muted** | `--color-nxl-gold-muted` | Subtle backgrounds, overlays |
| **Ivory Muted** | `--color-nxl-ivory-muted` | Soft backgrounds |
| **Black Soft** | `--color-nxl-black-soft` | Semi-transparent overlays |

### Status Colors

| Purpose | Color | CSS Variable |
|---------|-------|--------------|
| **Success** | `#10B981` | `--color-success` |
| **Warning** | `#F59E0B` | `--color-warning` |
| **Error** | `#EF4444` | `--color-error` |
| **Info** | `#3B82F6` | `--color-info` |

### Legacy Colors (Alternative Palette)

| Color Name | Hex Code | Usage Context |
|------------|----------|---------------|
| **Slate Gray** | `#A8A8A8` | Alternative neutral |
| **Charcoal** | `#212121` | Alternative dark |
| **Vibrant Blue** | `#1DAAF1` | Alternative accent |
| **Sunshine** | `#FFD600` | Alternative bright accent |

---

## Typography

### Font Families

| Purpose | Font Family | CSS Variable | Fallback |
|---------|-------------|--------------|----------|
| **Display** | Cinzel | `--font-display` | Trajan Pro, serif |
| **Headings** | Playfair Display | `--font-serif` | Georgia, serif |
| **Body Text** | Libre Baskerville | `--font-body` | Georgia, serif |
| **Buttons** | Cormorant Garamond | `--font-button` | serif |
| **UI Elements** | Inter | `--font-sans` | system fonts |

### Font Weights

| Weight | Value | CSS Variable |
|--------|-------|--------------|
| Light | 300 | `--font-weight-light` |
| Normal | 400 | `--font-weight-normal` |
| Medium | 500 | `--font-weight-medium` |
| Semibold | 600 | `--font-weight-semibold` |
| Bold | 700 | `--font-weight-bold` |

### Typography Scale

| Class | Font Size | Line Height | Usage |
|-------|-----------|-------------|-------|
| `.text-xsmall-regular` | 10px | 16px | Micro text, legal |
| `.text-small-regular` | 12px | 20px | Captions, metadata |
| `.text-base-regular` | 14px | 24px | Body text |
| `.text-large-regular` | 16px | 24px | Emphasized body |
| `.text-xl-regular` | 24px | 36px | Section headers |
| `.text-2xl-regular` | 30px | 48px | Page headers |
| `.text-3xl-regular` | 32px | 44px | Hero headers |

### Typography Utilities

```css
/* Brand-specific typography classes */
.nxl-display {
  font-family: var(--font-display);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-nxl-gold);
}

.nxl-heading {
  font-family: var(--font-serif);
  color: var(--color-nxl-ivory);
}

.nxl-body {
  font-family: var(--font-body);
  color: var(--color-nxl-ivory);
  opacity: 0.9;
}

.nxl-button {
  font-family: var(--font-button);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
```

---

## Layout & Spacing

### Container System

```css
.content-container {
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  padding: 0 1.5rem;
}
```

### Spacing Scale

| Size | Value | CSS Variable | Usage |
|------|-------|--------------|-------|
| **XS** | 4px | `--space-xs` | Fine details |
| **SM** | 8px | `--space-sm` | Small gaps |
| **MD** | 16px | `--space-md` | Standard spacing |
| **LG** | 24px | `--space-lg` | Section spacing |
| **XL** | 32px | `--space-xl` | Large sections |
| **2XL** | 48px | `--space-2xl` | Component separation |
| **3XL** | 64px | `--space-3xl` | Major sections |
| **4XL** | 96px | `--space-4xl` | Hero sections |

### Breakpoints

| Size | Width | CSS Variable |
|------|-------|--------------|
| **2XSmall** | 320px | Mobile (portrait) |
| **XSmall** | 512px | Mobile (landscape) |
| **Small** | 1024px | Tablet |
| **Medium** | 1280px | Desktop |
| **Large** | 1440px | Large desktop |
| **XLarge** | 1680px | Extra large |
| **2XLarge** | 1920px | Ultra wide |

### Border Radius

| Size | Value | Usage |
|------|-------|-------|
| **Soft** | 2px | Subtle rounding |
| **Base** | 4px | Standard elements |
| **Rounded** | 8px | Cards, buttons |
| **Large** | 16px | Major containers |
| **Circle** | 9999px | Circular elements |

---

## Components

### Buttons

#### Primary Button
```css
.nxl-btn-primary {
  @apply px-6 py-3 bg-nxl-gold text-nxl-black border border-nxl-gold 
         font-button uppercase tracking-wider hover:bg-nxl-gold-light 
         transition-all duration-300 shimmer text-base;
}
```

#### Secondary Button
```css
.nxl-btn-secondary {
  @apply px-6 py-3 bg-transparent text-nxl-gold border border-nxl-gold 
         font-button uppercase tracking-wider hover:bg-nxl-gold-muted 
         transition-all duration-300 shimmer text-base;
}
```

#### Dark Button
```css
.nxl-btn-dark {
  @apply px-6 py-3 bg-nxl-black text-nxl-ivory border border-nxl-black 
         font-button uppercase tracking-wider hover:bg-nxl-navy 
         transition-all duration-300 shimmer text-base;
}
```

### Form Elements

#### Input Fields
```css
.nxl-input {
  @apply bg-nxl-black border border-nxl-gold border-opacity-30 
         text-nxl-ivory p-3 font-body focus-gold
         placeholder:text-nxl-ivory placeholder:opacity-50 
         placeholder:font-body;
}
```

#### Focus States
```css
.focus-gold {
  @apply focus:outline-none focus:ring-2 focus:ring-nxl-gold 
         focus:ring-opacity-50 focus:border-nxl-gold;
}
```

### Cards

```css
.nxl-card {
  @apply bg-nxl-black border border-nxl-gold border-opacity-20 p-6 
         transition-all duration-300 hover:border-opacity-40;
}
```

### Navigation

#### Link Hover Effects
```css
.nav-link {
  position: relative;
  transition: all 300ms ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-nxl-gold);
  transition: width 300ms ease;
}

.nav-link:hover::after {
  width: 100%;
}
```

---

## Animations & Effects

### Keyframe Animations

| Animation | Duration | Easing | Usage |
|-----------|----------|--------|-------|
| `fade-in-right` | 300ms | cubic-bezier(0.5, 0, 0.5, 1) | Element entrance |
| `fade-in-top` | 200ms | cubic-bezier(0.5, 0, 0.5, 1) | Dropdown appearance |
| `accordion-open` | 300ms | cubic-bezier(0.87, 0, 0.13, 1) | Content expansion |
| `slide-in` | 1200ms | cubic-bezier(.41,.73,.51,1.02) | Hero elements |
| `shimmer` | - | ease-out | Button hover effect |

### Transition System

| Speed | Duration | CSS Variable | Usage |
|-------|----------|--------------|-------|
| **Fast** | 150ms | `--transition-fast` | Quick interactions |
| **Base** | 300ms | `--transition-base` | Standard transitions |
| **Slow** | 500ms | `--transition-slow` | Complex animations |
| **Luxury** | 700ms | `--transition-luxury` | Premium feel |

### Hover Effects

#### Image Zoom
```css
.zoom-on-hover {
  @apply transition-transform duration-700 hover:scale-105;
}
```

#### Shimmer Effect
```css
.shimmer {
  position: relative;
  overflow: hidden;
}

.shimmer::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.05) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: rotate(30deg);
  transition: transform 0.5s ease-out;
  pointer-events: none;
}

.shimmer:hover::after {
  transform: rotate(30deg) translate(100%, 100%);
}
```

---

## Accessibility

### Focus Management

```css
.focus-visible:focus {
  @apply outline-none ring-2 ring-nxl-gold ring-offset-2 
         ring-offset-nxl-black;
}
```

### Skip Links

```css
.skip-link {
  @apply absolute left-4 top-4 z-tooltip bg-nxl-gold text-nxl-black 
         px-4 py-2 rounded-md transform -translate-y-16 
         focus:translate-y-0 transition-transform;
}
```

### High Contrast Support

```css
@media (prefers-contrast: high) {
  :root {
    --color-nxl-gold: #FFD700;
    --shadow-luxury: 0 25px 50px -12px rgba(255, 215, 0, 0.4);
  }
  
  .nxl-btn-primary {
    @apply border-2 border-nxl-gold;
  }
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --transition-fast: 0ms;
    --transition-base: 0ms;
    --transition-slow: 0ms;
    --transition-luxury: 0ms;
  }
  
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## Implementation Guidelines

### CSS Architecture

The style system follows a structured approach:

1. **Base Layer**: Variables, reset, typography
2. **Components Layer**: Reusable UI components
3. **Utilities Layer**: Helper classes and overrides
4. **Layout Layer**: Grid systems and containers

### File Structure

```
src/styles/
├── globals.css              # Main entry point
├── base/
│   ├── _variables.css       # CSS custom properties
│   ├── _theme.css          # Theme definitions
│   ├── _typography.css     # Typography rules
│   └── _reset.css          # CSS reset
├── components/
│   ├── _buttons.css        # Button components
│   ├── _forms.css          # Form elements
│   ├── _cards.css          # Card components
│   └── _ui.css             # UI elements
├── layouts/
│   ├── _containers.css     # Container systems
│   ├── _grid.css           # Grid layouts
│   └── _layout.css         # Layout utilities
└── utilities/
    └── _effects.css        # Effects and animations
```

### Best Practices

#### 1. Use CSS Variables
Always use CSS custom properties for consistent theming:
```css
/* Good */
color: var(--color-nxl-gold);

/* Avoid */
color: #D4B660;
```

#### 2. Component Classes
Use semantic, component-based class names:
```css
/* Good */
.nxl-btn-primary
.nxl-card-product
.nxl-nav-link

/* Avoid */
.gold-button
.big-text
.fancy-border
```

#### 3. Responsive Design
Mobile-first approach with Tailwind breakpoints:
```css
/* Mobile first */
.component {
  @apply text-sm;
}

/* Desktop enhancement */
@screen lg {
  .component {
    @apply text-lg;
  }
}
```

#### 4. Performance Considerations
- Use `transform` and `opacity` for animations
- Leverage `will-change` for complex animations
- Implement proper loading states
- Optimize font loading strategies

### Dark Mode Support

The system includes basic dark mode infrastructure:

```css
[data-theme="dark"] {
  --color-background: var(--color-nxl-black);
  --color-foreground: var(--color-nxl-ivory);
}

[data-theme="light"] {
  --color-background: var(--color-nxl-white);
  --color-foreground: var(--color-nxl-black);
}
```

---

## Custom Scrollbar Styling

```css
::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: var(--color-nxl-black);
  border-radius: var(--border-radius-sm);
}

::-webkit-scrollbar-thumb {
  background: var(--color-nxl-navy);
  border: 2px solid var(--color-nxl-gold);
  border-radius: var(--border-radius-lg);
  transition: background var(--transition-base);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-nxl-green);
}
```

---

## Z-Index Scale

| Element | Value | CSS Variable |
|---------|-------|--------------|
| Dropdown | 1000 | `--z-dropdown` |
| Sticky | 1020 | `--z-sticky` |
| Fixed | 1030 | `--z-fixed` |
| Modal Backdrop | 1040 | `--z-modal-backdrop` |
| Modal | 1050 | `--z-modal` |
| Popover | 1060 | `--z-popover` |
| Tooltip | 1070 | `--z-tooltip` |
| Toast | 1080 | `--z-toast` |

---

*This style guide serves as the definitive reference for implementing the Next X Level brand design system. For updates or clarifications, please consult the development team.*
