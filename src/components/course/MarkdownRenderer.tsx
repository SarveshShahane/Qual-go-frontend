import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) {
    return <span className="text-[#413333]/50 italic">No content available for this topic.</span>;
  }

  // Split by code blocks or lines to parse blocks safely
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockLang = '';
  let codeBlockLines: string[] = [];
  let inMathBlock = false;
  let mathBlockLines: string[] = [];
  let inTable = false;
  let tableRows: string[][] = [];

  const flushTable = (key: string) => {
    if (tableRows.length === 0) return;
    const header = tableRows[0];
    const dataRows = tableRows.slice(1).filter(r => !r.every(c => /^[-:\s]+$/.test(c)));
    elements.push(
      <div key={key} className="overflow-x-auto my-4 rounded-lg border border-[#413333]/15 shadow-sm">
        <table className="min-w-full text-left text-xs font-mono">
          <thead className="bg-[#EDE0CF] text-[#315B8C] border-b border-[#413333]/15">
            <tr>
              {header.map((col, i) => (
                <th key={i} className="px-3 py-2 font-semibold">{renderInline(col)}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#413333]/10 bg-white">
            {dataRows.map((row, ri) => (
              <tr key={ri} className="hover:bg-[#FAF4EC]">
                {row.map((cell, ci) => (
                  <td key={ci} className="px-3 py-2 text-[#413333]">{renderInline(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
    inTable = false;
  };

  const renderInline = (text: string): React.ReactNode => {
    // Math inline $...$
    const parts = text.split(/(\$[^\$]+\$|`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
        const math = part.slice(1, -1);
        return (
          <span
            key={index}
            className="px-1.5 py-0.5 mx-0.5 rounded font-mono text-[#315B8C] bg-[#EDE0CF] border border-[#315B8C]/30 text-[13px] font-semibold"
          >
            {math}
          </span>
        );
      }
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
        return (
          <code
            key={index}
            className="px-1.5 py-0.5 rounded font-mono text-[#F2765E] bg-[#EDE0CF] text-[12px] font-semibold"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return (
          <strong key={index} className="font-semibold text-[#413333]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return (
          <em key={index} className="italic text-[#413333]/80">
            {part.slice(1, -1)}
          </em>
        );
      }
      return part;
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle code blocks ```
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // End code block
        const codeText = codeBlockLines.join('\n');
        elements.push(
          <div key={`code-${i}`} className="my-4 rounded-lg bg-white border border-[#413333]/15 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#EDE0CF] border-b border-[#413333]/10 text-[11px] font-mono text-[#413333]/70">
              <span>{codeBlockLang || 'code'}</span>
              <button
                onClick={() => navigator.clipboard.writeText(codeText)}
                className="hover:text-[#F2765E] transition-colors cursor-pointer"
              >
                Copy
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-[#315B8C] bg-[#FAF4EC] overflow-x-auto leading-relaxed">
              <code>{codeText}</code>
            </pre>
          </div>
        );
        codeBlockLines = [];
        inCodeBlock = false;
        codeBlockLang = '';
        continue;
      } else {
        if (inTable) flushTable(`table-${i}`);
        inCodeBlock = true;
        codeBlockLang = line.trim().slice(3).trim();
        codeBlockLines = [];
        continue;
      }
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      continue;
    }

    // Handle math display blocks $$
    if (line.trim().startsWith('$$')) {
      if (inMathBlock) {
        const mathText = mathBlockLines.join('\n');
        elements.push(
          <div
            key={`math-${i}`}
            className="my-4 p-4 rounded-lg bg-[#FAF4EC] border border-[#315B8C]/30 text-center font-mono text-sm text-[#315B8C] font-semibold overflow-x-auto"
          >
            {mathText}
          </div>
        );
        mathBlockLines = [];
        inMathBlock = false;
        continue;
      } else {
        if (inTable) flushTable(`table-${i}`);
        // Check single-line $$ formula $$
        const singleLineMatch = line.trim().match(/^\$\$(.+)\$\$$/);
        if (singleLineMatch) {
          elements.push(
            <div
              key={`math-single-${i}`}
              className="my-4 p-4 rounded-lg bg-[#FAF4EC] border border-[#315B8C]/30 text-center font-mono text-sm text-[#315B8C] font-semibold overflow-x-auto"
            >
              {singleLineMatch[1].trim()}
            </div>
          );
          continue;
        }
        inMathBlock = true;
        mathBlockLines = [];
        continue;
      }
    }

    if (inMathBlock) {
      mathBlockLines.push(line);
      continue;
    }

    // Handle Markdown tables
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      inTable = true;
      const cells = line
        .trim()
        .slice(1, -1)
        .split('|')
        .map(c => c.trim());
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      flushTable(`table-${i}`);
    }

    // Horizontal rule
    if (line.trim() === '---' || line.trim() === '***') {
      elements.push(<hr key={`hr-${i}`} className="my-6 border-[#413333]/15" />);
      continue;
    }

    // Callout / Blockquote
    if (line.trim().startsWith('>')) {
      const quoteText = line.replace(/^>\s?/, '');
      const isNote = quoteText.includes('[!NOTE]');
      const isTip = quoteText.includes('[!TIP]');
      const cleanQuote = quoteText.replace(/\[!(NOTE|TIP|IMPORTANT|WARNING)\]/g, '').trim();

      elements.push(
        <div
          key={`quote-${i}`}
          className={`my-3 p-3.5 rounded-lg border text-xs leading-relaxed ${
            isTip
              ? 'bg-[#315B8C]/10 border-[#315B8C]/30 text-[#315B8C]'
              : isNote
              ? 'bg-[#F2765E]/10 border-[#F2765E]/30 text-[#F2765E]'
              : 'bg-[#EDE0CF]/50 border-[#413333]/20 text-[#413333]'
          }`}
        >
          {isTip && <span className="font-mono font-bold mr-1.5 uppercase text-[10px]">Tip:</span>}
          {isNote && <span className="font-mono font-bold mr-1.5 uppercase text-[10px]">Note:</span>}
          {renderInline(cleanQuote)}
        </div>
      );
      continue;
    }

    // Headers
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={`h1-${i}`} className="font-heading text-xl sm:text-2xl font-bold text-[#413333] mt-6 mb-3">
          {renderInline(line.slice(2))}
        </h1>
      );
      continue;
    }
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${i}`} className="font-heading text-lg sm:text-xl font-semibold text-[#315B8C] mt-5 mb-2.5">
          {renderInline(line.slice(3))}
        </h2>
      );
      continue;
    }
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${i}`} className="font-heading text-base font-semibold text-[#413333] mt-4 mb-2">
          {renderInline(line.slice(4))}
        </h3>
      );
      continue;
    }
    if (line.startsWith('#### ')) {
      elements.push(
        <h4 key={`h4-${i}`} className="font-heading text-sm font-semibold text-[#F2765E] mt-3 mb-1.5">
          {renderInline(line.slice(5))}
        </h4>
      );
      continue;
    }

    // Lists (- or *)
    if (line.trim().match(/^[-*]\s+/)) {
      const listContent = line.trim().replace(/^[-*]\s+/, '');
      elements.push(
        <div key={`li-${i}`} className="flex items-start gap-2.5 my-1.5 text-xs text-[#413333] leading-relaxed pl-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F2765E] mt-1.5 shrink-0" />
          <div>{renderInline(listContent)}</div>
        </div>
      );
      continue;
    }

    // Numbered lists (1. , 2. )
    const numMatch = line.trim().match(/^(\d+)\.\s+(.+)$/);
    if (numMatch) {
      elements.push(
        <div key={`numli-${i}`} className="flex items-start gap-2.5 my-1.5 text-xs text-[#413333] leading-relaxed pl-2">
          <span className="font-mono text-[#315B8C] font-semibold shrink-0">{numMatch[1]}.</span>
          <div>{renderInline(numMatch[2])}</div>
        </div>
      );
      continue;
    }

    // Empty lines
    if (!line.trim()) {
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={`p-${i}`} className="text-xs sm:text-sm text-[#413333] leading-relaxed my-2.5">
        {renderInline(line)}
      </p>
    );
  }

  if (inTable) {
    flushTable(`table-end`);
  }

  return <div className="space-y-1">{elements}</div>;
};

