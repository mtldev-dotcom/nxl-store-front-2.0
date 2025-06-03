"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { Text, clx, useToggleState } from "@medusajs/ui"
import { Fragment } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import { HttpTypes } from "@medusajs/types"
import { useTranslation } from "@lib/context/translation-context"
import { useDictionary } from "@lib/i18n/use-dictionary"

interface NavItem {
  key: string;
  path: string;
  translationKey: string;
  fallback: string;
}

const SideMenu = ({ regions }: { regions: HttpTypes.StoreRegion[] | null }) => {
  const toggleState = useToggleState()
  const { translate } = useTranslation()
  const dictionary = useDictionary()
  
  // Define menu items with translation keys for better maintainability
  const navItems: NavItem[] = [
    {
      key: "home",
      path: "/",
      translationKey: "navigation.home",
      fallback: "Home",
    },
    {
      key: "shop",
      path: "/store",
      translationKey: "navigation.shop",
      fallback: "Shop",
    },
    {
      key: "about",
      path: "/about",
      translationKey: "navigation.about",
      fallback: "About",
    },
    {
      key: "contact",
      path: "/contact",
      translationKey: "navigation.contact",
      fallback: "Contact",
    },
    {
      key: "account",
      path: "/account",
      translationKey: "general.account",
      fallback: "Account",
    },
    {
      key: "cart",
      path: "/cart",
      translationKey: "general.cart",
      fallback: "Cart",
    },
  ]

  // Get translation from dictionary or use fallback
  const getTranslation = (key: string, fallback: string): string => {
    const keys = key.split('.');
    let value: any = dictionary;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return fallback;
      }
    }
    
    return typeof value === 'string' ? value : fallback;
  }

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  className="relative h-full flex items-center transition-all ease-out duration-300 focus:outline-none focus:ring-2 focus:ring-nxl-gold/30 rounded-md p-1 text-nxl-ivory hover:text-nxl-gold"
                  aria-label={getTranslation("navigation.menu", "Menu")}
                >
                  <div className="w-6 h-6 flex flex-col justify-center space-y-1.5">
                    <span className="block w-full h-0.5 bg-current transition-all duration-200"></span>
                    <span className="block w-full h-0.5 bg-current transition-all duration-200"></span>
                    <span className="block w-full h-0.5 bg-current transition-all duration-200"></span>
                  </div>
                </Popover.Button>
              </div>

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0"
                enterTo="opacity-100 backdrop-blur-xl"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 backdrop-blur-xl"
                leaveTo="opacity-0"
              >
                <PopoverPanel className="flex flex-col absolute w-full pr-4 sm:pr-0 sm:w-1/3 2xl:w-1/4 sm:min-w-min h-[calc(100vh-1rem)] z-50 inset-x-0 text-sm text-ui-fg-on-color m-2 backdrop-blur-xl">
                  <div
                    data-testid="nav-menu-popup"
                    className="flex flex-col h-full bg-nxl-black/95 border border-nxl-gold/20 rounded-lg shadow-xl justify-between p-6"
                  >
                    <div className="flex justify-end" id="xmark">
                      <button 
                        data-testid="close-menu-button" 
                        onClick={close}
                        className="p-2 text-nxl-ivory hover:text-nxl-gold transition-colors duration-200 rounded-full hover:bg-nxl-navy/30"
                        aria-label="Close menu"
                      >
                        <XMark />
                      </button>
                    </div>
                    <ul className="flex flex-col gap-6 items-start justify-start mt-6">
                      {navItems.map((item) => (
                        <li key={item.key}>
                          <LocalizedClientLink
                            href={item.path}
                            className="text-2xl leading-10 text-nxl-ivory hover:text-nxl-gold transition-colors duration-200 font-medium"
                            onClick={close}
                            data-testid={`${item.key}-link`}
                          >
                            {getTranslation(item.translationKey, item.fallback)}
                          </LocalizedClientLink>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-col gap-y-6 mt-auto pt-6 border-t border-nxl-gold/20">
                      <div
                        className="flex justify-between items-center"
                        onMouseEnter={toggleState.open}
                        onMouseLeave={toggleState.close}
                      >
                        {regions && (
                          <CountrySelect
                            toggleState={toggleState}
                            regions={regions}
                          />
                        )}
                        <ArrowRightMini
                          className={clx(
                            "transition-transform duration-200 text-nxl-ivory",
                            toggleState.state ? "-rotate-90" : ""
                          )}
                        />
                      </div>
                      <Text className="flex justify-between txt-compact-small text-nxl-ivory/80">
                        {getTranslation("footer.copyright", `© ${new Date().getFullYear()} Next X Level. All rights reserved.`)}
                      </Text>
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
