import React, { useState, useEffect } from 'react';
import { Project, FlowNode, FlowEdge, DialogueNodeData, NarrationNodeData, ActionNodeData, ChoiceNodeData } from '../../types';
import { X, RotateCcw, ArrowLeft, Play, BookOpen, Zap, GitFork, CheckCircle2 } from 'lucide-react';

interface PlayTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  nodes: FlowNode[];
  edges: FlowEdge[];
  startNodeId?: string | null;
}

export const PlayTestModal: React.FC<PlayTestModalProps> = ({
  isOpen,
  onClose,
  project,
  nodes,
  edges,
  startNodeId
}) => {
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  // Find start node on open
  useEffect(() => {
    if (isOpen) {
      const initialId = startNodeId || project.startNodeId || nodes[0]?.id || null;
      setCurrentNodeId(initialId);
      setHistory([]);
    }
  }, [isOpen, startNodeId, project.startNodeId, nodes]);

  if (!isOpen) return null;

  const currentNode = nodes.find((n) => n.id === currentNodeId);

  // Helper to step to next node ID
  const handleAdvance = (nextId: string | null) => {
    if (currentNodeId) {
      setHistory((prev) => [...prev, currentNodeId]);
    }
    setCurrentNodeId(nextId);
  };

  // Step Back
  const handleStepBack = () => {
    if (history.length === 0) return;
    const prevId = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setCurrentNodeId(prevId);
  };

  // Restart
  const handleRestart = () => {
    const initialId = startNodeId || project.startNodeId || nodes[0]?.id || null;
    setCurrentNodeId(initialId);
    setHistory([]);
  };

  // Find outgoing connection for non-choice nodes
  const getNextNodeForSingleFlow = (): string | null => {
    if (!currentNodeId) return null;
    const outgoingEdge = edges.find((e) => e.source === currentNodeId);
    return outgoingEdge ? outgoingEdge.target : null;
  };

  // Find outgoing connection for a specific choice option
  const getNextNodeForChoice = (choiceId: string): string | null => {
    if (!currentNodeId) return null;
    const targetEdge = edges.find(
      (e) => e.source === currentNodeId && e.sourceHandle === choiceId
    );
    if (targetEdge) return targetEdge.target;

    const fallbackEdge = edges.find((e) => e.source === currentNodeId);
    return fallbackEdge ? fallbackEdge.target : null;
  };

  // Active character for dialogue node
  let activeCharacter = null;
  if (currentNode && currentNode.type === 'dialogue') {
    const data = currentNode.data as DialogueNodeData;
    activeCharacter = project.characters.find((c) => c.id === data.characterId);
  }

  // Active location background
  const activeLocation = project.locations.find((l) => l.background);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden relative">
        {/* Top Playtester Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/80 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <span>Playtest Mode</span>
                <span className="text-xs font-normal text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                  {project.name}
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Simulating player visual novel dialogue flow
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleStepBack}
              disabled={history.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-200 rounded-lg transition-colors"
              title="Step Back"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              onClick={handleRestart}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-colors"
              title="Restart Test Play"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restart
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Visual Novel Screen Stage */}
        <div className="flex-1 relative flex flex-col justify-end p-8 overflow-hidden bg-slate-100 dark:bg-slate-950">
          {/* Background Image Layer */}
          {activeLocation?.background ? (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30 blur-[2px]"
              style={{ backgroundImage: `url(${activeLocation.background})` }}
            />
          ) : (
            <div className="absolute inset-0 bg-radial-gradient from-slate-200 via-slate-100 to-slate-300 dark:from-slate-900 dark:via-slate-950 dark:to-black opacity-90" />
          )}

          {/* Location Badge Indicator */}
          {activeLocation && (
            <div className="absolute top-6 left-6 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-medium text-amber-700 dark:text-amber-300 flex items-center gap-2 shadow-md">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              {activeLocation.name}
            </div>
          )}

          {/* Flow Content Display Area */}
          <div className="relative z-10 w-full max-w-3xl mx-auto space-y-4">
            {!currentNode ? (
              /* END OF STORY STATE */
              <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-8 backdrop-blur-xl text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-500/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">End of Narrative Route</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    No further outgoing node connections exist along this narrative choice path.
                  </p>
                </div>
                <button
                  onClick={handleRestart}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/20 transition-all inline-flex items-center gap-2 text-sm"
                >
                  <RotateCcw className="w-4 h-4" /> Restart Playtest
                </button>
              </div>
            ) : (
              <>
                {/* DIALOGUE NODE CARD */}
                {currentNode.type === 'dialogue' && (
                  <div className="bg-white/95 dark:bg-slate-900/95 border border-indigo-200 dark:border-indigo-500/30 rounded-2xl p-6 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-200 space-y-4">
                    <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                      {activeCharacter?.portrait ? (
                        <img
                          src={activeCharacter.portrait}
                          alt={activeCharacter.displayName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500 shadow-md shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/80 border-2 border-indigo-500 flex items-center justify-center text-indigo-700 dark:text-indigo-200 font-bold text-base shrink-0 shadow-md">
                          {activeCharacter
                            ? activeCharacter.displayName.slice(0, 2).toUpperCase()
                            : '?'}
                        </div>
                      )}
                      <div>
                        <div className="text-base font-bold text-slate-800 dark:text-slate-100">
                          {activeCharacter ? activeCharacter.displayName : 'Unknown Character'}
                        </div>
                        <div className="text-xs text-indigo-600 dark:text-indigo-400 font-mono">
                          @{activeCharacter ? activeCharacter.name : 'speaker'}
                        </div>
                      </div>
                    </div>

                    <p className="text-base text-slate-700 dark:text-slate-200 leading-relaxed font-sans min-h-[60px]">
                      {(currentNode.data as DialogueNodeData).text || '(No dialogue line)'}
                    </p>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => handleAdvance(getNextNodeForSingleFlow())}
                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
                      >
                        Continue <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>
                  </div>
                )}

                {/* NARRATION NODE CARD */}
                {currentNode.type === 'narration' && (
                  <div className="bg-white/95 dark:bg-slate-900/95 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl p-6 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-200 space-y-4">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                      <BookOpen className="w-4 h-4" /> Narration
                    </div>
                    <p className="text-base text-slate-700 dark:text-slate-200 italic leading-relaxed font-serif min-h-[60px]">
                      "{(currentNode.data as NarrationNodeData).text || '(No narration text)'}"
                    </p>
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => handleAdvance(getNextNodeForSingleFlow())}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
                      >
                        Continue <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ACTION NODE CARD */}
                {currentNode.type === 'action' && (
                  <div className="bg-white/95 dark:bg-slate-900/95 border border-purple-200 dark:border-purple-500/30 rounded-2xl p-6 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-200 space-y-4">
                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
                      <Zap className="w-4 h-4" /> Event Action
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50 p-4 rounded-xl text-purple-900 dark:text-purple-200 font-mono text-sm">
                      [ {(currentNode.data as ActionNodeData).description || '(No action description)'} ]
                    </div>
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => handleAdvance(getNextNodeForSingleFlow())}
                        className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-purple-600/20 transition-all flex items-center gap-2"
                      >
                        Continue <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>
                  </div>
                )}

                {/* CHOICE NODE CARD */}
                {currentNode.type === 'choice' && (
                  <div className="bg-white/95 dark:bg-slate-900/95 border border-amber-200 dark:border-amber-500/30 rounded-2xl p-6 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-200 space-y-5">
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
                      <GitFork className="w-4 h-4" /> Decision Prompt
                    </div>
                    <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                      {(currentNode.data as ChoiceNodeData).question || 'What do you do?'}
                    </h4>

                    {/* Interactive Choice Options */}
                    <div className="space-y-2.5 pt-1">
                      {((currentNode.data as ChoiceNodeData).choices || []).map((choice, idx) => {
                        const targetNodeId = getNextNodeForChoice(choice.id);
                        return (
                          <button
                            key={choice.id}
                            onClick={() => handleAdvance(targetNodeId)}
                            className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/80 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500/60 rounded-xl text-left transition-all group"
                          >
                            <span className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-amber-800 dark:group-hover:text-amber-200">
                              {idx + 1}. {choice.text || 'Choice option...'}
                            </span>
                            <Play className="w-4 h-4 text-slate-400 dark:text-slate-600 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
