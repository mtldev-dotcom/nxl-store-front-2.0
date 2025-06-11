"use client";

import React, { useEffect, useState } from "react";
import { FiUser, FiSearch } from "react-icons/fi";
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

  const headerClasses = `sticky top-0 inset-x-0 z-sticky transition-all duration-500 backdrop-blur-md ${
    scrolled
      ? "bg-nxl-black/95 text-nxl-ivory border-b border-nxl-gold/20 shadow-luxury"
      : "bg-transparent text-white border-b border-transparent"
  }`;

  const linkBaseClasses = "relative font-button uppercase tracking-wider transition-all duration-300 group";
  const linkTextClasses = scrolled
    ? "text-nxl-ivory hover:text-nxl-gold"
    : "text-white hover:text-nxl-gold";

  return (
    <header className={headerClasses} role="banner">
      <nav 
        className="content-container flex items-center justify-between w-full h-20"
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
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <LocalizedClientLink
                key={item.key}
                href={item.path}
                className={`${linkBaseClasses} ${linkTextClasses} text-sm`}
              >
                <span className="relative z-10">
                  {dictionary.navigation[item.key]}
                </span>
                {/* Hover underline animation */}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-nxl-gold group-hover:w-full transition-all duration-300 ease-out" />
                {/* Hover background effect */}
                <span className="absolute inset-0 bg-nxl-gold/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left -z-10 rounded-sm" />
              </LocalizedClientLink>
            ))}
          </div>
        </div>

        {/* Center Section - Logo */}
        <div className="flex items-center h-full">
          <LocalizedClientLink
            href="/"
            className={`${linkTextClasses} font-display text-xl md:text-2xl tracking-wider uppercase transition-all duration-300 hover:scale-105`}
            aria-label="Next X Level - Home"
          >
            <span className="relative">
              Next <span className="text-nxl-gold">X</span> Level
              {/* Logo glow effect */}
              <span className="absolute inset-0 text-nxl-gold opacity-0 hover:opacity-20 transition-opacity duration-300 blur-sm">
                Next X Level
              </span>
            </span>
          </LocalizedClientLink>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-x-4 h-full flex-1 basis-0 justify-end">
          {/* Search Button */}
          {/* <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`${linkTextClasses} p-2 rounded-md hover:bg-nxl-gold/10 transition-all duration-300`}
            aria-label="Search products"
          >
            <FiSearch size={20} />
          </button> */}

          {/* Desktop-only items */}
          <div className="hidden md:flex items-center gap-x-4">
            <LanguageSelect />
            
            <LocalizedClientLink 
              href="/account" 
              className={`${linkTextClasses} p-2 rounded-md hover:bg-nxl-gold/10 transition-all duration-300`}
              aria-label="Account"
            >
              <FiUser size={20} />
            </LocalizedClientLink>
          </div>

          {/* Enhanced Cart Button */}
          <CartButton dictionary={dictionary} />
        </div>
      </nav>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div 
          className="absolute inset-x-0 top-full bg-nxl-black/95 backdrop-blur-md border-b border-nxl-gold/20 z-40"
          role="search"
        >
          <div className="content-container py-6">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="search"
                placeholder="Search products..."
                className="w-full bg-nxl-navy/50 border border-nxl-gold/30 text-nxl-ivory placeholder:text-nxl-ivory/50 px-6 py-4 pr-12 rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-nxl-gold/50 focus:border-nxl-gold"
                autoFocus
              />
              <FiSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-nxl-gold" size={20} />
            </div>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-4 right-6 text-nxl-ivory/60 hover:text-nxl-gold transition-colors duration-200"
              aria-label="Close search"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
