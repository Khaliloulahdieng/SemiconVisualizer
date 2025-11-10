'use client';

import { Chapter, Section } from '@/lib/types';
import { useState } from 'react';

interface SidePanelProps {
  title: string;
  description: string;
  chapters: Chapter[];
  currentSection: Section;
  onSectionChange: (section: Section) => void;
}

export function SidePanel({ 
  title, 
  description, 
  chapters, 
  currentSection, 
  onSectionChange 
}: SidePanelProps) {
  const [expandedChapters, setExpandedChapters] = useState<string[]>(
    chapters.map(c => c.id) // All chapters expanded by default
  );

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev =>
      prev.includes(chapterId)
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">{title}</h1>
        <p className="text-gray-600 text-lg">{description}</p>
      </div>

      {/* Chapter Navigation */}
      <nav className="space-y-6">
        {chapters.map((chapter) => (
          <div key={chapter.id} className="border-l-2 border-gray-300 pl-4">
            {/* Chapter Title */}
            <button
              onClick={() => toggleChapter(chapter.id)}
              className="text-xl font-semibold mb-3 hover:text-blue-600 transition-colors flex items-center gap-2"
            >
              <span className={`transform transition-transform ${
                expandedChapters.includes(chapter.id) ? 'rotate-90' : ''
              }`}>
                ▶
              </span>
              {chapter.title}
            </button>

            {/* Sections */}
            {expandedChapters.includes(chapter.id) && (
              <ul className="space-y-2 ml-6">
                {chapter.sections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => onSectionChange(section)}
                      className={`text-left w-full py-2 px-3 rounded transition-colors ${
                        currentSection.id === section.id
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {section.title}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}