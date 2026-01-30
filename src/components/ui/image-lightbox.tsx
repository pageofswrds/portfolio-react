"use client";

import * as React from "react";
import Image from "next/image";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ImageLightboxProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  unoptimized?: boolean;
}

export function ImageLightbox({
  src,
  alt,
  width,
  height,
  className,
  unoptimized,
}: ImageLightboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn("cursor-pointer", className)}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          unoptimized={unoptimized}
        />
      </button>

      <DialogContent className="max-h-[90vh] max-w-[90vw] border-none bg-transparent p-0">
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        <DialogClose className="absolute top-4 right-4 z-10 rounded-full bg-black/50 p-2 text-white opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:outline-none">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <Image
          src={src}
          alt={alt}
          width={width * 2}
          height={height * 2}
          unoptimized={unoptimized}
          className="max-h-[90vh] w-auto object-contain"
        />
      </DialogContent>
    </Dialog>
  );
}
