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
      <div className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col h-full z-20 select-none transition-colors duration-200">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Inspector
          </span>
        </div>

        <div className="p-5 flex flex-col items-center justify-center text-center text-slate-500 my-auto space-y-3">
          <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
            <Info className="w-6 h-6 text-slate-400" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">No Element Selected</div>
            <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
              Click any node on the canvas, or a character/location in the left sidebar to edit its properties.
            </p>
          </div>

          <div className="w-full pt-4 border-t border-slate-200 dark:border-slate-800 text-left space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span>Total Graph Nodes:</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">{nodes.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Start Node:</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400">
                {project.startNodeId || 'Not set'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Cast Members:</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">{project.characters.length}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Character Inspector
  if (selectedCharacter) {
    return (
      <div className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col h-full z-20 select-none transition-colors duration-200">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <User className="w-4 h-4" />
            <span>Character Inspector</span>
          </div>
          <button
            onClick={onCloseInspector}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Internal Name
            </label>
            <input
              type="text"
              value={selectedCharacter.name}
              onChange={(e) => onUpdateCharacter(selectedCharacter.id, { name: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={selectedCharacter.displayName}
              onChange={(e) =>
                onUpdateCharacter(selectedCharacter.id, { displayName: e.target.value })
              }
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Portrait Image URL
            </label>
            <input
              type="url"
              value={selectedCharacter.portrait || ''}
              onChange={(e) =>
                onUpdateCharacter(selectedCharacter.id, { portrait: e.target.value || null })
              }
              placeholder="https://..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Description
            </label>
            <textarea
              value={selectedCharacter.description || ''}
              onChange={(e) =>
                onUpdateCharacter(selectedCharacter.id, { description: e.target.value })
              }
              rows={4}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>
        </div>
      </div>
    );
  }

  // Render Location Inspector
  if (selectedLocation) {
    return (
      <div className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col h-full z-20 select-none transition-colors duration-200">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            <span>Location Inspector</span>
          </div>
          <button
            onClick={onCloseInspector}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Location Name
            </label>
            <input
              type="text"
              value={selectedLocation.name}
              onChange={(e) => onUpdateLocation(selectedLocation.id, { name: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Background Image URL
            </label>
            <input
              type="url"
              value={selectedLocation.background || ''}
              onChange={(e) =>
                onUpdateLocation(selectedLocation.id, { background: e.target.value || null })
              }
              placeholder="https://..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Description / Scene Notes
            </label>
            <textarea
              value={selectedLocation.description || ''}
              onChange={(e) =>
                onUpdateLocation(selectedLocation.id, { description: e.target.value })
              }
              rows={4}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>
        </div>
      </div>
    );
  }

  // Render Node Inspector
  if (!selectedNode) return null;

  return (
    <div className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col h-full z-20 select-none transition-colors duration-200">
      {/* Node Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40">
        <div className="flex items-center gap-2">
          {selectedNode.type === 'dialogue' && (
            <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <MessageSquare className="w-4 h-4" /> Dialogue Node
            </span>
          )}
          {selectedNode.type === 'narration' && (
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <BookOpen className="w-4 h-4" /> Narration Node
            </span>
          )}
          {selectedNode.type === 'action' && (
            <span className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 text-xs font-semibold uppercase tracking-wider">
              <Zap className="w-4 h-4" /> Action Node
            </span>
          )}
          {selectedNode.type === 'choice' && (
            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <GitFork className="w-4 h-4" /> Choice Node
            </span>
          )}
        </div>

        <button
          onClick={onCloseInspector}
          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
        {/* Start Node Control */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flag
              className={`w-4 h-4 ${isStartNode ? 'text-indigo-600 dark:text-indigo-400 fill-current' : 'text-slate-400'}`}
            />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
              {isStartNode ? 'Start Node' : 'Set as Start'}
            </span>
          </div>

          {!isStartNode && (
            <button
              onClick={() => onSetStartNode(selectedNode.id)}
              className="px-2.5 py-1 text-xs font-semibold bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/40 hover:bg-indigo-600 hover:text-white rounded-md transition-all"
            >
              Make Start
            </button>
          )}
        </div>

        {/* DIALOGUE NODE FORM */}
        {selectedNode.type === 'dialogue' && (
          <>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
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
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
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
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
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
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 resize-none font-sans"
              />
            </div>
          </>
        )}

        {/* NARRATION NODE FORM */}
        {selectedNode.type === 'narration' && (
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
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
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 resize-none font-sans"
            />
          </div>
        )}

        {/* ACTION NODE FORM */}
        {selectedNode.type === 'action' && (
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
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
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-purple-500 resize-none font-sans"
            />
          </div>
        )}

        {/* CHOICE NODE FORM */}
        {selectedNode.type === 'choice' && (
          <>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
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
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-amber-500 font-sans"
              />
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
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
                  className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/50 px-2 py-0.5 rounded transition-colors"
                >
                  <Plus className="w-3 h-3" /> Add Choice
                </button>
              </div>

              <div className="space-y-2">
                {((selectedNode.data as ChoiceNodeData).choices || []).map((choice, idx) => (
                  <div
                    key={choice.id}
                    className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg"
                  >
                    <span className="text-[10px] font-mono text-slate-400 w-4 text-center">
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
                      className="flex-1 bg-transparent text-slate-800 dark:text-slate-200 text-xs focus:outline-none"
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
                      className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
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
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 space-y-1 font-mono">
          <div>ID: {selectedNode.id}</div>
          <div>
            Pos: ({Math.round(selectedNode.position.x)}, {Math.round(selectedNode.position.y)})
          </div>
        </div>

        {/* Delete Node Button */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => onDeleteNode(selectedNode.id)}
            className="w-full flex items-center justify-center gap-2 py-2 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-300 rounded-lg text-xs font-semibold transition-all"
          >
            <Trash2 className="w-4 h-4" /> Delete Node
          </button>
        </div>
      </div>
    </div>
  );
};
