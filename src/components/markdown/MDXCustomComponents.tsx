"use client";

import { ReactNode } from "react";
import VideoPlayer from "@/components/VideoPlayer";
import { Separator } from "@/components/ui/separator";
import { Clock, Map, ArrowRight } from "iconoir-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HighlightProps {
  children: React.ReactNode;
  color?: "yellow" | "blue" | "green" | "red";
}

export function Highlight({ children, color = "yellow" }: HighlightProps) {
  const colorClasses = {
    yellow: "bg-yellow-200 dark:bg-yellow-800",
    blue: "bg-blue-200 dark:bg-blue-800",
    green: "bg-green-200 dark:bg-green-800",
    red: "bg-red-200 dark:bg-red-800",
  };

  return (
    <span className={`rounded px-2 py-1 ${colorClasses[color]}`}>
      {children}
    </span>
  );
}

interface CalloutProps {
  children: React.ReactNode;
  type?: "info" | "warning" | "success" | "error";
}

export function Callout({ children, type = "info" }: CalloutProps) {
  const typeClasses = {
    info: "border-blue-500 bg-blue-50 dark:bg-blue-950",
    warning: "border-yellow-500 bg-yellow-50 dark:bg-yellow-950",
    success: "border-green-500 bg-green-50 dark:bg-green-950",
    error: "border-red-500 bg-red-50 dark:bg-red-950",
  };

  return (
    <div className={`my-4 border-l-4 p-4 ${typeClasses[type]}`}>{children}</div>
  );
}

interface AnchorProps {
  id: string;
  children?: ReactNode;
  title?: string;
  visible?: boolean;
}

export function Anchor({ id, children, visible = true }: AnchorProps) {
  if (!visible) {
    return <div id={id} className="scroll-mt-24" />;
  }

  return (
    <div
      id={id}
      className="mb-5 scroll-mt-24 rounded bg-bg-secondary px-2 py-2 font-mono text-md text-tx-primary"
    >
      # {children}
    </div>
  );
}

interface TitleSectionProps {
  // Accept optional frontmatter props to avoid SSR issues
  title?: string;
  subtitle?: string;
  date?: string | Date;
  year?: string | number;
  published?: string | Date;
  location?: string;
}

export function TitleSection(props: TitleSectionProps) {
  // Use props directly since frontmatter is injected via MDX rendering
  const frontmatter = props;

  if (!frontmatter || Object.keys(frontmatter).length === 0) {
    return null;
  }

  // Use published, date, or year - whichever is available
  // Convert Date objects to strings to avoid React rendering errors
  const getDateString = (
    value: string | Date | number | undefined
  ): string | undefined => {
    if (!value) return undefined;
    if (value instanceof Date) {
      return value.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return String(value);
  };

  const dateString =
    getDateString(frontmatter.published) ||
    getDateString(frontmatter.date) ||
    getDateString(frontmatter.year);

  return (
    <section className="mb-4 scroll-mt-24" id="overview">
      {frontmatter.title && (
        <h1 className="text-xl leading-[2.5rem] text-tx-primary">
          {frontmatter.title}
        </h1>
      )}
      {frontmatter.subtitle && (
        <h5 className="font-mono text-md text-tx-secondary">
          {frontmatter.subtitle}
        </h5>
      )}
      <Separator className="mb-4 mt-4 bg-bd-secondary" />
      <div className="flex gap-6 font-mono text-xs text-tx-tertiary">
        {dateString && (
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Clock className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Published on</p>
              </TooltipContent>
            </Tooltip>
            <span>{dateString}</span>
          </div>
        )}
        {frontmatter.location && (
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Map className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Created at</p>
              </TooltipContent>
            </Tooltip>
            <span>{frontmatter.location}</span>
          </div>
        )}
      </div>
    </section>
  );
}

interface ImageStackProps {
  children: React.ReactNode;
}

export function ImageStack({ children }: ImageStackProps) {
  return (
    <div className="my-4 flex flex-col gap-2 [&_img]:my-0">{children}</div>
  );
}

interface DemoButtonProps {
  href: string;
  children?: React.ReactNode;
}

export function DemoButton({ href, children = "Go to demo" }: DemoButtonProps) {
  return (
    <div className="my-6">
      <Link href={href}>
        <Button variant="brand" size="md" className="gap-2">
          {children}
          <ArrowRight width={16} height={16} />
        </Button>
      </Link>
    </div>
  );
}

const MDXCustomComponents = {
  Highlight,
  Callout,
  Anchor,
  TitleSection,
  VideoPlayer,
  ImageStack,
  DemoButton,
};

export default MDXCustomComponents;
