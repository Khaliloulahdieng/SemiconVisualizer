'use client';

import { Section } from '@/lib/types';
import ReactMarkdown from 'react-markdown';

interface SectionContentProps {
  section: Section;
}

export function SectionContent({ section }: SectionContentProps) {
  return (
    <div className="prose prose-lg max-w-none">
      <h2 className="text-3xl font-bold mb-6">{section.title}</h2>
      <ReactMarkdown
        components={{
          // Style markdown elements
          p: ({ children }) => <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>,
          strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
          h3: ({ children }) => <h3 className="text-xl font-semibold mt-6 mb-3">{children}</h3>,
          ul: ({ children }) => <ul className="list-disc ml-6 mb-4 space-y-2">{children}</ul>,
          li: ({ children }) => <li className="text-gray-700">{children}</li>,
        }}
      >
        {section.content}
      </ReactMarkdown>
    </div>
  );
}