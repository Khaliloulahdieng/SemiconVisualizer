'use client';

import { VisualizationState, InteractiveElement } from '@/lib/types';
import { useEffect, useState } from 'react';
import { TransistorViz } from './devices/TransistorViz';

interface VisualizationPanelProps {
  visualizationState: VisualizationState;
  interactiveElements?: InteractiveElement[];
  renderer?: string;
}

export function VisualizationPanel({ 
  visualizationState, 
  interactiveElements,
  renderer = 'TransistorViz'
}: VisualizationPanelProps) {
  // ensure params initialisation uses defaults (use id and defaultValue from type)
  const initialParams = Object.fromEntries(
    interactiveElements?.map(el => [el.id, el.defaultValue]) ?? []
  );
  const [params, setParams] = useState<Record<string, any>>(initialParams);

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
      {/* 3D Visualization */}
      <div className="flex-1">
        {renderer === 'TransistorViz' && (
          <TransistorViz visualizationState={visualizationState} />
        )}
      </div>

      {/* Interactive Controls */}
      {interactiveElements && interactiveElements.length > 0 && (
        <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Parameters</h3>
          <div className="space-y-4">
            {interactiveElements.map((element) => {
              const val = params[element.id] ?? element.defaultValue;
              return (
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
                  {element.type === 'button' && (
                    <div>
                      <button
                        onClick={() => { /* placeholder - button actions are app-specific */ }}
                        className="w-full h-10 px-3 text-sm border rounded-lg bg-blue-600 text-white"
                      >
                        {element.label}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}