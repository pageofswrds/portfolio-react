import Image from "next/image";
import { IconButton } from "@/components/ui/IconButton";
import { ArrowUpRight } from "iconoir-react";
import { shouldSkipOptimization } from "@/lib/imageUtils";

// Using external URLs instead of base64 strings to avoid webpack
// deserialization performance warnings with large embedded images.

interface ArticleThumbnailProps {
  title: string;
  subtitle: string;
  thumbnail: string;
}

export function ArticleThumbnail({
  title,
  subtitle,
  thumbnail,
}: ArticleThumbnailProps) {
  // Image source is derived directly from props - no need for state or effect
  const imageSrc = thumbnail || "";
  const imageLoaded = Boolean(thumbnail);

  return (
    <div className="group flex flex-col gap-4">
      {imageLoaded && imageSrc ? (
        <Image
          src={imageSrc}
          alt="thumbnail"
          height={480}
          width={225}
          sizes="(max-width: 768px) 100vw, 225px"
          quality={75}
          unoptimized={shouldSkipOptimization(imageSrc)}
          className="border-bd-primary h-[250px] w-full min-w-full rounded border-[1px] object-cover"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSd1E2VvLoMp7QdULQnifsaSiCGk0qA+yi2srJe1GVPVV4vPE8eKTnPHyNrWkdPyI2wFAahoUSDLKJxUpFTCtAJ1yRZF5QQggONWWAQkBwZhL5B3I8SN0TqTCyRG3BhsR7oPJ2rIyIGl4cLODwj7XQJG2SrZGgVSn0aHp0IEDnWBQcaFAABhE5LRKk4iJA4CmgBqSm3pOQJPNBhZGYnI2DQBk4TjNg7N4YrXzFnaTpSYhH54hA2DCyqLh6JA1Dp0ECB//2Q=="
        />
      ) : (
        <div className="bg-bg-primary h-[200px] w-full animate-pulse"></div>
      )}

      <div className="flex">
        <div className="flex w-full flex-col">
          <h3 className="text-md leading-[28px]">{title}</h3>
          <p className="text-tx-tertiary font-mono text-xs">{subtitle}</p>
        </div>
        <IconButton
          variant="tertiary"
          className="group-hover:bg-bg-hover group-active:bg-bg-pressed transition-colors"
        >
          <ArrowUpRight />
        </IconButton>
      </div>
    </div>
  );
}
