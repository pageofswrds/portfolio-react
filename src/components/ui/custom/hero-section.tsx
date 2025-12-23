"use client";
import React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

import SiteBar from "@/components/ui/custom/SiteBar";

const PointScene = dynamic(() => import("@/components/3d/pointScene"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-neutral-800" />,
});

const gogglesSrc = "/fa/head-side-goggles-solid.svg";
const browserSrc = "/fa/browser-solid.svg";

interface HeroSectionProps {
  // Define the props for your component here
}

const HeroSection: React.FC<HeroSectionProps> = () => {
  return (
    <section className="mx-2 h-[800px] rounded-b-lg bg-neutral-800 md:h-[928px]">
      <div className="absolute top-[500px] w-[calc(100vw-4rem)] px-8 sm:px-16 md:top-[650px] md:px-24 lg:px-32">
        <h1 className="ml-1 text-5xl text-white">Interaction Designer</h1>
        <h3 className="text-hypergold mt-3 ml-1">Seattle, WA</h3>

        <div className="xs:flex-row mt-8 flex flex-col items-start gap-2 text-white">
          <div className="bg-foreground flex rounded-full px-4 py-1">
            <Image
              src={gogglesSrc}
              width={16}
              height={16}
              alt="vr goggles icon"
              className="mr-1"
            />
            <p className="font-500">Mixed Reality</p>
          </div>
          <div className="bg-foreground flex rounded-full px-4 py-1">
            <Image
              src={browserSrc}
              width={16}
              height={16}
              alt="browser icon"
              className="mr-1"
            />
            <p className="font-500">Front-end</p>
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-1 w-[calc(100vw-2rem)] p-6">
        <SiteBar variant="inverted" />
      </div>

      <div className="top-0 h-[800px] w-full md:h-[800px]">
        <PointScene />
      </div>
    </section>
  );
};

export default HeroSection;
