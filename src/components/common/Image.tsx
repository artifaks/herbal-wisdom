import NextImage, { ImageProps as NextImageProps } from 'next/image';
import { FC } from 'react';

interface ImageProps extends Omit<NextImageProps, 'alt' | 'sizes'> {
  alt: string; // Make alt required
  sizes?: string;
}

const Image: FC<ImageProps> = ({ alt, sizes, fill, ...props }) => {
  // If fill is true and sizes is not provided, set a default sizes value
  const defaultSizes = fill && !sizes ? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' : sizes;

  return (
    <NextImage
      alt={alt}
      {...props}
      fill={fill}
      sizes={defaultSizes}
    />
  );
};

export default Image;
