import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, BookOpen, Zap, GitFork, Search } from 'lucide-react';
import { NodeType } from '../../types';

interface SearchMenuProps {
  position: { x: number; y: number };
  onSelectType: (type: NodeType) => void;
  onClose: () => void;
}

const NODE_TYPES: { type: NodeType; label: string; desc: string; icon: React.ReactNode; color: string }[] = [
  {
    type: 'dialogue',
    label: 'Dialogue',
    desc: 'Character speech with dialogue text',
    icon: <MessageSquare className="w-4 h-4" />,
    color: 'text-primary border-primary/30 bg-primary-container/40'
  },
  {
    type: 'narration',
    label: 'Narration',
    desc: 'Scene description, thoughts, and narration',
    icon: <BookOpen className="w-4 h-4" />,
    color: 'text-complete border-complete/30 bg-complete/15'
  },
  {
    type: 'action',
    label: 'Action',
    desc: 'Event or action occurring in scene',
    icon: <Zap className="w-4 h-4" />,
    color: 'text-called border-called/30 bg-called/15'
  },
  {
    type: 'choice',
    label: 'Choice Branch',
    desc: 'Player decision with multiple outcome routes',
    icon: <GitFork className="w-4 h-4" />,
    color: 'text-secondary border-secondary/30 bg-secondary-container/40'
  }
];

export const SearchMenu: React.FC<SearchMenuProps> = ({ position, onSelectType, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const filtered = NODE_TYPES.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.desc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      ref={containerRef}
      className="fixed z-50 w-72 bg-surface border border-outline/30 rounded-xl shadow-2xl overflow-hidden backdrop-blur text-text"
      style={{ left: position.x, top: position.y }}
    >
      <div className="p-2.5 border-b border-outline/30 flex items-center gap-2 bg-variant/50">
        <Search className="w-4 h-4 text-muted shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search node types..."
          className="w-full bg-transparent text-xs text-text placeholder-muted focus:outline-none"
        />
      </div>

      <div className="p-1.5 space-y-1 max-h-64 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="p-3 text-center text-xs text-muted">No matching node types</div>
        ) : (
          filtered.map((item) => (
            <button
              key={item.type}
              onClick={() => {
                onSelectType(item.type);
                onClose();
              }}
              className="w-full text-left p-2 rounded-lg hover:bg-cell flex items-start gap-2.5 transition-colors group"
            >
              <div className={`p-1.5 rounded-md border shrink-0 ${item.color}`}>
                {item.icon}
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold text-text group-hover:text-primary">
                  {item.label}
                </div>
                <div className="text-[10px] text-muted truncate">{item.desc}</div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
