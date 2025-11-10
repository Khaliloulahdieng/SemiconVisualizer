'use client';

import { ReactNode } from 'react';

interface SplitLayoutProps {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
}

export function SplitLayout({ leftPanel, rightPanel }: SplitLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Panel - Scrollable content */}
      <div className="w-1/2 overflow-y-auto bg-gray-50 border-r border-gray-200">
        {leftPanel}
      </div>
      
      {/* Right Panel - Fixed visualization */}
      <div className="w-1/2 bg-black relative">
        {rightPanel}
      </div>
    </div>
  );
}