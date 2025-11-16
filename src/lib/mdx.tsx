import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import React from "react";
import matter from "gray-matter";
import { Markdown } from "@/components/markdown/Markdown";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Highlight,
  Callout,
  Anchor,
  TitleSection,
  ImageStack,
  DemoButton,
} from "@/components/markdown/MDXCustomComponents";
import VideoPlayer from "@/components/VideoPlayer";
import MarkdownConverter from "@/components/markdown/MarkdownConverter";
import Image from "next/image";
import { createBaseMarkdownComponents } from "@/lib/markdownComponentsConfig";

export interface Frontmatter {
  title?: string;
  subtitle?: string;
  date?: string | Date;
  year?: string | number;
  published?: string | Date;
  location?: string;
  thumbnail?: string;
  order?: number | string;
  visible?: boolean;
}

// Create components function that can accept frontmatter
const createComponents = (frontmatter?: Frontmatter) => ({
  // Base markdown components with consistent styling
  ...createBaseMarkdownComponents(),
  // Custom components available in MDX
  Highlight,
  Callout,
  Anchor,
  TitleSection: (props: Record<string, unknown>) => (
    <TitleSection {...frontmatter} {...props} />
  ),
  VideoPlayer,
  Button,
  Link,
  Image,
  MarkdownConverter,
  ImageStack,
  DemoButton,
});

// Function to check if content should be treated as MDX
export function isMDXContent(filePath: string): boolean {
  return filePath.endsWith(".mdx");
}

// Function to render regular markdown (fallback)
export async function renderMarkdownContent(source: string) {
  const { data, content } = matter(source);

  // For regular markdown, you might want to use a markdown parser
  // For now, we'll just return the raw content
  return {
    frontmatter: data as Frontmatter,
    content: <div dangerouslySetInnerHTML={{ __html: content }} />,
  };
}

export interface AnchorData {
  id: string;
  title: string;
}

// Function to extract anchors from MDX content using proper parsing
export function extractAnchors(source: string): AnchorData[] {
  const { content } = matter(source);
  const anchors: AnchorData[] = [];

  // Check if TitleSection component exists in the content
  const titleSectionRegex = /<TitleSection\s*[^>]*\/?>/;
  const hasTitleSection = titleSectionRegex.test(content);

  // If TitleSection exists, add Overview anchor to the top
  if (hasTitleSection) {
    anchors.push({ id: "overview", title: "Overview" });
  }

  // Match both self-closing and regular Anchor components
  // Self-closing: <Anchor id="..." />
  // With children: <Anchor id="...">content</Anchor>
  const anchorRegex =
    /<Anchor\s+id=["']([^"']+)["']\s*(?:\/>|>(.*?)<\/Anchor>)/g;

  // Reset regex lastIndex to ensure we start from the beginning
  anchorRegex.lastIndex = 0;
  let match;

  while ((match = anchorRegex.exec(content)) !== null) {
    const id = match[1];
    const childContent = match[2]; // This will be undefined for self-closing tags

    let title: string;

    if (childContent) {
      // Use the child content as the title
      title = childContent.trim();
    } else {
      // Format title from ID: replace dashes with spaces and capitalize first letter
      title = id.replace(/-/g, " ");
      title = title.charAt(0).toUpperCase() + title.slice(1);
    }

    anchors.push({ id, title });
  }

  return anchors;
}

export async function renderMDXContent(source: string) {
  try {
    // Use gray-matter to extract frontmatter and content
    const { data, content } = matter(source);
    const anchors = extractAnchors(source);

    // Create components with frontmatter injected
    const componentsWithFrontmatter = createComponents(data as Frontmatter);

    // Compile MDX content using @mdx-js/mdx
    const { default: MDXContent } = await evaluate(content, {
      ...runtime,
      useMDXComponents: () => componentsWithFrontmatter,
    });

    return {
      frontmatter: data as Frontmatter,
      content: React.createElement(MDXContent),
      anchors,
    };
  } catch (error) {
    // Error will be logged by error boundary
    if (error instanceof Error) {
      throw new Error(`MDX rendering failed: ${error.message}`);
    }
    // Fall back to regular markdown rendering on error
    const { data, content } = matter(source);
    const anchors = extractAnchors(source);
    return {
      frontmatter: data as Frontmatter,
      content: <Markdown markdown={content} />,
      anchors,
    };
  }
}
