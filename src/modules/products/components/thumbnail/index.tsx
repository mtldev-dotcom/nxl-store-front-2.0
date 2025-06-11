import { Container, clx } from "@medusajs/ui"
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
    <Container
      className={clx(
        "relative w-full overflow-hidden bg-nxl-navy/10 border border-nxl-gold/5 transition-all duration-500 ease-out",
        className,
        {
          "aspect-[4/5]": isFeatured,
          "aspect-[3/4]": !isFeatured && size !== "square",
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
      
      {/* Luxury overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-nxl-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </Container>
  )
}

const ImageOrPlaceholder = ({
  image,
  size,
}: Pick<ThumbnailProps, "size"> & { image?: string }) => {
  return image ? (
    <Image
      src={image}
      alt="Product image"
      className="absolute inset-0 object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
      draggable={false}
      quality={75}
      sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
      fill
      loading="lazy"
    />
  ) : (
    <div className="w-full h-full absolute inset-0 flex items-center justify-center bg-nxl-navy/20">
      <div className="text-center space-y-2">
        <PlaceholderImage size={size === "small" ? 16 : 24} />
        <p className="text-nxl-ivory/40 text-xs font-body">No Image</p>
      </div>
    </div>
  )
}

export default Thumbnail
