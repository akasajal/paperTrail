import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { MessageSquare, User } from 'lucide-react';
import { FlowNode, DialogueNodeData, Character } from '../../../types';

interface DialogueNodeProps extends NodeProps<FlowNode> {
  characters?: Character[];
}

export const DialogueNode: React.FC<DialogueNodeProps> = ({ id, data, selected }) => {
  const dialogueData = data as unknown as DialogueNodeData;
  const characters = (data.charactersList as Character[]) || [];
  const character = characters.find((c) => c.id === dialogueData.characterId);
  const characterName = character ? character.displayName : 'Select Character...';

  return (
    <div
      className={`w-64 bg-editor-card border-2 rounded-xl shadow-lg transition-all overflow-hidden ${
        selected ? 'border-blue-500 shadow-blue-500/20' : 'border-blue-900/60 hover:border-blue-700/80'
      }`}
    >
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-blue-500 !border-editor-bg" />

      {/* Header */}
      <div className="bg-blue-950/80 px-3 py-1.5 border-b border-blue-900/60 flex items-center justify-between">
        <span className="text-[10px] font-bold text-blue-300 tracking-wider uppercase flex items-center gap-1.5">
          <MessageSquare size={12} className="text-blue-400" /> Dialogue
        </span>
      </div>

      {/* Body */}
      <div className="p-3 space-y-2 text-xs">
        <div className="flex items-center gap-1.5 text-blue-200 font-medium bg-blue-950/40 px-2 py-1 rounded border border-blue-900/40">
          <User size={12} className="text-blue-400 shrink-0" />
          <span className="truncate">{characterName}</span>
        </div>

        <p className="text-slate-300 text-xs italic font-serif leading-relaxed line-clamp-3 bg-editor-bg/60 p-2 rounded border border-slate-800">
          "{dialogueData.text || 'No dialogue text...'}"
        </p>
      </div>

      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-blue-500 !border-editor-bg" />
    </div>
  );
};
