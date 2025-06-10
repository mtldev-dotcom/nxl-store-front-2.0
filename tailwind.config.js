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
      },
      screens: {
        "2xsmall": "320px",
        xsmall: "512px",
        small: "1024px",
        medium: "1280px",
        large: "1440px",
        xlarge: "1680px",
        "2xlarge": "1920px",
      },
      fontSize: {
        "3xl": "2rem",
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
      },
    },
  },
  plugins: [require("tailwindcss-radix")()],
}
