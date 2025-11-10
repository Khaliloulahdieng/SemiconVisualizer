'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { SplitLayout } from '@/components/layout/SplitLayout';
import { SidePanel } from '@/components/layout/SidePanel';
import { SectionContent } from '@/components/content/SectionContent';
import { VisualizationPanel } from '@/components/visualizations/VisualizationPanel';
import { loadTopic } from '@/lib/utils/loadTopic';
import { Topic, Section } from '@/lib/types';
import Link from 'next/link';

export default function TopicPage() {
  const params = useParams();
  const topicId = params.topicId as string;
  
  const [topic, setTopic] = useState<Topic | null>(null);
  const [currentSection, setCurrentSection] = useState<Section | null>(null);

  useEffect(() => {
    const loadedTopic = loadTopic(topicId);
    if (loadedTopic) {
      setTopic(loadedTopic);
      // Set first section as default
      setCurrentSection(loadedTopic.chapters[0].sections[0]);
    }
  }, [topicId]);

  if (!topic) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Topic not found</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  if (!currentSection) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* Header with back button */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 px-6 py-3">
        <Link 
          href="/" 
          className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
        >
          ← Back to Topics
        </Link>
      </div>

      <div className="pt-14">
        <SplitLayout
          leftPanel={
            <div>
              <SidePanel
                title={topic.title}
                description={topic.description}
                chapters={topic.chapters}
                currentSection={currentSection}
                onSectionChange={setCurrentSection}
              />
              <div className="px-8 pb-8">
                <SectionContent section={currentSection} />
              </div>
            </div>
          }
          rightPanel={
            <VisualizationPanel
              visualizationState={currentSection.visualizationState}
              interactiveElements={currentSection.interactiveElements}
              renderer={topic.visualization.renderer}
            />
          }
        />
      </div>
    </>
  );
}