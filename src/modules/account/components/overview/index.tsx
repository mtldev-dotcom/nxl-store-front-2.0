import { Container } from "@medusajs/ui"

import ChevronDown from "@modules/common/icons/chevron-down"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
  dictionary?: Record<string, any>
}

const Overview = ({ customer, orders, dictionary }: OverviewProps) => {
  return (
    <div data-testid="overview-page-wrapper">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex flex-col small:flex-row small:justify-between small:items-center gap-4">
          <div>
            <h1 className="nxl-heading text-2xl small:text-3xl text-nxl-gold mb-2" data-testid="welcome-message" data-value={customer?.first_name}>
              {dictionary?.account?.welcome || "Welcome"}, {customer?.first_name}
            </h1>
            <p className="nxl-body opacity-80">
              {dictionary?.account?.dashboardDescription || "Manage your account and track your orders"}
            </p>
          </div>
          <div className="nxl-body text-sm opacity-70">
            <span className="block small:text-right">
              {dictionary?.account?.signedInAs || "Signed in as"}:{" "}
              <span
                className="text-nxl-gold font-medium"
                data-testid="customer-email"
                data-value={customer?.email}
              >
                {customer?.email}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 small:grid-cols-2 gap-6 mb-8">
        {/* Profile Completion */}
        <div className="bg-nxl-navy rounded-lg p-6 border border-nxl-gold border-opacity-20">
          <h3 className="nxl-heading text-xl text-nxl-gold mb-4">
            {dictionary?.account?.profile || "Profile"}
          </h3>
          <div className="flex items-end gap-x-3">
            <span
              className="text-4xl font-bold text-nxl-ivory leading-none"
              data-testid="customer-profile-completion"
              data-value={getProfileCompletion(customer)}
            >
              {getProfileCompletion(customer)}%
            </span>
            <span className="nxl-body text-sm opacity-70 uppercase tracking-wider">
              {dictionary?.account?.completed || "Completed"}
            </span>
          </div>
          <div className="mt-4">
            <div className="w-full bg-nxl-black rounded-full h-2">
              <div 
                className="bg-nxl-gold h-2 rounded-full transition-all duration-500"
                style={{ width: `${getProfileCompletion(customer)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Saved Addresses */}
        <div className="bg-nxl-navy rounded-lg p-6 border border-nxl-gold border-opacity-20">
          <h3 className="nxl-heading text-xl text-nxl-gold mb-4">
            {dictionary?.account?.addresses || "Addresses"}
          </h3>
          <div className="flex items-end gap-x-3">
            <span
              className="text-4xl font-bold text-nxl-ivory leading-none"
              data-testid="addresses-count"
              data-value={customer?.addresses?.length || 0}
            >
              {customer?.addresses?.length || 0}
            </span>
            <span className="nxl-body text-sm opacity-70 uppercase tracking-wider">
              {dictionary?.account?.saved || "Saved"}
            </span>
          </div>
          <p className="nxl-body text-sm opacity-60 mt-2">
            {dictionary?.account?.addressesDescription || "Manage your shipping and billing addresses"}
          </p>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="nxl-heading text-xl text-nxl-gold">
            {dictionary?.account?.recentOrders || "Recent Orders"}
          </h2>
          {orders && orders.length > 0 && (
            <LocalizedClientLink
              href="/account/orders"
              className="nxl-body text-sm text-nxl-gold hover:text-nxl-gold-light transition-colors duration-300 underline decoration-nxl-gold underline-offset-4"
            >
              {dictionary?.account?.viewAll || "View All"}
            </LocalizedClientLink>
          )}
        </div>

        <div className="space-y-4" data-testid="orders-wrapper">
          {orders && orders.length > 0 ? (
            orders.slice(0, 5).map((order) => (
              <LocalizedClientLink
                key={order.id}
                href={`/account/orders/details/${order.id}`}
                data-testid="order-wrapper"
                data-value={order.id}
              >
                <div className="bg-nxl-navy rounded-lg p-6 border border-nxl-gold border-opacity-20 hover:border-opacity-40 transition-all duration-300 group">
                  <div className="grid grid-cols-1 small:grid-cols-3 gap-4 small:gap-6">
                    <div>
                      <p className="nxl-body text-xs opacity-60 uppercase tracking-wider mb-1">
                        {dictionary?.account?.datePlaced || "Date Placed"}
                      </p>
                      <p className="nxl-body text-sm text-nxl-ivory" data-testid="order-created-date">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="nxl-body text-xs opacity-60 uppercase tracking-wider mb-1">
                        {dictionary?.account?.orderNumber || "Order Number"}
                      </p>
                      <p 
                        className="nxl-body text-sm text-nxl-gold font-medium"
                        data-testid="order-id"
                        data-value={order.display_id}
                      >
                        #{order.display_id}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="nxl-body text-xs opacity-60 uppercase tracking-wider mb-1">
                          {dictionary?.account?.totalAmount || "Total Amount"}
                        </p>
                        <p className="nxl-body text-sm text-nxl-ivory font-medium" data-testid="order-amount">
                          {convertToLocale({
                            amount: order.total,
                            currency_code: order.currency_code,
                          })}
                        </p>
                      </div>
                      <ChevronDown 
                        className="transform -rotate-90 text-nxl-gold group-hover:text-nxl-gold-light transition-colors duration-300 w-5 h-5" 
                        data-testid="open-order-button"
                      />
                    </div>
                  </div>
                </div>
              </LocalizedClientLink>
            ))
          ) : (
            <div className="bg-nxl-navy rounded-lg p-8 border border-nxl-gold border-opacity-20 text-center">
              <p className="nxl-body text-nxl-ivory opacity-60 mb-4" data-testid="no-orders-message">
                {dictionary?.account?.noOrdersYet || "You haven't made any orders yet"}
              </p>
              <LocalizedClientLink
                href="/store"
                className="nxl-btn-secondary inline-block"
              >
                {dictionary?.account?.browseProducts || "Browse Products"}
              </LocalizedClientLink>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  let count = 0

  if (!customer) {
    return 0
  }

  if (customer.email) {
    count++
  }

  if (customer.first_name && customer.last_name) {
    count++
  }

  if (customer.phone) {
    count++
  }

  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing
  )

  if (billingAddress) {
    count++
  }

  return (count / 4) * 100
}

export default Overview
