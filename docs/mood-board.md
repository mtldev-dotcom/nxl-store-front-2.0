# Next X Level Website Mood-Board Guide

A comprehensive roadmap to achieve a **strong, bold, modern, and high-end** design for the Next X Level website. Use these guidelines to inform colors, typography, imagery, layouts, and UI components.

---

## 1. Brand Essence & Key Attributes

* **Bold & Confident**
  Elements should command attention—strong headlines, solid blocks of color, and decisive typography.

* **Modern & Clean**
  Generous white (or neutral) space, minimalist layouts, and uncluttered interfaces. High-quality photography and carefully chosen accents should stand out.

* **High-End & Luxurious**
  Convey premium quality through subtle textures, refined fonts, and a restrained use of color—similar to luxury watchmakers or boutique fashion houses.

* **Versatile & Aspirational**
  The site must feel equally at home in a mountain chalet as in a penthouse skyline, reflecting the “chalet → boardroom → soirée” lifestyle.

---

## 2. Primary Color Palette

Below are four core color swatches. Use them consistently for buttons, accents, calls-to-action, and section backgrounds.

| Purpose            | Name            | HEX       | Sample Swatch                                                                         |
| ------------------ | --------------- | --------- | ------------------------------------------------------------------------------------- |
| **Neutral Base**   | Slate Gray      | `#A8A8A8` | <span style="display:inline-block;width:50px;height:20px;background:#A8A8A8;"></span> |
| **Neutral Accent** | Charcoal Black  | `#212121` | <span style="display:inline-block;width:50px;height:20px;background:#212121;"></span> |
| **Highlight 1**    | Vibrant Blue    | `#1DAAF1` | <span style="display:inline-block;width:50px;height:20px;background:#1DAAF1;"></span> |
| **Highlight 2**    | Sunshine Yellow | `#FFD600` | <span style="display:inline-block;width:50px;height:20px;background:#FFD600;"></span> |

> **Usage Notes**
>
> * **Backgrounds**: Primarily use very pale gray (`#F9F9F9`) or white for page backgrounds. Use `Slate Gray (#A8A8A8)` sparingly for footer/nav backgrounds or subtle dividers.
> * **Text & Body Copy**: Use `Charcoal Black (#212121)` for primary headings and paragraph text. Use `Slate Gray (#A8A8A8)` for secondary text (captions, fine print).
> * **Buttons & CTAs**: Use `Vibrant Blue (#1DAAF1)` for primary buttons (e.g., “Shop Now,” “Get Started”), and `Sunshine Yellow (#FFD600)` for hover states or secondary emphasis on links.
> * **Hover States**:
>
>   * Primary Button normal: `#1DAAF1` → hover: lighten to around `#4ECFFF`.
>   * Link normal: charcoal text on white → hover: underline or text color changes to `#1DAAF1`.

---

## 3. Secondary & Accent Colors (Seasonal / Campaign)

For capsule collections or seasonal promotions, introduce one or two accent tones that complement the core palette.

| Name               | HEX       | Sample Swatch                                                                         |
| ------------------ | --------- | ------------------------------------------------------------------------------------- |
| **Electric Green** | `#4ED96C` | <span style="display:inline-block;width:50px;height:20px;background:#4ED96C;"></span> |
| **Magenta Pink**   | `#E52E77` | <span style="display:inline-block;width:50px;height:20px;background:#E52E77;"></span> |
| **Deep Navy**      | `#1A2D4E` | <span style="display:inline-block;width:50px;height:20px;background:#1A2D4E;"></span> |
| **Taupe Brown**    | `#8E7C6D` | <span style="display:inline-block;width:50px;height:20px;background:#8E7C6D;"></span> |

> **When to Use Seasonal Accents**
>
> 1. **Limited-Edition Banners**
>
>    * Use `Magenta Pink (#E52E77)` on a charcoal background for “Spring ’25 Capsule” hero sections.
> 2. **Highlight Icons/Badges**
>
>    * Use `Electric Green (#4ED96C)` sparingly for “New,” “Limited Stock,” or “Offer Ends Soon” badges.
> 3. **Background Textures**
>
>    * On a `Deep Navy (#1A2D4E)` background, apply a tone-on-tone pattern (e.g., diagonal pinstripes) for “Press Feature” sections.

---

## 4. Typography & Hierarchy

### 4.1. Headline Typeface

* **Font**: **Playfair Display** (or another high-contrast serif)
* **Usage**: Main hero titles, section headers
* **Weights & Styles**:

  * **Bold/Black**:

    * Size: 48px – 72px (desktop), uppercase, letter-spacing 0.05em
  * **Regular / Italic**:

    * Size: 32px – 36px for sub-headers, can be italic or regular.

```css
.hero-title {
  font-family: 'Playfair Display', serif;
  font-weight: 700;        /* Bold */
  font-size: 64px;
  line-height: 1.2;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.section-header {
  font-family: 'Playfair Display', serif;
  font-weight: 400;        /* Regular */
  font-size: 36px;
  line-height: 1.3;
}
```

### 4.2. Body / Paragraph Typeface

* **Font**: **Montserrat** (or “Helvetica Neue” / “Proxima Nova”)
* **Usage**: Paragraph copy, product descriptions, navigation labels
* **Weights & Styles**:

  * **Regular (400)** for body copy:

    * Size: 16px, line-height: 1.6, color: `#212121`
  * **Medium (500)** for nav links / button text:

    * Size: 14px, text-transform: uppercase, letter-spacing: 0.025em
  * **Light (300)** for disclaimers and footers:

    * Size: 12px, color: `#7A7A7A`, line-height: 1.5

```css
body {
  font-family: 'Montserrat', sans-serif;
  font-weight: 400;         /* Regular */
  font-size: 16px;
  color: #212121;
  line-height: 1.6;
}

.nav-link {
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;         /* Medium */
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  color: #212121;
}

.footer-text {
  font-family: 'Montserrat', sans-serif;
  font-weight: 300;         /* Light */
  font-size: 12px;
  color: #7A7A7A;
  line-height: 1.5;
}
```

### 4.3. Accent / Label Typeface

* **Font**: **Montserrat Alternates** (rounded corners, friendly feel)
* **Usage**: Small capsule labels (e.g., “New Arrival,” “Limited Stock”), price tags
* **Weight**: **Bold (600)** or **Semi-Bold (500)**
* **Size**: 12px – 14px, letter-spacing 0.05em, uppercase

```css
.badge {
  font-family: 'Montserrat Alternates', sans-serif;
  font-weight: 600;         /* Bold */
  font-size: 12px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background-color: #FFD600; /* Sunshine Yellow */
  color: #212121;            /* Charcoal Black */
  padding: 4px 8px;
  border-radius: 4px;
}
```

---

## 5. Imagery & Photography

### 5.1. Style & Mood

* **High-Contrast Lighting**
  Softboxes or diffused natural light. Shadows should be gentle but defined, emphasizing texture (fabric nap, stitching).

* **Monochromatic Backgrounds**

  * **Studio Hero Shots**: Light gray (`#F0F0F0`) or white for main hero/product imagery.
  * **Lifestyle Shoots**: Neutral environments (alpine wooden deck, rooftop patio at dusk, minimalist loft interior).

* **Candid Movement**
  For hero carousels, show models:

  1. **Swinging a Golf Club** in a crisp polo.
  2. **Leaning by a Fireplace** in a gray hoodie (chalet vibe).
  3. **Walking through City Streets** in joggers and crewneck.

* **Close-Ups**

  * Fabric swatches (zoom on knit texture).
  * Embroidery detail: “X” in shield, shot at 2× actual print size.
  * Hardware shots: zippers, drawcord tips, snapback buckle.

### 5.2. Sample Mood Images

Below are example references to inspire tone and composition.

1. **Alpine Lifestyle**
   ![Alpine Chesterfield Fireside](https://images.unsplash.com/photo-1512323401426-6f1e6f55c79e?crop=entropy\&cs=tinysrgb\&fit=max\&fm=jpg\&w=400)
   *Soft warm lighting, neutral wood tones, model in a heather-gray hoodie, relaxed posture.*

2. **Urban Evening Out**
   ![City Rooftop at Dusk](https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?crop=entropy\&cs=tinysrgb\&fit=max\&fm=jpg\&w=400)
   *Skyline silhouette, hints of neon light, model in a crisp white polo and black joggers, confident stride.*

3. **Golf Course at Sunrise**
   ![Golf Course Sunrise](https://images.unsplash.com/photo-1576360530718-3c858d14a4c4?crop=entropy\&cs=tinysrgb\&fit=max\&fm=jpg\&w=400)
   *Dewy green fairways, pastel sky, model lining up a putt in a bold blue-logo polo.*

> **Tip**: Create a private folder in your design drive and pin 10–12 reference photos that emulate lighting, composition, and postures. Over time, you’ll see recurring themes—use those as inspiration.

---

## 6. UI / Layout Components

### 6.1. Buttons & CTAs

#### Primary Button

* **Background**: `#1DAAF1` (Vibrant Blue)
* **Text**: `#FFFFFF`, Montserrat Bold, 16px, uppercase, letter-spacing 0.05em
* **Padding**: 12px × 32px
* **Border Radius**: 4px
* **Hover State**: Lighten to `#4ECFFF`
* **Shadow**: `0 4px 8px rgba(29,170,241,0.25)`

#### Secondary Button / Outline

* **Border**: `2px solid #212121` (Charcoal Black)
* **Text**: `#212121`, Montserrat Medium, 16px, uppercase
* **Background**: transparent
* **Hover State**: Fill `#FFD600` (Sunshine Yellow), text turns `#212121`
* **Border Radius**: 4px

```css
.btn-primary {
  background-color: #1DAAF1;
  color: #fff;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 12px 32px;
  border: none;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(29, 170, 241, 0.25);
  transition: background-color 0.3s ease;
}
.btn-primary:hover {
  background-color: #4ECFFF;
}

.btn-secondary {
  background-color: transparent;
  color: #212121;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 10px 30px;
  border: 2px solid #212121;
  border-radius: 4px;
  transition: background-color 0.3s ease, color 0.3s ease;
}
.btn-secondary:hover {
  background-color: #FFD600;
  color: #212121;
}
```

### 6.2. Cards (Product Thumbnails, Blog Previews)

* **Container**:

  * `background-color: #FFFFFF` (white)
  * `border-radius: 8px`
  * `overflow: hidden`
  * `box-shadow: 0 2px 8px rgba(0,0,0,0.05)`

* **Image**:

  * Aspect ratio 4:5 or 1:1
  * `object-fit: cover`
  * Full width on mobile, fixed height on desktop

* **Title**:

  * Playfair Display, 20px, `#212121`
  * `margin: 16px 0 8px 0`

* **Description**:

  * Montserrat Regular, 14px, `#7A7A7A`, `line-height: 1.5`

* **Price**:

  * Montserrat Bold, 16px, `#212121`, `margin-top: 8px`

* **Button**:

  * `.btn-primary` (small variant): padding `8px × 24px`

```html
<div class="product-card">
  <img src="..." alt="Item Name" class="product-image" />
  <h3 class="product-title">Premium Joggers</h3>
  <p class="product-desc">
    High-performance joggers with four-way stretch. Perfect for office or off-duty style.
  </p>
  <div class="product-footer">
    <span class="product-price">$79</span>
    <button class="btn-primary btn-sm">Add to Cart</button>
  </div>
</div>
```

### 6.3. Navigation (Header)

* **Layout**: Fixed at top on scroll (sticky)

* **Background**:

  * Transparent when over hero
  * Transitions to `#FFFFFF` + `box-shadow: 0 2px 4px rgba(0,0,0,0.1)` on scroll

* **Logo**:

  * Left-aligned—use monochrome version (`#212121` on light bg, `#FFFFFF` on dark bg)

* **Links**:

  * Montserrat Medium, 14px, uppercase, `color: #212121` on light bg; `#FFFFFF` on dark bg
  * Spacing: `margin-right: 32px`
  * Active Link Underline: `border-bottom: 2px solid #1DAAF1`
  * Hover: `color: #4ECFFF`

* **Call-to-Action (Top-Right)**: “Shop” or “Account” button using `.btn-secondary` styling or a small icon (shopping bag/cart).

```css
header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}
header.transparent {
  background-color: transparent;
  box-shadow: none;
}
header.solid {
  background-color: #FFFFFF;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav-links {
  display: flex;
  align-items: center;
}
.nav-link {
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: 14px;
  text-transform: uppercase;
  color: #212121;
  margin-right: 32px;
  padding: 16px 0;
  transition: color 0.2s;
  text-decoration: none;
}
.nav-link:hover {
  color: #4ECFFF;
}
.nav-link.active {
  border-bottom: 2px solid #1DAAF1;
}
```

### 6.4. Footer

* **Background**: `Slate Gray (#A8A8A8)` or a dark gradient (charcoal → black)

* **Layout**:

  * Four columns on desktop (“About Us,” “Shop,” “Support,” “Follow Us”)
  * Collapses to stacked or accordion on mobile

* **Text**: Montserrat Light, 12px, white (`#FFFFFF`) on dark bg or charcoal (`#212121`) on light gray

* **Links**: Montserrat Regular, 12px, white on dark bg (underline hover `#FFD600`)

* **Social Icons**: Monochrome (white icons on dark bg), hover fill changes to accent blue (`#1DAAF1`)

* **Copyright**:

  * Montserrat Light, 10px, `#EEEEEE` (on dark bg)
  * “© 2025 Next X Level. All rights reserved.”

```html
<footer class="site-footer">
  <div class="footer-container">
    <div class="footer-col">
      <h4 class="footer-heading">About Us</h4>
      <ul>
        <li><a href="/our-story" class="footer-link">Our Story</a></li>
        <li><a href="/sustainability" class="footer-link">Sustainability</a></li>
        <li><a href="/careers" class="footer-link">Careers</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4 class="footer-heading">Shop</h4>
      <ul>
        <li><a href="/hoodies" class="footer-link">Hoodies</a></li>
        <li><a href="/joggers" class="footer-link">Joggers</a></li>
        <li><a href="/caps" class="footer-link">Caps</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4 class="footer-heading">Support</h4>
      <ul>
        <li><a href="/faq" class="footer-link">FAQ</a></li>
        <li><a href="/contact" class="footer-link">Contact Us</a></li>
        <li><a href="/shipping-returns" class="footer-link">Shipping &amp; Returns</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4 class="footer-heading">Follow Us</h4>
      <div class="social-icons">
        <!-- Social icon SVGs or IMG tags here -->
        <a href="#" class="social-link"><img src="icon-instagram-white.svg" alt="Instagram" /></a>
        <a href="#" class="social-link"><img src="icon-facebook-white.svg" alt="Facebook" /></a>
        <a href="#" class="social-link"><img src="icon-tiktok-white.svg" alt="TikTok" /></a>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <p class="copyright">© 2025 Next X Level. All rights reserved.</p>
  </div>
</footer>
```

---

## 7. Layout & Spacing Guidelines

1. **Grid System**

   * Desktop: 12-column grid (max-width: 1200px)
   * Tablet (768–1024px): 8-column grid
   * Mobile (<768px): Single-column stacked layout

2. **Gutters & Margins**

   * **Desktop**:

     * Column gutters: 32px
     * Page margin (left/right): 64px
   * **Tablet**:

     * Column gutters: 24px
     * Page margin (left/right): 32px
   * **Mobile**:

     * Padding/Margin (left/right): 16px

3. **Section Padding (Top & Bottom)**

   * **Desktop**: 120px per major section (hero, featured, etc.)
   * **Tablet**: 80px per section
   * **Mobile**: 60px per section

4. **Component Spacing**

   * Headline → Sub-Headline: 24px margin bottom
   * Sub-Headline → Paragraph: 16px margin bottom
   * Image → Caption: 12px spacing
   * CTA → Next Section: 80px margin bottom (desktop)

5. **White Space**

   * Surround images and cards with at least 24px of padding inside containers.
   * Between stacked sections, consider background-color shifts or diagonal dividers to break monotony.

---

## 8. Iconography & Graphic Accents

* **Icon Set**: Monoline/outline style (e.g., Feather Icons, Heroicons). Use charcoal or white icons at 24px – 32px.
* **Accent Lines**: Thin (#CCCCCC) divider lines (1px) between footer columns or inside product cards.
* **Subtle Patterns**: Light diagonal pinstripes on gray backgrounds (e.g., 1px white line, 1px gap) at 45° for texture behind hero CTAs.
* **Hover Animations**: Smooth transitions (200–300ms ease-in-out) for color changes and slight upward motion (translateY(-4px)) on cards and buttons.

---

## 9. Sample Page Wireframe (Desktop View)

```
--------------------------------------------------------------------------------
| Header (transparent over hero; logo left; nav center; “Shop” CTA right)      |
|                                                                              |
| Hero Section (Full-screen background image of model in gray hoodie at chalet)|
|   • H1 (Playfair Display 64px, #FFFFFF): “Elevate Your Style—Elevate Your Game.” |
|   • Subheading (Montserrat 20px, #FFFFFF): “Premium Canadian Apparel for Every Moment.” |
|   • CTA Buttons: [Shop Collection] [Learn More]                              |
|                                                                              |
| Featured Categories (white background)                                       |
|   • Grid (3-column):                                                          |
|     – Card: Image (polo), Title (38px), Desc (14px), Button “Shop Now”       |
|     – Card: Image (hoodie), Title, Desc, Button                              |
|     – Card: Image (joggers), Title, Desc, Button                             |
|                                                                              |
| About Section (off-white background)                                         |
|   • H2 (Playfair Display 36px, #212121): “Our Story”                          |
|   • Two-column: Text (Montserrat 16px, #212121) + Lifestyle Image             |
|                                                                              |
| New Arrivals (white background)                                              |
|   • H2 “New Arrivals” (Playfair Display 36px)                                 |
|   • Horizontal scroll or 4-column product grid (Image + Title + Price + Button) |
|                                                                              |
| Instagram Feed Preview (light gray bg)                                       |
|   • H3 “#NXLSquad” (Montserrat 20px, #212121), 4 engaged lifestyle images (grid) |
|                                                                              |
| Blog Teasers (white background)                                              |
|   • H2 “Style & Inspiration” (Playfair Display 36px)                          |
|   • 3 columns: Each card: Thumbnail + Title (Montserrat 20px) + Excerpt (14px) |
|                                                                              |
| Newsletter Signup (dark charcoal bg)                                         |
|   • H2 “Join The Next Level” (Playfair Display 36px, #FFFFFF)                 |
|   • Input (rounded 4px, placeholder “Your email address”, bg: #F5F5F5) + Submit (btn-primary) |
|                                                                              |
| Footer (slate gray background)                                               |
|   • 4-column links, social icons, copyright                                   |
--------------------------------------------------------------------------------
```

---

## 10. Downloadable Reference Snippets

1. **Color Variables (SCSS)**

   ```scss
   $color-slate-gray:   #A8A8A8;
   $color-charcoal:     #212121;
   $color-vibrant-blue: #1DAAF1;
   $color-sunshine:     #FFD600;
   $color-electric:     #4ED96C;
   $color-magenta:      #E52E77;
   $color-deep-navy:    #1A2D4E;
   $color-taupe:        #8E7C6D;
   ```

2. **Typography Import (Google Fonts)**

   ```html
   <!-- In <head> -->
   <link
     href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:wght@400;700&display=swap"
     rel="stylesheet">
   <link
     href="https://fonts.googleapis.com/css2?family=Montserrat+Alternates:wght@400;500;600&display=swap"
     rel="stylesheet">
   ```

3. **Example Button Component (React + Styled-Components)**

   ```jsx
   import styled from 'styled-components';

   export const Button = styled.button`
     font-family: 'Montserrat', sans-serif;
     font-weight: 700;
     text-transform: uppercase;
     letter-spacing: 0.05em;
     padding: ${(props) => (props.small ? '8px 24px' : '12px 32px')};
     border: none;
     border-radius: 4px;
     cursor: pointer;
     transition: background-color 0.3s ease, box-shadow 0.3s ease;

     background-color: ${({ variant }) =>
       variant === 'secondary' ? 'transparent' : '#1DAAF1'};
     color: ${({ variant }) =>
       variant === 'secondary' ? '#212121' : '#FFFFFF'};
     box-shadow: ${({ variant }) =>
       variant === 'secondary' ? 'none' : '0 4px 8px rgba(29,170,241,0.25)'};
     border: ${({ variant }) =>
       variant === 'secondary' ? '2px solid #212121' : 'none'};

     &:hover {
       background-color: ${({ variant }) =>
         variant === 'secondary' ? '#FFD600' : '#4ECFFF'};
       color: ${({ variant }) => (variant === 'secondary' ? '#212121' : '#FFFFFF')};
     }
   `;
   ```

---

## Final Thoughts

1. **Stick to Core Palette**
   Use neutrals (slate gray, charcoal) for large backgrounds and text. Let vibrant accents (blue, yellow) direct user attention.

2. **Embrace White Space**
   A bold, high-end design feels airy—avoid clutter. Let images and typography breathe.

3. **Consistent Typography**
   The pairing of Playfair Display + Montserrat (and Montserrat Alternates for small labels) will feel instantly upscale and coherent.

4. **Imagery Selection**
   Always choose high-resolution, well-lit photographs that reflect your brand’s lifestyle—avoid generic stock images.

5. **Micro-Interactions**
   Small hover animations (button color shifts, slight raise on product cards) give the site a polished, modern feel.

With this mood-board guide, your Next X Level website will communicate a strong, bold, and high-end identity—inviting visitors to experience premium Canadian apparel designed for every part of their day.
