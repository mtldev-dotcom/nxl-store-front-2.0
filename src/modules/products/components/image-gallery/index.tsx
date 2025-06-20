"use client"

import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { useTranslation } from "@lib/context/translation-context"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const { translate } = useTranslation()

  // Minimum swipe distance for mobile gestures
  const minSwipeDistance = 50

  // Handle touch events for mobile swipe gestures
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    })
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    })
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distanceX = touchStart.x - touchEnd.x
    const distanceY = touchStart.y - touchEnd.y
    const isLeftSwipe = distanceX > minSwipeDistance
    const isRightSwipe = distanceX < -minSwipeDistance
    const isVerticalSwipe = Math.abs(distanceY) > Math.abs(distanceX)

    // Only handle horizontal swipes
    if (!isVerticalSwipe) {
      if (isLeftSwipe && selectedImage < images.length - 1) {
        setSelectedImage(selectedImage + 1)
      }
      if (isRightSwipe && selectedImage > 0) {
        setSelectedImage(selectedImage - 1)
      }
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isFullscreen) return

      switch (e.key) {
        case 'ArrowLeft':
          if (selectedImage > 0) setSelectedImage(selectedImage - 1)
          break
        case 'ArrowRight':
          if (selectedImage < images.length - 1) setSelectedImage(selectedImage + 1)
          break
        case 'Escape':
          setIsFullscreen(false)
          break
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [selectedImage, images.length, isFullscreen])

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gradient-to-br from-nxl-navy/20 to-nxl-black/40 border border-nxl-gold/20 rounded-2xl backdrop-blur-sm">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-nxl-gold/20 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-nxl-gold/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-nxl-ivory/60 font-body">No images available</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="w-full" ref={galleryRef}>
        {/* Mobile Layout: Enhanced single image with gestures */}
        <div className="lg:hidden">
          {/* Main Image with Swipe Support */}
          <div
            className="relative aspect-square w-full bg-gradient-to-br from-nxl-black to-nxl-navy/20 border border-nxl-gold/20 rounded-2xl overflow-hidden backdrop-blur-sm"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {images[selectedImage]?.url && (
              <Image
                src={images[selectedImage].url}
                alt={`Product image ${selectedImage + 1}`}
                fill
                priority={selectedImage <= 2}
                className={`object-cover transition-all duration-700 cursor-zoom-in ${isZoomed ? 'scale-150' : 'hover:scale-105'
                  }`}
                sizes="(max-width: 768px) 100vw, 50vw"
                onClick={() => setIsFullscreen(true)}
                onDoubleClick={() => setIsZoomed(!isZoomed)}
              />
            )}

            {/* Enhanced Image Counter with Progress Bar */}
            <div className="absolute top-4 right-4 space-y-2">
              <div className="bg-nxl-black/80 backdrop-blur-md text-nxl-gold px-4 py-2 rounded-full text-sm font-button border border-nxl-gold/30">
                {selectedImage + 1} / {images.length}
              </div>
              <div className="w-16 h-1 bg-nxl-black/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-nxl-gold transition-all duration-300"
                  style={{ width: `${((selectedImage + 1) / images.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Mobile Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => selectedImage > 0 && setSelectedImage(selectedImage - 1)}
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-nxl-black/80 backdrop-blur-md border border-nxl-gold/30 rounded-full flex items-center justify-center text-nxl-gold transition-all duration-300 ${selectedImage === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-nxl-gold hover:text-nxl-black active:scale-95'
                    }`}
                  disabled={selectedImage === 0}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  onClick={() => selectedImage < images.length - 1 && setSelectedImage(selectedImage + 1)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-nxl-black/80 backdrop-blur-md border border-nxl-gold/30 rounded-full flex items-center justify-center text-nxl-gold transition-all duration-300 ${selectedImage === images.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-nxl-gold hover:text-nxl-black active:scale-95'
                    }`}
                  disabled={selectedImage === images.length - 1}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Zoom Indicator */}
            {isZoomed && (
              <div className="absolute bottom-4 left-4 bg-nxl-black/80 backdrop-blur-md text-nxl-gold px-3 py-1 rounded-full text-xs font-button border border-nxl-gold/30">
                {translate("product", "zoom", "Zoomed")} - {translate("product", "swipeForMore", "Double tap to reset")}
              </div>
            )}
          </div>

          {/* Enhanced Thumbnail Navigation */}
          {images.length > 1 && (
            <div className="flex gap-3 mt-6 px-2 overflow-x-auto scrollbar-hide pb-2">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${selectedImage === index
                    ? 'border-nxl-gold shadow-luxury scale-105'
                    : 'border-nxl-gold/20 hover:border-nxl-gold/60 hover:scale-102'
                    }`}
                >
                  {image.url && (
                    <Image
                      src={image.url}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  )}
                  {selectedImage === index && (
                    <div className="absolute inset-0 bg-nxl-gold/20 flex items-center justify-center">
                      <div className="w-3 h-3 bg-nxl-gold rounded-full"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Mobile Swipe Indicator */}
          {images.length > 1 && (
            <div className="flex justify-center mt-4">
              <div className="flex items-center gap-2 text-xs text-nxl-ivory/60 font-body">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                <span>{translate("product", "swipeForMore", "Swipe to browse")}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Desktop Layout: Masonry-style grid */}
        <div className="hidden lg:block">
          <div className="grid gap-6 auto-rows-auto">
            {images.map((image, index) => (
              <Container
                key={image.id}
                className={`relative overflow-hidden bg-gradient-to-br from-nxl-black to-nxl-navy/20 border border-nxl-gold/20 rounded-2xl group cursor-zoom-in transition-all duration-500 hover:border-nxl-gold/60 hover:shadow-luxury backdrop-blur-sm ${index === 0 ? 'aspect-[4/5]' : index % 3 === 1 ? 'aspect-[3/4]' : 'aspect-[5/6]'
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

                {/* Enhanced Overlay with Zoom Indicator */}
                <div className="absolute inset-0 bg-gradient-to-t from-nxl-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-6">
                  <div className="text-nxl-gold text-sm font-button uppercase tracking-wider bg-nxl-black/80 backdrop-blur-md px-4 py-2 rounded-lg border border-nxl-gold/30">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                      <span>{translate("product", "viewFullscreen", "View Full Size")}</span>
                    </div>
                  </div>
                  <div className="text-nxl-gold/60 text-xs font-body bg-nxl-black/60 backdrop-blur-md px-3 py-1 rounded-lg">
                    {index + 1} of {images.length}
                  </div>
                </div>
              </Container>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-nxl-black/95 z-50 flex items-center justify-center backdrop-blur-md">
          <div className="relative w-full h-full max-w-7xl max-h-full p-4">
            {/* Enhanced Close Button */}
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-6 right-6 z-10 bg-nxl-black/80 backdrop-blur-md text-nxl-gold p-3 rounded-full border border-nxl-gold/30 hover:bg-nxl-gold hover:text-nxl-black transition-all duration-300 group"
            >
              <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Main Fullscreen Image */}
            <div className="relative w-full h-full flex items-center justify-center">
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

            {/* Enhanced Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : images.length - 1)}
                  className="absolute left-6 top-1/2 -translate-y-1/2 bg-nxl-black/80 backdrop-blur-md text-nxl-gold p-4 rounded-full border border-nxl-gold/30 hover:bg-nxl-gold hover:text-nxl-black transition-all duration-300 group"
                >
                  <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  onClick={() => setSelectedImage(prev => prev < images.length - 1 ? prev + 1 : 0)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 bg-nxl-black/80 backdrop-blur-md text-nxl-gold p-4 rounded-full border border-nxl-gold/30 hover:bg-nxl-gold hover:text-nxl-black transition-all duration-300 group"
                >
                  <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Enhanced Image Counter and Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6">
              <div className="bg-nxl-black/80 backdrop-blur-md text-nxl-gold px-6 py-3 rounded-full text-sm font-button border border-nxl-gold/30">
                {selectedImage + 1} of {images.length}
              </div>

              {/* Thumbnail Strip in Fullscreen */}
              {images.length > 1 && (
                <div className="flex gap-2 max-w-md overflow-x-auto scrollbar-hide">
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(index)}
                      className={`relative flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 ${selectedImage === index
                        ? 'border-nxl-gold'
                        : 'border-nxl-gold/20 hover:border-nxl-gold/60'
                        }`}
                    >
                      {image.url && (
                        <Image
                          src={image.url}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Keyboard Navigation Hint */}
            <div className="absolute bottom-6 right-6 bg-nxl-black/60 backdrop-blur-md text-nxl-ivory/60 px-4 py-2 rounded-lg text-xs font-body">
              {translate("navigation", "keyboardHint", "Use ← → arrow keys or ESC to close")}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ImageGallery
