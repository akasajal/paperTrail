import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { BookOpen } from 'lucide-react';
import { FlowNode, NarrationNodeData } from '../../../types';

export const NarrationNode: React.FC<NodeProps<FlowNode>> = ({ data, selected }) => {
  const narrationData = data as unknown as NarrationNodeData;

  return (
    <div
      className={`w-64 rounded-xl border-2 shadow-md transition-all overflow-hidden bg-surface text-text ${
        selected
          ? 'border-complete ring-2 ring-complete/30 shadow-lg'
          : 'border-outline/40 hover:border-outline'
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-complete !border-2 !border-surface"
      />

      {/* Header */}
      <div className="bg-complete/15 px-3.5 py-2 border-b border-outline/30 flex items-center justify-between">
        <span className="text-[11px] font-bold text-complete tracking-wider uppercase flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-complete" /> Narration
        </span>
      </div>

      {/* Body */}
      <div className="p-3 text-xs">
        <p className="text-text text-xs font-serif leading-relaxed line-clamp-4 bg-variant/50 p-2.5 rounded-lg border border-outline/20">
          {narrationData.text || 'No narration text...'}
        </p>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-complete !border-2 !border-surface"
      />
    </div>
  );
};
