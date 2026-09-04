import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { GitFork, Flag } from 'lucide-react';
import { FlowNode, ChoiceNodeData } from '../../../types';

export const ChoiceNode: React.FC<NodeProps<FlowNode>> = ({ data, selected }) => {
  const choiceData = data as unknown as ChoiceNodeData & { isStartNode?: boolean };
  const choices = choiceData.choices || [];

  return (
    <div
      className={`w-72 rounded-xl border-2 shadow-md transition-all overflow-hidden bg-surface text-text ${
        selected
          ? 'border-secondary ring-2 ring-secondary/20 shadow-lg'
          : 'border-outline/25 hover:border-outline/50'
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-secondary !border-2 !border-surface"
      />

      {/* Header */}
      <div className="bg-secondary-container/30 px-3.5 py-2 border-b border-outline/20 flex items-center justify-between">
        <span className="text-[11px] font-bold text-secondary tracking-wider uppercase flex items-center gap-1.5">
          <GitFork className="w-3.5 h-3.5 text-secondary" /> Choice Branch
        </span>
        <div className="flex items-center gap-1.5">
          {choiceData.isStartNode && (
            <span className="flex items-center gap-1 text-[9px] font-bold text-secondary bg-secondary-container/80 px-2 py-0.5 rounded-full border border-secondary/40 shadow-sm">
              <Flag className="w-2.5 h-2.5 fill-current" /> START
            </span>
          )}
          <span className="text-[10px] font-mono text-secondary bg-surface px-2 py-0.5 rounded-md font-semibold border border-outline/20">
            {choices.length} routes
          </span>
        </div>
      </div>

      {/* Body Question Prompt */}
      <div className="p-3 space-y-3 text-xs">
        <p className="text-text text-xs font-semibold font-serif bg-variant/40 p-2.5 rounded-lg border border-outline/15">
          {choiceData.question || 'What do you do?'}
        </p>

        {/* Choice Rows with individual Output Handles */}
        <div className="space-y-2">
          {choices.map((choice, index) => (
            <div
              key={choice.id}
              className="relative flex items-center justify-between bg-cell hover:bg-secondary-container/20 px-3 py-2 rounded-lg border border-outline/20 text-text text-xs transition-colors"
            >
              <span className="truncate pr-4 font-medium">
                {index + 1}. {choice.text || 'Choice option...'}
              </span>

              <Handle
                type="source"
                position={Position.Right}
                id={choice.id}
                className="!w-3 !h-3 !bg-secondary !border-2 !border-surface !-right-1.5"
                style={{ top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
