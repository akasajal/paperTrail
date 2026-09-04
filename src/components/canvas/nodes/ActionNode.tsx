import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Zap } from 'lucide-react';
import { FlowNode, ActionNodeData } from '../../../types';

export const ActionNode: React.FC<NodeProps<FlowNode>> = ({ data, selected }) => {
  const actionData = data as unknown as ActionNodeData;

  return (
    <div
      className={`w-64 bg-editor-card border-2 rounded-xl shadow-lg transition-all overflow-hidden ${
        selected ? 'border-emerald-500 shadow-emerald-500/20' : 'border-emerald-900/60 hover:border-emerald-700/80'
      }`}
    >
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-emerald-500 !border-editor-bg" />

      {/* Header */}
      <div className="bg-emerald-950/80 px-3 py-1.5 border-b border-emerald-900/60 flex items-center justify-between">
        <span className="text-[10px] font-bold text-emerald-300 tracking-wider uppercase flex items-center gap-1.5">
          <Zap size={12} className="text-emerald-400" /> Action
        </span>
      </div>

      {/* Body */}
      <div className="p-3 text-xs">
        <p className="text-slate-300 text-xs leading-relaxed line-clamp-3 bg-editor-bg/60 p-2 rounded border border-slate-800 font-mono">
          {actionData.description || 'No action description...'}
        </p>
      </div>

      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-emerald-500 !border-editor-bg" />
    </div>
  );
};
