"use client";
import React from "react";
import "@/app/styles.css";
import Image from "next/image";

export default function AcquireWindow({ src = "default" }: { src?: string }) {
  return (
    <div className="card h-[400px] bg-clip-border">
      <Image
        src="/chrome-tool-bar.png"
        alt="toolbar"
        height={0}
        width={0}
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
      />
      <Image
        src={src}
        alt="acquire screen"
        height={0}
        width={0}
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
      />
    </div>
  );
}
