import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { GitFork } from 'lucide-react';
import { FlowNode, ChoiceNodeData } from '../../../types';

export const ChoiceNode: React.FC<NodeProps<FlowNode>> = ({ data, selected }) => {
  const choiceData = data as unknown as ChoiceNodeData;
  const choices = choiceData.choices || [];

  return (
    <div
      className={`w-72 rounded-xl border-2 shadow-sm transition-all overflow-hidden bg-white dark:bg-slate-900 ${
        selected
          ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-md'
          : 'border-amber-200 dark:border-amber-900/60 hover:border-amber-400 dark:hover:border-amber-700'
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-amber-500 !border-2 !border-white dark:!border-slate-900"
      />

      {/* Header - Soft Pastel Amber/Peach */}
      <div className="bg-amber-50 dark:bg-amber-950/70 px-3.5 py-2 border-b border-amber-100 dark:border-amber-900/50 flex items-center justify-between">
        <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 tracking-wider uppercase flex items-center gap-1.5">
          <GitFork className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> Choice Branch
        </span>
        <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded-md font-semibold">
          {choices.length} routes
        </span>
      </div>

      {/* Body Question Prompt */}
      <div className="p-3 space-y-3 text-xs">
        <p className="text-slate-800 dark:text-slate-200 text-xs font-semibold font-serif bg-slate-50 dark:bg-slate-950/80 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800">
          {choiceData.question || 'What do you do?'}
        </p>

        {/* Choice Rows with individual Output Handles */}
        <div className="space-y-2">
          {choices.map((choice, index) => (
            <div
              key={choice.id}
              className="relative flex items-center justify-between bg-amber-50/60 dark:bg-amber-950/40 hover:bg-amber-100/80 dark:hover:bg-amber-900/30 px-3 py-2 rounded-lg border border-amber-200/60 dark:border-amber-900/40 text-slate-800 dark:text-slate-200 text-xs transition-colors"
            >
              <span className="truncate pr-4 font-medium">
                {index + 1}. {choice.text || 'Choice option...'}
              </span>

              {/* Unique Output Handle for each choice branch */}
              <Handle
                type="source"
                position={Position.Right}
                id={choice.id}
                className="!w-3 !h-3 !bg-amber-500 !border-2 !border-white dark:!border-slate-900 !-right-1.5"
                style={{ top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
