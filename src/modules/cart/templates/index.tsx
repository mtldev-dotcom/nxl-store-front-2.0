import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import Divider from "@modules/common/components/divider"
import { HttpTypes } from "@medusajs/types"
import { Heading } from "@medusajs/ui"
import { getDictionary } from "@lib/i18n/get-dictionary"
import { Locale } from "@lib/i18n/config"

const CartTemplate = async ({
  cart,
  customer,
  params,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
  params: { locale: Locale }
}) => {
  const dictionary = await getDictionary(params.locale)

  return (
    <div className="py-8 sm:py-12 min-h-screen bg-gradient-to-br from-nxl-black via-nxl-black to-nxl-black/95">
      <div className="content-container" data-testid="cart-container">
        {cart?.items?.length ? (
          <>
            {/* Page Header */}
            <div className="mb-8 text-center">
              <Heading 
                level="h1" 
                className="text-4xl sm:text-5xl font-bold text-nxl-gold mb-3 font-serif tracking-wide"
              >
                {dictionary.cart.title}
              </Heading>
              <p className="text-nxl-ivory text-lg font-light max-w-2xl mx-auto leading-relaxed">
                {dictionary.cart.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 lg:gap-12">
              {/* Cart Items Section */}
              <div className="order-2 lg:order-1">
                <div className="bg-nxl-black/90 backdrop-blur-sm border border-nxl-gold/40 p-6 sm:p-8 text-nxl-ivory rounded-xl shadow-luxury">
                  {!customer && (
                    <>
                      <div className="mb-6">
                        <SignInPrompt dictionary={dictionary} />
                      </div>
                      <Divider />
                    </>
                  )}
                  <ItemsTemplate cart={cart} dictionary={dictionary} />
                </div>
              </div>

              {/* Summary Section */}
              <div className="order-1 lg:order-2">
                <div className="lg:sticky lg:top-8">
                  {cart && cart.region && (
                    <div className="bg-nxl-black/90 backdrop-blur-sm border border-nxl-gold/40 p-6 sm:p-8 text-nxl-ivory rounded-xl shadow-luxury">
                      <Summary cart={cart as any} dictionary={dictionary} />
                    </div>
                  )}

                  {/* Enhanced Trust Indicators */}
                  <div className="mt-6 space-y-3">
                    <div className="bg-nxl-black/70 border border-nxl-gold/25 rounded-lg p-4 transition-all duration-300 hover:border-nxl-gold/40">
                      <div className="flex items-center gap-3 text-sm text-nxl-ivory/85">
                        <div className="w-5 h-5 rounded-full bg-nxl-gold/20 flex items-center justify-center">
                          <svg className="w-3 h-3 text-nxl-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span className="font-medium">{(dictionary.cart as any)?.trustIndicators?.returnPolicy || "30-day return policy"}</span>
                      </div>
                    </div>
                    <div className="bg-nxl-black/70 border border-nxl-gold/25 rounded-lg p-4 transition-all duration-300 hover:border-nxl-gold/40">
                      <div className="flex items-center gap-3 text-sm text-nxl-ivory/85">
                        <div className="w-5 h-5 rounded-full bg-nxl-gold/20 flex items-center justify-center">
                          <svg className="w-3 h-3 text-nxl-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                          </svg>
                        </div>
                        <span className="font-medium">{(dictionary.cart as any)?.trustIndicators?.customerSupport || "Customer support available"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <EmptyCartMessage dictionary={dictionary} />
        )}
      </div>
    </div>
  )
}

export default CartTemplate
