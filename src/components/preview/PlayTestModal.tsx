import React, { useState, useEffect, useRef } from 'react';
import { Project, FlowNode, FlowEdge, DialogueNodeData, NarrationNodeData, ActionNodeData, ChoiceNodeData } from '../../types';
import { X, RotateCcw, ArrowLeft, Play, BookOpen, Zap, GitFork, CheckCircle2, History, Maximize2, Minimize2, ChevronRight } from 'lucide-react';

interface PlayTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  nodes: FlowNode[];
  edges: FlowEdge[];
  startNodeId?: string | null;
}

interface BacklogEntry {
  type: 'dialogue' | 'narration' | 'action' | 'choice';
  speaker?: string;
  text: string;
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
  const [backlog, setBacklog] = useState<BacklogEntry[]>([]);
  const [showBacklog, setShowBacklog] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Find start node on open
  useEffect(() => {
    if (isOpen) {
      const initialId = startNodeId || project.startNodeId || nodes[0]?.id || null;
      setCurrentNodeId(initialId);
      setHistory([]);
      setBacklog([]);
      setShowBacklog(false);
    }
  }, [isOpen, startNodeId, project.startNodeId, nodes]);

  const currentNode = nodes.find((n) => n.id === currentNodeId);

  // Typewriter effect for active node text
  useEffect(() => {
    if (!currentNode) {
      setDisplayedText('');
      setIsTyping(false);
      return;
    }

    let rawText = '';
    if (currentNode.type === 'dialogue') {
      rawText = (currentNode.data as DialogueNodeData).text || '';
    } else if (currentNode.type === 'narration') {
      rawText = (currentNode.data as NarrationNodeData).text || '';
    } else if (currentNode.type === 'action') {
      rawText = (currentNode.data as ActionNodeData).description || '';
    } else if (currentNode.type === 'choice') {
      rawText = (currentNode.data as ChoiceNodeData).question || '';
    }

    // Typewriter
    let currentIndex = 0;
    setIsTyping(true);
    setDisplayedText('');

    const interval = setInterval(() => {
      if (currentIndex < rawText.length) {
        setDisplayedText(rawText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [currentNodeId, currentNode]);

  if (!isOpen) return null;

  // Complete typewriter immediately on click
  const completeTyping = () => {
    if (!currentNode || !isTyping) return;
    let fullText = '';
    if (currentNode.type === 'dialogue') fullText = (currentNode.data as DialogueNodeData).text || '';
    if (currentNode.type === 'narration') fullText = (currentNode.data as NarrationNodeData).text || '';
    if (currentNode.type === 'action') fullText = (currentNode.data as ActionNodeData).description || '';
    if (currentNode.type === 'choice') fullText = (currentNode.data as ChoiceNodeData).question || '';
    setDisplayedText(fullText);
    setIsTyping(false);
  };

  // Helper to record backlog and advance
  const recordAndAdvance = (nextId: string | null, choicePicked?: string) => {
    if (currentNode) {
      if (currentNode.type === 'dialogue') {
        const char = project.characters.find((c) => c.id === (currentNode.data as DialogueNodeData).characterId);
        setBacklog((prev) => [
          ...prev,
          {
            type: 'dialogue',
            speaker: char ? char.displayName : 'Unknown',
            text: (currentNode.data as DialogueNodeData).text
          }
        ]);
      } else if (currentNode.type === 'narration') {
        setBacklog((prev) => [
          ...prev,
          { type: 'narration', text: (currentNode.data as NarrationNodeData).text }
        ]);
      } else if (currentNode.type === 'action') {
        setBacklog((prev) => [
          ...prev,
          { type: 'action', text: (currentNode.data as ActionNodeData).description }
        ]);
      } else if (currentNode.type === 'choice') {
        setBacklog((prev) => [
          ...prev,
          {
            type: 'choice',
            text: `${(currentNode.data as ChoiceNodeData).question}${choicePicked ? ` (Selected: ${choicePicked})` : ''}`
          }
        ]);
      }
    }

    if (currentNodeId) {
      setHistory((prev) => [...prev, currentNodeId]);
    }
    setCurrentNodeId(nextId);
  };

  const handleStepBack = () => {
    if (history.length === 0) return;
    const prevId = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setBacklog((prev) => prev.slice(0, -1));
    setCurrentNodeId(prevId);
  };

  const handleRestart = () => {
    const initialId = startNodeId || project.startNodeId || nodes[0]?.id || null;
    setCurrentNodeId(initialId);
    setHistory([]);
    setBacklog([]);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-2 sm:p-6 animate-in fade-in duration-200">
      <div
        ref={containerRef}
        className={`bg-surface border border-outline/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden relative text-text transition-all duration-300 ${
          isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-4xl h-[88vh]'
        }`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-outline/30 bg-variant/50 backdrop-blur z-20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-container/40 text-primary border border-primary/30">
              <Play className="w-4 h-4 fill-current" />
            </div>
            <div>
              <div className="text-sm font-bold text-text flex items-center gap-2">
                <span>Playtest Mode</span>
                <span className="text-xs font-normal text-muted bg-cell px-2 py-0.5 rounded-full border border-outline/20">
                  {project.name}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBacklog(!showBacklog)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                showBacklog
                  ? 'bg-primary text-white border-primary'
                  : 'bg-cell hover:bg-variant text-text border-outline/30'
              }`}
              title="View conversation log"
            >
              <History className="w-3.5 h-3.5" /> Log
            </button>
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
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 text-muted hover:text-text hover:bg-variant rounded-lg transition-colors"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-muted hover:text-text hover:bg-variant rounded-lg transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Backlog Drawer */}
        {showBacklog && (
          <div className="absolute inset-x-0 top-14 bottom-0 z-30 bg-surface/98 backdrop-blur-md p-6 overflow-y-auto space-y-4 border-t border-outline/30 animate-in slide-in-from-top-4 duration-200">
            <div className="flex items-center justify-between border-b border-outline/30 pb-3">
              <h4 className="text-sm font-bold text-text flex items-center gap-2">
                <History className="w-4 h-4 text-primary" /> Story Backlog
              </h4>
              <button
                onClick={() => setShowBacklog(false)}
                className="text-xs text-muted hover:text-text"
              >
                Close Log
              </button>
            </div>
            {backlog.length === 0 ? (
              <div className="text-center py-12 text-xs text-muted">No dialogue history recorded yet.</div>
            ) : (
              <div className="space-y-3">
                {backlog.map((entry, idx) => (
                  <div key={idx} className="p-3 bg-cell rounded-xl border border-outline/20 text-xs space-y-1">
                    {entry.speaker && (
                      <span className="font-bold text-primary block">{entry.speaker}</span>
                    )}
                    <p className={`text-text ${entry.type === 'narration' ? 'italic font-serif' : ''}`}>
                      {entry.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Visual Novel Screen Stage */}
        <div
          onClick={completeTyping}
          className="flex-1 relative flex flex-col justify-end p-6 sm:p-10 overflow-hidden bg-bg cursor-pointer select-none"
        >
          {/* Background Image Layer */}
          {activeLocation?.background ? (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-35 blur-[1px]"
              style={{ backgroundImage: `url(${activeLocation.background})` }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-surface/60 via-bg/80 to-bg" />
          )}

          {activeLocation && (
            <div className="absolute top-6 left-6 bg-surface/90 border border-outline/30 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-medium text-secondary flex items-center gap-2 shadow-md z-10">
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
                      {displayedText}
                      {isTyping && <span className="animate-pulse text-primary font-bold">|</span>}
                    </p>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          recordAndAdvance(getNextNodeForSingleFlow());
                        }}
                        className="px-5 py-2 bg-primary text-white rounded-xl text-xs font-semibold shadow-md hover:opacity-90 transition-all flex items-center gap-2"
                      >
                        Continue <ChevronRight className="w-4 h-4" />
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
                      "{displayedText}"
                      {isTyping && <span className="animate-pulse text-complete font-bold">|</span>}
                    </p>
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          recordAndAdvance(getNextNodeForSingleFlow());
                        }}
                        className="px-5 py-2 bg-complete text-white rounded-xl text-xs font-semibold shadow-md hover:opacity-90 transition-all flex items-center gap-2"
                      >
                        Continue <ChevronRight className="w-4 h-4" />
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
                      [ {displayedText} ]
                    </div>
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          recordAndAdvance(getNextNodeForSingleFlow());
                        }}
                        className="px-5 py-2 bg-called text-white rounded-xl text-xs font-semibold shadow-md hover:opacity-90 transition-all flex items-center gap-2"
                      >
                        Continue <ChevronRight className="w-4 h-4" />
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
                      {displayedText}
                    </h4>

                    <div className="space-y-2.5 pt-1">
                      {((currentNode.data as ChoiceNodeData).choices || []).map((choice, idx) => {
                        const targetNodeId = getNextNodeForChoice(choice.id);
                        return (
                          <button
                            key={choice.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              recordAndAdvance(targetNodeId, choice.text);
                            }}
                            className="w-full flex items-center justify-between p-4 bg-cell hover:bg-secondary-container/40 border border-outline/30 hover:border-secondary rounded-xl text-left transition-all group"
                          >
                            <span className="text-sm font-medium text-text group-hover:text-secondary">
                              {idx + 1}. {choice.text || 'Choice option...'}
                            </span>
                            <ChevronRight className="w-4 h-4 text-muted group-hover:text-secondary group-hover:translate-x-1 transition-all" />
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
