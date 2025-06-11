"use client"

import React from "react"
import { clx } from "@medusajs/ui"
import { ArrowRightOnRectangle } from "@medusajs/icons"
import { useParams, usePathname } from "next/navigation"

import ChevronDown from "@modules/common/icons/chevron-down"
import User from "@modules/common/icons/user"
import MapPin from "@modules/common/icons/map-pin"
import Package from "@modules/common/icons/package"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { signout } from "@lib/data/customer"

const AccountNav = ({
  customer,
  dictionary,
}: {
  customer: HttpTypes.StoreCustomer | null
  dictionary?: Record<string, any>
}) => {
  const route = usePathname()
  const { countryCode } = useParams() as { countryCode: string }

  const handleLogout = async () => {
    await signout(countryCode)
  }

  return (
    <div>
      {/* Mobile Navigation */}
      <div className="large:hidden" data-testid="mobile-account-nav">
        {route !== `/${countryCode}/account` ? (
          <LocalizedClientLink
            href="/account"
            className="flex items-center gap-x-3 nxl-body py-3 px-4 bg-nxl-navy rounded-lg hover:bg-nxl-green transition-colors duration-300"
            data-testid="account-main-link"
          >
            <>
              <ChevronDown className="transform rotate-90 text-nxl-gold w-4 h-4" />
              <span className="text-nxl-ivory">
                {dictionary?.account?.account || "Account"}
              </span>
            </>
          </LocalizedClientLink>
        ) : (
          <>
            <div className="nxl-heading text-xl mb-6 px-4">
              {dictionary?.account?.dashboard || "Dashboard"}
            </div>
            <div className="space-y-2">
              <LocalizedClientLink
                href="/account/profile"
                className="flex items-center justify-between py-4 px-4 bg-nxl-navy hover:bg-nxl-green transition-all duration-300 rounded-lg"
                data-testid="profile-link"
              >
                <div className="flex items-center gap-x-3">
                  <User className="text-nxl-gold w-5 h-5" />
                  <span className="nxl-body text-nxl-ivory">
                    {dictionary?.account?.profile || "Profile"}
                  </span>
                </div>
                <ChevronDown className="transform -rotate-90 text-nxl-gold w-4 h-4" />
              </LocalizedClientLink>
              
              <LocalizedClientLink
                href="/account/addresses"
                className="flex items-center justify-between py-4 px-4 bg-nxl-navy hover:bg-nxl-green transition-all duration-300 rounded-lg"
                data-testid="addresses-link"
              >
                <div className="flex items-center gap-x-3">
                  <MapPin className="text-nxl-gold w-5 h-5" />
                  <span className="nxl-body text-nxl-ivory">
                    {dictionary?.account?.addresses || "Addresses"}
                  </span>
                </div>
                <ChevronDown className="transform -rotate-90 text-nxl-gold w-4 h-4" />
              </LocalizedClientLink>
              
              <LocalizedClientLink
                href="/account/orders"
                className="flex items-center justify-between py-4 px-4 bg-nxl-navy hover:bg-nxl-green transition-all duration-300 rounded-lg"
                data-testid="orders-link"
              >
                <div className="flex items-center gap-x-3">
                  <Package className="text-nxl-gold w-5 h-5" />
                  <span className="nxl-body text-nxl-ivory">
                    {dictionary?.account?.orders || "Orders"}
                  </span>
                </div>
                <ChevronDown className="transform -rotate-90 text-nxl-gold w-4 h-4" />
              </LocalizedClientLink>
              
              <button
                type="button"
                className="flex items-center justify-between w-full py-4 px-4 border-t border-nxl-gold border-opacity-20 bg-nxl-navy hover:bg-nxl-green transition-all duration-300 rounded-lg mt-4"
                onClick={handleLogout}
                data-testid="logout-button"
              >
                <div className="flex items-center gap-x-3">
                  <ArrowRightOnRectangle className="text-nxl-gold w-5 h-5" />
                  <span className="nxl-body text-nxl-ivory">
                    {dictionary?.account?.logout || "Log out"}
                  </span>
                </div>
                <ChevronDown className="transform -rotate-90 text-nxl-gold w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Desktop Navigation */}
      <div className="hidden large:block" data-testid="account-nav">
        <div className="bg-nxl-navy rounded-lg p-6 shadow-luxury">
          <div className="mb-6">
            <h3 className="nxl-heading text-xl text-nxl-gold">
              {dictionary?.account?.account || "Account"}
            </h3>
            <p className="nxl-body text-sm opacity-70 mt-1">
              {customer?.first_name 
                ? `Hello, ${customer.first_name}` 
                : dictionary?.account?.dashboard || "Manage your account"}
            </p>
          </div>
          
          <nav>
            <ul className="space-y-2">
              <li>
                <AccountNavLink
                  href="/account"
                  route={route!}
                  data-testid="overview-link"
                >
                  <User className="w-[18px] h-[18px]" />
                  {dictionary?.account?.dashboard || "Overview"}
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink
                  href="/account/profile"
                  route={route!}
                  data-testid="profile-link"
                >
                  <User className="w-[18px] h-[18px]" />
                  {dictionary?.account?.profile || "Profile"}
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink
                  href="/account/addresses"
                  route={route!}
                  data-testid="addresses-link"
                >
                  <MapPin className="w-[18px] h-[18px]" />
                  {dictionary?.account?.addresses || "Addresses"}
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink
                  href="/account/orders"
                  route={route!}
                  data-testid="orders-link"
                >
                  <Package className="w-[18px] h-[18px]" />
                  {dictionary?.account?.orders || "Orders"}
                </AccountNavLink>
              </li>
              <li className="pt-4 border-t border-nxl-gold border-opacity-20">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-x-3 w-full py-3 px-4 text-left nxl-body text-nxl-ivory hover:text-nxl-gold hover:bg-nxl-black rounded-lg transition-all duration-300 group"
                  data-testid="logout-button"
                >
                  <ArrowRightOnRectangle className="text-nxl-gold group-hover:text-nxl-ivory transition-colors duration-300 w-[18px] h-[18px]" />
                  <span>{dictionary?.account?.logout || "Log out"}</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}

type AccountNavLinkProps = {
  href: string
  route: string
  children: React.ReactNode
  "data-testid"?: string
}

const AccountNavLink = ({
  href,
  route,
  children,
  "data-testid": dataTestId,
}: AccountNavLinkProps) => {
  const { countryCode }: { countryCode: string } = useParams()

  const active = route.split(countryCode)[1] === href
  return (
    <LocalizedClientLink
      href={href}
      className={clx(
        "flex items-center gap-x-3 py-3 px-4 rounded-lg transition-all duration-300 nxl-body group",
        {
          "bg-nxl-gold text-nxl-black": active,
          "text-nxl-ivory hover:text-nxl-gold hover:bg-nxl-black": !active,
        }
      )}
      data-testid={dataTestId}
    >
      <span className={clx("transition-colors duration-300", {
        "text-nxl-black": active,
        "text-nxl-gold group-hover:text-nxl-ivory": !active,
      })}>
        {React.Children.toArray(children)[0]}
      </span>
      <span className={clx("font-medium", {
        "text-nxl-black": active,
        "text-nxl-ivory group-hover:text-nxl-gold": !active,
      })}>
        {React.Children.toArray(children)[1]}
      </span>
    </LocalizedClientLink>
  )
}

export default AccountNav
