import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import { CheckCircleSolid, Envelope, Calendar, User } from "@medusajs/icons"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const formatStatus = (str: string) => {
    const formatted = str.split("_").join(" ")
    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }

  const orderDetails = [
    {
      icon: Envelope,
      label: "Confirmation sent to",
      value: order.email,
      testId: "order-email",
      color: "text-blue-400"
    },
    {
      icon: Calendar,
      label: "Order date",
      value: new Date(order.created_at).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      testId: "order-date",
      color: "text-green-400"
    },
    {
      icon: User,
      label: "Order number",
      value: `#${order.display_id}`,
      testId: "order-id",
      color: "text-nxl-gold"
    }
  ]

  return (
    <div className="bg-nxl-black/40 border border-nxl-gold/20 rounded-lg p-6">
      {/* Success Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
          <CheckCircleSolid className="w-5 h-5 text-white" />
        </div>
        <div>
          <Text className="font-semibold text-nxl-ivory">Order Confirmed</Text>
          <Text className="text-sm text-nxl-ivory/70">
            Your order has been successfully processed
          </Text>
        </div>
      </div>

      {/* Order Information */}
      <div className="space-y-4">
        {orderDetails.map((detail, index) => {
          const Icon = detail.icon
          return (
            <div key={index} className="flex items-start gap-3 p-3 bg-nxl-black/30 rounded-lg">
              <div className={`flex-shrink-0 ${detail.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <Text className="text-sm text-nxl-ivory/60 mb-1">
                  {detail.label}
                </Text>
                <Text
                  className="font-medium text-nxl-ivory"
                  data-testid={detail.testId}
                >
                  {detail.value}
                </Text>
              </div>
            </div>
          )
        })}
      </div>

      {/* Status Information (if enabled) */}
      {showStatus && (
        <div className="mt-6 pt-6 border-t border-nxl-gold/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-nxl-black/30 rounded-lg">
              <Text className="text-sm text-nxl-ivory/60 mb-1">
                Order Status
              </Text>
              <Text
                className="font-medium text-green-400"
                data-testid="order-status"
              >
                Processing
                {/* TODO: Check where the statuses should come from */}
                {/* {formatStatus(order.fulfillment_status)} */}
              </Text>
            </div>
            <div className="p-3 bg-nxl-black/30 rounded-lg">
              <Text className="text-sm text-nxl-ivory/60 mb-1">
                Payment Status
              </Text>
              <Text
                className="font-medium text-green-400"
                data-testid="order-payment-status"
              >
                Paid
                {/* {formatStatus(order.payment_status)} */}
              </Text>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderDetails
