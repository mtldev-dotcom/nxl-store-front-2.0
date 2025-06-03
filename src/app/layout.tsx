import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: "Next X Level - Premium Golf Apparel",
  description: "Elevate your golf game with modern, high-performance apparel designed in Canada. From breathable polo shirts to sleek hoodies and caps, our clothing merges style, comfort, and function—perfect for golfers of all levels."
}

// This is the root layout that doesn't know about locales yet
// The actual language attribute will be set in the [locale] layout
export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="dark">
      <head>
        {/* Preload fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:wght@300;400;500;600&family=Libre+Baskerville:wght@400;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-nxl-black text-nxl-ivory min-h-screen">
        {props.children}
      </body>
    </html>
  )
}
