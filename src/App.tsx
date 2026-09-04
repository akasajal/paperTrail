import React, { useState, useEffect } from 'react';
import { useProjectStore } from './state/useProjectStore';
import { TopBar } from './components/topbar/TopBar';
import { LeftSidebar } from './components/sidebar/LeftSidebar';
import { Canvas } from './components/canvas/Canvas';
import { RightInspector } from './components/inspector/RightInspector';
import { PlayTestModal } from './components/preview/PlayTestModal';
import { CharacterModal } from './components/sidebar/CharacterModal';
import { LocationModal } from './components/sidebar/LocationModal';
import { StoryStatsModal } from './components/analytics/StoryStatsModal';
import { ScriptExportModal } from './components/export/ScriptExportModal';
import { ShortcutsModal } from './components/help/ShortcutsModal';
import { Character, Location, NodeType } from './types';

export function App() {
  const {
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
    canUndo,
    canRedo,
    undo,
    redo,
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
  } = useProjectStore();

  // Theme state ('light' | 'dark')
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const stored = localStorage.getItem('papertrail_theme');
      return (stored as 'light' | 'dark') || 'dark';
    } catch {
      return 'dark';
    }
  });

  // Apply theme class directly to documentElement
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    try {
      localStorage.setItem('papertrail_theme', nextTheme);
    } catch {}
  };

  // Modals & Panels state
  const [isPlayTestOpen, setIsPlayTestOpen] = useState(false);
  const [isCharModalOpen, setIsCharModalOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);

  const [isLocModalOpen, setIsLocModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isScriptExportOpen, setIsScriptExportOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Keyboard Shortcuts (Undo/Redo, Save & Help)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow Ctrl+S even inside input fields
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveProject();
        return;
      }

      // Ignore standard key bindings inside text inputs
      if (
        ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)
      ) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      } else if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, saveProject]);

  // Handle Character Modal Save
  const handleSaveCharacter = (char: Character) => {
    if (editingCharacter) {
      updateCharacter(char.id, char);
    } else {
      addCharacter(char);
    }
  };

  // Handle Location Modal Save
  const handleSaveLocation = (loc: Location) => {
    if (editingLocation) {
      updateLocation(loc.id, loc);
    } else {
      addLocation(loc);
    }
  };

  // Handle Adding Node from Left Sidebar
  const handleAddNodeFromSidebar = (type: NodeType) => {
    addNode(type, { x: 300 + Math.random() * 50, y: 200 + Math.random() * 50 });
  };

  return (
    <div className="flex flex-col h-screen w-screen font-sans select-none bg-bg text-text transition-colors duration-200">
      {/* Top Header Navigation */}
      <TopBar
        project={project}
        canUndo={canUndo}
        canRedo={canRedo}
        isDirty={isDirty}
        theme={theme}
        onUndo={undo}
        onRedo={redo}
        onSave={saveProject}
        onPlayTest={() => setIsPlayTestOpen(true)}
        onExport={exportProjectJson}
        onImport={importProjectJson}
        onClearProject={clearProject}
        onUpdateProjectName={(name) => setProject((p) => ({ ...p, name }))}
        onToggleTheme={toggleTheme}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenScriptExport={() => setIsScriptExportOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar */}
        <LeftSidebar
          project={project}
          onAddCharacter={() => {
            setEditingCharacter(null);
            setIsCharModalOpen(true);
          }}
          onEditCharacter={(char) => {
            setEditingCharacter(char);
            setIsCharModalOpen(true);
          }}
          onDeleteCharacter={deleteCharacter}
          onAddLocation={() => {
            setEditingLocation(null);
            setIsLocModalOpen(true);
          }}
          onEditLocation={(loc) => {
            setEditingLocation(loc);
            setIsLocModalOpen(true);
          }}
          onDeleteLocation={deleteLocation}
          onAddNode={handleAddNodeFromSidebar}
          selectedEntityType={selectedEntityType}
          selectedEntityId={selectedEntityId}
          onSelectEntity={(type, id) => {
            setSelectedEntityType(type);
            setSelectedEntityId(id);
            setSelectedNodeId(null);
          }}
        />

        {/* Center Canvas */}
        <div className="flex-1 relative h-full">
          <Canvas
            nodes={nodes}
            edges={edges}
            project={project}
            selectedNodeId={selectedNodeId}
            onNodesChange={setNodes}
            onEdgesChange={setEdges}
            onSelectNode={(nodeId) => {
              setSelectedNodeId(nodeId);
              setSelectedEntityType(null);
              setSelectedEntityId(null);
            }}
            onAddNode={addNode}
            onDeleteNode={deleteNode}
          />
        </div>

        {/* Right Inspector */}
        <RightInspector
          project={project}
          nodes={nodes}
          selectedNodeId={selectedNodeId}
          selectedEntityType={selectedEntityType}
          selectedEntityId={selectedEntityId}
          onUpdateNodeData={updateNodeData}
          onDeleteNode={deleteNode}
          onSetStartNode={(id) => setProject((p) => ({ ...p, startNodeId: id }))}
          onAddNode={addNode}
          onUpdateCharacter={updateCharacter}
          onUpdateLocation={updateLocation}
          onCloseInspector={() => {
            setSelectedNodeId(null);
            setSelectedEntityType(null);
            setSelectedEntityId(null);
          }}
        />
      </div>

      {/* Play / Test Visual Novel Runner Modal */}
      <PlayTestModal
        isOpen={isPlayTestOpen}
        onClose={() => setIsPlayTestOpen(false)}
        project={project}
        nodes={nodes}
        edges={edges}
        startNodeId={selectedNodeId}
      />

      {/* Story Analytics & Health Modal */}
      <StoryStatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        project={project}
        nodes={nodes}
        edges={edges}
      />

      {/* Script Export Modal */}
      <ScriptExportModal
        isOpen={isScriptExportOpen}
        onClose={() => setIsScriptExportOpen(false)}
        project={project}
        nodes={nodes}
        edges={edges}
      />

      {/* Keyboard Shortcuts Help Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Character Modal */}
      <CharacterModal
        isOpen={isCharModalOpen}
        onClose={() => setIsCharModalOpen(false)}
        onSave={handleSaveCharacter}
        initialCharacter={editingCharacter}
      />

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocModalOpen}
        onClose={() => setIsLocModalOpen(false)}
        onSave={handleSaveLocation}
        initialLocation={editingLocation}
      />
    </div>
  );
}

export default App;
