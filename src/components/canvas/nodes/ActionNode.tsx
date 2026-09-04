import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Zap } from 'lucide-react';
import { FlowNode, ActionNodeData } from '../../../types';

export const ActionNode: React.FC<NodeProps<FlowNode>> = ({ data, selected }) => {
  const actionData = data as unknown as ActionNodeData;

  return (
    <div
      className={`w-64 rounded-xl border-2 shadow-sm transition-all overflow-hidden bg-white dark:bg-slate-900 ${
        selected
          ? 'border-purple-500 ring-2 ring-purple-500/20 shadow-md'
          : 'border-purple-200 dark:border-purple-900/60 hover:border-purple-400 dark:hover:border-purple-700'
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-purple-500 !border-2 !border-white dark:!border-slate-900"
      />

      {/* Header - Soft Pastel Purple/Lilac */}
      <div className="bg-purple-50 dark:bg-purple-950/70 px-3.5 py-2 border-b border-purple-100 dark:border-purple-900/50 flex items-center justify-between">
        <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 tracking-wider uppercase flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" /> Action Event
        </span>
      </div>

      {/* Body */}
      <div className="p-3 text-xs">
        <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed line-clamp-3 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 font-mono">
          {actionData.description || 'No action description...'}
        </p>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-purple-500 !border-2 !border-white dark:!border-slate-900"
      />
    </div>
  );
};
