import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { MessageSquare, User } from 'lucide-react';
import { FlowNode, DialogueNodeData, Character } from '../../../types';

export const DialogueNode: React.FC<NodeProps<FlowNode>> = ({ data, selected }) => {
  const dialogueData = data as unknown as DialogueNodeData;
  const characters = (data.charactersList as Character[]) || [];
  const character = characters.find((c) => c.id === dialogueData.characterId);
  const characterName = character ? character.displayName : 'Select Character...';

  return (
    <div
      className={`w-64 rounded-xl border-2 shadow-md transition-all overflow-hidden bg-surface text-text ${
        selected
          ? 'border-primary ring-2 ring-primary/30 shadow-lg'
          : 'border-outline/40 hover:border-outline'
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-primary !border-2 !border-surface"
      />

      {/* Header */}
      <div className="bg-primary-container/60 px-3.5 py-2 border-b border-outline/30 flex items-center justify-between">
        <span className="text-[11px] font-bold text-primary tracking-wider uppercase flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-primary" /> Dialogue
        </span>
      </div>

      {/* Body */}
      <div className="p-3 space-y-2 text-xs">
        <div className="flex items-center gap-1.5 text-text font-semibold bg-cell px-2.5 py-1 rounded-lg border border-outline/30">
          <User className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="truncate">{characterName}</span>
        </div>

        <p className="text-text text-xs italic font-serif leading-relaxed line-clamp-3 bg-variant/50 p-2.5 rounded-lg border border-outline/20">
          "{dialogueData.text || 'No dialogue text...'}"
        </p>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-primary !border-2 !border-surface"
      />
    </div>
  );
};
