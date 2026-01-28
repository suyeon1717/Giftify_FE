'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface ProductImagesProps {
  images: string[];
  alt: string;
}

/**
 * ProductImages - Image carousel for product detail
 * Shows thumbnails for navigation
 */
export function ProductImages({ images, alt }: ProductImagesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter out empty strings and invalid URLs
  const validImages = images?.filter((img) => img && img.trim() !== '') || [];

  if (validImages.length === 0) {
    return (
      <div className="relative aspect-square w-full bg-gray-100 flex items-center justify-center">
        <p className="text-gray-400">No image available</p>
      </div>
    );
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={validImages[currentIndex]}
          alt={`${alt} - Image ${currentIndex + 1}`}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />

        {/* Navigation Arrows (only show if multiple images) */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Pagination Dots */}
        {validImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {validImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  'h-2 w-2 rounded-full transition-all',
                  index === currentIndex
                    ? 'bg-white w-4'
                    : 'bg-white/50'
                )}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {validImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                'relative aspect-square overflow-hidden rounded-md border-2 transition-all',
                index === currentIndex
                  ? 'border-indigo-500'
                  : 'border-transparent hover:border-gray-300'
              )}
            >
              <Image
                src={image}
                alt={`${alt} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="25vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
