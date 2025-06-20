const path = require("path")

module.exports = {
  darkMode: "class",
  presets: [require("@medusajs/ui-preset")],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/modules/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@medusajs/ui/dist/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      transitionProperty: {
        width: "width margin",
        height: "height",
        bg: "background-color",
        display: "display opacity",
        visibility: "visibility",
        padding: "padding-top padding-right padding-bottom padding-left",
        transform: "transform",
        colors: "color background-color border-color text-decoration-color fill stroke",
      },
      transitionDuration: {
        '50': '50ms',
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
        '400': '400ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'ease-out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
      colors: {
        grey: {
          0: "#FFFFFF",
          5: "#F9FAFB",
          10: "#F3F4F6",
          20: "#E5E7EB",
          30: "#D1D5DB",
          40: "#9CA3AF",
          50: "#6B7280",
          60: "#4B5563",
          70: "#374151",
          80: "#1F2937",
          90: "#111827",
        },
        nxl: {
          black: "var(--color-nxl-black)",
          green: "var(--color-nxl-green)",
          gold: "var(--color-nxl-gold)",
          navy: "var(--color-nxl-navy)",
          ivory: "var(--color-nxl-ivory)",
          white: "var(--color-nxl-white)",
          'gold-light': "var(--color-nxl-gold-light)",
          'gold-dark': "var(--color-nxl-gold-dark)",
          'gold-muted': "var(--color-nxl-gold-muted)",
          'ivory-muted': "var(--color-nxl-ivory-muted)",
          'black-soft': "var(--color-nxl-black-soft)",
        },
        status: {
          success: "var(--color-success)",
          warning: "var(--color-warning)",
          error: "var(--color-error)",
          info: "var(--color-info)",
        },
      },
      borderRadius: {
        none: "0px",
        soft: "2px",
        base: "4px",
        rounded: "8px",
        large: "16px",
        circle: "9999px",
      },
      maxWidth: {
        "8xl": "100rem",
        "mobile": "420px",
        "tablet": "768px",
      },
      minHeight: {
        'touch': '44px',
        'mobile-input': '48px',
      },
      minWidth: {
        'touch': '44px',
        'mobile-button': '88px',
      },
      screens: {
        "2xsmall": "320px",
        xsmall: "412px",
        small: "768px",
        medium: "1024px",
        large: "1280px",
        xlarge: "1440px",
        "2xlarge": "1920px",
        "mobile-s": "320px",
        "mobile-m": "375px",
        "mobile-l": "414px",
        "mobile-xl": "480px",
        "touch": { "raw": "(hover: none) and (pointer: coarse)" },
        "no-touch": { "raw": "(hover: hover) and (pointer: fine)" },
        "portrait": { "raw": "(orientation: portrait)" },
        "landscape": { "raw": "(orientation: landscape)" },
      },
      fontSize: {
        "3xl": "2rem",
        "mobile-xs": ["0.75rem", { lineHeight: "1rem" }],
        "mobile-sm": ["0.875rem", { lineHeight: "1.25rem" }],
        "mobile-base": ["1rem", { lineHeight: "1.5rem" }],
        "mobile-lg": ["1.125rem", { lineHeight: "1.75rem" }],
        "mobile-xl": ["1.25rem", { lineHeight: "1.75rem" }],
      },
      fontFamily: {
        sans: "var(--font-sans)",
        serif: "var(--font-serif)",
        display: "var(--font-display)",
        body: "var(--font-body)",
        button: "var(--font-button)",
      },
      spacing: {
        'xs': "var(--space-xs)",
        'sm': "var(--space-sm)",
        'md': "var(--space-md)",
        'lg': "var(--space-lg)",
        'xl': "var(--space-xl)",
        '2xl': "var(--space-2xl)",
        '3xl': "var(--space-3xl)",
        '4xl': "var(--space-4xl)",
        'mobile-xs': "0.25rem",
        'mobile-sm': "0.5rem",
        'mobile-md': "0.75rem",
        'mobile-lg': "1rem",
        'mobile-xl': "1.25rem",
        'mobile-2xl': "1.5rem",
        'touch-sm': "2.75rem",
        'touch-md': "3rem",
        'touch-lg': "3.5rem",
      },
      zIndex: {
        'dropdown': "var(--z-dropdown)",
        'sticky': "var(--z-sticky)",
        'fixed': "var(--z-fixed)",
        'modal-backdrop': "var(--z-modal-backdrop)",
        'modal': "var(--z-modal)",
        'popover': "var(--z-popover)",
        'tooltip': "var(--z-tooltip)",
        'toast': "var(--z-toast)",
      },
      boxShadow: {
        'luxury': "var(--shadow-luxury)",
        'luxury-lg': "0 35px 60px -12px rgba(212, 182, 96, 0.15), 0 15px 35px -5px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(212, 182, 96, 0.1)",
        'mobile': "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        'mobile-lg': "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        'touch': "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      },
      backdropBlur: {
        'mobile': '8px',
        'luxury': '12px',
      },
      scale: {
        '98': '0.98',
        '102': '1.02',
      },
      keyframes: {
        ring: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "line-slide-1": {
          "0%": { transform: "translateX(-100%) rotate(25deg)" },
          "100%": { transform: "translateX(100%) rotate(25deg)" }
        },
        "line-slide-2": {
          "0%": { transform: "translateX(100%) rotate(-15deg)" },
          "100%": { transform: "translateX(-100%) rotate(-15deg)" }
        },
        "line-slide-3": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" }
        },
        "line-slide-vertical": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" }
        },
        "fade-in-right": {
          "0%": {
            opacity: "0",
            transform: "translateX(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        "fade-in-top": {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-out-top": {
          "0%": {
            height: "100%",
          },
          "99%": {
            height: "0",
          },
          "100%": {
            visibility: "hidden",
          },
        },
        "accordion-slide-up": {
          "0%": {
            height: "var(--radix-accordion-content-height)",
            opacity: "1",
          },
          "100%": {
            height: "0",
            opacity: "0",
          },
        },
        "accordion-slide-down": {
          "0%": {
            "min-height": "0",
            "max-height": "0",
            opacity: "0",
          },
          "100%": {
            "min-height": "var(--radix-accordion-content-height)",
            "max-height": "none",
            opacity: "1",
          },
        },
        enter: {
          "0%": { transform: "scale(0.9)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        leave: {
          "0%": { transform: "scale(1)", opacity: 1 },
          "100%": { transform: "scale(0.9)", opacity: 0 },
        },
        "slide-in": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "mobile-bounce": {
          "0%, 20%, 53%, 80%, 100%": { transform: "translate3d(0,0,0)" },
          "40%, 43%": { transform: "translate3d(0,-8px,0)" },
          "70%": { transform: "translate3d(0,-4px,0)" },
          "90%": { transform: "translate3d(0,-2px,0)" },
        },
        "mobile-pulse": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.05)", opacity: "0.7" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "touch-feedback": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        ring: "ring 2.2s cubic-bezier(0.5, 0, 0.5, 1) infinite",
        "fade-in-right":
          "fade-in-right 0.3s cubic-bezier(0.5, 0, 0.5, 1) forwards",
        "fade-in-top": "fade-in-top 0.2s cubic-bezier(0.5, 0, 0.5, 1) forwards",
        "fade-out-top":
          "fade-out-top 0.2s cubic-bezier(0.5, 0, 0.5, 1) forwards",
        "accordion-open":
          "accordion-slide-down 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards",
        "accordion-close":
          "accordion-slide-up 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards",
        enter: "enter 200ms ease-out",
        "slide-in": "slide-in 1.2s cubic-bezier(.41,.73,.51,1.02)",
        leave: "leave 150ms ease-in forwards",
        "line-slide-1": "line-slide-1 8s linear infinite",
        "line-slide-2": "line-slide-2 12s linear infinite",
        "line-slide-3": "line-slide-3 10s linear infinite",
        "line-slide-vertical": "line-slide-vertical 15s linear infinite",
        "mobile-bounce": "mobile-bounce 0.6s ease-in-out",
        "mobile-pulse": "mobile-pulse 2s ease-in-out infinite",
        "touch-feedback": "touch-feedback 0.15s ease-out",
      },
      gridTemplateColumns: {
        'mobile': 'repeat(2, minmax(0, 1fr))',
        'mobile-3': 'repeat(3, minmax(0, 1fr))',
        'tablet': 'repeat(3, minmax(0, 1fr))',
        'desktop': 'repeat(4, minmax(0, 1fr))',
      },
      aspectRatio: {
        'mobile-card': '3 / 4',
        'mobile-hero': '4 / 3',
        'mobile-banner': '16 / 9',
        'product': '3 / 4',
      },
    },
  },
  plugins: [
    require("tailwindcss-radix")(),
    function ({ addUtilities, theme }) {
      const newUtilities = {
        '.mobile-tap-highlight-none': {
          '-webkit-tap-highlight-color': 'transparent',
        },
        '.mobile-scroll-smooth': {
          '-webkit-overflow-scrolling': 'touch',
          'scroll-behavior': 'smooth',
        },
        '.mobile-select-none': {
          '-webkit-user-select': 'none',
          '-moz-user-select': 'none',
          'user-select': 'none',
        },
        '.safe-top': {
          'padding-top': 'env(safe-area-inset-top)',
        },
        '.safe-bottom': {
          'padding-bottom': 'env(safe-area-inset-bottom)',
        },
        '.safe-left': {
          'padding-left': 'env(safe-area-inset-left)',
        },
        '.safe-right': {
          'padding-right': 'env(safe-area-inset-right)',
        },
        '.touch-target': {
          'min-height': '44px',
          'min-width': '44px',
          'display': 'flex',
          'align-items': 'center',
          'justify-content': 'center',
        },
        '.touch-target-lg': {
          'min-height': '48px',
          'min-width': '48px',
          'display': 'flex',
          'align-items': 'center',
          'justify-content': 'center',
        },
      }
      addUtilities(newUtilities)
    },
  ],
}
