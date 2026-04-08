import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';

interface MathRendererProps {
  text: string;
  className?: string;
}

const MathRenderer: React.FC<MathRendererProps> = ({ text, className }) => {
  if (!text) return null;

  // Split text by $$...$$ (block math) and $...$ (inline math)
  // We use a regex that captures the delimiters so we can distinguish them
  const regex = /(\$\$.*?\$\$|\$.*?\$)/g;
  const parts = text.split(regex);

  return (
    <div className={className}>
      {parts.map((part, index) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const math = part.slice(2, -2);
          return <BlockMath key={index} math={math} />;
        } else if (part.startsWith('$') && part.endsWith('$')) {
          const math = part.slice(1, -1);
          return <InlineMath key={index} math={math} />;
        }
        return <span key={index} className="whitespace-pre-wrap">{part}</span>;
      })}
    </div>
  );
};

export default MathRenderer;
