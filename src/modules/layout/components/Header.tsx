"use client";

import React, { useEffect, useState } from "react";
import { FiShoppingCart, FiUser } from "react-icons/fi";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import SideMenu from "@modules/layout/components/side-menu";
import LanguageSelect from "@modules/layout/components/language-select";

import type { StoreRegion } from "@medusajs/types";
import type { Locale } from "@lib/i18n/config";

interface NavItem {
  path: string;
  key: string;
}

interface HeaderProps {
  navItems: NavItem[];
  regions: StoreRegion[];
  dictionary: any;
}

export default function Header({
  navItems,
  regions,
  dictionary,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const headerClasses = `sticky top-0 inset-x-0 z-50 transition-colors duration-300 ${
    scrolled
      ? "bg-white text-[var(--color-charcoal)] border-b border-[var(--color-sunshine)] shadow-lg shadow-black/10"
      : "bg-transparent text-white border-b border-transparent shadow-none"
  }`;

  const linkText = scrolled
    ? "text-[var(--color-charcoal)] hover:text-nxl-gold transition-colors duration-300"
    : "text-white hover:text-nxl-gold transition-colors duration-300";

  return (
    <header className={headerClasses}>
      <nav className="content-container flex items-center justify-between w-full h-20 text-small-regular">
        <div className="flex-1 basis-0 h-full flex items-center">
          <div className="h-full lg:hidden">
            <SideMenu regions={regions} />
          </div>
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <LocalizedClientLink
                key={item.key}
                href={item.path}
                className={`relative ${linkText} text-lg uppercase`}
              >
                <span>{dictionary.navigation[item.key]}</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-nxl-gold transform group-hover:w-full transition-all duration-300" />
              </LocalizedClientLink>
            ))}
          </div>
        </div>
        <div className="flex items-center h-full">
          <LocalizedClientLink
            href="/"
            className={`${linkText} font-display text-2xl tracking-wider uppercase`}
          >
            Next <span className="text-nxl-gold">X</span> Level
          </LocalizedClientLink>
        </div>
        <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
          <div className="hidden small:flex items-center gap-x-6 h-full">
            <LanguageSelect />
            <LocalizedClientLink href="/account" className={linkText}>
              <FiUser size={20} />
            </LocalizedClientLink>
          </div>
          <LocalizedClientLink
            href="/cart"
            className={`flex items-center ${linkText}`}
          >
            <FiShoppingCart size={20} />
          </LocalizedClientLink>
        </div>
      </nav>
    </header>
  );
}
