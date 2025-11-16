import React from "react";

// HTML element props types for markdown components
export type HeadingProps = React.HTMLAttributes<HTMLHeadingElement>;
export type ParagraphProps = React.HTMLAttributes<HTMLParagraphElement>;
export type CodeProps = React.HTMLAttributes<HTMLElement>;
export type PreProps = React.HTMLAttributes<HTMLPreElement>;
export type BlockquoteProps = React.HTMLAttributes<HTMLQuoteElement>;
export type ListProps = React.HTMLAttributes<
  HTMLUListElement | HTMLOListElement
>;
export type ListItemProps = React.HTMLAttributes<HTMLLIElement>;
export type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;
export type EmphasisProps = React.HTMLAttributes<HTMLElement>;
export type StrongProps = React.HTMLAttributes<HTMLElement>;
export type HrProps = React.HTMLAttributes<HTMLHRElement>;

// Image props type for markdown images
export interface MarkdownImageProps {
  src?: string;
  alt?: string;
  title?: string;
  width?: string | number;
  height?: string | number;
}
