// lib/types.ts
export type Category = 'devices' | 'ics' | 'processes';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Topic {
  id: string;
  category: Category;
  title: string;
  description: string;
  difficulty: Difficulty;
  chapters: Chapter[];
  visualization: VisualizationConfig;
}

export interface Chapter {
  id: string;
  title: string;
  sections: Section[];
}

export interface Section {
  id: string;
  title: string;
  content: string;
  visualizationState: VisualizationState;
  interactiveElements?: InteractiveElement[];
}

export interface VisualizationState {
  type: 'process-step' | 'device-operation' | 'cross-section' | 'parameter-sweep';
  camera?: CameraPosition;
  layers?: string[];
  animation?: string;
  highlights?: string[];
}

export interface CameraPosition {
  position: [number, number, number];
  target: [number, number, number];
}

export interface InteractiveElement {
  type: 'slider' | 'toggle' | 'button';
  id: string;
  label: string;
  range?: [number, number];
  defaultValue: number | boolean;
  unit?: string;
}

export interface VisualizationConfig {
  renderer: string;
  defaultView: string;
}