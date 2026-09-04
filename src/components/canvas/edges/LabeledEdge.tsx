import React, { useState } from 'react';
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getSmoothStepPath, useReactFlow } from '@xyflow/react';
import { X } from 'lucide-react';

export const LabeledEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
  selected
}) => {
  const { setEdges } = useReactFlow();
  const [isHovered, setIsHovered] = useState(false);

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: selected ? 'var(--primary)' : 'var(--outline)',
          strokeWidth: selected ? 3 : 2,
          transition: 'stroke 0.2s, stroke-width 0.2s',
          opacity: selected ? 1 : 0.75
        }}
      />

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan flex items-center gap-1 group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {label && (
            <div
              className={`px-2.5 py-1 text-[11px] font-medium rounded-full shadow-sm border transition-all select-none ${
                selected
                  ? 'bg-primary-container text-primary border-primary font-semibold'
                  : 'bg-surface text-text border-outline/30 hover:border-outline'
              }`}
            >
              {label}
            </div>
          )}

          {(isHovered || selected) && (
            <button
              onClick={handleDelete}
              title="Delete connection"
              className="p-1 bg-surface hover:bg-called hover:text-white text-muted rounded-full shadow-md border border-outline/30 transition-all hover:scale-110"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};
