"use client"

import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import React from "react"
import { useTranslation } from "@lib/context/translation-context"

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
  const filteredOptions = (option.values ?? []).map((v) => v.value)

  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-sm text-nxl-gold font-semibold">
        {translate("product", "selectOption", "Select {option}").replace("{option}", title)}
      </span>
      <div
        className="flex flex-wrap justify-between gap-2"
        data-testid={dataTestId}
      >
        {filteredOptions.map((v) => {
          return (
            <button
              onClick={() => updateOption(option.id, v)}
              key={v}
              className={clx(
                "border-nxl-gold/30 bg-nxl-black text-nxl-ivory border text-small-regular h-10 rounded-rounded p-2 flex-1 transition-all duration-300",
                {
                  "border-nxl-gold bg-nxl-gold/10 text-nxl-gold": v === current,
                  "hover:border-nxl-gold/50 hover:bg-nxl-navy/50": v !== current,
                }
              )}
              disabled={disabled}
              data-testid="option-button"
            >
              {v}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect
