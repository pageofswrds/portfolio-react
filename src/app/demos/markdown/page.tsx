"use client";

import { SidebarNav } from "@/components/Sidebar";
import { StickyCard, StickyCardMask } from "@/components/StickyCard";
import { useMDXContent } from "@/hooks/useMDXContent";

export default function MarkdownDemo() {
  const { renderedContent, loading, error } = useMDXContent(
    "/demos/markdown/markdownconverter.mdx"
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p>Loading content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!renderedContent) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>No content available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
      <div className="mt-4 flex flex-col md:col-span-8 md:col-start-3">
        <SidebarNav
          href={"/?tab=demos"}
          breadcrumb={"demos"}
          page={"markdown"}
        />

        <main className="md:col-span-8">
          <StickyCardMask mobileFullWidth />
          <StickyCard mobileFullWidth>
            <article className="mx-auto max-w-4xl px-8 py-8">
              {renderedContent.content}
            </article>
          </StickyCard>
        </main>
      </div>
    </div>
  );
}
