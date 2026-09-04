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

  useEffect(() => {
    if (isOpen) {
      const initialId = startNodeId || project.startNodeId || nodes[0]?.id || null;
      setCurrentNodeId(initialId);
      setHistory([]);
    }
  }, [isOpen, startNodeId, project.startNodeId, nodes]);

  if (!isOpen) return null;

  const currentNode = nodes.find((n) => n.id === currentNodeId);

  const handleAdvance = (nextId: string | null) => {
    if (currentNodeId) {
      setHistory((prev) => [...prev, currentNodeId]);
    }
    setCurrentNodeId(nextId);
  };

  const handleStepBack = () => {
    if (history.length === 0) return;
    const prevId = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setCurrentNodeId(prevId);
  };

  const handleRestart = () => {
    const initialId = startNodeId || project.startNodeId || nodes[0]?.id || null;
    setCurrentNodeId(initialId);
    setHistory([]);
  };

  const getNextNodeForSingleFlow = (): string | null => {
    if (!currentNodeId) return null;
    const outgoingEdge = edges.find((e) => e.source === currentNodeId);
    return outgoingEdge ? outgoingEdge.target : null;
  };

  const getNextNodeForChoice = (choiceId: string): string | null => {
    if (!currentNodeId) return null;
    const targetEdge = edges.find(
      (e) => e.source === currentNodeId && e.sourceHandle === choiceId
    );
    if (targetEdge) return targetEdge.target;

    const fallbackEdge = edges.find((e) => e.source === currentNodeId);
    return fallbackEdge ? fallbackEdge.target : null;
  };

  let activeCharacter = null;
  if (currentNode && currentNode.type === 'dialogue') {
    const data = currentNode.data as DialogueNodeData;
    activeCharacter = project.characters.find((c) => c.id === data.characterId);
  }

  const activeLocation = project.locations.find((l) => l.background);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-surface border border-outline/30 rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden relative text-text">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline/30 bg-variant/60 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-container/40 text-primary border border-primary/30">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="text-sm font-bold text-text flex items-center gap-2">
                <span>Playtest Mode</span>
                <span className="text-xs font-normal text-muted bg-cell px-2.5 py-0.5 rounded-full border border-outline/20">
                  {project.name}
                </span>
              </div>
              <div className="text-xs text-muted">
                Simulating player visual novel dialogue flow
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleStepBack}
              disabled={history.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-cell hover:bg-variant disabled:opacity-40 text-text rounded-lg transition-colors border border-outline/30"
              title="Step Back"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              onClick={handleRestart}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-cell hover:bg-variant text-text rounded-lg transition-colors border border-outline/30"
              title="Restart Test Play"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restart
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-muted hover:text-text hover:bg-variant rounded-lg transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Visual Novel Screen Stage */}
        <div className="flex-1 relative flex flex-col justify-end p-8 overflow-hidden bg-bg">
          {activeLocation?.background ? (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30 blur-[2px]"
              style={{ backgroundImage: `url(${activeLocation.background})` }}
            />
          ) : (
            <div className="absolute inset-0 bg-radial-gradient from-surface via-bg to-bg opacity-90" />
          )}

          {activeLocation && (
            <div className="absolute top-6 left-6 bg-surface/90 border border-outline/30 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-medium text-secondary flex items-center gap-2 shadow-md">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              {activeLocation.name}
            </div>
          )}

          {/* Flow Content Display Area */}
          <div className="relative z-10 w-full max-w-3xl mx-auto space-y-4">
            {!currentNode ? (
              <div className="bg-surface/95 border border-outline/30 rounded-2xl p-8 backdrop-blur-xl text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 bg-complete/15 text-complete rounded-full flex items-center justify-center mx-auto border border-complete/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text">End of Narrative Route</h3>
                  <p className="text-sm text-muted mt-1">
                    No further outgoing node connections exist along this narrative choice path.
                  </p>
                </div>
                <button
                  onClick={handleRestart}
                  className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold shadow-lg hover:opacity-90 transition-all inline-flex items-center gap-2 text-sm"
                >
                  <RotateCcw className="w-4 h-4" /> Restart Playtest
                </button>
              </div>
            ) : (
              <>
                {/* DIALOGUE NODE CARD */}
                {currentNode.type === 'dialogue' && (
                  <div className="bg-surface/95 border border-primary/40 rounded-2xl p-6 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-200 space-y-4">
                    <div className="flex items-center gap-3 border-b border-outline/30 pb-3">
                      {activeCharacter?.portrait ? (
                        <img
                          src={activeCharacter.portrait}
                          alt={activeCharacter.displayName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-primary shadow-md shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary-container/60 border-2 border-primary flex items-center justify-center text-primary font-bold text-base shrink-0 shadow-md">
                          {activeCharacter
                            ? activeCharacter.displayName.slice(0, 2).toUpperCase()
                            : '?'}
                        </div>
                      )}
                      <div>
                        <div className="text-base font-bold text-text">
                          {activeCharacter ? activeCharacter.displayName : 'Unknown Character'}
                        </div>
                        <div className="text-xs text-primary font-mono">
                          @{activeCharacter ? activeCharacter.name : 'speaker'}
                        </div>
                      </div>
                    </div>

                    <p className="text-base text-text leading-relaxed font-sans min-h-[60px]">
                      {(currentNode.data as DialogueNodeData).text || '(No dialogue line)'}
                    </p>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => handleAdvance(getNextNodeForSingleFlow())}
                        className="px-5 py-2 bg-primary text-white rounded-xl text-xs font-semibold shadow-md hover:opacity-90 transition-all flex items-center gap-2"
                      >
                        Continue <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>
                  </div>
                )}

                {/* NARRATION NODE CARD */}
                {currentNode.type === 'narration' && (
                  <div className="bg-surface/95 border border-complete/40 rounded-2xl p-6 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-200 space-y-4">
                    <div className="flex items-center gap-2 text-complete text-xs font-bold uppercase tracking-wider">
                      <BookOpen className="w-4 h-4" /> Narration
                    </div>
                    <p className="text-base text-text italic leading-relaxed font-serif min-h-[60px]">
                      "{(currentNode.data as NarrationNodeData).text || '(No narration text)'}"
                    </p>
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => handleAdvance(getNextNodeForSingleFlow())}
                        className="px-5 py-2 bg-complete text-white rounded-xl text-xs font-semibold shadow-md hover:opacity-90 transition-all flex items-center gap-2"
                      >
                        Continue <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ACTION NODE CARD */}
                {currentNode.type === 'action' && (
                  <div className="bg-surface/95 border border-called/40 rounded-2xl p-6 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-200 space-y-4">
                    <div className="flex items-center gap-2 text-called text-xs font-bold uppercase tracking-wider">
                      <Zap className="w-4 h-4" /> Event Action
                    </div>
                    <div className="bg-cell border border-outline/30 p-4 rounded-xl text-text font-mono text-sm">
                      [ {(currentNode.data as ActionNodeData).description || '(No action description)'} ]
                    </div>
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => handleAdvance(getNextNodeForSingleFlow())}
                        className="px-5 py-2 bg-called text-white rounded-xl text-xs font-semibold shadow-md hover:opacity-90 transition-all flex items-center gap-2"
                      >
                        Continue <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>
                  </div>
                )}

                {/* CHOICE NODE CARD */}
                {currentNode.type === 'choice' && (
                  <div className="bg-surface/95 border border-secondary/40 rounded-2xl p-6 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-200 space-y-5">
                    <div className="flex items-center gap-2 text-secondary text-xs font-bold uppercase tracking-wider">
                      <GitFork className="w-4 h-4" /> Decision Prompt
                    </div>
                    <h4 className="text-lg font-bold text-text">
                      {(currentNode.data as ChoiceNodeData).question || 'What do you do?'}
                    </h4>

                    <div className="space-y-2.5 pt-1">
                      {((currentNode.data as ChoiceNodeData).choices || []).map((choice, idx) => {
                        const targetNodeId = getNextNodeForChoice(choice.id);
                        return (
                          <button
                            key={choice.id}
                            onClick={() => handleAdvance(targetNodeId)}
                            className="w-full flex items-center justify-between p-4 bg-cell hover:bg-secondary-container/40 border border-outline/30 hover:border-secondary rounded-xl text-left transition-all group"
                          >
                            <span className="text-sm font-medium text-text group-hover:text-secondary">
                              {idx + 1}. {choice.text || 'Choice option...'}
                            </span>
                            <Play className="w-4 h-4 text-muted group-hover:text-secondary group-hover:translate-x-1 transition-all" />
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
