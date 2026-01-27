"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type InfoBoxProps = {
  children: React.ReactNode;
};

type InfoBoxHeaderProps = {
  title: string;
  subtitle: string;
  imageSrc: string;
};

type DataRow = {
  label: string;
  value: string;
};

type InfoBoxSectionProps = {
  title: string;
  dataRows: DataRow[];
  format: "A" | "B";
};

export function InfoBox({ children }: InfoBoxProps) {
  const [isAccordion, setIsAccordion] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsAccordion(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isAccordion) {
    return (
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1" className="card bg-background px-4">
          <AccordionTrigger className="font-500 text-lg">
            Project Info
          </AccordionTrigger>
          <AccordionContent>{children}</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }

  return (
    <div
      className={`md: card bg-background flex max-w-[300px] min-w-[250px] flex-col gap-3 p-6 ${isAccordion ? "accordion" : ""}`}
    >
      {children}
    </div>
  );
}

export function InfoBoxHeader({
  title,
  subtitle,
  imageSrc,
}: InfoBoxHeaderProps) {
  return (
    <div className="flex flex-col text-center">
      <h4>{title}</h4>
      <p className="text-secondary">{subtitle}</p>
      {imageSrc == "" ? (
        <></>
      ) : (
        <div className="card mt-4 mb-2">
          <Image
            src={imageSrc}
            alt={title}
            height={0}
            width={0}
            sizes="100vw"
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      )}
    </div>
  );
}

export function InfoBoxSection({
  title,
  dataRows,
  format,
}: InfoBoxSectionProps) {
  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-center self-stretch bg-[#8D9FFF]/[0.2] py-1">
        <p className="font-500">{title}</p>
      </div>
      <div
        className={`gap-2 self-stretch ${format === "A" ? "flex flex-col" : "grid grid-cols-2 md:flex md:flex-col"}`}
      >
        {dataRows.map((row, index) => (
          <div
            key={index}
            className={`flex ${format === "A" ? "flex-row" : "flex-col md:text-center"}`}
          >
            {/* <p className="text-sm font-500 w-[4rem]">{row.label}</p>
            <p className="text-sm font-400 grow">{row.value}</p> */}
            <p
              className={`font-500 text-sm ${format === "A" ? "w-[8rem]" : "grow"}`}
            >
              {row.label}
            </p>
            <p
              className={`font-400 w-full text-sm ${format === "A" ? "" : "text-secondary"}`}
            >
              {row.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
