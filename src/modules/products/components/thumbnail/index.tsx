import { clx } from "@medusajs/ui"
import Image from "next/image"
import React from "react"

import PlaceholderImage from "@modules/common/icons/placeholder-image"

type ThumbnailProps = {
  thumbnail?: string | null
  // TODO: Fix image typings
  images?: any[] | null
  size?: "small" | "medium" | "large" | "full" | "square"
  isFeatured?: boolean
  className?: string
  "data-testid"?: string
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  size = "small",
  isFeatured,
  className,
  "data-testid": dataTestid,
}) => {
  const initialImage = thumbnail || images?.[0]?.url

  return (
    <div
      className={clx(
        "relative w-full overflow-hidden bg-gray-50 transition-all duration-300",
        className,
        {
          "aspect-[4/5]": isFeatured || size === "full",
          "aspect-[3/4]": !isFeatured && size !== "square" && size !== "full",
          "aspect-[1/1]": size === "square",
          "w-[180px]": size === "small",
          "w-[290px]": size === "medium",
          "w-[440px]": size === "large",
          "w-full": size === "full",
        }
      )}
      data-testid={dataTestid}
    >
      <ImageOrPlaceholder image={initialImage} size={size} />
    </div>
  )
}

const ImageOrPlaceholder = ({
  image,
  size,
}: Pick<ThumbnailProps, "size"> & { image?: string }) => {
  return image ? (
    <div className="absolute inset-0 w-full h-full">
      <Image
        src={image}
        alt="Product image"
        className="object-cover object-center w-full h-full transition-transform duration-500 ease-out"
        draggable={false}
        quality={85}
        sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
        fill
        loading="lazy"
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
    </div>
  ) : (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-center space-y-2">
        <PlaceholderImage size={size === "small" ? 16 : 24} />
        <p className="text-gray-400 text-xs font-medium">No Image</p>
      </div>
    </div>
  )
}

export default Thumbnail
