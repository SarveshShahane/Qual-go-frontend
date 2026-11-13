import React, { useMemo } from 'react';
import { marked } from 'marked';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const html = useMemo(() => {
    if (!content) return '';

    let text = content;

    // 1. Convert unicode bullets ('• ', '● ') at start of lines into markdown list markers ('- ')
    text = text.replace(/^[ \t]*[•●][ \t]+/gm, '- ');

    // 2. Pre-render Display Math: $$...$$
    text = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
      try {
        const rendered = katex.renderToString(math.trim(), {
          displayMode: true,
          throwOnError: false,
        });
        return `<div class="katex-display-block my-2 overflow-x-auto py-1">${rendered}</div>`;
      } catch {
        return `$$${math}$$`;
      }
    });

    // 3. Pre-render Inline Math: $...$
    // Ensure we don't accidentally match escaped dollars or empty formulas
    text = text.replace(/(?<!\\)\$([^\$\n]+?)(?<!\\)\$/g, (_, math) => {
      try {
        return katex.renderToString(math.trim(), {
          displayMode: false,
          throwOnError: false,
        });
      } catch {
        return `$${math}$`;
      }
    });

    // 4. Configure marked for GFM and clean break handling
    try {
      return marked.parse(text, {
        gfm: true,
        breaks: true,
      }) as string;
    } catch {
      return text;
    }
  }, [content]);

  return (
    <div
      className={`prose max-w-none text-xs leading-relaxed text-[#413333] 
        prose-headings:font-bold prose-headings:text-[#315B8C] prose-headings:my-2
        prose-h3:text-sm prose-h4:text-xs prose-h5:text-xs
        prose-strong:text-[#413333] prose-strong:font-bold
        prose-p:my-1.5 prose-p:leading-relaxed
        prose-ul:list-disc prose-ul:pl-5 prose-ul:my-2 prose-ul:space-y-1
        prose-ol:list-decimal prose-ol:pl-5 prose-ol:my-2 prose-ol:space-y-1
        prose-li:text-[#413333] prose-li:leading-relaxed
        prose-blockquote:border-l-2 prose-blockquote:border-[#F2765E] prose-blockquote:pl-3 prose-blockquote:py-1 prose-blockquote:my-2 prose-blockquote:italic prose-blockquote:text-[#413333]/80 prose-blockquote:bg-[#FAF4EC] prose-blockquote:rounded-r
        prose-code:text-[#F2765E] prose-code:bg-[#EDE0CF] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono
        [&_.katex]:text-[#315B8C] [&_.katex-display]:my-2
        ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
