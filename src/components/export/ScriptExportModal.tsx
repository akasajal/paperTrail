import React, { useState } from 'react';
import { Project, FlowNode, FlowEdge, DialogueNodeData, NarrationNodeData, ChoiceNodeData, ActionNodeData } from '../../types';
import { X, Download, Copy, Check, FileText } from 'lucide-react';

interface ScriptExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export const ScriptExportModal: React.FC<ScriptExportModalProps> = ({
  isOpen,
  onClose,
  project,
  nodes,
  edges
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate Script in formatted Markdown
  const generateScript = (): string => {
    const lines: string[] = [];
    lines.push(`# ${project.name}`);
    if (project.description) {
      lines.push(`> ${project.description}`);
    }
    lines.push('');

    // Cast list
    if (project.characters.length > 0) {
      lines.push('### Cast');
      project.characters.forEach((c) => {
        lines.push(`- **${c.displayName}** (@${c.name})${c.description ? `: ${c.description}` : ''}`);
      });
      lines.push('');
    }

    // Locations list
    if (project.locations.length > 0) {
      lines.push('### Locations');
      project.locations.forEach((l) => {
        lines.push(`- **${l.name}**${l.description ? `: ${l.description}` : ''}`);
      });
      lines.push('');
    }

    lines.push('---');
    lines.push('### Narrative Flow');
    lines.push('');

    // Walk graph starting from startNodeId or first node
    const visited = new Set<string>();
    const startId = project.startNodeId || nodes[0]?.id;

    const traverse = (nodeId: string | undefined, depth: number = 0) => {
      if (!nodeId || visited.has(nodeId)) return;
      visited.add(nodeId);

      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return;

      const indent = '  '.repeat(depth);

      switch (node.type) {
        case 'dialogue': {
          const data = node.data as DialogueNodeData;
          const char = project.characters.find((c) => c.id === data.characterId);
          const speaker = char ? char.displayName.toUpperCase() : 'UNKNOWN';
          lines.push(`${indent}**${speaker}**`);
          lines.push(`${indent}"${data.text || ''}"`);
          lines.push('');
          // Follow single outgoing edge
          const nextEdge = edges.find((e) => e.source === nodeId);
          if (nextEdge) traverse(nextEdge.target, depth);
          break;
        }
        case 'narration': {
          const data = node.data as NarrationNodeData;
          lines.push(`${indent}*${data.text || ''}*`);
          lines.push('');
          const nextEdge = edges.find((e) => e.source === nodeId);
          if (nextEdge) traverse(nextEdge.target, depth);
          break;
        }
        case 'action': {
          const data = node.data as ActionNodeData;
          lines.push(`${indent}[ ACTION: ${data.description || ''} ]`);
          lines.push('');
          const nextEdge = edges.find((e) => e.source === nodeId);
          if (nextEdge) traverse(nextEdge.target, depth);
          break;
        }
        case 'choice': {
          const data = node.data as ChoiceNodeData;
          lines.push(`${indent}**[ DECISION: ${data.question || 'What do you do?'} ]**`);
          (data.choices || []).forEach((c, idx) => {
            lines.push(`${indent}  Choice ${idx + 1}: ${c.text || 'Option'}`);
            const choiceEdge = edges.find((e) => e.source === nodeId && e.sourceHandle === c.id);
            if (choiceEdge) {
              traverse(choiceEdge.target, depth + 1);
            }
          });
          lines.push('');
          break;
        }
      }
    };

    if (startId) {
      traverse(startId, 0);
    }

    // Traverse any unvisited nodes
    nodes.forEach((n) => {
      if (!visited.has(n.id)) {
        lines.push(`*(Unlinked Scene Section)*`);
        traverse(n.id, 0);
      }
    });

    return lines.join('\n');
  };

  const scriptContent = generateScript();

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([scriptContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name.replace(/\s+/g, '_')}_script.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface border border-outline/30 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden text-text">
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline/30 bg-variant/40">
          <div className="flex items-center gap-2 text-primary font-semibold text-base">
            <FileText className="w-5 h-5" />
            <span>Export Manuscript Script</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted hover:text-text hover:bg-cell transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs leading-relaxed bg-cell border-b border-outline/30 select-text whitespace-pre-wrap">
          {scriptContent}
        </div>

        <div className="px-6 py-3 bg-surface flex items-center justify-between">
          <span className="text-xs text-muted">
            Formatted in human-readable Markdown script
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cell hover:bg-variant text-text text-xs font-semibold rounded-lg border border-outline/30 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-complete" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Script'}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-primary hover:opacity-90 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              <Download className="w-4 h-4" /> Download .md
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
