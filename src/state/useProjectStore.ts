import { useState, useEffect, useCallback } from 'react';
import { Project, Character, Location, FlowNode, FlowEdge, NodeType, FlowNodeData } from '../types';
import { SAMPLE_PROJECT, SAMPLE_NODES, SAMPLE_EDGES } from '../sample/sampleProject';

const STORAGE_KEY = 'narrative_flow_editor_project';

interface AppSnapshot {
  project: Project;
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export function useProjectStore() {
  const [project, setProject] = useState<Project>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY + '_meta');
      return raw ? JSON.parse(raw) : SAMPLE_PROJECT;
    } catch {
      return SAMPLE_PROJECT;
    }
  });

  const [nodes, setNodes] = useState<FlowNode[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY + '_nodes');
      return raw ? JSON.parse(raw) : SAMPLE_NODES;
    } catch {
      return SAMPLE_NODES;
    }
  });

  const [edges, setEdges] = useState<FlowEdge[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY + '_edges');
      return raw ? JSON.parse(raw) : SAMPLE_EDGES;
    } catch {
      return SAMPLE_EDGES;
    }
  });

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEntityType, setSelectedEntityType] = useState<'character' | 'location' | null>(null);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);

  // Undo / Redo stacks
  const [history, setHistory] = useState<AppSnapshot[]>([]);
  const [future, setFuture] = useState<AppSnapshot[]>([]);

  // Record history snapshot before mutating graph/project
  const pushHistory = useCallback(() => {
    setHistory((prev) => [
      ...prev.slice(-30), // Max 30 undo steps
      { project, nodes, edges }
    ]);
    setFuture([]);
  }, [project, nodes, edges]);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + '_meta', JSON.stringify(project));
      localStorage.setItem(STORAGE_KEY + '_nodes', JSON.stringify(nodes));
      localStorage.setItem(STORAGE_KEY + '_edges', JSON.stringify(edges));
    } catch (e) {
      console.error('Failed to save to local storage:', e);
    }
  }, [project, nodes, edges]);

  // Undo Action
  const undo = useCallback(() => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setFuture((prev) => [{ project, nodes, edges }, ...prev]);
    setProject(last.project);
    setNodes(last.nodes);
    setEdges(last.edges);
    setHistory((prev) => prev.slice(0, -1));
  }, [history, project, nodes, edges]);

  // Redo Action
  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    setHistory((prev) => [...prev, { project, nodes, edges }]);
    setProject(next.project);
    setNodes(next.nodes);
    setEdges(next.edges);
    setFuture((prev) => prev.slice(1));
  }, [future, project, nodes, edges]);

  // Character Management
  const addCharacter = (char: Character) => {
    pushHistory();
    setProject((prev) => ({
      ...prev,
      characters: [...prev.characters, char]
    }));
  };

  const updateCharacter = (id: string, updates: Partial<Character>) => {
    pushHistory();
    setProject((prev) => ({
      ...prev,
      characters: prev.characters.map((c) => (c.id === id ? { ...c, ...updates } : c))
    }));
  };

  const deleteCharacter = (id: string) => {
    pushHistory();
    setProject((prev) => ({
      ...prev,
      characters: prev.characters.filter((c) => c.id !== id)
    }));
  };

  // Location Management
  const addLocation = (loc: Location) => {
    pushHistory();
    setProject((prev) => ({
      ...prev,
      locations: [...prev.locations, loc]
    }));
  };

  const updateLocation = (id: string, updates: Partial<Location>) => {
    pushHistory();
    setProject((prev) => ({
      ...prev,
      locations: prev.locations.map((l) => (l.id === id ? { ...l, ...updates } : l))
    }));
  };

  const deleteLocation = (id: string) => {
    pushHistory();
    setProject((prev) => ({
      ...prev,
      locations: prev.locations.filter((l) => l.id !== id)
    }));
  };

  // Node Management
  const addNode = (type: NodeType, position: { x: number; y: number }) => {
    pushHistory();
    const id = `node-${Date.now()}`;
    let data: FlowNodeData;

    switch (type) {
      case 'dialogue':
        data = {
          characterId: project.characters[0]?.id || '',
          text: 'Enter dialogue line...'
        };
        break;
      case 'narration':
        data = { text: 'Enter narration text...' };
        break;
      case 'action':
        data = { description: 'Describe action...' };
        break;
      case 'choice':
        data = {
          question: 'What do you do?',
          choices: [
            { id: `choice-${Date.now()}-1`, text: 'Option 1' },
            { id: `choice-${Date.now()}-2`, text: 'Option 2' }
          ]
        };
        break;
    }

    const newNode: FlowNode = {
      id,
      type,
      position,
      data
    };

    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(id);
    setSelectedEntityType(null);
  };

  const updateNodeData = (nodeId: string, newData: FlowNodeData) => {
    pushHistory();
    setNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...newData } } : n))
    );
  };

  const deleteNode = (nodeId: string) => {
    pushHistory();
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setEdges((prev) => prev.filter((e) => e.source !== nodeId && e.target !== nodeId));
    if (selectedNodeId === nodeId) setSelectedNodeId(null);
  };

  // JSON Export / Import
  const exportProjectJson = () => {
    const fullData = {
      project,
      nodes,
      edges
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${project.name.replace(/\s+/g, '_')}_flow.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importProjectJson = (jsonData: any) => {
    if (jsonData && jsonData.project && jsonData.nodes) {
      pushHistory();
      setProject(jsonData.project);
      setNodes(jsonData.nodes || []);
      setEdges(jsonData.edges || []);
      setSelectedNodeId(null);
      setSelectedEntityId(null);
    }
  };

  const resetToSample = () => {
    pushHistory();
    setProject(SAMPLE_PROJECT);
    setNodes(SAMPLE_NODES);
    setEdges(SAMPLE_EDGES);
    setSelectedNodeId(null);
  };

  return {
    project,
    setProject,
    nodes,
    setNodes,
    edges,
    setEdges,
    selectedNodeId,
    setSelectedNodeId,
    selectedEntityType,
    setSelectedEntityType,
    selectedEntityId,
    setSelectedEntityId,
    canUndo: history.length > 0,
    canRedo: future.length > 0,
    undo,
    redo,
    pushHistory,
    addCharacter,
    updateCharacter,
    deleteCharacter,
    addLocation,
    updateLocation,
    deleteLocation,
    addNode,
    updateNodeData,
    deleteNode,
    exportProjectJson,
    importProjectJson,
    resetToSample
  };
}
