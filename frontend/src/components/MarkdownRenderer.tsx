import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="text-sm md:text-base leading-relaxed text-slate-200">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({node, ...props}) => <h1 className="text-xl font-bold text-slate-100 mt-4 mb-2" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-lg font-bold text-slate-100 mt-3 mb-2" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-base font-bold text-emerald-400 mt-3 mb-2" {...props} />,
          p: ({node, ...props}) => <p className="mb-3 last:mb-0" {...props} />,
          strong: ({node, ...props}) => <strong className="text-emerald-300 font-semibold" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc list-outside ml-4 mb-3" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-4 mb-3" {...props} />,
          li: ({node, ...props}) => <li className="mb-1" {...props} />,
          code: ({node, inline, className, children, ...props}: any) => {
            if (inline) {
              return <code className="bg-slate-800 text-emerald-200 px-1.5 py-0.5 rounded text-sm font-medium" {...props}>{children}</code>;
            }
            return <code className={className} {...props}>{children}</code>;
          },
          pre: ({node, ...props}) => <pre className="bg-slate-900 border border-slate-700/50 p-3 rounded-lg overflow-x-auto mb-3 text-sm" {...props} />,
          blockquote: ({node, ...props}) => <blockquote className="border-l-2 border-emerald-500 pl-3 italic text-slate-400 mb-3" {...props} />,
          a: ({node, ...props}) => <a className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2" {...props} />,
          hr: ({node, ...props}) => <hr className="border-slate-700/50 my-4" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
