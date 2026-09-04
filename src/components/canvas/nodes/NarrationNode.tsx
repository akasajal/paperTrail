import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { BookOpen } from 'lucide-react';
import { FlowNode, NarrationNodeData } from '../../../types';

export const NarrationNode: React.FC<NodeProps<FlowNode>> = ({ data, selected }) => {
  const narrationData = data as unknown as NarrationNodeData;

  return (
    <div
      className={`w-64 rounded-xl border-2 shadow-sm transition-all overflow-hidden bg-white dark:bg-slate-900 ${
        selected
          ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
          : 'border-emerald-200 dark:border-emerald-900/60 hover:border-emerald-400 dark:hover:border-emerald-700'
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-emerald-500 !border-2 !border-white dark:!border-slate-900"
      />

      {/* Header - Soft Pastel Mint/Emerald */}
      <div className="bg-emerald-50 dark:bg-emerald-950/70 px-3.5 py-2 border-b border-emerald-100 dark:border-emerald-900/50 flex items-center justify-between">
        <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 tracking-wider uppercase flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> Narration
        </span>
      </div>

      {/* Body */}
      <div className="p-3 text-xs">
        <p className="text-slate-700 dark:text-slate-300 text-xs font-serif leading-relaxed line-clamp-4 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800">
          {narrationData.text || 'No narration text...'}
        </p>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-emerald-500 !border-2 !border-white dark:!border-slate-900"
      />
    </div>
  );
};
