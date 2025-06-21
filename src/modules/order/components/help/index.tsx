import { Heading, Text } from "@medusajs/ui"
import { ChatBubbleLeftRight, QuestionMarkCircle, ArrowPath, Phone } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import React from "react"

const Help = () => {
  const helpOptions = [
    {
      icon: ChatBubbleLeftRight,
      title: "Contact Support",
      description: "Get help with your order or product questions",
      href: "/contact",
      color: "text-blue-400"
    },
    {
      icon: ArrowPath,
      title: "Returns & Exchanges",
      description: "Easy returns within 30 days of purchase",
      href: "/contact",
      color: "text-green-400"
    },
    {
      icon: QuestionMarkCircle,
      title: "FAQ",
      description: "Find answers to common questions",
      href: "/faq",
      color: "text-purple-400"
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak with our customer service team",
      href: "tel:+1-800-123-4567",
      color: "text-orange-400"
    }
  ]

  return (
    <div>
      <div className="text-center mb-8">
        <Heading level="h2" className="text-xl font-semibold text-nxl-gold font-display mb-2">
          Need help with your order?
        </Heading>
        <Text className="text-nxl-ivory/70">
          Our customer support team is here to assist you
        </Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {helpOptions.map((option, index) => {
          const Icon = option.icon
          return (
            <LocalizedClientLink
              key={index}
              href={option.href}
              className="group block"
            >
              <div className="bg-nxl-black/40 hover:bg-nxl-black/60 border border-nxl-gold/20 hover:border-nxl-gold/40 rounded-lg p-4 transition-all duration-300 hover:shadow-lg hover:shadow-nxl-gold/10">
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 ${option.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <Text className="font-semibold text-nxl-ivory mb-1 group-hover:text-nxl-gold transition-colors">
                      {option.title}
                    </Text>
                    <Text className="text-sm text-nxl-ivory/70">
                      {option.description}
                    </Text>
                  </div>
                </div>
              </div>
            </LocalizedClientLink>
          )
        })}
      </div>

      {/* Additional Trust Signals */}
      <div className="border-t border-nxl-gold/20 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <Text className="text-sm font-semibold text-nxl-gold mb-1">
              🔒 Secure Checkout
            </Text>
            <Text className="text-xs text-nxl-ivory/60">
              Your payment information is protected
            </Text>
          </div>
          <div>
            <Text className="text-sm font-semibold text-nxl-gold mb-1">
              🚚 Free Shipping
            </Text>
            <Text className="text-xs text-nxl-ivory/60">
              On orders over $75
            </Text>
          </div>
          <div>
            <Text className="text-sm font-semibold text-nxl-gold mb-1">
              ↩️ Easy Returns
            </Text>
            <Text className="text-xs text-nxl-ivory/60">
              30-day return policy
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Help
