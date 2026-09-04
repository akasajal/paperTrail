import { Node, Edge } from '@xyflow/react';

export interface Character {
  id: string;
  name: string;
  displayName: string;
  portrait?: string | null;
  description?: string;
}

export interface Location {
  id: string;
  name: string;
  background?: string | null;
  description?: string;
}

export type NodeType = 'dialogue' | 'narration' | 'action' | 'choice';

export interface DialogueNodeData extends Record<string, unknown> {
  characterId: string;
  text: string;
}

export interface NarrationNodeData extends Record<string, unknown> {
  text: string;
}

export interface ActionNodeData extends Record<string, unknown> {
  description: string;
}

export interface ChoiceOption {
  id: string;
  text: string;
}

export interface ChoiceNodeData extends Record<string, unknown> {
  question: string;
  choices: ChoiceOption[];
}

export type FlowNodeData = DialogueNodeData | NarrationNodeData | ActionNodeData | ChoiceNodeData;

export type FlowNode = Node<FlowNodeData, NodeType>;
export type FlowEdge = Edge;

export interface Project {
  id: string;
  name: string;
  description?: string;
  characters: Character[];
  locations: Location[];
  startNodeId?: string | null;
}
