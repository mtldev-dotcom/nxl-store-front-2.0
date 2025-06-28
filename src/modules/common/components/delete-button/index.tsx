"use client"

import { deleteLineItem } from "@lib/data/cart"
import { Spinner, Trash } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { useState } from "react"
import { useTranslation } from "@lib/context/translation-context"
import { useCart } from "@lib/context/cart-context"

interface DeleteButtonProps {
  id: string
  children?: React.ReactNode
  className?: string
  onDeleteStart?: () => void
  onDeleteComplete?: () => void
  onDeleteError?: (error: string) => void
  autoRefreshCart?: boolean
}

const DeleteButton = ({
  id,
  children,
  className,
  onDeleteStart,
  onDeleteComplete,
  onDeleteError,
  autoRefreshCart = true,
}: DeleteButtonProps) => {
  const { translate } = useTranslation()
  const { refreshCart } = useCart()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isDeleting) return

    setIsDeleting(true)
    onDeleteStart?.()

    // Haptic feedback on mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(10)
    }

    try {
      await deleteLineItem(id)

      // Auto refresh cart if enabled
      if (autoRefreshCart) {
        await refreshCart()
      }

      onDeleteComplete?.()

      // Success haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate([10, 50, 10])
      }
    } catch (err: any) {
      const errorMessage = err.message || translate("cart", "deleteError", "Failed to remove item")
      onDeleteError?.(errorMessage)
      setIsDeleting(false)

      // Error haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 100, 100])
      }
    }
  }

  return (
    <div
      className={clx(
        "flex items-center justify-center",
        className
      )}
    >
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className={clx(
          // Base styles
          "relative flex items-center justify-center gap-1 transition-all duration-200",
          "min-w-[44px] min-h-[44px] p-2 rounded-lg",
          "focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 focus:ring-offset-nxl-black",

          // Mobile touch optimization
          "mobile-touch-target -webkit-tap-highlight-color: transparent",

          // Colors and states
          "text-nxl-ivory/60 hover:text-red-400 hover:bg-red-500/10",
          "active:scale-95 active:bg-red-500/20",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent",

          // Loading state
          isDeleting && "pointer-events-none"
        )}
        aria-label={translate("cart", "removeItem", "Remove item from cart")}
        data-testid="cart-item-delete-button"
      >
        {/* Button content */}
        <div className="flex items-center gap-1">
          {isDeleting ? (
            <Spinner className="animate-spin text-red-400 w-4 h-4" />
          ) : (
            <Trash className="w-4 h-4 flex-shrink-0" />
          )}
          {children && (
            <span className="text-xs font-medium whitespace-nowrap">
              {children}
            </span>
          )}
        </div>

        {/* Loading overlay */}
        {isDeleting && (
          <div className="absolute inset-0 bg-red-500/5 rounded-lg animate-pulse" />
        )}
      </button>
    </div>
  )
}

export default DeleteButton
