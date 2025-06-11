"use client"

import React from "react"

import UnderlineLink from "@modules/common/components/interactive-link"

import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
  dictionary?: Record<string, any>
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
  dictionary,
}) => {
  return (
    <div className="flex-1 min-h-screen bg-nxl-black" data-testid="account-page">
      <div className="content-container py-8 small:py-16">
        {/* Header Section */}
        <div className="mb-8 small:mb-12">
          <h1 className="nxl-display text-2xl small:text-3xl mb-2">
            {dictionary?.account?.myAccount || "My Account"}
          </h1>
          <p className="nxl-body text-base small:text-lg opacity-70">
            {customer?.first_name 
              ? `Welcome back, ${customer.first_name}` 
              : dictionary?.account?.accountDetails || "Manage your account details and preferences"}
          </p>
        </div>

        {/* Main Content Grid */}
        {customer ? (
          <div className="grid grid-cols-1 large:grid-cols-[280px_1fr] gap-8 large:gap-12">
            {/* Navigation Sidebar */}
            <div className="order-2 large:order-1">
              <AccountNav customer={customer} dictionary={dictionary} />
            </div>
            
            {/* Main Content Area */}
            <div className="order-1 large:order-2">
              <div className="nxl-card rounded-lg p-6 small:p-8">
                {children}
              </div>
            </div>
          </div>
        ) : (
          /* Centered content for non-logged-in users */
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              {children}
            </div>
          </div>
        )}

        {/* Support Section */}
        {/* <div className="mt-16 pt-8 border-t border-nxl-gold border-opacity-20">
          <div className="flex flex-col small:flex-row items-start small:items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="nxl-heading text-xl small:text-2xl mb-3">
                {dictionary?.account?.gotQuestions || "Got questions?"}
              </h3>
              <p className="nxl-body text-base opacity-80">
                {dictionary?.account?.faqDescription || 
                  "Find FAQs and answers on our customer service page."}
              </p>
            </div>
            <div className="flex-shrink-0">
              <UnderlineLink 
                href="/customer-service"
                className="nxl-btn-secondary inline-block"
              >
                {dictionary?.account?.customerService || "Customer Service"}
              </UnderlineLink>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default AccountLayout
