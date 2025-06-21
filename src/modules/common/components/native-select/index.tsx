import { ChevronUpDown } from "@medusajs/icons"
import { clx, Label } from "@medusajs/ui"
import {
  SelectHTMLAttributes,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useId,
} from "react"

export type NativeSelectProps = {
  placeholder?: string
  errors?: Record<string, unknown>
  touched?: Record<string, unknown>
  label?: string
  required?: boolean
  topLabel?: string
} & SelectHTMLAttributes<HTMLSelectElement>

const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  (
    {
      placeholder = "Select...",
      defaultValue,
      className,
      children,
      label,
      name,
      required,
      topLabel,
      id,
      ...props
    },
    ref
  ) => {
    const innerRef = useRef<HTMLSelectElement>(null)
    const [isPlaceholder, setIsPlaceholder] = useState(false)

    // Generate a unique ID for this select instance
    const uniqueId = useId()
    const selectId = id || `${name}-${uniqueId}` || uniqueId

    useImperativeHandle<HTMLSelectElement | null, HTMLSelectElement | null>(
      ref,
      () => innerRef.current
    )

    useEffect(() => {
      if (innerRef.current && innerRef.current.value === "") {
        setIsPlaceholder(true)
      } else {
        setIsPlaceholder(false)
      }
    }, [innerRef.current?.value])

    return (
      <div className="flex flex-col w-full">
        {topLabel && (
          <Label className="mb-2 txt-compact-medium-plus">{topLabel}</Label>
        )}
        <div>
          {label && (
            <Label
              htmlFor={selectId}
              className="flex items-center justify-center mx-3 px-1 transition-all absolute duration-300 top-3 -z-1 origin-0 text-gray-700 pointer-events-none"
            >
              {label}
              {required && <span className="text-rose-500">*</span>}
            </Label>
          )}
          <div
            onFocus={() => innerRef.current?.focus()}
            onBlur={() => innerRef.current?.blur()}
            className={clx(
              "relative flex items-center text-base-regular border border-nxl-gold/30 bg-nxl-navy/20 rounded-md hover:bg-nxl-navy/30 focus-within:ring-2 focus-within:ring-nxl-gold focus-within:ring-opacity-50 focus-within:border-nxl-gold transition-all duration-300",
              className,
              {
                "text-nxl-ivory/50": isPlaceholder,
                "pt-4 pb-1": label, // Add top padding when label is present (floating label style)
              }
            )}
          >
            <select
              ref={innerRef}
              id={selectId}
              name={name}
              defaultValue={defaultValue}
              required={required}
              className={clx(
                "appearance-none flex-1 bg-transparent border-none px-4 transition-colors duration-150 outline-none text-white",
                label ? "py-2.5 pt-4" : "py-2.5" // Adjust padding based on label presence
              )}
              {...props}
            >
              <option disabled value="">
                {placeholder}
              </option>
              {children}
            </select>
            <span className="absolute right-4 inset-y-0 flex items-center pointer-events-none ">
              <ChevronUpDown />
            </span>
          </div>
        </div>
      </div>
    )
  }
)

NativeSelect.displayName = "NativeSelect"

export default NativeSelect
