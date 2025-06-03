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
    <div className="flex-1 small:py-12" data-testid="account-page">
      <div className="flex-1 content-container h-full max-w-5xl mx-auto bg-white flex flex-col">
        <div className="grid grid-cols-1  small:grid-cols-[240px_1fr] py-12">
          <div>{customer && <AccountNav customer={customer} />}</div>
          <div className="flex-1">{children}</div>
        </div>
        <div className="flex flex-col small:flex-row items-end justify-between small:border-t border-gray-200 py-12 gap-8">
          <div>
            <h3 className="text-xl-semi mb-4 font-serif text-nxl-black">
              {dictionary?.account?.gotQuestions || "Got questions?"}
            </h3>
            <span className="txt-medium text-nxl-black/80">
              {dictionary?.account?.faqDescription || 
                "You can find frequently asked questions and answers on our customer service page."}
            </span>
          </div>
          <div>
            <UnderlineLink href="/customer-service">
              {dictionary?.account?.customerService || "Customer Service"}
            </UnderlineLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
