import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { getAllArticles } from "@/lib/articles";
import { Markdown } from "@/components/markdown/Markdown";
import { renderMDXContent } from "@/lib/mdx";
import { StickyCard, StickyCardMask } from "@/components/StickyCard";
import { SidebarNav } from "@/components/Sidebar";
import { logger } from "@/lib/logger";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles
    .filter((article) => article.path.startsWith("/blog/"))
    .map((article) => ({
      slug: article.path.replace("/blog/", ""), // Extract just the slug part
    }));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const articles = await getAllArticles();
  const article = articles.find((a) => a.path === `/blog/${slug}`);

  if (!article) {
    notFound();
  }

  // For MDX files, render with MDX compiler
  const isMDX = article.isMDX;
  let renderedContent;

  if (isMDX) {
    try {
      // Find the actual file to get the full content
      const articlesFolder = path.join(process.cwd(), "public/articles/blog/");
      const fileName = `${slug}.mdx`;
      const filePath = path.join(articlesFolder, fileName);

      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf8");
        const { content } = await renderMDXContent(fileContent);
        renderedContent = content;
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
    <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
      <div className="mt-4 flex flex-col md:col-span-8 md:col-start-3">
        <SidebarNav href={"/?tab=blog"} breadcrumb={"blog"} page={slug} />

        <main className="md:col-span-8">
          <StickyCardMask />
          <StickyCard>
            <article className="mx-auto max-w-4xl px-8 py-8">
              {renderedContent}
            </article>
          </StickyCard>
        </main>
      </div>
    </div>
  );
}
