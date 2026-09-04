import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
  addEdge,
  Connection,
  Edge,
  NodeChange,
  useReactFlow,
  ReactFlowProvider
} from '@xyflow/react';
import { DialogueNode } from './nodes/DialogueNode';
import { NarrationNode } from './nodes/NarrationNode';
import { ActionNode } from './nodes/ActionNode';
import { ChoiceNode } from './nodes/ChoiceNode';
import { SearchMenu } from './SearchMenu';
import { FlowNode, FlowEdge, NodeType, Project } from '../../types';
import { Plus, Sparkles } from 'lucide-react';

export interface CanvasProps {
  nodes: FlowNode[];
  edges: FlowEdge[];
  project: Project;
  selectedNodeId: string | null;
  onNodesChange: (nodes: FlowNode[]) => void;
  onEdgesChange: (edges: FlowEdge[]) => void;
  onSelectNode: (nodeId: string | null) => void;
  onAddNode: (type: NodeType, position: { x: number; y: number }) => void;
  onDeleteNode: (nodeId: string) => void;
}

const CanvasInner: React.FC<CanvasProps> = ({
  nodes,
  edges,
  project,
  selectedNodeId,
  onNodesChange,
  onEdgesChange,
  onSelectNode,
  onAddNode,
  onDeleteNode
}) => {
  const [searchMenuPos, setSearchMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [canvasClickPos, setCanvasClickPos] = useState<{ x: number; y: number }>({ x: 400, y: 300 });

  const reactFlowInstance = useReactFlow();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Define custom node types mapping
  const nodeTypes = useMemo(
    () => ({
      dialogue: DialogueNode,
      narration: NarrationNode,
      action: ActionNode,
      choice: ChoiceNode
    }),
    []
  );

  // Inject characters list into node data so dialogue nodes update dynamically
  const nodesWithData = useMemo(() => {
    return nodes.map((node) => ({
      ...node,
      selected: node.id === selectedNodeId,
      data: {
        ...node.data,
        charactersList: project.characters
      }
    }));
  }, [nodes, selectedNodeId, project.characters]);

  // Handle Edge Connection
  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge: Edge = {
        ...connection,
        id: `edge-${connection.source}-${connection.sourceHandle || 'def'}-${connection.target}`,
        type: 'smoothstep'
      };
      onEdgesChange(addEdge(newEdge, edges) as FlowEdge[]);
    },
    [edges, onEdgesChange]
  );

  // Handle Right-click Context Menu on Canvas
  const onContextMenu = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      if (reactFlowWrapper.current) {
        const flowPos = reactFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY
        });
        setCanvasClickPos(flowPos);
        setSearchMenuPos({ x: event.clientX, y: event.clientY });
      }
    },
    [reactFlowInstance]
  );

  // Handle Keyboard Space Key to open search menu
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (
        event.code === 'Space' &&
        !(event.target instanceof HTMLInputElement) &&
        !(event.target instanceof HTMLTextAreaElement)
      ) {
        event.preventDefault();
        const centerPos = reactFlowInstance.screenToFlowPosition({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2
        });
        setCanvasClickPos(centerPos);
        setSearchMenuPos({ x: window.innerWidth / 2 - 140, y: window.innerHeight / 2 - 100 });
      } else if (event.key === 'Delete' || event.key === 'Backspace') {
        if (
          selectedNodeId &&
          !(event.target instanceof HTMLInputElement) &&
          !(event.target instanceof HTMLTextAreaElement)
        ) {
          onDeleteNode(selectedNodeId);
        }
      }
    },
    [reactFlowInstance, selectedNodeId, onDeleteNode]
  );

  return (
    <div
      ref={reactFlowWrapper}
      className="w-full h-full relative select-none outline-none bg-slate-100 dark:bg-slate-950 transition-colors duration-200"
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      <ReactFlow
        nodes={nodesWithData}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={(changes: NodeChange[]) => {
          const updatedNodes = nodes.map((node) => {
            const change = changes.find((c) => 'id' in c && c.id === node.id);
            if (change && change.type === 'position' && change.position) {
              return { ...node, position: change.position };
            }
            return node;
          });
          onNodesChange(updatedNodes);
        }}
        onEdgesChange={(changes) => {
          const removedIds = changes.filter((c) => c.type === 'remove').map((c) => c.id);
          if (removedIds.length > 0) {
            onEdgesChange(edges.filter((e) => !removedIds.includes(e.id)));
          }
        }}
        onConnect={onConnect}
        onNodeClick={(_, node) => onSelectNode(node.id)}
        onPaneClick={() => {
          onSelectNode(null);
          setSearchMenuPos(null);
        }}
        onContextMenu={onContextMenu}
        fitView={nodes.length > 0}
        minZoom={0.2}
        maxZoom={2}
        defaultEdgeOptions={{ type: 'smoothstep' }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} className="dark:opacity-80" />
        <Controls className="!m-4" />
      </ReactFlow>

      {/* Empty State Overlay when no nodes exist */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100/80 dark:bg-slate-950/80 backdrop-blur-sm pointer-events-none z-10">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center max-w-md shadow-2xl pointer-events-auto space-y-4">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/60 rounded-xl flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Your story starts here</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Create your first node to begin building your visual novel or dialogue flow. Press{' '}
                <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded text-[10px] text-slate-700 dark:text-slate-300 font-mono">
                  Space
                </kbd>{' '}
                or right-click anywhere to search nodes.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center pt-2">
              <button
                onClick={() => onAddNode('narration', { x: 300, y: 200 })}
                className="px-3.5 py-2 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold rounded-lg border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" /> + Narration
              </button>
              <button
                onClick={() => onAddNode('dialogue', { x: 300, y: 200 })}
                className="px-3.5 py-2 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 text-xs font-semibold rounded-lg border border-indigo-200 dark:border-indigo-900/60 flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" /> + Dialogue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Node Search Menu */}
      {searchMenuPos && (
        <SearchMenu
          position={searchMenuPos}
          onSelectType={(type) => {
            onAddNode(type, canvasClickPos);
            setSearchMenuPos(null);
          }}
          onClose={() => setSearchMenuPos(null)}
        />
      )}
    </div>
  );
};

export const Canvas: React.FC<CanvasProps> = (props) => {
  return (
    <ReactFlowProvider>
      <CanvasInner {...props} />
    </ReactFlowProvider>
  );
};
