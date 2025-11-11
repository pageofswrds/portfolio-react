import clsx from 'clsx';
import Link from "next/link";
import Image from "next/image";
import { IconButton } from "@/components/ui/IconButton";
import { ArrowUpRight } from 'iconoir-react';
import { ReactNode, useState, useEffect } from 'react';
import { shouldSkipOptimization } from '@/lib/imageUtils';

// Using external URLs instead of base64 strings to avoid webpack 
// deserialization performance warnings with large embedded images.

interface ArticleThumbnailProps {
  title: string;
  subtitle: string;
  thumbnail: string;
  // children?: ReactNode;
}

export function ArticleThumbnail({ title, subtitle, thumbnail }: ArticleThumbnailProps) {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Decode thumbnail when needed to avoid webpack cache serialization issues
    if (thumbnail) {
      // If it's a data URL or base64, we handle it here
      // Otherwise, just use the URL directly
      if (thumbnail.startsWith('data:') || thumbnail.length > 200) {
        // For large strings, we load them asynchronously
        const loadImage = async () => {
          setImageSrc(thumbnail);
          setImageLoaded(true);
        };
        loadImage();
      } else {
        setImageSrc(thumbnail);
        setImageLoaded(true);
      }
    }
  }, [thumbnail]);

  return (
    <div className="flex flex-col gap-4 group">
        {imageLoaded && imageSrc ? (
          <Image
            src={imageSrc}
            alt="thumbnail"
            height={480}
            width={225}
            sizes="(max-width: 768px) 100vw, 225px"
            quality={75}
            unoptimized={shouldSkipOptimization(imageSrc)}
            className="min-w-full h-[250px] w-full object-cover border-[1px] border-bd-primary rounded"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSd1E2VvLoMp7QdULQnifsaSiCGk0qA+yi2srJe1GVPVV4vPE8eKTnPHyNrWkdPyI2wFAahoUSDLKJxUpFTCtAJ1yRZF5QQggONWWAQkBwZhL5B3I8SN0TqTCyRG3BhsR7oPJ2rIyIGl4cLODwj7XQJG2SrZGgVSn0aHp0IEDnWBQcaFAABhE5LRKk4iJA4CmgBqSm3pOQJPNBhZGYnI2DQBk4TjNg7N4YrXzFnaTpSYhH54hA2DCyqLh6JA1Dp0ECB//2Q=="
          />
        ) : (
          <div className="bg-bg-primary w-full h-[200px] animate-pulse"></div>
        )}

        <div className="flex">
            <div className="flex flex-col w-full">
              <h3 className="text-md leading-[28px]">{title}</h3>
              <p className="font-mono text-xs text-tx-tertiary">{subtitle}</p>
            </div>
            <IconButton variant="tertiary" className="group-hover:bg-bg-hover group-active:bg-bg-pressed transition-colors"><ArrowUpRight/></IconButton>
        </div>
    </div>
  );
}
