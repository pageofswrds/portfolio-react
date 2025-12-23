import React from "react";
import Link from "next/link";
import { IconButton } from "./ui/IconButton";
import { NavArrowLeft } from "iconoir-react";
import { cn } from "@/lib/utils";

interface StickyCardProps {
  children: React.ReactNode;
  className?: string;
}

interface StickyCardNavProps {
  href: string;
  destination: string;
  page: string;
  className?: string;
}

export function StickyCardMask() {
  return (
    <section
      id="mask"
      className="sticky top-0 z-10 flex min-h-6 w-[calc(100%)] rounded-md"
    >
      <div
        id="cornerLeft"
        className="pointer-events-none absolute top-3 left-[-12px] z-10 h-[36px] w-[36px] overflow-hidden"
      >
        <div className="border-bd-primary corner-shadow absolute top-[12px] left-[12px] h-[48px] w-[48px] rounded-md border border-l-0"></div>
      </div>
      <div className="border-bd-primary absolute top-3 left-6 z-0 h-[13px] w-[calc(100%-48px)] border-b" />
      <div
        id="cornerRight"
        className="pointer-events-none absolute top-3 right-[-12px] z-10 h-[36px] w-[36px] overflow-hidden"
      >
        <div className="border-bd-primary corner-shadow absolute top-[12px] right-[12px] h-[48px] w-[48px] rounded-md border border-r-0"></div>
      </div>

      <div className="bg-bg-base absolute top-0 z-1 h-6 w-full" />
    </section>
  );
}

export const StickyCard: React.FC<StickyCardProps> = ({
  children,
  className,
}) => {
  // Convert children to array and check if we have exactly 2 elements
  const childrenArray = React.Children.toArray(children);
  const hasHeader = childrenArray.length === 2;

  // Get header and content elements
  const [headerChild, contentChild] = hasHeader
    ? childrenArray
    : [null, childrenArray[0]];

  return (
    <div
      className={cn(
        "bg-bg-card border-bd-card rounded-md border border-t-0 shadow-xs",
        className
      )}
    >
      {hasHeader && headerChild}
      {contentChild}
    </div>
  );
};

export const StickyCardHeader: React.FC<StickyCardProps> = ({
  children,
  className,
}) => {
  return (
    <header
      className={cn(
        "bg-bg-card border-bd-card flex w-full flex-col rounded-t-md border-b",
        className
      )}
    >
      {children}
    </header>
  );
};

export const StickyCardNav: React.FC<StickyCardNavProps> = ({
  href,
  destination,
  page,
  className,
}) => {
  return (
    <nav
      className={cn(
        "bg-bg-card flex w-full items-center rounded-t-md p-4 font-mono text-xs",
        className
      )}
    >
      <Link
        href={href}
        className="text-tx-tertiary hover:bg-bg-hover hover:text-tx-primary flex items-center gap-2 rounded-xs pr-2"
      >
        <IconButton variant="ghostalt" size="sm">
          <NavArrowLeft />
        </IconButton>
        <span> {destination} </span>
      </Link>
      <span className="text-tx-tertiary pr-2">/</span>
      <span className="text-tx-primary">{page}</span>
    </nav>
  );
};
