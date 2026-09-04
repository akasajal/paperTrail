import React from 'react';
import { Project, FlowNode, FlowEdge, DialogueNodeData, NarrationNodeData, ChoiceNodeData, ActionNodeData } from '../../types';
import { X, BarChart3, AlertTriangle, CheckCircle2, MessageSquare, BookOpen, GitFork, Zap, FileText } from 'lucide-react';

interface StoryStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export const StoryStatsModal: React.FC<StoryStatsModalProps> = ({
  isOpen,
  onClose,
  project,
  nodes,
  edges
}) => {
  if (!isOpen) return null;

  // Compute Node Counts
  const dialogueNodes = nodes.filter((n) => n.type === 'dialogue');
  const narrationNodes = nodes.filter((n) => n.type === 'narration');
  const actionNodes = nodes.filter((n) => n.type === 'action');
  const choiceNodes = nodes.filter((n) => n.type === 'choice');

  // Compute Word Counts
  let totalWords = 0;
  dialogueNodes.forEach((n) => {
    const text = (n.data as DialogueNodeData).text || '';
    totalWords += text.trim().split(/\s+/).filter(Boolean).length;
  });
  narrationNodes.forEach((n) => {
    const text = (n.data as NarrationNodeData).text || '';
    totalWords += text.trim().split(/\s+/).filter(Boolean).length;
  });
  actionNodes.forEach((n) => {
    const text = (n.data as ActionNodeData).description || '';
    totalWords += text.trim().split(/\s+/).filter(Boolean).length;
  });
  choiceNodes.forEach((n) => {
    const data = n.data as ChoiceNodeData;
    totalWords += (data.question || '').trim().split(/\s+/).filter(Boolean).length;
    (data.choices || []).forEach((c) => {
      totalWords += (c.text || '').trim().split(/\s+/).filter(Boolean).length;
    });
  });

  // Character Speaking Counts
  const characterCounts: Record<string, number> = {};
  project.characters.forEach((c) => {
    characterCounts[c.id] = 0;
  });
  dialogueNodes.forEach((n) => {
    const charId = (n.data as DialogueNodeData).characterId;
    if (charId && characterCounts[charId] !== undefined) {
      characterCounts[charId]++;
    }
  });

  // Graph Health Checks
  const issues: { type: 'warning' | 'info'; text: string }[] = [];

  if (!project.startNodeId) {
    issues.push({ type: 'warning', text: 'No Start Node is designated for this project.' });
  } else if (!nodes.some((n) => n.id === project.startNodeId)) {
    issues.push({ type: 'warning', text: 'The designated Start Node no longer exists in the graph.' });
  }

  // Check unreachable nodes
  const targetIds = new Set(edges.map((e) => e.target));
  const unreachable = nodes.filter((n) => n.id !== project.startNodeId && !targetIds.has(n.id));
  if (unreachable.length > 0) {
    issues.push({
      type: 'warning',
      text: `${unreachable.length} node(s) have no incoming connections and cannot be reached.`
    });
  }

  // Check dead ends (excluding nodes intentionally marked or single ending paths)
  const sourceIds = new Set(edges.map((e) => e.source));
  const deadEnds = nodes.filter((n) => !sourceIds.has(n.id));

  // Check empty choice handles
  let unconnectedChoices = 0;
  choiceNodes.forEach((n) => {
    const choices = (n.data as ChoiceNodeData).choices || [];
    choices.forEach((c) => {
      const hasConnection = edges.some((e) => e.source === n.id && e.sourceHandle === c.id);
      if (!hasConnection) unconnectedChoices++;
    });
  });
  if (unconnectedChoices > 0) {
    issues.push({
      type: 'info',
      text: `${unconnectedChoices} choice option branch(es) have no outgoing connections.`
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface border border-outline/30 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden text-text">
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline/30 bg-variant/40">
          <div className="flex items-center gap-2 text-primary font-semibold text-base">
            <BarChart3 className="w-5 h-5" />
            <span>Story Analytics & Health</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted hover:text-text hover:bg-cell transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-sm">
          {/* Top Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-cell rounded-xl border border-outline/20 flex flex-col items-center text-center">
              <span className="text-2xl font-bold text-primary font-mono">{nodes.length}</span>
              <span className="text-xs text-muted mt-0.5">Total Nodes</span>
            </div>
            <div className="p-3 bg-cell rounded-xl border border-outline/20 flex flex-col items-center text-center">
              <span className="text-2xl font-bold text-complete font-mono">{edges.length}</span>
              <span className="text-xs text-muted mt-0.5">Connections</span>
            </div>
            <div className="p-3 bg-cell rounded-xl border border-outline/20 flex flex-col items-center text-center">
              <span className="text-2xl font-bold text-secondary font-mono">{totalWords}</span>
              <span className="text-xs text-muted mt-0.5">Word Count</span>
            </div>
            <div className="p-3 bg-cell rounded-xl border border-outline/20 flex flex-col items-center text-center">
              <span className="text-2xl font-bold text-text font-mono">{project.characters.length}</span>
              <span className="text-xs text-muted mt-0.5">Cast Members</span>
            </div>
          </div>

          {/* Node Breakdown */}
          <div>
            <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2.5">
              Node Distribution
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="flex items-center gap-2 p-2.5 bg-cell rounded-lg border border-outline/20">
                <MessageSquare className="w-4 h-4 text-primary shrink-0" />
                <div className="text-xs">
                  <div className="font-semibold">{dialogueNodes.length} Dialogue</div>
                  <div className="text-[10px] text-muted">Spoken lines</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-cell rounded-lg border border-outline/20">
                <BookOpen className="w-4 h-4 text-complete shrink-0" />
                <div className="text-xs">
                  <div className="font-semibold">{narrationNodes.length} Narration</div>
                  <div className="text-[10px] text-muted">Scene prose</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-cell rounded-lg border border-outline/20">
                <Zap className="w-4 h-4 text-called shrink-0" />
                <div className="text-xs">
                  <div className="font-semibold">{actionNodes.length} Actions</div>
                  <div className="text-[10px] text-muted">Events</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-cell rounded-lg border border-outline/20">
                <GitFork className="w-4 h-4 text-secondary shrink-0" />
                <div className="text-xs">
                  <div className="font-semibold">{choiceNodes.length} Choices</div>
                  <div className="text-[10px] text-muted">Decisions</div>
                </div>
              </div>
            </div>
          </div>

          {/* Character Line Share */}
          {project.characters.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2.5">
                Cast Dialogue Share
              </h4>
              <div className="space-y-2 bg-cell p-4 rounded-xl border border-outline/20">
                {project.characters.map((c) => {
                  const count = characterCounts[c.id] || 0;
                  const percent = dialogueNodes.length > 0 ? Math.round((count / dialogueNodes.length) * 100) : 0;
                  return (
                    <div key={c.id} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-text">{c.displayName}</span>
                        <span className="text-muted font-mono text-[11px]">{count} lines ({percent}%)</span>
                      </div>
                      <div className="w-full bg-variant h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Story Flow Health Check */}
          <div>
            <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2.5">
              Flow Health & Connectivity
            </h4>
            {issues.length === 0 ? (
              <div className="flex items-center gap-2.5 p-3.5 bg-complete/15 border border-complete/30 text-complete rounded-xl text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>All routes are connected cleanly with a valid starting node!</span>
              </div>
            ) : (
              <div className="space-y-2">
                {issues.map((iss, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 p-3 bg-variant/60 border border-outline/30 rounded-xl text-xs text-text"
                  >
                    <AlertTriangle className="w-4 h-4 text-secondary shrink-0" />
                    <span>{iss.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-3 border-t border-outline/30 bg-variant/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-semibold shadow-sm hover:opacity-90 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
