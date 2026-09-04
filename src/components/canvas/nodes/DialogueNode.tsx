import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { MessageSquare, User } from 'lucide-react';
import { FlowNode, DialogueNodeData, Character } from '../../../types';

interface DialogueNodeProps extends NodeProps<FlowNode> {
  characters?: Character[];
}

export const DialogueNode: React.FC<DialogueNodeProps> = ({ data, selected }) => {
  const dialogueData = data as unknown as DialogueNodeData;
  const characters = (data.charactersList as Character[]) || [];
  const character = characters.find((c) => c.id === dialogueData.characterId);
  const characterName = character ? character.displayName : 'Select Character...';

  return (
    <div
      className={`w-64 rounded-xl border-2 shadow-sm transition-all overflow-hidden bg-white dark:bg-slate-900 ${
        selected
          ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
          : 'border-indigo-200 dark:border-indigo-900/60 hover:border-indigo-400 dark:hover:border-indigo-700'
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-indigo-500 !border-2 !border-white dark:!border-slate-900"
      />

      {/* Header - Soft Pastel Indigo */}
      <div className="bg-indigo-50 dark:bg-indigo-950/70 px-3.5 py-2 border-b border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between">
        <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 tracking-wider uppercase flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" /> Dialogue
        </span>
      </div>

      {/* Body */}
      <div className="p-3 space-y-2 text-xs">
        <div className="flex items-center gap-1.5 text-indigo-900 dark:text-indigo-200 font-semibold bg-indigo-50/60 dark:bg-indigo-950/40 px-2.5 py-1 rounded-lg border border-indigo-100 dark:border-indigo-900/40">
          <User className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 shrink-0" />
          <span className="truncate">{characterName}</span>
        </div>

        <p className="text-slate-700 dark:text-slate-300 text-xs italic font-serif leading-relaxed line-clamp-3 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800">
          "{dialogueData.text || 'No dialogue text...'}"
        </p>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-indigo-500 !border-2 !border-white dark:!border-slate-900"
      />
    </div>
  );
};
