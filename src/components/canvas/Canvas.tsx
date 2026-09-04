import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
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
import { LabeledEdge } from './edges/LabeledEdge';
import { SearchMenu } from './SearchMenu';
import { FlowNode, FlowEdge, NodeType, Project, ChoiceNodeData } from '../../types';
import { Plus, Sparkles, Map, Copy } from 'lucide-react';

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
  const [showMiniMap, setShowMiniMap] = useState(true);

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

  // Define custom edge types mapping
  const edgeTypes = useMemo(
    () => ({
      labeled: LabeledEdge
    }),
    []
  );

  // Inject characters list and isStartNode into node data
  const nodesWithData = useMemo(() => {
    return nodes.map((node) => ({
      ...node,
      selected: node.id === selectedNodeId,
      data: {
        ...node.data,
        charactersList: project.characters,
        isStartNode: node.id === project.startNodeId
      }
    }));
  }, [nodes, selectedNodeId, project.characters, project.startNodeId]);

  // Inject dynamic labels onto edges (e.g. choice option text)
  const edgesWithLabels = useMemo(() => {
    return edges.map((edge) => {
      let label = edge.label;
      if (!label && edge.sourceHandle) {
        const sourceNode = nodes.find((n) => n.id === edge.source);
        if (sourceNode && sourceNode.type === 'choice') {
          const choiceData = sourceNode.data as ChoiceNodeData;
          const matchedChoice = (choiceData.choices || []).find((c) => c.id === edge.sourceHandle);
          if (matchedChoice && matchedChoice.text) {
            label = matchedChoice.text;
          }
        }
      }
      return {
        ...edge,
        type: 'labeled',
        label
      };
    });
  }, [edges, nodes]);

  // Handle Edge Connection
  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge: Edge = {
        ...connection,
        id: `edge-${connection.source}-${connection.sourceHandle || 'def'}-${connection.target}`,
        type: 'labeled'
      };
      onEdgesChange(addEdge(newEdge, edges) as FlowEdge[]);
    },
    [edges, onEdgesChange]
  );

  // Duplicate Selected Node
  const duplicateSelectedNode = useCallback(() => {
    if (!selectedNodeId) return;
    const nodeToDup = nodes.find((n) => n.id === selectedNodeId);
    if (!nodeToDup) return;

    const newPos = {
      x: nodeToDup.position.x + 40,
      y: nodeToDup.position.y + 40
    };

    onAddNode(nodeToDup.type as NodeType, newPos);
  }, [selectedNodeId, nodes, onAddNode]);

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

  // Handle Keyboard Shortcuts
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
      } else if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === 'd' &&
        !(event.target instanceof HTMLInputElement) &&
        !(event.target instanceof HTMLTextAreaElement)
      ) {
        event.preventDefault();
        duplicateSelectedNode();
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
    [reactFlowInstance, selectedNodeId, onDeleteNode, duplicateSelectedNode]
  );

  return (
    <div
      ref={reactFlowWrapper}
      className="w-full h-full relative select-none outline-none bg-bg transition-colors duration-200"
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      <ReactFlow
        nodes={nodesWithData}
        edges={edgesWithLabels}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid={true}
        snapGrid={[16, 16]}
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
        defaultEdgeOptions={{ type: 'labeled' }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} color="var(--outline)" />
        <Controls className="!m-4" />

        {showMiniMap && nodes.length > 0 && (
          <MiniMap
            nodeStrokeWidth={3}
            nodeColor={(n) => {
              if (n.type === 'dialogue') return 'var(--primary)';
              if (n.type === 'choice') return 'var(--secondary)';
              if (n.type === 'narration') return 'var(--bingo-complete)';
              if (n.type === 'action') return 'var(--called-cell)';
              return 'var(--outline)';
            }}
            maskColor="rgba(0, 0, 0, 0.4)"
            className="!bg-surface !border !border-outline/30 !rounded-xl overflow-hidden !m-4 shadow-lg"
          />
        )}
      </ReactFlow>

      {/* Floating Canvas Controls (MiniMap Toggle & Node Actions) */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        {selectedNodeId && (
          <button
            onClick={duplicateSelectedNode}
            className="px-3 py-1.5 bg-surface hover:bg-variant text-text text-xs font-semibold rounded-xl border border-outline/30 shadow-md flex items-center gap-1.5 transition-all active:scale-95"
            title="Duplicate selected node (Ctrl+D)"
          >
            <Copy className="w-3.5 h-3.5 text-primary" /> Duplicate
          </button>
        )}
        <button
          onClick={() => setShowMiniMap(!showMiniMap)}
          className={`p-2 rounded-xl border shadow-md transition-all ${
            showMiniMap
              ? 'bg-primary-container text-primary border-primary/40'
              : 'bg-surface hover:bg-variant text-muted border-outline/30'
          }`}
          title="Toggle MiniMap"
        >
          <Map className="w-4 h-4" />
        </button>
      </div>

      {/* Empty State Overlay when no nodes exist */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg/80 backdrop-blur-sm pointer-events-none z-10">
          <div className="bg-surface p-8 rounded-2xl border border-outline/30 text-center max-w-md shadow-2xl pointer-events-auto space-y-4">
            <div className="w-12 h-12 bg-primary-container/40 border border-primary/30 rounded-xl flex items-center justify-center mx-auto text-primary">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text">Your story starts here</h3>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Create your first node to begin building your visual novel or dialogue flow. Press{' '}
                <kbd className="px-1.5 py-0.5 bg-variant border border-outline/30 rounded text-[10px] text-text font-mono">
                  Space
                </kbd>{' '}
                or right-click anywhere to search nodes.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center pt-2">
              <button
                onClick={() => onAddNode('narration', { x: 300, y: 200 })}
                className="px-3.5 py-2 bg-complete/15 hover:bg-complete/25 text-complete text-xs font-semibold rounded-lg border border-complete/30 flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" /> + Narration
              </button>
              <button
                onClick={() => onAddNode('dialogue', { x: 300, y: 200 })}
                className="px-3.5 py-2 bg-primary-container/50 hover:bg-primary-container text-primary text-xs font-semibold rounded-lg border border-primary/30 flex items-center gap-1.5 transition-colors"
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
