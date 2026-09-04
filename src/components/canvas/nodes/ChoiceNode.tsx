import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { GitFork } from 'lucide-react';
import { FlowNode, ChoiceNodeData } from '../../../types';

export const ChoiceNode: React.FC<NodeProps<FlowNode>> = ({ data, selected }) => {
  const choiceData = data as unknown as ChoiceNodeData;
  const choices = choiceData.choices || [];

  return (
    <div
      className={`w-72 bg-editor-card border-2 rounded-xl shadow-lg transition-all overflow-hidden ${
        selected ? 'border-purple-500 shadow-purple-500/20' : 'border-purple-900/60 hover:border-purple-700/80'
      }`}
    >
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-purple-500 !border-editor-bg" />

      {/* Header */}
      <div className="bg-purple-950/80 px-3 py-1.5 border-b border-purple-900/60 flex items-center justify-between">
        <span className="text-[10px] font-bold text-purple-300 tracking-wider uppercase flex items-center gap-1.5">
          <GitFork size={12} className="text-purple-400" /> Choice Branch
        </span>
        <span className="text-[10px] font-mono text-purple-400 bg-purple-900/40 px-1.5 py-0.5 rounded">
          {choices.length} routes
        </span>
      </div>

      {/* Body Question Prompt */}
      <div className="p-3 space-y-3 text-xs">
        <p className="text-slate-200 text-xs font-semibold font-serif bg-editor-bg/80 p-2 rounded border border-slate-800">
          {choiceData.question || 'What do you do?'}
        </p>

        {/* Choice Rows with individual Output Handles */}
        <div className="space-y-2">
          {choices.map((choice, index) => (
            <div
              key={choice.id}
              className="relative flex items-center justify-between bg-purple-950/40 hover:bg-purple-900/30 px-3 py-2 rounded-lg border border-purple-900/40 text-slate-200 text-xs transition-colors"
            >
              <span className="truncate pr-4 font-medium">
                {index + 1}. {choice.text || 'Choice option...'}
              </span>

              {/* Unique Output Handle for each choice branch */}
              <Handle
                type="source"
                position={Position.Right}
                id={choice.id}
                className="!w-3 !h-3 !bg-purple-400 !border-editor-bg !-right-1.5"
                style={{ top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
