import React from 'react';

interface MarkdownViewerProps {
  content: string;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content }) => {
  // Simple, resilient line-by-line renderer
  const lines = content.split('\n');

  const formatInline = (text: string) => {
    // Process **bold** and *italic*
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let keyIdx = 0;

    // Regex to find **bold**
    const boldRegex = /\*\*(.*?)\*\*/g;
    let match: RegExpExecArray | null;
    let lastIndex = 0;

    while ((match = boldRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push(
        <strong key={keyIdx++} className="font-extrabold text-black">
          {match[1]}
        </strong>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className="space-y-3 text-black text-sm leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // Heading 1 or 2
        if (trimmed.startsWith('# ') || trimmed.startsWith('## ')) {
          const title = trimmed.replace(/^#+\s*/, '');
          return (
            <h3
              key={idx}
              className="text-base sm:text-lg font-extrabold text-black pt-2 border-b-2 border-dark-brown pb-1"
            >
              {formatInline(title)}
            </h3>
          );
        }

        // Heading 3 or 4
        if (trimmed.startsWith('### ') || trimmed.startsWith('#### ')) {
          const title = trimmed.replace(/^#+\s*/, '');
          return (
            <h4
              key={idx}
              className="text-sm sm:text-base font-extrabold text-peach-900 pt-2 flex items-center gap-1.5"
            >
              {formatInline(title)}
            </h4>
          );
        }

        // Bullet point
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const bulletText = trimmed.substring(2);
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-2">
              <span className="w-1.5 h-1.5 rounded-none bg-peach-600 mt-2 shrink-0" />
              <div className="flex-1 font-medium">{formatInline(bulletText)}</div>
            </div>
          );
        }

        // Numbered list (e.g., "1. ")
        const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numberedMatch) {
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-2 mt-1">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-none bg-peach-100 text-dark-brown text-xs font-bold border-2 border-dark-brown shrink-0 mt-0.5">
                {numberedMatch[1]}
              </span>
              <div className="flex-1 pt-0.5 font-medium">{formatInline(numberedMatch[2])}</div>
            </div>
          );
        }

        // Regular paragraph
        return (
          <p key={idx} className="text-black font-medium">
            {formatInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
};
