import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
// import '@/app/styles.css'
import "@/lib/transform.css";
import { getAllArticles } from "@/lib/articles";
import { getAllDemos } from "@/lib/demos";
import HomeTabsWithScroll from "@/components/HomeTabsWithScroll";
import { StickyCard, StickyCardMask } from "@/components/StickyCard";
import { logger } from "@/lib/logger";

export default async function Home() {
  // Fetch articles data directly in the component (server-side)
  const articles = await getAllArticles();
  const demos = await getAllDemos();

  logger.debug("=== SERVER: Demos loaded ===", demos);
  logger.debug("=== SERVER: Demos count ===", demos.length);

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
      <section className="flex flex-col gap-4 self-start md:sticky md:top-0 md:col-span-4 md:h-screen md:py-16">
        <Image
          src={"/images/star-sketch.png"}
          alt="logo"
          height={150}
          width={150}
          sizes="10vw"
          priority
          className=""
        />
        <Link href="/">
          <h1 className="font-serif text-lg text-tx">david schultz</h1>
        </Link>
        <p className="flex-grow">designer who codes</p>
        {/* <ThemeButtons /> */}
        {/* I'm feeling lucky button */}
        <p className="">© 2025</p>
      </section>

      <main className="md:col-span-8">
        <StickyCardMask />
        <StickyCard>
          {/* <StickyCardNav href="/?tab=demos" destination="demos" page ="page" /> */}
          <Suspense fallback={<div>Loading...</div>}>
            <HomeTabsWithScroll articles={articles} demos={demos} />
          </Suspense>
        </StickyCard>
      </main>
    </div>
  );
}
