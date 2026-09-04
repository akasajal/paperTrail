import { Project, FlowNode, FlowEdge } from '../types';

export const SAMPLE_PROJECT: Project = {
  id: 'proj-cafe',
  name: 'The Café Meeting',
  description: 'A quiet conversation between Alex and Maya during a rainy evening.',
  startNodeId: 'node-1',
  characters: [
    {
      id: 'char-alex',
      name: 'alex',
      displayName: 'Alex',
      portrait: null,
      description: 'A quiet university student looking for answers.'
    },
    {
      id: 'char-maya',
      name: 'maya',
      displayName: 'Maya',
      portrait: null,
      description: 'An enigmatic old friend who disappeared months ago.'
    }
  ],
  locations: [
    {
      id: 'loc-cafe',
      name: 'Old Café',
      background: null,
      description: 'A dim, quiet café near the campus edge.'
    }
  ]
};

export const SAMPLE_NODES: FlowNode[] = [
  {
    id: 'node-1',
    type: 'narration',
    position: { x: 250, y: 100 },
    data: {
      text: 'The café was almost empty. Outside, the rain beat rhythmically against the fogged windows.'
    }
  },
  {
    id: 'node-2',
    type: 'dialogue',
    position: { x: 250, y: 280 },
    data: {
      characterId: 'char-alex',
      text: "You're late."
    }
  },
  {
    id: 'node-3',
    type: 'choice',
    position: { x: 250, y: 460 },
    data: {
      question: 'Why are you here?',
      choices: [
        { id: 'choice-1', text: "I'm leaving." },
        { id: 'choice-2', text: 'I needed to see you.' }
      ]
    }
  },
  {
    id: 'node-4',
    type: 'action',
    position: { x: 80, y: 680 },
    data: {
      description: 'Alex grabs his coat and walks out into the rain.'
    }
  },
  {
    id: 'node-5',
    type: 'dialogue',
    position: { x: 450, y: 680 },
    data: {
      characterId: 'char-maya',
      text: 'Then stay. There is much to explain.'
    }
  }
];

export const SAMPLE_EDGES: FlowEdge[] = [
  {
    id: 'edge-1-2',
    source: 'node-1',
    target: 'node-2'
  },
  {
    id: 'edge-2-3',
    source: 'node-2',
    target: 'node-3'
  },
  {
    id: 'edge-3-4',
    source: 'node-3',
    sourceHandle: 'choice-1',
    target: 'node-4'
  },
  {
    id: 'edge-3-5',
    source: 'node-3',
    sourceHandle: 'choice-2',
    target: 'node-5'
  }
];
