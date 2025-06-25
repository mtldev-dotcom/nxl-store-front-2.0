/**
 * Enhanced CartIcon Component
 * ---------------------------
 * Premium cart icon with:
 * - Smooth animations and micro-interactions
 * - Real-time item count updates
 * - Enhanced visual feedback
 * - Accessibility optimizations
 * - Performance optimizations
 */

"use client"

import { useEffect, useState, useCallback } from "react"
import { HttpTypes } from "@medusajs/types"

interface CartIconEnhancedProps {
  cart: HttpTypes.StoreCart | null
  onClick?: () => void
  className?: string
  showBadge?: boolean
  asButton?: boolean
}

const CartIconEnhanced = ({
  cart,
  onClick,
  className = "",
  showBadge = true,
  asButton = true
}: CartIconEnhancedProps) => {
  const [itemCount, setItemCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showPulse, setShowPulse] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [justUpdated, setJustUpdated] = useState(false)

  // Enhanced item count tracking with animation triggers
  useEffect(() => {
    const newCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0

    if (newCount !== itemCount) {
      // Item added animation
      if (newCount > itemCount) {
        setIsAnimating(true)
        setShowPulse(true)
        setJustUpdated(true)

        // Stagger animation cleanup
        setTimeout(() => setIsAnimating(false), 400)
        setTimeout(() => setShowPulse(false), 600)
        setTimeout(() => setJustUpdated(false), 1000)
      }

      setItemCount(newCount)
    }
  }, [cart?.items, itemCount])

  // Enhanced hover handlers
  const handleMouseEnter = useCallback(() => setIsHovered(true), [])
  const handleMouseLeave = useCallback(() => setIsHovered(false), [])

  // Enhanced click handler with haptic feedback
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Add subtle click feedback
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 200)

    // Trigger haptic feedback on mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(10) // Very subtle vibration
    }

    onClick?.()
  }, [onClick])

  const commonProps = {
    className: `
      relative p-2 text-nxl-ivory transition-all duration-300 group cursor-pointer
      hover:text-nxl-gold focus:text-nxl-gold
      ${isHovered ? 'scale-105' : 'scale-100'}
      ${isAnimating ? 'scale-110' : ''}
      ${justUpdated ? 'animate-pulse' : ''}
      ${className}
    `,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    ...(asButton && {
      onClick: handleClick,
      'aria-label': `Shopping cart with ${itemCount} item${itemCount !== 1 ? 's' : ''}`,
      'role': 'button',
      'tabIndex': 0
    })
  }

  const content = (
    <>
      {/* Enhanced Cart Icon */}
      <div className={`
        relative transition-all duration-300
        ${isAnimating ? 'animate-bounce' : ''}
        ${isHovered ? 'scale-110 rotate-12' : 'scale-100 rotate-0'}
        group-hover:scale-110 group-hover:rotate-12
      `}>
        <svg
          className="w-6 h-6 drop-shadow-sm"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 2.5M7 13l2.5 2.5m6-2.5a2.5 2.5 0 105 0 2.5 2.5 0 00-5 0z"
          />
        </svg>

        {/* Enhanced hover ring */}
        <div className={`
          absolute inset-0 rounded-full border border-nxl-gold/0 transition-all duration-300
          ${isHovered ? 'border-nxl-gold/30 scale-150' : 'scale-100'}
        `} />
      </div>

      {/* Enhanced Quantity Badge */}
      {showBadge && itemCount > 0 && (
        <div className={`
          absolute -top-2 -right-2 z-20 transition-all duration-300
          ${isAnimating ? 'animate-bounce scale-125' : 'scale-100'}
          ${showPulse ? 'animate-pulse' : ''}
          ${justUpdated ? 'ring-2 ring-nxl-gold/50 ring-offset-1 ring-offset-nxl-black' : ''}
        `}>
          <div className={`
            bg-gradient-to-r from-nxl-gold to-nxl-gold/90 text-nxl-black 
            text-xs font-bold rounded-full min-w-[24px] h-6 
            flex items-center justify-center px-2 
            border-2 border-nxl-black shadow-lg
            transition-all duration-300
            ${isHovered ? 'scale-110 shadow-nxl-gold/30' : 'scale-100'}
            ${itemCount > 99 ? 'text-[10px]' : 'text-xs'}
          `}>
            <span className="leading-none">
              {itemCount > 99 ? '99+' : itemCount}
            </span>
          </div>

          {/* Badge glow effect */}
          <div className={`
            absolute inset-0 bg-nxl-gold rounded-full blur-sm opacity-0 transition-opacity duration-300
            ${justUpdated ? 'opacity-30' : 'opacity-0'}
          `} />
        </div>
      )}

      {/* Enhanced Hover Effect Ring */}
      <div className={`
        absolute inset-0 rounded-full border border-nxl-gold/0 transition-all duration-500
        ${isHovered ? 'border-nxl-gold/20 scale-150' : 'scale-100'}
        group-hover:border-nxl-gold/20 group-hover:scale-150
      `} />

      {/* Activity pulse effect */}
      {justUpdated && (
        <div className="absolute inset-0 rounded-full bg-nxl-gold/10 animate-ping" />
      )}
    </>
  )

  if (asButton) {
    return (
      <button {...commonProps} type="button">
        {content}
      </button>
    )
  }

  return (
    <div {...commonProps}>
      {content}
    </div>
  )
}

export default CartIconEnhanced
