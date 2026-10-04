import React, { useState } from 'react';
import { marked } from 'marked';
import { Check, Copy, Terminal } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  isStreaming?: boolean;
}

interface CodeBlockProps {
  language: string;
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code', err);
    }
  };

  const displayLang = language || 'code';

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-[#1b2b69] bg-[#070c22] text-sm shadow-lg">
      <div className="flex items-center justify-between border-b border-[#172354] bg-[#0a1130] px-4 py-2 text-xs text-slate-300">
        <div className="flex items-center gap-2 font-mono font-medium text-sky-400">
          <Terminal size={14} className="text-sky-400" />
          <span>{displayLang}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-slate-300 transition-colors hover:bg-[#162254] hover:text-white"
          title="Код хуулах"
        >
          {copied ? (
            <>
              <Check size={13} className="text-emerald-400" />
              <span className="text-emerald-400">Хууллаа!</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>Код хуулах</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto p-4 text-[13.5px] leading-relaxed text-slate-200">
        <pre className="font-mono">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, isStreaming }) => {
  // Parse markdown into tokens using marked
  const tokens = React.useMemo(() => {
    try {
      return marked.lexer(content);
    } catch {
      return [];
    }
  }, [content]);

  if (!tokens || tokens.length === 0) {
    return (
      <div className="prose-sapphire">
        <p className="whitespace-pre-wrap">{content}</p>
        {isStreaming && <span className="typing-cursor" />}
      </div>
    );
  }

  return (
    <div className="prose-sapphire space-y-2">
      {tokens.map((token, index) => {
        if (token.type === 'code') {
          return (
            <CodeBlock
              key={index}
              language={token.lang || ''}
              code={token.text}
            />
          );
        }

        // For non-code blocks, render with marked.parser
        try {
          const rawHtml = marked.parser([token]);
          return (
            <div
              key={index}
              dangerouslySetInnerHTML={{ __html: rawHtml }}
            />
          );
        } catch {
          return (
            <p key={index} className="whitespace-pre-wrap">
              {token.raw}
            </p>
          );
        }
      })}
      {isStreaming && <span className="typing-cursor" />}
    </div>
  );
};
