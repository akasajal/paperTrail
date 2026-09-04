import { useState, useEffect, useCallback } from 'react';
import { Project, Character, Location, FlowNode, FlowEdge, NodeType, FlowNodeData } from '../types';
import { EMPTY_PROJECT, EMPTY_NODES, EMPTY_EDGES } from '../sample/sampleProject';

const STORAGE_KEY = 'papertrail_project_v3';

// Clear old legacy keys from previous versions
try {
  localStorage.removeItem('narrative_flow_editor_project_meta');
  localStorage.removeItem('narrative_flow_editor_project_nodes');
  localStorage.removeItem('narrative_flow_editor_project_edges');
} catch {}

interface AppSnapshot {
  project: Project;
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export function useProjectStore() {
  const [project, setProjectState] = useState<Project>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY + '_meta');
      return raw ? JSON.parse(raw) : EMPTY_PROJECT;
    } catch {
      return EMPTY_PROJECT;
    }
  });

  const [nodes, setNodesState] = useState<FlowNode[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY + '_nodes');
      return raw ? JSON.parse(raw) : EMPTY_NODES;
    } catch {
      return EMPTY_NODES;
    }
  });

  const [edges, setEdgesState] = useState<FlowEdge[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY + '_edges');
      return raw ? JSON.parse(raw) : EMPTY_EDGES;
    } catch {
      return EMPTY_EDGES;
    }
  });

  const [isDirty, setIsDirty] = useState(false);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEntityType, setSelectedEntityType] = useState<'character' | 'location' | null>(null);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);

  // Undo / Redo stacks
  const [history, setHistory] = useState<AppSnapshot[]>([]);
  const [future, setFuture] = useState<AppSnapshot[]>([]);

  // Record history snapshot before mutating graph/project
  const pushHistory = useCallback(() => {
    setHistory((prev) => [
      ...prev.slice(-30),
      { project, nodes, edges }
    ]);
    setFuture([]);
    setIsDirty(true);
  }, [project, nodes, edges]);

  // Setters that mark as dirty
  const setProject = useCallback((action: React.SetStateAction<Project>) => {
    pushHistory();
    setProjectState(action);
  }, [pushHistory]);

  const setNodes = useCallback((action: React.SetStateAction<FlowNode[]>) => {
    setNodesState(action);
    setIsDirty(true);
  }, []);

  const setEdges = useCallback((action: React.SetStateAction<FlowEdge[]>) => {
    setEdgesState(action);
    setIsDirty(true);
  }, []);

  // Save explicitly to localStorage
  const saveProject = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY + '_meta', JSON.stringify(project));
      localStorage.setItem(STORAGE_KEY + '_nodes', JSON.stringify(nodes));
      localStorage.setItem(STORAGE_KEY + '_edges', JSON.stringify(edges));
      setIsDirty(false);
    } catch (e) {
      console.error('Failed to save to local storage:', e);
    }
  }, [project, nodes, edges]);

  // Undo Action
  const undo = useCallback(() => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setFuture((prev) => [{ project, nodes, edges }, ...prev]);
    setProjectState(last.project);
    setNodesState(last.nodes);
    setEdgesState(last.edges);
    setHistory((prev) => prev.slice(0, -1));
    setIsDirty(true);
  }, [history, project, nodes, edges]);

  // Redo Action
  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    setHistory((prev) => [...prev, { project, nodes, edges }]);
    setProjectState(next.project);
    setNodesState(next.nodes);
    setEdgesState(next.edges);
    setFuture((prev) => prev.slice(1));
    setIsDirty(true);
  }, [future, project, nodes, edges]);

  // Character Management
  const addCharacter = (char: Character) => {
    pushHistory();
    setProjectState((prev) => ({
      ...prev,
      characters: [...prev.characters, char]
    }));
  };

  const updateCharacter = (id: string, updates: Partial<Character>) => {
    pushHistory();
    setProjectState((prev) => ({
      ...prev,
      characters: prev.characters.map((c) => (c.id === id ? { ...c, ...updates } : c))
    }));
  };

  const deleteCharacter = (id: string) => {
    pushHistory();
    setProjectState((prev) => ({
      ...prev,
      characters: prev.characters.filter((c) => c.id !== id)
    }));
  };

  // Location Management
  const addLocation = (loc: Location) => {
    pushHistory();
    setProjectState((prev) => ({
      ...prev,
      locations: [...prev.locations, loc]
    }));
  };

  const updateLocation = (id: string, updates: Partial<Location>) => {
    pushHistory();
    setProjectState((prev) => ({
      ...prev,
      locations: prev.locations.map((l) => (l.id === id ? { ...l, ...updates } : l))
    }));
  };

  const deleteLocation = (id: string) => {
    pushHistory();
    setProjectState((prev) => ({
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
          text: ''
        };
        break;
      case 'narration':
        data = { text: '' };
        break;
      case 'action':
        data = { description: '' };
        break;
      case 'choice':
        data = {
          question: '',
          choices: [
            { id: `choice-${Date.now()}-1`, text: '' },
            { id: `choice-${Date.now()}-2`, text: '' }
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

    setNodesState((prev) => [...prev, newNode]);
    setSelectedNodeId(id);
    setSelectedEntityType(null);
    setIsDirty(true);
  };

  const updateNodeData = (nodeId: string, newData: FlowNodeData) => {
    pushHistory();
    setNodesState((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...newData } } : n))
    );
  };

  const deleteNode = (nodeId: string) => {
    pushHistory();
    setNodesState((prev) => prev.filter((n) => n.id !== nodeId));
    setEdgesState((prev) => prev.filter((e) => e.source !== nodeId && e.target !== nodeId));
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
      setProjectState(jsonData.project);
      setNodesState(jsonData.nodes || []);
      setEdgesState(jsonData.edges || []);
      setSelectedNodeId(null);
      setSelectedEntityId(null);
      setIsDirty(true);
    }
  };

  const clearProject = () => {
    pushHistory();
    setProjectState(EMPTY_PROJECT);
    setNodesState(EMPTY_NODES);
    setEdgesState(EMPTY_EDGES);
    setSelectedNodeId(null);
    setSelectedEntityType(null);
    setSelectedEntityId(null);
    setIsDirty(false);
    localStorage.removeItem(STORAGE_KEY + '_meta');
    localStorage.removeItem(STORAGE_KEY + '_nodes');
    localStorage.removeItem(STORAGE_KEY + '_edges');
  };

  return {
    project,
    setProject,
    nodes,
    setNodes,
    edges,
    setEdges,
    isDirty,
    saveProject,
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
    clearProject
  };
}
