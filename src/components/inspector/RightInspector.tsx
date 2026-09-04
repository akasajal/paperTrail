import React from 'react';
import {
  FlowNode,
  Project,
  Character,
  Location,
  DialogueNodeData,
  NarrationNodeData,
  ActionNodeData,
  ChoiceNodeData,
  ChoiceOption
} from '../../types';
import {
  MessageSquare,
  BookOpen,
  Zap,
  GitFork,
  Trash2,
  Flag,
  User,
  MapPin,
  Plus,
  Info,
  X
} from 'lucide-react';

interface RightInspectorProps {
  project: Project;
  nodes: FlowNode[];
  selectedNodeId: string | null;
  selectedEntityType: 'character' | 'location' | null;
  selectedEntityId: string | null;
  onUpdateNodeData: (nodeId: string, data: any) => void;
  onDeleteNode: (nodeId: string) => void;
  onSetStartNode: (nodeId: string) => void;
  onUpdateCharacter: (id: string, updates: Partial<Character>) => void;
  onUpdateLocation: (id: string, updates: Partial<Location>) => void;
  onCloseInspector: () => void;
}

export const RightInspector: React.FC<RightInspectorProps> = ({
  project,
  nodes,
  selectedNodeId,
  selectedEntityType,
  selectedEntityId,
  onUpdateNodeData,
  onDeleteNode,
  onSetStartNode,
  onUpdateCharacter,
  onUpdateLocation,
  onCloseInspector
}) => {
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const selectedCharacter =
    selectedEntityType === 'character'
      ? project.characters.find((c) => c.id === selectedEntityId)
      : null;
  const selectedLocation =
    selectedEntityType === 'location'
      ? project.locations.find((l) => l.id === selectedEntityId)
      : null;

  const isStartNode = selectedNode ? project.startNodeId === selectedNode.id : false;

  // Render Nothing Selected / Overview
  if (!selectedNode && !selectedCharacter && !selectedLocation) {
    return (
      <div className="w-80 bg-surface border-l border-outline/30 flex flex-col h-full z-20 select-none transition-colors duration-200">
        <div className="flex items-center justify-between px-4 py-3 border-b border-outline/30 bg-variant/40">
          <span className="text-xs font-bold text-muted uppercase tracking-wider">
            Inspector
          </span>
        </div>

        <div className="p-5 flex flex-col items-center justify-center text-center text-muted my-auto space-y-3">
          <div className="p-3 bg-cell rounded-xl border border-outline/30">
            <Info className="w-6 h-6 text-muted" />
          </div>
          <div>
            <div className="text-sm font-semibold text-text">No Element Selected</div>
            <p className="text-xs text-muted mt-1 max-w-[200px]">
              Click any node on the canvas, or a character/location in the left sidebar to edit its properties.
            </p>
          </div>

          <div className="w-full pt-4 border-t border-outline/30 text-left space-y-2 text-xs text-muted">
            <div className="flex justify-between">
              <span>Total Graph Nodes:</span>
              <span className="font-mono text-text">{nodes.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Start Node:</span>
              <span className="font-mono text-primary">
                {project.startNodeId || 'Not set'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Cast Members:</span>
              <span className="font-mono text-text">{project.characters.length}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Character Inspector
  if (selectedCharacter) {
    return (
      <div className="w-80 bg-surface border-l border-outline/30 flex flex-col h-full z-20 select-none transition-colors duration-200">
        <div className="flex items-center justify-between px-4 py-3 border-b border-outline/30 bg-variant/40">
          <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider">
            <User className="w-4 h-4" />
            <span>Character Inspector</span>
          </div>
          <button
            onClick={onCloseInspector}
            className="p-1 text-muted hover:text-text rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1">
              Internal Name
            </label>
            <input
              type="text"
              value={selectedCharacter.name}
              onChange={(e) => onUpdateCharacter(selectedCharacter.id, { name: e.target.value })}
              className="w-full bg-cell border border-outline/30 rounded-lg px-3 py-2 text-text focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={selectedCharacter.displayName}
              onChange={(e) =>
                onUpdateCharacter(selectedCharacter.id, { displayName: e.target.value })
              }
              className="w-full bg-cell border border-outline/30 rounded-lg px-3 py-2 text-text focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1">
              Portrait Image URL
            </label>
            <input
              type="url"
              value={selectedCharacter.portrait || ''}
              onChange={(e) =>
                onUpdateCharacter(selectedCharacter.id, { portrait: e.target.value || null })
              }
              placeholder="https://..."
              className="w-full bg-cell border border-outline/30 rounded-lg px-3 py-2 text-text focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1">
              Description
            </label>
            <textarea
              value={selectedCharacter.description || ''}
              onChange={(e) =>
                onUpdateCharacter(selectedCharacter.id, { description: e.target.value })
              }
              rows={4}
              className="w-full bg-cell border border-outline/30 rounded-lg px-3 py-2 text-text focus:outline-none focus:border-primary resize-none"
            />
          </div>
        </div>
      </div>
    );
  }

  // Render Location Inspector
  if (selectedLocation) {
    return (
      <div className="w-80 bg-surface border-l border-outline/30 flex flex-col h-full z-20 select-none transition-colors duration-200">
        <div className="flex items-center justify-between px-4 py-3 border-b border-outline/30 bg-variant/40">
          <div className="flex items-center gap-2 text-secondary text-xs font-semibold uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            <span>Location Inspector</span>
          </div>
          <button
            onClick={onCloseInspector}
            className="p-1 text-muted hover:text-text rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1">
              Location Name
            </label>
            <input
              type="text"
              value={selectedLocation.name}
              onChange={(e) => onUpdateLocation(selectedLocation.id, { name: e.target.value })}
              className="w-full bg-cell border border-outline/30 rounded-lg px-3 py-2 text-text focus:outline-none focus:border-secondary"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1">
              Background Image URL
            </label>
            <input
              type="url"
              value={selectedLocation.background || ''}
              onChange={(e) =>
                onUpdateLocation(selectedLocation.id, { background: e.target.value || null })
              }
              placeholder="https://..."
              className="w-full bg-cell border border-outline/30 rounded-lg px-3 py-2 text-text focus:outline-none focus:border-secondary"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1">
              Description / Scene Notes
            </label>
            <textarea
              value={selectedLocation.description || ''}
              onChange={(e) =>
                onUpdateLocation(selectedLocation.id, { description: e.target.value })
              }
              rows={4}
              className="w-full bg-cell border border-outline/30 rounded-lg px-3 py-2 text-text focus:outline-none focus:border-secondary resize-none"
            />
          </div>
        </div>
      </div>
    );
  }

  // Render Node Inspector
  if (!selectedNode) return null;

  return (
    <div className="w-80 bg-surface border-l border-outline/30 flex flex-col h-full z-20 select-none transition-colors duration-200">
      {/* Node Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-outline/30 bg-variant/40">
        <div className="flex items-center gap-2">
          {selectedNode.type === 'dialogue' && (
            <span className="flex items-center gap-1.5 text-primary text-xs font-semibold uppercase tracking-wider">
              <MessageSquare className="w-4 h-4" /> Dialogue Node
            </span>
          )}
          {selectedNode.type === 'narration' && (
            <span className="flex items-center gap-1.5 text-complete text-xs font-semibold uppercase tracking-wider">
              <BookOpen className="w-4 h-4" /> Narration Node
            </span>
          )}
          {selectedNode.type === 'action' && (
            <span className="flex items-center gap-1.5 text-called text-xs font-semibold uppercase tracking-wider">
              <Zap className="w-4 h-4" /> Action Node
            </span>
          )}
          {selectedNode.type === 'choice' && (
            <span className="flex items-center gap-1.5 text-secondary text-xs font-semibold uppercase tracking-wider">
              <GitFork className="w-4 h-4" /> Choice Node
            </span>
          )}
        </div>

        <button
          onClick={onCloseInspector}
          className="p-1 text-muted hover:text-text rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
        {/* Start Node Control */}
        <div className="p-3 bg-cell rounded-xl border border-outline/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flag
              className={`w-4 h-4 ${isStartNode ? 'text-primary fill-current' : 'text-muted'}`}
            />
            <span className="text-xs font-medium text-text">
              {isStartNode ? 'Start Node' : 'Set as Start'}
            </span>
          </div>

          {!isStartNode && (
            <button
              onClick={() => onSetStartNode(selectedNode.id)}
              className="px-2.5 py-1 text-xs font-semibold bg-primary-container/40 text-primary border border-primary/30 hover:bg-primary hover:text-white rounded-md transition-all"
            >
              Make Start
            </button>
          )}
        </div>

        {/* DIALOGUE NODE FORM */}
        {selectedNode.type === 'dialogue' && (
          <>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1">
                Speaker Character
              </label>
              <select
                value={(selectedNode.data as DialogueNodeData).characterId || ''}
                onChange={(e) =>
                  onUpdateNodeData(selectedNode.id, {
                    ...selectedNode.data,
                    characterId: e.target.value
                  })
                }
                className="w-full bg-cell border border-outline/30 rounded-lg px-3 py-2 text-text focus:outline-none focus:border-primary"
              >
                <option value="">Select Character...</option>
                {project.characters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.displayName} (@{c.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1">
                Dialogue Speech Line
              </label>
              <textarea
                value={(selectedNode.data as DialogueNodeData).text || ''}
                onChange={(e) =>
                  onUpdateNodeData(selectedNode.id, {
                    ...selectedNode.data,
                    text: e.target.value
                  })
                }
                rows={5}
                placeholder="Enter character spoken line..."
                className="w-full bg-cell border border-outline/30 rounded-lg px-3 py-2 text-text focus:outline-none focus:border-primary resize-none font-sans"
              />
            </div>
          </>
        )}

        {/* NARRATION NODE FORM */}
        {selectedNode.type === 'narration' && (
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1">
              Narration Prose
            </label>
            <textarea
              value={(selectedNode.data as NarrationNodeData).text || ''}
              onChange={(e) =>
                onUpdateNodeData(selectedNode.id, {
                  ...selectedNode.data,
                  text: e.target.value
                })
              }
              rows={6}
              placeholder="Enter scene narration prose..."
              className="w-full bg-cell border border-outline/30 rounded-lg px-3 py-2 text-text focus:outline-none focus:border-complete resize-none font-sans"
            />
          </div>
        )}

        {/* ACTION NODE FORM */}
        {selectedNode.type === 'action' && (
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1">
              Action Event Description
            </label>
            <textarea
              value={(selectedNode.data as ActionNodeData).description || ''}
              onChange={(e) =>
                onUpdateNodeData(selectedNode.id, {
                  ...selectedNode.data,
                  description: e.target.value
                })
              }
              rows={4}
              placeholder="e.g. Doors slide shut silently..."
              className="w-full bg-cell border border-outline/30 rounded-lg px-3 py-2 text-text focus:outline-none focus:border-called resize-none font-sans"
            />
          </div>
        )}

        {/* CHOICE NODE FORM */}
        {selectedNode.type === 'choice' && (
          <>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1">
                Question Prompt
              </label>
              <input
                type="text"
                value={(selectedNode.data as ChoiceNodeData).question || ''}
                onChange={(e) =>
                  onUpdateNodeData(selectedNode.id, {
                    ...selectedNode.data,
                    question: e.target.value
                  })
                }
                placeholder="What do you do?"
                className="w-full bg-cell border border-outline/30 rounded-lg px-3 py-2 text-text focus:outline-none focus:border-secondary font-sans"
              />
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted">
                  Branch Options ({((selectedNode.data as ChoiceNodeData).choices || []).length})
                </label>
                <button
                  onClick={() => {
                    const currentChoices = (selectedNode.data as ChoiceNodeData).choices || [];
                    const newChoice: ChoiceOption = {
                      id: `choice-${Date.now()}`,
                      text: `Option ${currentChoices.length + 1}`
                    };
                    onUpdateNodeData(selectedNode.id, {
                      ...selectedNode.data,
                      choices: [...currentChoices, newChoice]
                    });
                  }}
                  className="flex items-center gap-1 text-[11px] font-semibold text-secondary bg-secondary-container/40 border border-secondary/30 px-2 py-0.5 rounded transition-colors"
                >
                  <Plus className="w-3 h-3" /> Add Choice
                </button>
              </div>

              <div className="space-y-2">
                {((selectedNode.data as ChoiceNodeData).choices || []).map((choice, idx) => (
                  <div
                    key={choice.id}
                    className="flex items-center gap-2 p-2 bg-cell border border-outline/30 rounded-lg"
                  >
                    <span className="text-[10px] font-mono text-muted w-4 text-center">
                      #{idx + 1}
                    </span>
                    <input
                      type="text"
                      value={choice.text}
                      onChange={(e) => {
                        const currentChoices = (selectedNode.data as ChoiceNodeData).choices;
                        const updatedChoices = currentChoices.map((c) =>
                          c.id === choice.id ? { ...c, text: e.target.value } : c
                        );
                        onUpdateNodeData(selectedNode.id, {
                          ...selectedNode.data,
                          choices: updatedChoices
                        });
                      }}
                      className="flex-1 bg-transparent text-text text-xs focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        const currentChoices = (selectedNode.data as ChoiceNodeData).choices;
                        const updatedChoices = currentChoices.filter((c) => c.id !== choice.id);
                        onUpdateNodeData(selectedNode.id, {
                          ...selectedNode.data,
                          choices: updatedChoices
                        });
                      }}
                      className="p-1 text-muted hover:text-called rounded transition-colors"
                      title="Delete Choice Option"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Node Meta Info */}
        <div className="pt-4 border-t border-outline/30 text-[11px] text-muted space-y-1 font-mono">
          <div>ID: {selectedNode.id}</div>
          <div>
            Pos: ({Math.round(selectedNode.position.x)}, {Math.round(selectedNode.position.y)})
          </div>
        </div>

        {/* Delete Node Button */}
        <div className="pt-3 border-t border-outline/30">
          <button
            onClick={() => onDeleteNode(selectedNode.id)}
            className="w-full flex items-center justify-center gap-2 py-2 bg-called/15 hover:bg-called/30 border border-called/40 text-called rounded-lg text-xs font-semibold transition-all"
          >
            <Trash2 className="w-4 h-4" /> Delete Node
          </button>
        </div>
      </div>
    </div>
  );
};
