"use client";
import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel"

// Chart icons imported but not used in this file

type FeatureCardProps = {
  // children: React.ReactNode;
  color: string;
  badge: string;
  h3: string;
  p: string;
  imagePreviewSrc: string;
  imageFullSrc?: string[];
  imageShadow: boolean;
};

export default function FeatureCard({
  color,
  badge,
  h3,
  p,
  imagePreviewSrc,
  imageFullSrc = [],
  imageShadow,
}: FeatureCardProps) {
  // const listCarouselImages = imageFullSrc.map((imgsrc, index) => {
  //   <CarouselItem key={index}>
  //     <Image
  //       src={imgsrc}
  //       alt=""
  //       height={0}
  //       width={0}
  //       sizes="225vw"
  //       style={{ width: '100%', height: 'auto' }}
  //     />
  //   </CarouselItem>
  // });

  return (
    <div
      className="flex flex-col items-center rounded-2xl p-8 text-center"
      style={{ backgroundColor: color + ", 10%)" }}
    >
      <Badge
        className="text-foreground"
        style={{ backgroundColor: color + ", 50%)" }}
      >
        {badge}
      </Badge>
      <h3 className="font-500 mt-4 mb-2">{h3}</h3>
      <p>{p}</p>

      {imageFullSrc.length === 0 ? (
        <div
          className="card mt-8"
          style={
            imageShadow
              ? { boxShadow: "0px 15px 15px 0px rgba(0, 0, 0, 0.10)" }
              : {}
          }
        >
          <Image
            src={imagePreviewSrc}
            alt=""
            height={0}
            width={0}
            sizes="225vw"
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      ) : (
        <Dialog>
          <DialogTrigger>
            <div
              className="card mt-8"
              style={
                imageShadow
                  ? { boxShadow: "0px 15px 15px 0px rgba(0, 0, 0, 0.10)" }
                  : {}
              }
            >
              <Image
                src={imagePreviewSrc}
                alt=""
                height={0}
                width={0}
                sizes="225vw"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-[calc(100vw-4rem)] overflow-clip bg-[#EEEEEE] md:min-w-[calc(100vw-16rem)]">
            <DialogDescription className="max-h-[calc(100vh-4rem)] w-full overflow-y-scroll sm:max-h-[calc(100vh-8rem)]">
              <Image
                src={imageFullSrc[0]}
                alt=""
                height={0}
                width={0}
                sizes="225vw"
                style={{ width: "100%", height: "auto" }}
              />
            </DialogDescription>

            {/* {imageFullSrc.length === 1 ? 
                    <Image
                      src={imageFullSrc[0]}
                      alt=""
                      height={0}
                      width={0}
                      sizes="225vw"
                      style={{ width: '100%', height: 'auto' }}
                    />
                  :
                    <Carousel>
                      <CarouselContent>
                        {listCarouselImages}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                } */}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
