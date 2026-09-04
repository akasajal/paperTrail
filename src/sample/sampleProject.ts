import { Project, FlowNode, FlowEdge } from '../types';

export const EMPTY_PROJECT: Project = {
  id: 'proj-1',
  name: 'Untitled Project',
  description: '',
  startNodeId: null,
  characters: [],
  locations: []
};

export const EMPTY_NODES: FlowNode[] = [];
export const EMPTY_EDGES: FlowEdge[] = [];
