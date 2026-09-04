import React, { useState, useEffect } from 'react';
import { Character } from '../../types';
import { X, User, Image, AlignLeft } from 'lucide-react';

interface CharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (character: Character) => void;
  initialCharacter?: Character | null;
}

export const CharacterModal: React.FC<CharacterModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialCharacter
}) => {
  const [name, setName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [portrait, setPortrait] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialCharacter) {
      setName(initialCharacter.name);
      setDisplayName(initialCharacter.displayName);
      setPortrait(initialCharacter.portrait || '');
      setDescription(initialCharacter.description || '');
    } else {
      setName('');
      setDisplayName('');
      setPortrait('');
      setDescription('');
    }
  }, [initialCharacter, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !displayName.trim()) return;

    onSave({
      id: initialCharacter ? initialCharacter.id : `char-${Date.now()}`,
      name: name.trim(),
      displayName: displayName.trim(),
      portrait: portrait.trim() || null,
      description: description.trim()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface border border-outline/30 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden text-text">
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline/30 bg-variant/40">
          <div className="flex items-center gap-2 text-primary font-semibold text-base">
            <User className="w-5 h-5" />
            <span>{initialCharacter ? 'Edit Character' : 'Create New Character'}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted hover:text-text hover:bg-cell transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
              Internal Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. detective_hero"
              required
              className="w-full bg-cell border border-outline/30 rounded-lg px-3 py-2 text-text placeholder-muted focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
              Display Name *
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Detective Miller"
              required
              className="w-full bg-cell border border-outline/30 rounded-lg px-3 py-2 text-text placeholder-muted focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Image className="w-3.5 h-3.5 text-muted" />
              Portrait URL (Optional)
            </label>
            <input
              type="url"
              value={portrait}
              onChange={(e) => setPortrait(e.target.value)}
              placeholder="https://..."
              className="w-full bg-cell border border-outline/30 rounded-lg px-3 py-2 text-text placeholder-muted focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5 text-muted" />
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Character notes..."
              className="w-full bg-cell border border-outline/30 rounded-lg px-3 py-2 text-text placeholder-muted focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline/30">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-muted hover:text-text hover:bg-cell rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg transition-colors font-medium shadow-md hover:opacity-90"
            >
              {initialCharacter ? 'Save Changes' : 'Create Character'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
