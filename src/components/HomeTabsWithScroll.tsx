"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
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
    // Priority: URL param > localStorage > defaultTab
    if (isValidTab(tabFromUrl)) {
      return tabFromUrl;
    }

    // Check localStorage on client-side only
    if (typeof window !== "undefined") {
      const savedTab = localStorage.getItem("activeTab");
      if (savedTab && isValidTab(savedTab)) {
        return savedTab;
      }
    }

    return defaultTab as TabValue;
  });

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
          <p className="text-lg italic text-tx-body">
            Everybody just wants to be seen
          </p>
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
          <div className="my-4 flex w-full flex-col gap-3 rounded p-4 text-md">
            <p className="text-tx-body">I design both interfaces and code.</p>
            <p className="text-tx-body">
              I consider myself, first-and-foremost, a designer. I graduated
              from the University of Washington&apos;s Interaction Design
              program in 2024, where I ultimately focused on sharpening my
              design process. This involved extensive user research&mdash;both
              academically, and professionally.
            </p>
            <p className="text-tx-body">
              But historically, I&apos;ve spent a lot of time developing. I have
              extensive experience in frontend technologies, my bread-and-butter
              being Next.js + TailwindCSS. Recently, I&apos;ve developed
              proficiency in Rust and Swift. I&apos;ve also worked with 3D
              technologies: namely, prototyping with extended reality (XR) in C#
              (Unity + Meta&apos;s XR SDK). My niche in XR focuses on
              hand/gestural interactions&mdash;i.e., designing for a future
              without traditional controllers.
            </p>
            <p className="text-tx-body">
              When I was in high school, I was introduced to computer science,
              and later on, &ldquo;Special Topics&rdquo; &mdash; a class
              dedicated to data structures and algorithms (taught by Microsoft
              TEALS). Programming came very naturally to me, and my teachers
              were extremely effective at helping us build a deep gnosis for
              efficent computing. This set a strong technical foundation for
              &ldquo;left brain&rdquo; activity (in other words, engineering).
            </p>
            <p className="text-tx-body">
              But after being denied to UW&apos;s (very competitive) CSE
              program, I found myself forced to engage with my &ldquo;right
              brain&rdquo;. In this, I&apos;ve come to understand that design is
              the intersection between art and engineering&mdash;and this blend
              guides everything I do. My calling is to build products for
              end-users, and this entails picking up any hard skill that serves
              that end.
            </p>
            <p className="text-tx-body">
              I believe my greatest strength is that I do for the sake of
              doing&mdash;and in trying to do the best I can, I&apos;ve
              developed a strong sense for where my energy is most valuable.
              This means walking the line of expansion and contraction;
              confidence is knowing what you don&apos;t know. I seek out
              information when it&apos;s needed, and shift my focus to action
              once I&apos;ve accumulated enough. (e.g. knowing when I need to do
              user research, and when I&apos;ve learned enough.)
            </p>
            <p className="text-tx-body">
              Mostly recently, I have been building{" "}
              <a
                href="https://www.instagram.com/zojer.studio/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Kairos
              </a>
              , a professional astrology tool that intends to outclass all
              others, starting from a foundation of strong UX—not features. (The
              features will arise naturally, especially considering my{" "}
              <a
                href="https://www.davidschultz.co/blog/rapid-refactoring"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                development process
              </a>
              .) I&apos;v been getting heavy use out of Claude Code, and have a
              lot of thoughts on how this technology will shape the world,
              especially given the current social climate. Blog post on those
              topics later!
            </p>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}
