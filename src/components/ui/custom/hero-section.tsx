"use client";
import React from "react";
import "@/app/styles.css";
import Image from "next/image";

import SiteBar from "@/components/ui/custom/SiteBar";
import PointScene from "@/components/3d/pointScene";

const gogglesSrc = "/fa/head-side-goggles-solid.svg";
const browserSrc = "/fa/browser-solid.svg";

interface HeroSectionProps {
  // Define the props for your component here
}

const HeroSection: React.FC<HeroSectionProps> = () => {
  return (
    <section className="mx-2 h-[800px] rounded-b-lg bg-neutral-800 md:h-[928px]">
      <div className="absolute top-[500px] w-[calc(100vw-4rem)] px-8 sm:px-16 md:top-[650px] md:px-24 lg:px-32 ">
        <h1 className="text-5xl ml-1 text-white">Interaction Designer</h1>
        <h3 className="text-hypergold ml-1 mt-3">Seattle, WA</h3>

        <div className="mt-8 flex flex-col items-start gap-2 text-white xs:flex-row">
          <div className="bg-foreground flex rounded-full px-4 py-1">
            <Image
              src={gogglesSrc}
              width={16}
              height={16}
              alt="vr goggles icon"
              className="mr-1"
            />
            <p className="font-500">Mixed Reality</p>
            {/* <p className="font-500" style={{"leading-trim": 'both', 'text-edge': 'cap'}}>Mixed Reality</p> */}
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
            {/* <p className="font-500 " style={{"leading-trim": 'both', 'text-edge': 'cap'}}>Front-end</p> */}
          </div>
        </div>
      </div>

      <div className="z-1 sticky top-0 w-[calc(100vw-2rem)] p-6">
        <SiteBar variant="inverted" />
      </div>

      <div className="top-0 h-[800px] w-full md:h-[800px]">
        {/* <PortalScene isRunning={isRunning} /> */}
        {/* <GlassScene /> */}
        <PointScene />
      </div>

      {/* <div className="mx-2 p-4 sticky top-1 w-full">
          <SiteBar />
        </div> */}

      {/* <div className="absolute z-1 p-6 top-[calc(100vh-32rem)] md:top-[calc(100vh-24rem)] right-16">
          <Button onClick={toggleRunning} className={isRunning ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}>{isRunning ? "Pause Sim" : "Start Sim"}</Button>
        </div> */}
    </section>
  );
};

export default HeroSection;
