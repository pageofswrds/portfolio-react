import React from "react";
import Image from "next/image";
import { shouldSkipOptimization } from "@/lib/imageUtils";
import { CONTENT } from "@/lib/constants";
import {
  HeadingProps,
  ParagraphProps,
  CodeProps,
  PreProps,
  BlockquoteProps,
  ListProps,
  ListItemProps,
  AnchorProps,
  EmphasisProps,
  StrongProps,
  HrProps,
  MarkdownImageProps,
} from "@/types/markdown";

/**
 * Shared markdown component styles for consistent rendering across MDX and Markdown
 */
export const markdownComponentStyles = {
  h1: "text-xl text-tx-primary",
  h2: "text-lg text-tx-primary mb-2",
  h3: "font-mono text-md text-tx-primary border-b-2 border-dashed border-ic-disabled pb-2 mt-8",
  h4: "text-md text-tx-primary mb-3",
  h5: "font-mono text-md text-tx-tertiary pb-2",
  h6: "text-sm text-tx-tertiary pt-1",
  p: "text-md py-4",
  code: "bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm",
  pre: "bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4",
  blockquote:
    "border-l-2 border-ic-brand bg-bg-disabled px-6 text-md italic text-tx-secondary",
  ul: "list-disc text-md pl-8 pb-4",
  ol: "list-decimal text-md pl-8 pb-4",
  li: "mb-1",
  a: "text-blue-600 dark:text-blue-400 hover:underline",
  em: "mb-4",
  strong: "mb-4",
  hr: "my-16",
  img: "border my-4",
};

/**
 * Base markdown components with consistent styling
 */
export const createBaseMarkdownComponents = () => ({
  h1: (props: HeadingProps) => (
    <h1 className={markdownComponentStyles.h1} {...props} />
  ),
  h2: (props: HeadingProps) => (
    <h2 className={markdownComponentStyles.h2} {...props} />
  ),
  h3: (props: HeadingProps) => (
    <h3 className={markdownComponentStyles.h3} {...props} />
  ),
  h4: (props: HeadingProps) => (
    <h4 className={markdownComponentStyles.h4} {...props} />
  ),
  h5: (props: HeadingProps) => (
    <h5 className={markdownComponentStyles.h5} {...props} />
  ),
  h6: (props: HeadingProps) => (
    <h6 className={markdownComponentStyles.h6} {...props} />
  ),
  p: (props: ParagraphProps) => (
    <p className={markdownComponentStyles.p} {...props} />
  ),
  code: (props: CodeProps) => (
    <code className={markdownComponentStyles.code} {...props} />
  ),
  pre: (props: PreProps) => (
    <pre className={markdownComponentStyles.pre} {...props} />
  ),
  blockquote: (props: BlockquoteProps) => (
    <blockquote className={markdownComponentStyles.blockquote} {...props} />
  ),
  ul: (props: ListProps) => (
    <ul className={markdownComponentStyles.ul} {...props} />
  ),
  ol: (props: ListProps) => (
    <ol className={markdownComponentStyles.ol} {...props} />
  ),
  li: (props: ListItemProps) => (
    <li className={markdownComponentStyles.li} {...props} />
  ),
  a: (props: AnchorProps) => (
    <a
      className={markdownComponentStyles.a}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  em: (props: EmphasisProps) => (
    <em className={markdownComponentStyles.em} {...props} />
  ),
  strong: (props: StrongProps) => (
    <strong className={markdownComponentStyles.strong} {...props} />
  ),
  hr: (props: HrProps) => (
    <hr className={markdownComponentStyles.hr} {...props} />
  ),
  img: (props: MarkdownImageProps) => (
    <Image
      className={markdownComponentStyles.img}
      width={props.width ? Number(props.width) : CONTENT.DEFAULT_IMAGE_WIDTH}
      height={
        props.height ? Number(props.height) : CONTENT.DEFAULT_IMAGE_HEIGHT
      }
      alt={props.alt || "Image"}
      src={props.src || ""}
      unoptimized={shouldSkipOptimization(props.src || "")}
    />
  ),
});
