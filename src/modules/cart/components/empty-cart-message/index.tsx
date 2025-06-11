import { Heading, Text, Button } from "@medusajs/ui"
import InteractiveLink from "@modules/common/components/interactive-link"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type EmptyCartMessageProps = {
  dictionary: any
}

const EmptyCartMessage = ({ dictionary }: EmptyCartMessageProps) => {
  return (
    <div className="py-24 px-8 flex flex-col justify-center items-center text-center min-h-[60vh]" data-testid="empty-cart-message">
      <div className="bg-nxl-black/90 border border-nxl-gold/40 rounded-2xl p-12 max-w-2xl mx-auto shadow-luxury">
        {/* Enhanced shopping cart icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-28 h-28 border-2 border-nxl-gold/40 rounded-full flex items-center justify-center bg-gradient-to-br from-nxl-gold/10 to-nxl-gold/5 transition-all duration-500 hover:border-nxl-gold/60">
            <svg 
              className="w-14 h-14 text-nxl-gold/70" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
              />
            </svg>
          </div>
        </div>

        <Heading
          level="h1"
          className="text-4xl font-bold text-nxl-gold mb-4 font-serif tracking-wide"
        >
          {dictionary.cart.empty}
        </Heading>
        
        <Text className="text-lg text-nxl-ivory/85 mb-8 leading-relaxed font-light max-w-lg mx-auto">
          {dictionary.cart.emptyDescription}
        </Text>

        <div className="space-y-4">
          <LocalizedClientLink href="/store">
            <Button className="w-full h-12 bg-nxl-gold text-nxl-black border border-nxl-gold hover:bg-nxl-gold/90 transition-all duration-300 font-semibold text-lg rounded-lg shadow-lg hover:shadow-xl">
              {dictionary.cart.startShopping}
            </Button>
          </LocalizedClientLink>
          
          <LocalizedClientLink href="/collections">
            <Button 
              variant="transparent" 
              className="w-full h-12 border border-nxl-gold/40 text-nxl-gold hover:bg-nxl-gold/10 hover:border-nxl-gold/60 transition-all duration-300 rounded-lg"
            >
              {dictionary.cart.browseCollections}
            </Button>
          </LocalizedClientLink>
        </div>

        {/* Enhanced helpful links */}
        <div className="mt-8 pt-6 border-t border-nxl-gold/25">
          <Text className="text-sm text-nxl-ivory/70 mb-3 font-medium">
            {dictionary.cart.helpfulLinks.needHelp}
          </Text>
          <div className="flex justify-center gap-6 text-sm">
            <InteractiveLink href="/search" className="text-nxl-gold/80 hover:text-nxl-gold transition-colors duration-200">
              {dictionary.cart.helpfulLinks.searchProducts}
            </InteractiveLink>
            <span className="text-nxl-ivory/30">•</span>
            <InteractiveLink href="/contact" className="text-nxl-gold/80 hover:text-nxl-gold transition-colors duration-200">
              {dictionary.cart.helpfulLinks.contactUs}
            </InteractiveLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmptyCartMessage
