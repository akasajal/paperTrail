import React, { useState, useEffect } from 'react';
import { Location } from '../../types';
import { X, MapPin, Image, AlignLeft } from 'lucide-react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (location: Location) => void;
  initialLocation?: Location | null;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialLocation
}) => {
  const [name, setName] = useState('');
  const [background, setBackground] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialLocation) {
      setName(initialLocation.name);
      setBackground(initialLocation.background || '');
      setDescription(initialLocation.description || '');
    } else {
      setName('');
      setBackground('');
      setDescription('');
    }
  }, [initialLocation, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: initialLocation ? initialLocation.id : `loc-${Date.now()}`,
      name: name.trim(),
      background: background.trim() || null,
      description: description.trim()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface border border-outline/30 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden text-text">
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline/30 bg-variant/40">
          <div className="flex items-center gap-2 text-secondary font-semibold text-base">
            <MapPin className="w-5 h-5" />
            <span>{initialLocation ? 'Edit Location' : 'Create New Location'}</span>
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
              Location Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rain-slick Alleyway"
              required
              className="w-full bg-cell border border-outline/30 rounded-lg px-3 py-2 text-text placeholder-muted focus:outline-none focus:border-secondary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Image className="w-3.5 h-3.5 text-muted" />
              Background Image URL (Optional)
            </label>
            <input
              type="url"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              placeholder="https://..."
              className="w-full bg-cell border border-outline/30 rounded-lg px-3 py-2 text-text placeholder-muted focus:outline-none focus:border-secondary"
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
              placeholder="Scene atmosphere or notes..."
              className="w-full bg-cell border border-outline/30 rounded-lg px-3 py-2 text-text placeholder-muted focus:outline-none focus:border-secondary resize-none"
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
              className="px-4 py-2 bg-secondary text-white rounded-lg transition-colors font-medium shadow-md hover:opacity-90"
            >
              {initialLocation ? 'Save Changes' : 'Create Location'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
