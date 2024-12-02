'use client'

import Image from 'next/image'
import { useState } from 'react'

interface HerbImageProps {
  src: string
  alt: string
  className?: string
}

export function HerbImage({ src, alt, className }: HerbImageProps) {
  const [imageSrc, setImageSrc] = useState(src || '/placeholder-herb.jpg')

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className={className}
      onError={() => setImageSrc('/placeholder-herb.jpg')}
    />
  )
}
