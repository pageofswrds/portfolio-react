import clsx from "clsx";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createBaseMarkdownComponents } from "@/lib/markdownComponentsConfig";

// import 'katex/dist/katex.min.css'

export type MarkdownProps = {
  markdown: string;
  className?: string;
};

export const Markdown = ({ markdown, className }: MarkdownProps) => (
  <div className={clsx("break-words", className)}>
    <ReactMarkdown
      components={createBaseMarkdownComponents()}
      remarkPlugins={[remarkGfm]}
    >
      {markdown}
    </ReactMarkdown>
  </div>
);
