import { ArrowUpRightMini } from "@medusajs/icons"
import { Text } from "@medusajs/ui"
import LocalizedClientLink from "../localized-client-link"

type InteractiveLinkProps = {
  href: string
  children?: React.ReactNode
  onClick?: () => void
  className?: string
  dictionary?: Record<string, any>
}

const InteractiveLink = ({
  href,
  children,
  onClick,
  className,
  ...props
}: InteractiveLinkProps) => {
  return (
    <LocalizedClientLink
      className={`flex gap-x-1 items-center group transition-colors duration-300 hover:text-nxl-gold ${className || ''}`}
      href={href}
      onClick={onClick}
      {...props}
    >
      <Text className="text-ui-fg-interactive group-hover:text-nxl-gold transition-colors duration-300">{children}</Text>
      <ArrowUpRightMini
        className="group-hover:rotate-45 ease-in-out duration-300 group-hover:text-nxl-gold"
        color="var(--fg-interactive)"
      />
    </LocalizedClientLink>
  )
}

export default InteractiveLink
