import { evaluate } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import React from 'react'
import matter from 'gray-matter'
import { Markdown } from '@/components/markdown/Markdown'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Highlight, Callout, Anchor, TitleSection, ImageStack, DemoButton } from '@/components/markdown/MDXCustomComponents'
import VideoPlayer from '@/components/VideoPlayer'
import MarkdownConverter from '@/components/markdown/MarkdownConverter'
import Image from 'next/image'
import { shouldSkipOptimization } from '@/lib/imageUtils'

export interface Frontmatter {
  title?: string
  subtitle?: string
  date?: string | Date
  year?: string | number
  published?: string | Date
  location?: string
  thumbnail?: string
  order?: number | string
  visible?: boolean
}

// Create components function that can accept frontmatter
const createComponents = (frontmatter?: Frontmatter) => ({
  // Custom components for MDX rendering
  h1: (props: any) => <h1 className="text-xl text-tx-primary" {...props} />,
  h2: (props: any) => <h2 className="text-lg text-tx-primary mb-2" {...props} />,
  h3: (props: any) => <h3 className="font-mono text-md text-tx-primary border-b-2 border-dashed border-ic-disabled pb-2 mt-8" {...props}/>,
  h4: (props: any) => <h4 className="text-md text-tx-primary mb-3" {...props} />,
  h5: (props: any) => <h5 className="font-mono text-md text-tx-tertiary pb-2" {...props} />,
  h6: (props: any) => <h6 className="text-sm text-tx-tertiary pt-1" {...props} />,
  p:  (props: any) => <p  className="text-md py-4" {...props} />,
  code: (props: any) => (
    <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm" {...props} />
  ),
  pre: (props: any) => (
    <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4" {...props} />
  ),
  blockquote: (props: any) => (
    <blockquote className="border-l-2 border-ic-brand bg-bg-disabled px-6 text-md italic text-tx-secondary" {...props} />
  ),
  ul: (props: any) => <ul className="list-disc text-md pl-8 pb-4" {...props} />,
  ol: (props: any) => <ol className="list-decimal text-md pl-8 pb-4" {...props} />,
  li: (props: any) => <li className="mb-1" {...props} />,
  a: (props: any) => (
    <a 
      className="text-blue-600 dark:text-blue-400 hover:underline" 
      target="_blank" 
      rel="noopener noreferrer" 
      {...props} 
    />
  ),
  em: (props: any) => <em className="mb-4" {...props} />,
  strong: (props: any) => <strong className="mb-4" {...props} />,
  hr: (props: any) => <hr className="my-16" {...props} />,
  img: (props: any) => (
    <Image
      className="border my-4"
      width={800}
      height={600}
      alt={props.alt || "Image"}
      unoptimized={shouldSkipOptimization(props.src)}
      {...props}
    />
  ),
  // Custom components available in MDX
  Highlight,
  Callout,
  Anchor,
  TitleSection: (props: any) => <TitleSection {...frontmatter} {...props} />,
  VideoPlayer,
  Button,
  Link,
  Image,
  MarkdownConverter,
  ImageStack,
  DemoButton,
})

// Default components for backward compatibility
const components = createComponents()


// Function to check if content should be treated as MDX
export function isMDXContent(filePath: string): boolean {
  return filePath.endsWith('.mdx')
}

// Function to render regular markdown (fallback)
export async function renderMarkdownContent(source: string) {
  const { data, content } = matter(source)
  
  // For regular markdown, you might want to use a markdown parser
  // For now, we'll just return the raw content
  return {
    frontmatter: data as Frontmatter,
    content: <div dangerouslySetInnerHTML={{ __html: content }} />
  }
}

export interface AnchorData {
  id: string
  title: string
}

// Function to extract anchors from MDX content using proper parsing
export function extractAnchors(source: string): AnchorData[] {
  const { content } = matter(source)
  const anchors: AnchorData[] = []
  
  // Check if TitleSection component exists in the content
  const titleSectionRegex = /<TitleSection\s*[^>]*\/?>/
  const hasTitleSection = titleSectionRegex.test(content)
  
  // If TitleSection exists, add Overview anchor to the top
  if (hasTitleSection) {
    anchors.push({ id: 'overview', title: 'Overview' })
  }
  
  // Match both self-closing and regular Anchor components
  // Self-closing: <Anchor id="..." />
  // With children: <Anchor id="...">content</Anchor>
  const anchorRegex = /<Anchor\s+id=["']([^"']+)["']\s*(?:\/>|>(.*?)<\/Anchor>)/g
  
  // Reset regex lastIndex to ensure we start from the beginning
  anchorRegex.lastIndex = 0
  let match
  
  while ((match = anchorRegex.exec(content)) !== null) {
    const id = match[1]
    const childContent = match[2] // This will be undefined for self-closing tags
    
    let title: string
    
    if (childContent) {
      // Use the child content as the title
      title = childContent.trim()
    } else {
      // Format title from ID: replace dashes with spaces and capitalize first letter
      title = id.replace(/-/g, ' ')
      title = title.charAt(0).toUpperCase() + title.slice(1)
    }
    
    anchors.push({ id, title })
  }
  
  return anchors
}




export async function renderMDXContent(source: string) {
  try {
    // Use gray-matter to extract frontmatter and content
    const { data, content } = matter(source)
    const anchors = extractAnchors(source)
    
    // Create components with frontmatter injected
    const componentsWithFrontmatter = createComponents(data as Frontmatter)
    
    // Compile MDX content using @mdx-js/mdx
    const { default: MDXContent } = await evaluate(content, {
      ...runtime,
      useMDXComponents: () => componentsWithFrontmatter
    } as any)

    return { 
      frontmatter: data as Frontmatter, 
      content: React.createElement(MDXContent),
      anchors
    }
  } catch (error) {
    console.error('Error rendering MDX content:', error)
    // Fall back to regular markdown rendering on error
    const { data, content } = matter(source)
    const anchors = extractAnchors(source)
    return { 
      frontmatter: data as Frontmatter, 
      content: <Markdown markdown={content} />,
      anchors
    }
  }
}