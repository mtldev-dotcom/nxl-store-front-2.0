import { deleteLineItem } from "@lib/data/cart"
import { Spinner, Trash } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { useState } from "react"

const DeleteButton = ({
  id,
  children,
  className,
}: {
  id: string
  children?: React.ReactNode
  className?: string
}) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    await deleteLineItem(id).catch((err) => {
      setIsDeleting(false)
    })
  }

  return (
    <div
      className={clx(
        "flex items-center justify-between text-small-regular",
        className
      )}
    >
      <button
        className="flex gap-x-1 text-nxl-ivory/70 hover:text-nxl-gold cursor-pointer transition-colors duration-200"
        onClick={() => handleDelete(id)}
      >
        {isDeleting ? <Spinner className="animate-spin text-nxl-gold" /> : <Trash className="text-nxl-ivory/70 hover:text-nxl-gold" />}
        <span>{children}</span>
      </button>
    </div>
  )
}

export default DeleteButton
