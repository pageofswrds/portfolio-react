import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { getAllArticles } from "@/lib/articles";
import { Markdown } from "@/components/markdown/Markdown";
import { renderMDXContent } from "@/lib/mdx";
import { StickyCard, StickyCardMask } from "@/components/StickyCard";
import { SidebarNav } from "@/components/Sidebar";
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
  let mdxContent: React.ReactNode | null = null;
  let useFallback = !isMDX;

  if (isMDX) {
    try {
      // Find the actual file to get the full content
      const fileName = `${slug}.mdx`;
      const filePath = path.join(PATHS.ARTICLES_BLOG_FOLDER, fileName);

      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf8");
        const { content } = await renderMDXContent(fileContent);
        mdxContent = content;
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
    <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
      <div className="mt-4 flex flex-col md:col-span-8 md:col-start-3">
        <SidebarNav href={"/?tab=blog"} breadcrumb={"blog"} page={slug} />

        <main className="md:col-span-8">
          <StickyCardMask mobileFullWidth />
          <StickyCard mobileFullWidth>
            <article className="mx-auto max-w-4xl px-8 py-8">
              {renderedContent}
            </article>
          </StickyCard>
        </main>
      </div>
    </div>
  );
}
