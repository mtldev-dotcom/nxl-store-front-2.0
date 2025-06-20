"use client";

import React, { useEffect, useState } from "react";
import { FiUser, FiSearch, FiShoppingBag } from "react-icons/fi";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import CartButton from "./cart-button";
import SideMenu from "@modules/layout/components/side-menu";
import LanguageSelect from "@modules/layout/components/language-select";

import type { StoreRegion } from "@medusajs/types";

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const headerClasses = `sticky top-0 inset-x-0 z-sticky transition-all duration-500 backdrop-blur-md ${scrolled
    ? "bg-nxl-black/95 text-nxl-ivory border-b border-nxl-gold/20 shadow-luxury"
    : "bg-transparent text-white border-b border-transparent"
    }`;

  const linkBaseClasses = "relative font-button uppercase tracking-wider transition-all duration-300 group mobile-touch-target";
  const linkTextClasses = scrolled
    ? "text-nxl-ivory hover:text-nxl-gold"
    : "text-white hover:text-nxl-gold";

  return (
    <header className={headerClasses} role="banner">
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">
        {dictionary?.accessibility?.skipToMain || "Skip to main content"}
      </a>

      <nav
        className="mobile-container flex items-center justify-between w-full h-16 sm:h-20 safe-area-top"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Left Section - Navigation */}
        <div className="flex-1 basis-0 h-full flex items-center">
          {/* Mobile Menu Button */}
          <div className="h-full lg:hidden">
            <SideMenu regions={regions} />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center mobile-gap">
            {navItems.map((item) => (
              <LocalizedClientLink
                key={item.key}
                href={item.path}
                className={`${linkBaseClasses} ${linkTextClasses} text-sm`}
              >
                <span className="relative z-10 px-3 py-2">
                  {dictionary.navigation[item.key]}
                </span>
                {/* Enhanced hover underline animation */}
                <span className="absolute bottom-1 left-3 right-3 h-0.5 bg-nxl-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left" />
                {/* Enhanced hover background effect */}
                <span className="absolute inset-0 bg-nxl-gold/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left -z-10 rounded-lg" />
              </LocalizedClientLink>
            ))}
          </div>
        </div>

        {/* Center Section - Logo */}
        <div className="flex items-center h-full px-4">
          <LocalizedClientLink
            href="/"
            className={`${linkTextClasses} font-display text-lg sm:text-xl md:text-2xl tracking-wider uppercase transition-all duration-300 hover:scale-105 mobile-touch-target`}
            aria-label="Next X Level - Home"
          >
            <span className="relative px-2 py-2">
              Next <span className="text-nxl-gold">X</span> Level
              {/* Enhanced logo glow effect */}
              <span className="absolute inset-0 text-nxl-gold opacity-0 hover:opacity-20 transition-opacity duration-300 blur-sm">
                Next X Level
              </span>
            </span>
          </LocalizedClientLink>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center mobile-gap h-full flex-1 basis-0 justify-end">
          {/* Search Button - Desktop */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`${linkTextClasses} mobile-touch-target rounded-lg hover:bg-nxl-gold/10 active:bg-nxl-gold/20 transition-all duration-300 hidden sm:flex`}
            aria-label={dictionary?.navigation?.search || "Search products"}
            aria-expanded={isSearchOpen}
          >
            <FiSearch size={20} />
          </button>

          {/* Desktop-only items */}
          <div className="hidden md:flex items-center mobile-gap">
            <LanguageSelect />

            <LocalizedClientLink
              href="/account"
              className={`${linkTextClasses} mobile-touch-target rounded-lg hover:bg-nxl-gold/10 active:bg-nxl-gold/20 transition-all duration-300`}
              aria-label={dictionary?.navigation?.account || "Account"}
            >
              <FiUser size={20} />
            </LocalizedClientLink>
          </div>

          {/* Enhanced Cart Button with mobile optimization */}
          <CartButton dictionary={dictionary} />
        </div>
      </nav>

      {/* Enhanced Search Overlay with better mobile UX */}
      {isSearchOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-nxl-black/60 backdrop-blur-sm z-30"
            onClick={() => setIsSearchOpen(false)}
            aria-hidden="true"
          />

          {/* Search Panel */}
          <div
            className="absolute inset-x-0 top-full bg-nxl-black/95 backdrop-blur-md border-b border-nxl-gold/20 z-40 animate-fade-in-top"
            role="search"
            aria-label="Product search"
          >
            <div className="mobile-container mobile-py">
              <div className="relative max-w-2xl mx-auto">
                <label htmlFor="search-input" className="sr-only">
                  {dictionary?.navigation?.searchPlaceholder || "Search products"}
                </label>
                <input
                  id="search-input"
                  type="search"
                  placeholder={dictionary?.navigation?.searchPlaceholder || "Search products..."}
                  className="w-full bg-nxl-navy/50 border border-nxl-gold/30 text-nxl-ivory placeholder:text-nxl-ivory/50 mobile-px py-4 pr-14 rounded-lg font-body focus:outline-none focus:ring-4 focus:ring-nxl-gold/50 focus:border-nxl-gold mobile-touch-target transition-all duration-200"
                  autoFocus
                  autoComplete="off"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  <FiSearch className="text-nxl-gold" size={20} aria-hidden="true" />
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={() => setIsSearchOpen(false)}
                className="absolute top-4 right-6 text-nxl-ivory/60 hover:text-nxl-gold transition-colors duration-200 mobile-touch-target rounded-lg"
                aria-label={dictionary?.general?.close || "Close search"}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              {/* Quick search suggestions could go here */}
              <div className="mt-4 text-center">
                <p className="text-nxl-ivory/60 text-sm">
                  {dictionary?.navigation?.searchHint || "Try searching for 'polo', 'hoodie', or 'joggers'"}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
