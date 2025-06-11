"use client"

import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Image from "next/image"
import { useState } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-nxl-navy/20 border border-nxl-gold/20 rounded-lg">
        <span className="text-nxl-ivory/60 font-body">No images available</span>
      </div>
    )
  }

  return (
    <>
      <div className="w-full">
        {/* Mobile Layout: Single image with dots */}
        <div className="lg:hidden">
          {/* Main Image */}
          <div className="relative aspect-square w-full bg-nxl-black border border-nxl-gold/20 rounded-lg overflow-hidden">
            {images[selectedImage]?.url && (
              <Image
                src={images[selectedImage].url}
                alt={`Product image ${selectedImage + 1}`}
                fill
                priority={selectedImage <= 2}
                className="object-cover hover:scale-105 transition-transform duration-700 cursor-zoom-in"
                sizes="(max-width: 768px) 100vw, 50vw"
                onClick={() => setIsFullscreen(true)}
              />
            )}
            
            {/* Image Counter */}
            <div className="absolute top-4 right-4 bg-nxl-black/80 text-nxl-gold px-3 py-1 rounded-full text-sm font-button">
              {selectedImage + 1} / {images.length}
            </div>
          </div>

          {/* Thumbnail Navigation */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-4 px-2 overflow-x-auto scrollbar-hide">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    selectedImage === index
                      ? 'border-nxl-gold shadow-lg'
                      : 'border-nxl-gold/20 hover:border-nxl-gold/60'
                  }`}
                >
                  {image.url && (
                    <Image
                      src={image.url}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Layout: Grid of images */}
        <div className="hidden lg:block">
          <div className="grid gap-4 auto-rows-auto">
            {images.map((image, index) => (
              <Container
                key={image.id}
                className={`relative overflow-hidden bg-nxl-black border border-nxl-gold/20 rounded-lg group cursor-zoom-in transition-all duration-300 hover:border-nxl-gold/60 hover:shadow-luxury ${
                  index === 0 ? 'aspect-[4/5]' : 'aspect-[3/4]'
                }`}
                onClick={() => {
                  setSelectedImage(index)
                  setIsFullscreen(true)
                }}
              >
                {image.url && (
                  <Image
                    src={image.url}
                    priority={index <= 2}
                    className="absolute inset-0 object-cover group-hover:scale-105 transition-transform duration-700"
                    alt={`Product image ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  />
                )}
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-nxl-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-nxl-gold text-sm font-button uppercase tracking-wider bg-nxl-black/80 px-4 py-2 rounded-lg">
                    View Full Size
                  </div>
                </div>
              </Container>
            ))}
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-nxl-black/95 z-50 flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-4xl max-h-full">
            {/* Close Button */}
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 z-10 bg-nxl-black/80 text-nxl-gold p-2 rounded-full hover:bg-nxl-gold hover:text-nxl-black transition-colors duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Main Fullscreen Image */}
            <div className="relative w-full h-full">
              {images[selectedImage]?.url && (
                <Image
                  src={images[selectedImage].url}
                  alt={`Product image ${selectedImage + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              )}
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : images.length - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-nxl-black/80 text-nxl-gold p-3 rounded-full hover:bg-nxl-gold hover:text-nxl-black transition-colors duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  onClick={() => setSelectedImage(prev => prev < images.length - 1 ? prev + 1 : 0)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-nxl-black/80 text-nxl-gold p-3 rounded-full hover:bg-nxl-gold hover:text-nxl-black transition-colors duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-nxl-black/80 text-nxl-gold px-4 py-2 rounded-full text-sm font-button">
              {selectedImage + 1} of {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ImageGallery
