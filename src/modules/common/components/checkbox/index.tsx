import { Checkbox, Label } from "@medusajs/ui"
import React, { useId } from "react"

type CheckboxProps = {
  checked?: boolean
  onChange?: () => void
  label: string
  name?: string
  'data-testid'?: string
  id?: string
}

const CheckboxWithLabel: React.FC<CheckboxProps> = ({
  checked = true,
  onChange,
  label,
  name,
  'data-testid': dataTestId,
  id
}) => {
  // Generate a unique ID for this checkbox instance
  const uniqueId = useId()
  const checkboxId = id || `${name}-${uniqueId}` || `checkbox-${uniqueId}`

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.()
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Actual HTML checkbox input for proper form submission */}
      <input
        type="checkbox"
        id={checkboxId}
        name={name}
        checked={checked}
        onChange={handleChange}
        className="sr-only" // Hide the native checkbox visually
        data-testid={dataTestId}
      />

      {/* Visual checkbox for styling */}
      <div
        className="cursor-pointer"
        onClick={onChange}
      >
        <Checkbox
          className="text-base-regular flex items-center gap-x-2"
          role="checkbox"
          type="button"
          checked={checked}
          aria-checked={checked}
          tabIndex={-1} // Prevent tab focus since the real input handles that
        />
      </div>

      <Label
        htmlFor={checkboxId}
        className="!transform-none !txt-medium cursor-pointer"
        size="large"
      >
        {label}
      </Label>
    </div>
  )
}

export default CheckboxWithLabel
