"use client";
import React from "react";

import Link from "next/link";

import { Instagram, Threads, Camera } from "iconoir-react";

interface FooterProps {
  // Define props here
}

const Footer: React.FC<FooterProps> = (props) => {
  return (
    <footer
      className="text-fabric flex w-full 
                      flex-col overflow-clip rounded-lg bg-[#202020]"
    >
      <div className="grid gap-4 p-8 sm:p-12 md:grid-cols-3 md:p-16">
        <div className="col-span-2">
          <h1 className="text-[1.75rem] sm:text-[3rem] md:text-[2.8rem] lg:text-[4rem]">
            47° 39’ 19.1484” N
          </h1>
          <h1 className="text-[1.75rem] sm:text-[3rem] md:text-[2.8rem] lg:text-[4rem]">
            122° 18’ 43.3512” W
          </h1>
        </div>
        <div className="flex flex-col md:items-end">
          <h4>david@davidschultz.co</h4>
          <div className="mt-2 flex gap-4">
            <Link
              href="https://www.instagram.com/schultzdavidg/"
              target="_blank"
            >
              <Instagram className="h-8 w-8 hover:text-[#FC8E37]" />
            </Link>
            <Link href="https://www.threads.net/@schultzdavidg" target="_blank">
              <Threads className="h-8 w-8 hover:text-[#FC8E37]" />
            </Link>
            <Link href="https://unsplash.com/@davidschultz" target="_blank">
              <Camera className="h-8 w-8 hover:text-[#FC8E37]" />
            </Link>
          </div>
        </div>
      </div>

      <div
        className="flex flex-col gap-2 bg-[#2E2E2E] p-8 text-[#ACA998] sm:flex-row
                      sm:justify-between sm:gap-0"
      >
        <p className="font-500">
          Built with Next.js, Tailwind.css, and shad/cn.
        </p>
        <p className="font-500">© 2024 ALL RIGHTS RESERVED</p>
      </div>
    </footer>
  );
};

export default Footer;
