"use client"

import { useEffect, useState } from "react"
import { HttpTypes } from "@medusajs/types"

interface CartIconEnhancedProps {
  cart: HttpTypes.StoreCart | null
  onClick?: () => void
  className?: string
  showBadge?: boolean
}

const CartIconEnhanced = ({
  cart,
  onClick,
  className = "",
  showBadge = true
}: CartIconEnhancedProps) => {
  const [itemCount, setItemCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const newCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
    
    if (newCount > itemCount) {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 300)
    }
    
    setItemCount(newCount)
  }, [cart?.items, itemCount])

  return (
    <button
      onClick={onClick}
      className={`relative p-2 text-nxl-ivory hover:text-nxl-gold transition-colors duration-300 group ${className}`}
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      {/* Cart Icon */}
      <div className={`transition-transform duration-300 ${isAnimating ? 'scale-110' : 'scale-100'} group-hover:scale-105`}>
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 2.5M7 13l2.5 2.5m6-2.5a2.5 2.5 0 105 0 2.5 2.5 0 00-5 0z" 
          />
        </svg>
      </div>

      {/* Quantity Badge */}
      {showBadge && (
        <div className={`absolute -top-2 -right-2 transition-all duration-300 z-10 ${
          isAnimating ? 'animate-bounce' : ''
        }`}>
          <div className="bg-nxl-gold text-nxl-black text-xs font-bold rounded-full min-w-[22px] h-6 flex items-center justify-center px-2 border-2 border-nxl-black shadow-lg">
            {itemCount > 99 ? '99+' : itemCount}
          </div>
        </div>
      )}

      {/* Hover Effect Ring */}
      <div className="absolute inset-0 rounded-full border-2 border-nxl-gold/0 group-hover:border-nxl-gold/30 transition-colors duration-300" />
    </button>
  )
}

export default CartIconEnhanced
