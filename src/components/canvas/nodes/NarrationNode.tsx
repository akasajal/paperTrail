import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { BookOpen } from 'lucide-react';
import { FlowNode, NarrationNodeData } from '../../../types';

export const NarrationNode: React.FC<NodeProps<FlowNode>> = ({ data, selected }) => {
  const narrationData = data as unknown as NarrationNodeData;

  return (
    <div
      className={`w-64 bg-editor-card border-2 rounded-xl shadow-lg transition-all overflow-hidden ${
        selected ? 'border-amber-500 shadow-amber-500/20' : 'border-amber-900/60 hover:border-amber-700/80'
      }`}
    >
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-amber-500 !border-editor-bg" />

      {/* Header */}
      <div className="bg-amber-950/80 px-3 py-1.5 border-b border-amber-900/60 flex items-center justify-between">
        <span className="text-[10px] font-bold text-amber-300 tracking-wider uppercase flex items-center gap-1.5">
          <BookOpen size={12} className="text-amber-400" /> Narration
        </span>
      </div>

      {/* Body */}
      <div className="p-3 text-xs">
        <p className="text-slate-300 text-xs font-serif leading-relaxed line-clamp-4 bg-editor-bg/60 p-2 rounded border border-slate-800">
          {narrationData.text || 'No narration text...'}
        </p>
      </div>

      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-amber-500 !border-editor-bg" />
    </div>
  );
};
