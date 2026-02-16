"use client";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

interface MathMarkdownProps {
  children: string;
  className?: string;
}

/**
 * Markdown renderer with LaTeX math support.
 * Inline math: $...$  or \(...\)
 * Display math: $$...$$ or \[...\]
 */
export default function MathMarkdown({ children, className }: MathMarkdownProps) {
  // Normalize LaTeX delimiters: convert \(...\) → $...$ and \[...\] → $$...$$
  const normalized = children
    .replace(/\\\((.+?)\\\)/g, (_, m) => `$${m}$`)
    .replace(/\\\[([\s\S]+?)\\\]/g, (_, m) => `$$${m}$$`);

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {normalized}
      </ReactMarkdown>
    </div>
  );
}
