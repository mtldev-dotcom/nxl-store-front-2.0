/**
 * Enhanced OptionSelect Component with Tolgee Translation Support
 * -------------------------------------------------------------
 * Features:
 * - Dictionary-based translation for UI labels (Select {option})
 * - Tolgee translation for option titles and values from backend
 * - Fallback to original data if translations are missing
 * - Maintains all existing styling and functionality
 */

"use client"

import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import React from "react"
import { useTranslation } from "@lib/context/translation-context"
import { useParams } from "next/navigation"
import {
  getTranslatedOption,
  getTranslatedOptionValue,
  StoreOptionWithTranslations,
  StoreOptionValueWithTranslations
} from "@lib/util/translations"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const { translate } = useTranslation()
  const params = useParams()
  const locale = params.locale as string

  // Get translated option data using Tolgee translations
  // This will translate option titles like "Color" → "Couleur"
  const translatedOption = locale
    ? getTranslatedOption(option as StoreOptionWithTranslations, locale)
    : option

  // Get the translated option title, with fallback to the passed title prop
  const displayTitle = translatedOption.title || title

  // Get translated option values
  // This will translate values like "Blue" → "Bleu", "Large" → "Grande"
  const translatedValues = (translatedOption.values ?? []).map((optionValue) => {
    const translatedValue = locale
      ? getTranslatedOptionValue(optionValue as StoreOptionValueWithTranslations, locale)
      : optionValue

    return {
      originalValue: optionValue.value, // Keep original for updateOption callback
      displayValue: translatedValue.value || optionValue.value // Use translated for display
    }
  })

  return (
    <div className="flex flex-col gap-y-3">
      {/* Option Label with Dictionary Translation */}
      <span className="text-sm text-nxl-gold font-semibold">
        {/* Use dictionary translation for the "Select {option}" label */}
        {translate("product", "selectOption", "Select {option}").replace("{option}", displayTitle)}
      </span>

      {/* Option Values with Tolgee Translation */}
      <div
        className="flex flex-wrap justify-between gap-2"
        data-testid={dataTestId}
      >
        {translatedValues.map(({ originalValue, displayValue }) => {
          return (
            <button
              onClick={() => updateOption(option.id, originalValue)} // Use original value for backend
              key={originalValue}
              className={clx(
                "border-nxl-gold/30 bg-nxl-black text-nxl-ivory border text-small-regular h-10 rounded-rounded p-2 flex-1 transition-all duration-300",
                {
                  "border-nxl-gold bg-nxl-gold/10 text-nxl-gold": originalValue === current,
                  "hover:border-nxl-gold/50 hover:bg-nxl-navy/50": originalValue !== current,
                }
              )}
              disabled={disabled}
              data-testid="option-button"
              aria-label={`${displayTitle}: ${displayValue}`} // Accessibility with translated text
              title={displayValue} // Tooltip with translated value
            >
              {displayValue} {/* Display translated value to user */}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect
