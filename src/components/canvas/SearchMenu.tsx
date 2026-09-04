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
    icon: <MessageSquare size={16} />,
    color: 'text-blue-400 border-blue-900/60 bg-blue-950/40'
  },
  {
    type: 'narration',
    label: 'Narration',
    desc: 'Scene description, thoughts, and narration',
    icon: <BookOpen size={16} />,
    color: 'text-amber-400 border-amber-900/60 bg-amber-950/40'
  },
  {
    type: 'action',
    label: 'Action',
    desc: 'Event or action occurring in scene',
    icon: <Zap size={16} />,
    color: 'text-emerald-400 border-emerald-900/60 bg-emerald-950/40'
  },
  {
    type: 'choice',
    label: 'Choice Branch',
    desc: 'Player decision with multiple outcome routes',
    icon: <GitFork size={16} />,
    color: 'text-purple-400 border-purple-900/60 bg-purple-950/40'
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
      className="fixed z-50 w-72 bg-editor-panel border border-editor-border rounded-xl shadow-2xl overflow-hidden backdrop-blur"
      style={{ left: position.x, top: position.y }}
    >
      <div className="p-2 border-b border-editor-border flex items-center gap-2 bg-editor-bg/60">
        <Search size={14} className="text-slate-400 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search node types... (Press Esc to close)"
          className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
        />
      </div>

      <div className="p-1.5 space-y-1 max-h-64 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="p-3 text-center text-xs text-slate-500">No matching node types</div>
        ) : (
          filtered.map((item) => (
            <button
              key={item.type}
              onClick={() => {
                onSelectType(item.type);
                onClose();
              }}
              className="w-full text-left p-2 rounded-lg hover:bg-slate-800 flex items-start gap-2.5 transition-colors group"
            >
              <div className={`p-1.5 rounded-md border shrink-0 ${item.color}`}>
                {item.icon}
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold text-slate-200 group-hover:text-white">
                  {item.label}
                </div>
                <div className="text-[10px] text-slate-400 truncate">{item.desc}</div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
