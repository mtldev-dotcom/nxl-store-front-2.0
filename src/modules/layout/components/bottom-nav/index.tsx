"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { FiHome, FiSearch, FiUser, FiShoppingBag, FiGrid } from "react-icons/fi";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import { useTranslation } from "@lib/context/translation-context";

interface BottomNavProps {
    cartCount?: number;
    dictionary?: any;
}

const BottomNav: React.FC<BottomNavProps> = ({ cartCount = 0, dictionary }) => {
    const pathname = usePathname();
    const { translate } = useTranslation();

    // Define navigation items with better organization
    const navItems = [
        {
            key: "home",
            path: "/",
            icon: FiHome,
            label: translate("navigation", "home") || "Home",
            match: (path: string) => path === "/" || path.endsWith("/en") || path.endsWith("/fr"),
        },
        {
            key: "shop",
            path: "/store",
            icon: FiGrid,
            label: translate("navigation", "shop") || "Shop",
            match: (path: string) => path.includes("/store") || path.includes("/products") || path.includes("/collections"),
        },
        {
            key: "search",
            path: "/search",
            icon: FiSearch,
            label: translate("navigation", "search") || "Search",
            match: (path: string) => path.includes("/search"),
        },
        {
            key: "account",
            path: "/account",
            icon: FiUser,
            label: translate("navigation", "account") || "Account",
            match: (path: string) => path.includes("/account"),
        },
        {
            key: "cart",
            path: "/cart",
            icon: FiShoppingBag,
            label: translate("general", "cart") || "Cart",
            match: (path: string) => path.includes("/cart"),
            badge: cartCount > 0 ? cartCount : undefined,
        },
    ];

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-sticky bg-nxl-black/95 backdrop-blur-md border-t border-nxl-gold/20 shadow-luxury-lg safe-area-bottom lg:hidden"
            role="navigation"
            aria-label="Mobile bottom navigation"
        >
            <div className="flex items-center justify-around h-16 mobile-container">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.match(pathname);

                    return (
                        <LocalizedClientLink
                            key={item.key}
                            href={item.path}
                            className={`
                relative flex flex-col items-center justify-center mobile-touch-target px-2 py-1 rounded-lg transition-all duration-300 group
                ${isActive
                                    ? "text-nxl-gold"
                                    : "text-nxl-ivory/70 hover:text-nxl-gold active:text-nxl-gold/80"
                                }
              `}
                            aria-label={`${item.label}${item.badge ? ` (${item.badge} items)` : ""}`}
                            aria-current={isActive ? "page" : undefined}
                        >
                            {/* Icon container with enhanced styling */}
                            <div className="relative mb-1">
                                <Icon
                                    size={20}
                                    className={`transition-all duration-300 ${isActive ? "scale-110" : "group-hover:scale-105 group-active:scale-95"
                                        }`}
                                />

                                {/* Badge for cart */}
                                {item.badge && (
                                    <span
                                        className="absolute -top-2 -right-2 bg-nxl-gold text-nxl-black text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center border border-nxl-black"
                                        aria-hidden="true"
                                    >
                                        {item.badge > 99 ? "99+" : item.badge}
                                    </span>
                                )}

                                {/* Active indicator */}
                                {isActive && (
                                    <div className="absolute -bottom-1 left-1/2 w-1 h-1 bg-nxl-gold rounded-full transform -translate-x-1/2 animate-pulse" />
                                )}
                            </div>

                            {/* Label with enhanced typography */}
                            <span
                                className={`
                  text-xs font-medium transition-all duration-300 leading-none
                  ${isActive ? "text-nxl-gold" : "text-nxl-ivory/60 group-hover:text-nxl-ivory/80"}
                `}
                            >
                                {item.label}
                            </span>

                            {/* Hover background effect */}
                            <div
                                className={`
                  absolute inset-0 bg-nxl-gold/5 rounded-lg scale-90 opacity-0 
                  group-hover:scale-100 group-hover:opacity-100 group-active:opacity-50
                  transition-all duration-200 -z-10
                `}
                            />
                        </LocalizedClientLink>
                    );
                })}
            </div>

            {/* Bottom safe area spacer for devices with home indicators */}
            <div className="h-[env(safe-area-inset-bottom)] bg-nxl-black/95" />
        </nav>
    );
};

export default BottomNav; 