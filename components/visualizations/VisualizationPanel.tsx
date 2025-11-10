'use client';

import { VisualizationState, InteractiveElement } from '@/lib/types';
import { useEffect, useState } from 'react';

interface VisualizationPanelProps {
  visualizationState: VisualizationState;
  interactiveElements?: InteractiveElement[];
}

export function VisualizationPanel({ 
  visualizationState, 
  interactiveElements 
}: VisualizationPanelProps) {
  const [params, setParams] = useState<Record<string, number | boolean>>({});

  useEffect(() => {
    // Initialize parameters with default values
    if (interactiveElements) {
      const defaults: Record<string, number | boolean> = {};
      interactiveElements.forEach(el => {
        defaults[el.id] = el.defaultValue;
      });
      setParams(defaults);
    }
  }, [interactiveElements]);

  const handleParamChange = (id: string, value: number | boolean) => {
    setParams(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* 3D Visualization Area - Placeholder for now */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">🔬</div>
          <p className="text-xl font-semibold mb-2">3D Visualization</p>
          <p className="text-gray-400">Type: {visualizationState.type}</p>
          <p className="text-gray-400 text-sm mt-2">
            Animation: {visualizationState.animation || 'none'}
          </p>
          {visualizationState.highlights && (
            <p className="text-blue-400 text-sm mt-1">
              Highlighting: {visualizationState.highlights.join(', ')}
            </p>
          )}
        </div>
      </div>

      {/* Interactive Controls */}
      {interactiveElements && interactiveElements.length > 0 && (
        <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Parameters</h3>
          <div className="space-y-4">
            {interactiveElements.map((element) => (
              <div key={element.id}>
                {element.type === 'slider' && element.range && (
                  <div>
                    <label className="flex justify-between text-sm font-medium mb-2">
                      <span>{element.label}</span>
                      <span className="text-blue-600">
                        {params[element.id]} {element.unit}
                      </span>
                    </label>
                    <input
                      type="range"
                      min={element.range[0]}
                      max={element.range[1]}
                      step={(element.range[1] - element.range[0]) / 100}
                      value={params[element.id] as number}
                      onChange={(e) => handleParamChange(element.id, parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                )}
                {element.type === 'toggle' && (
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={params[element.id] as boolean}
                      onChange={(e) => handleParamChange(element.id, e.target.checked)}
                      className="w-5 h-5 accent-blue-600"
                    />
                    <span className="text-sm font-medium">{element.label}</span>
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}