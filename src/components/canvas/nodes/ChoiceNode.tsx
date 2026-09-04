import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { GitFork } from 'lucide-react';
import { FlowNode, ChoiceNodeData } from '../../../types';

export const ChoiceNode: React.FC<NodeProps<FlowNode>> = ({ data, selected }) => {
  const choiceData = data as unknown as ChoiceNodeData;
  const choices = choiceData.choices || [];

  return (
    <div
      className={`w-72 rounded-xl border-2 shadow-md transition-all overflow-hidden bg-surface text-text ${
        selected
          ? 'border-secondary ring-2 ring-secondary/30 shadow-lg'
          : 'border-outline/40 hover:border-outline'
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-secondary !border-2 !border-surface"
      />

      {/* Header */}
      <div className="bg-secondary-container/60 px-3.5 py-2 border-b border-outline/30 flex items-center justify-between">
        <span className="text-[11px] font-bold text-secondary tracking-wider uppercase flex items-center gap-1.5">
          <GitFork className="w-3.5 h-3.5 text-secondary" /> Choice Branch
        </span>
        <span className="text-[10px] font-mono text-secondary bg-surface px-2 py-0.5 rounded-md font-semibold border border-outline/20">
          {choices.length} routes
        </span>
      </div>

      {/* Body Question Prompt */}
      <div className="p-3 space-y-3 text-xs">
        <p className="text-text text-xs font-semibold font-serif bg-variant/50 p-2.5 rounded-lg border border-outline/20">
          {choiceData.question || 'What do you do?'}
        </p>

        {/* Choice Rows with individual Output Handles */}
        <div className="space-y-2">
          {choices.map((choice, index) => (
            <div
              key={choice.id}
              className="relative flex items-center justify-between bg-cell hover:bg-secondary-container/40 px-3 py-2 rounded-lg border border-outline/30 text-text text-xs transition-colors"
            >
              <span className="truncate pr-4 font-medium">
                {index + 1}. {choice.text || 'Choice option...'}
              </span>

              {/* Unique Output Handle for each choice branch */}
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
