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
  let renderedContent;
  let anchors: AnchorData[] = [];

  if (isMDX) {
    try {
      // Find the actual file to get the full content
      const fileName = `${slug}.mdx`;
      const filePath = path.join(PATHS.ARTICLES_WORK_FOLDER, fileName);

      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf8");
        const { content, anchors: extractedAnchors } =
          await renderMDXContent(fileContent);
        // const { content, anchors: extractedAnchors } = await renderMDXContentWithAnchors(fileContent)
        renderedContent = content;
        anchors = extractedAnchors;
      } else {
        // Fallback to article content from database
        renderedContent = <Markdown markdown={article.content} />;
      }
    } catch (error) {
      logger.error("Error rendering MDX:", error);
      renderedContent = <Markdown markdown={article.content} />;
    }
  } else {
    // For regular markdown, use existing Markdown component
    renderedContent = <Markdown markdown={article.content} />;
  }

  return (
    <div className="flex w-full flex-col gap-8 md:flex-row">
      <Sidebar>
        <SidebarNav href={"/"} breadcrumb={"work"} page={slug} />
        <ol className="flex flex-col space-y-1 rounded-md border border-bd-secondary bg-bg-card p-3 font-mono text-sm text-tx-primary">
          {anchors.map((anchor) => (
            <a
              key={anchor.id}
              href={`#${anchor.id}`}
              className="rounded bg-bg-secondary px-4 py-3 hover:bg-bg-hover hover:underline active:bg-bg-pressed"
            >
              <li className="">{anchor.title}</li>
            </a>
          ))}
        </ol>
      </Sidebar>

      <main className="min-w-0 flex-1">
        <StickyCardMask />
        <StickyCard>
          {/* <StickyCardNav href="/" destination="work" page ={params.slug} className="sticky top-6" /> */}
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
