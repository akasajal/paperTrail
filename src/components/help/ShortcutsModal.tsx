import React from 'react';
import { X, Keyboard, Command } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Space', desc: 'Open node quick-search menu on canvas' },
    { key: 'Ctrl + S', desc: 'Save project to local browser storage' },
    { key: 'Ctrl + Z', desc: 'Undo previous canvas action' },
    { key: 'Ctrl + Shift + Z / Ctrl + Y', desc: 'Redo previously undone action' },
    { key: 'Ctrl + D', desc: 'Duplicate selected node' },
    { key: 'Delete / Backspace', desc: 'Delete selected node or selected connection' },
    { key: 'Right Click', desc: 'Open context menu at cursor position' },
    { key: 'Scroll Wheel', desc: 'Zoom in and out on the canvas' },
    { key: 'Middle Click / Drag', desc: 'Pan around the infinite canvas' },
    { key: 'Esc', desc: 'Close any open dialog, modal, or menu' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface border border-outline/30 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden text-text">
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline/30 bg-variant/40">
          <div className="flex items-center gap-2 text-primary font-semibold text-base">
            <Keyboard className="w-5 h-5" />
            <span>Keyboard Shortcuts & Gestures</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted hover:text-text hover:bg-cell transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-2.5">
          {shortcuts.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-2.5 bg-cell rounded-xl border border-outline/20 text-xs"
            >
              <span className="text-text font-medium">{item.desc}</span>
              <kbd className="px-2.5 py-1 bg-surface border border-outline/30 rounded-lg text-[11px] font-mono font-semibold text-primary shadow-sm whitespace-nowrap">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="px-5 py-3 border-t border-outline/30 bg-variant/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-semibold shadow-sm hover:opacity-90 transition-all"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
