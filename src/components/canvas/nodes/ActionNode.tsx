import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Zap } from 'lucide-react';
import { FlowNode, ActionNodeData } from '../../../types';

export const ActionNode: React.FC<NodeProps<FlowNode>> = ({ data, selected }) => {
  const actionData = data as unknown as ActionNodeData;

  return (
    <div
      className={`w-64 rounded-xl border-2 shadow-sm transition-all overflow-hidden bg-surface text-text ${
        selected
          ? 'border-called ring-2 ring-called/20 shadow-md'
          : 'border-outline/25 hover:border-outline/50'
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-called !border-2 !border-surface"
      />

      {/* Header */}
      <div className="bg-called/10 px-3.5 py-2 border-b border-outline/20 flex items-center justify-between">
        <span className="text-[11px] font-bold text-called tracking-wider uppercase flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-called" /> Action Event
        </span>
      </div>

      {/* Body */}
      <div className="p-3 text-xs">
        <p className="text-text text-xs leading-relaxed line-clamp-3 bg-variant/40 p-2.5 rounded-lg border border-outline/15 font-mono">
          {actionData.description || 'No action description...'}
        </p>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-called !border-2 !border-surface"
      />
    </div>
  );
};
