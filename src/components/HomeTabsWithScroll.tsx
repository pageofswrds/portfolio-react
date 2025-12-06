"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArticleThumbnail } from "@/components/organisms/ArticleThumbnail";
import { StickyCardHeader } from "@/components/StickyCard";
import { CurrentTime } from "@/components/CurrentTime";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Article } from "@/lib/articles";
import { Demo } from "@/lib/demos";
import { logger } from "@/lib/logger";
import dynamic from "next/dynamic";

const SpinningCube = dynamic(() => import("@/components/3d/SpinningCube"), {
  ssr: false,
});

interface TabsWithScrollProps {
  articles: Article[];
  demos: Demo[];
  defaultTab?: string;
}

const VALID_TABS = ["work", "demos", "blog", "about"] as const;
type TabValue = (typeof VALID_TABS)[number];

function isValidTab(tab: string | undefined): tab is TabValue {
  return tab !== undefined && VALID_TABS.includes(tab as TabValue);
}

export default function HomeTabsWithScroll({
  articles,
  demos,
  defaultTab = "work",
}: TabsWithScrollProps) {
  logger.debug("=== CLIENT: Demos received ===", demos);
  logger.debug("=== CLIENT: Demos count ===", demos.length);

  const router = useRouter();
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams?.get("tab") || undefined;

  const [activeTab, setActiveTab] = useState<TabValue>(() => {
    // Priority: URL param > defaultTab
    // Note: We don't check localStorage here to avoid hydration mismatch
    if (isValidTab(tabFromUrl)) {
      return tabFromUrl;
    }

    return defaultTab as TabValue;
  });

  // Hydrate from localStorage after mount (client-side only)
  useEffect(() => {
    // Only apply localStorage if there's no URL param
    if (!tabFromUrl && typeof window !== "undefined") {
      const savedTab = localStorage.getItem("activeTab");
      if (savedTab && isValidTab(savedTab)) {
        setActiveTab(savedTab);
      }
    }
  }, []); // Empty deps - only run once on mount

  // Update localStorage and URL when tab changes
  const handleTabValueChange = (value: string) => {
    if (!isValidTab(value)) return;

    setActiveTab(value);

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("activeTab", value);
    }

    // Update URL with the new tab
    router.push(`/?tab=${value}`, { scroll: false });

    // Multiple approaches to ensure scrolling works regardless of content height
    setTimeout(() => {
      // Method 1: Direct element scrollTop (immediate)
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // Method 2: window.scrollTo with smooth behavior (for visual effect)
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });

      // Method 3: Force scroll by trying to scroll to a specific element (fallback)
      const topElement = document.querySelector("body");
      if (topElement) {
        topElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100); // Increased delay to ensure tab content has fully rendered
  };

  // Sync with URL changes (e.g., browser back/forward)
  useEffect(() => {
    if (isValidTab(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  return (
    <Tabs
      id="tabs"
      value={activeTab}
      className="mt-0 flex flex-col"
      onValueChange={handleTabValueChange}
    >
      <StickyCardHeader className="sticky top-[-81px] z-0">
        {/* <h2 className="text-lg pl-4 pt-4">Stuff</h2> */}
        <div className="ml-4 mt-4 p-4 pb-0">
          <p className="text-lg italic text-tx-body">Hello from Seattle, WA</p>
          <Tooltip>
            <TooltipTrigger asChild>
              <CurrentTime className="font-mono text-sm text-tx-secondary" />
            </TooltipTrigger>
            <TooltipContent>
              <p>this site is v in-progress lol</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <TabsList className="flex items-center pt-4 font-mono text-xs">
          <TabsTrigger value="work" className="w-full">
            work
          </TabsTrigger>
          <TabsTrigger value="demos" className="w-full">
            demos
          </TabsTrigger>
          <TabsTrigger value="blog" className="w-full">
            blog
          </TabsTrigger>
          <TabsTrigger value="about" className="w-full">
            about
          </TabsTrigger>
        </TabsList>
      </StickyCardHeader>

      <div className="flex-1">
        <TabsContent value="work" className="m-0 flex flex-col">
          <ul className="grid w-full grid-cols-1 gap-12 p-4">
            {articles
              .filter(
                ({ visible, path }) => visible && path.startsWith("/work/")
              )
              .map(({ title, subtitle, thumbnail, path }) => (
                <Link key={path} className={clsx("w-full")} href={path}>
                  <ArticleThumbnail
                    title={title}
                    subtitle={subtitle}
                    thumbnail={thumbnail}
                  />
                </Link>
              ))}
          </ul>
        </TabsContent>
        <TabsContent value="demos" className="m-0 flex flex-col">
          <ul className="grid w-full grid-cols-1 gap-12 p-4">
            {demos
              .filter(({ visible }) => visible)
              .map(({ title, subtitle, thumbnail, path }) => (
                <Link key={path} className={clsx("w-full")} href={path}>
                  <ArticleThumbnail
                    title={title}
                    subtitle={subtitle}
                    thumbnail={thumbnail}
                  />
                </Link>
              ))}
          </ul>
        </TabsContent>
        <TabsContent value="blog" className="m-0 flex flex-col">
          <ul className="grid w-full grid-cols-1 gap-12 p-4">
            {articles
              .filter(
                ({ visible, path }) => visible && path.startsWith("/blog/")
              )
              .map(({ title, subtitle, thumbnail, path }) => (
                <Link key={path} className={clsx("w-full")} href={path}>
                  <ArticleThumbnail
                    title={title}
                    subtitle={subtitle}
                    thumbnail={thumbnail}
                  />
                </Link>
              ))}
          </ul>
        </TabsContent>
        <TabsContent
          value="about"
          className="m-0 flex max-w-[900px] flex-col items-center px-6"
        >
          <div className="mt-4 w-full overflow-clip rounded-md">
            <Image
              src="https://schultzdavidg-portfolio.s3.us-west-1.amazonaws.com/images/xa2-bnw.jpg"
              alt="David Schultz"
              width={900}
              height={600}
              className="h-auto w-full object-cover"
              unoptimized
            />
          </div>
          <div className="my-4 flex w-full flex-col gap-3 rounded p-4 text-md">
            <p className="text-tx-body">Hellooooooo</p>
            <p className="text-tx-body">
              I&apos;m a designer/developer based in Seattle, WA. I graduated
              from the University of Washington&apos;s Interaction Design
              program in 2024, where I ultimately focused on sharpening my
              design process. This involved extensive user research&mdash;both
              academically and professionally.
            </p>
            <p className="text-tx-body">
              But historically, I&apos;ve spent a lot of time developing. I have
              extensive experience in frontend technologies, my bread-and-butter
              being Next.js + TailwindCSS. More recently, I&apos;ve been
              building in Rust + Swift.
            </p>
            {/* <SpinningCube className="my-8 h-48 w-full rounded-md" /> */}
            <p className="text-tx-body">
              I&apos;ve also worked with 3D technologies: namely, prototyping
              with extended reality (XR) in C# (Unity + Meta&apos;s XR SDK). My
              niche in XR focuses on hand/gestural interactions&mdash;i.e.,
              designing for a future without traditional controllers.
            </p>

            <Link
              className={clsx("my-4")}
              href="https://www.davidschultz.co/work/kairos#communication"
            >
              <Image
                src="https://schultzdavidg-portfolio.s3.us-west-1.amazonaws.com/images/kairos/managing_visual_complexity.png"
                alt="David Schultz"
                width={900}
                height={600}
                className="h-auto w-full object-cover "
                unoptimized
              />
            </Link>
            <p className="text-tx-body">
              My current focus is on{" "}
              <Link className={clsx("text-brand")} href="https://zojer.studio">
                Kairōs
              </Link>
              , an iOS app I have been building. More to the point, I have been
              making extensive use of Claude Code, and am blown away by its
              abilities. It is a complete game changer for product design,
              simply because of how fast it has become to iterate in a live
              environment.
            </p>

            <p className="text-tx-body">
              I am open for work, so if you have ideas -- please reach out!
            </p>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}
