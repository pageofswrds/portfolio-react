import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { getAllArticles } from "@/lib/articles";
import { Markdown } from "@/components/markdown/Markdown";
// import { renderMDXContentWithAnchors, AnchorData } from '@/lib/mdx'
import { renderMDXContent, AnchorData } from "@/lib/mdx";
import { StickyCard, StickyCardMask } from "@/components/StickyCard";
import { Sidebar, SidebarNav } from "@/components/Sidebar";
import { logger } from "@/lib/logger";
import { PATHS } from "@/lib/constants";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles
    .filter((article) => article.path.startsWith("/work/"))
    .map((article) => ({
      slug: article.path.replace("/work/", ""), // Extract just the slug part
    }));
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const articles = await getAllArticles();
  const article = articles.find((a) => a.path === `/work/${slug}`);

  if (!article) {
    notFound();
  }

  // For MDX files, render with MDX compiler
  const isMDX = article.isMDX;
  let mdxContent: React.ReactNode | null = null;
  let anchors: AnchorData[] = [];
  let useFallback = !isMDX;

  if (isMDX) {
    try {
      // Find the actual file to get the full content
      const fileName = `${slug}.mdx`;
      const filePath = path.join(PATHS.ARTICLES_WORK_FOLDER, fileName);

      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf8");
        const { content, anchors: extractedAnchors } =
          await renderMDXContent(fileContent);
        mdxContent = content;
        anchors = extractedAnchors;
      } else {
        // Fallback to article content from database
        useFallback = true;
      }
    } catch (error) {
      logger.error("Error rendering MDX:", error);
      useFallback = true;
    }
  }

  const renderedContent = useFallback ? (
    <Markdown markdown={article.content} />
  ) : (
    mdxContent
  );

  return (
    <div className="flex w-full flex-col gap-8 md:flex-row">
      <Sidebar>
        <SidebarNav href={"/"} breadcrumb={"work"} page={slug} />
        <ol className="border-bd-secondary bg-bg-card text-tx-primary flex flex-col space-y-1 rounded-md border p-3 font-mono text-sm">
          {anchors.map((anchor) => (
            <a
              key={anchor.id}
              href={`#${anchor.id}`}
              className="bg-bg-secondary hover:bg-bg-hover active:bg-bg-pressed rounded px-4 py-3 hover:underline"
            >
              <li className="">{anchor.title}</li>
            </a>
          ))}
        </ol>
      </Sidebar>

      <main className="min-w-0 flex-1">
        <StickyCardMask mobileFullWidth />
        <StickyCard mobileFullWidth>
          <article className="px-8 py-8">
            <div className="prose-content mx-auto max-w-4xl">
              {renderedContent}
            </div>
          </article>
        </StickyCard>
      </main>
    </div>
  );
}
