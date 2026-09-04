import React, { useState } from 'react';
import {
  Undo2,
  Redo2,
  Play,
  Download,
  Upload,
  FilePlus,
  FolderGit2,
  Edit3,
  Save,
  Sun,
  Moon,
  BarChart3,
  FileText,
  HelpCircle
} from 'lucide-react';
import { Project } from '../../types';

interface TopBarProps {
  project: Project;
  canUndo: boolean;
  canRedo: boolean;
  isDirty: boolean;
  theme: 'light' | 'dark';
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onPlayTest: () => void;
  onExport: () => void;
  onImport: (data: any) => void;
  onClearProject: () => void;
  onUpdateProjectName: (name: string) => void;
  onToggleTheme: () => void;
  onOpenStats: () => void;
  onOpenScriptExport: () => void;
  onOpenShortcuts: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  project,
  canUndo,
  canRedo,
  isDirty,
  theme,
  onUndo,
  onRedo,
  onSave,
  onPlayTest,
  onExport,
  onImport,
  onClearProject,
  onUpdateProjectName,
  onToggleTheme,
  onOpenStats,
  onOpenScriptExport,
  onOpenShortcuts
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(project.name);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        onImport(parsed);
      } catch (err) {
        alert('Invalid JSON project file.');
      }
    };
    reader.readAsText(file);
  };

  const handleSaveTitle = () => {
    if (titleInput.trim()) {
      onUpdateProjectName(titleInput.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <header className="h-14 bg-surface border-b border-outline/25 px-4 flex items-center justify-between select-none z-30 shrink-0 shadow-sm transition-colors duration-200">
      {/* Left: Project Title & Save Status */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary-container/40 border border-primary/30 text-primary rounded-xl shadow-sm">
          <FolderGit2 className="w-5 h-5" />
        </div>
        <div>
          {isEditingTitle ? (
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
              autoFocus
              className="bg-bg border border-primary rounded px-2 py-0.5 text-sm font-bold text-text focus:outline-none"
            />
          ) : (
            <div
              onClick={() => {
                setTitleInput(project.name);
                setIsEditingTitle(true);
              }}
              className="flex items-center gap-1.5 cursor-pointer group"
            >
              <h1 className="text-sm font-bold text-text tracking-tight group-hover:text-primary transition-colors">
                {project.name}
              </h1>
              <Edit3 className="w-3.5 h-3.5 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}

          {isDirty ? (
            <span className="text-[10px] text-secondary font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" /> Unsaved changes
            </span>
          ) : (
            <span className="text-[10px] text-complete font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-complete" /> All changes saved
            </span>
          )}
        </div>
      </div>

      {/* Center: Action Controls (Undo, Redo, Save, Play/Test) */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center bg-cell p-1 rounded-xl border border-outline/25 gap-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 text-muted hover:text-text disabled:opacity-30 rounded-lg hover:bg-variant transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 text-muted hover:text-text disabled:opacity-30 rounded-lg hover:bg-variant transition-colors"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={onSave}
          disabled={!isDirty}
          className={`px-3.5 py-2 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-sm ${
            isDirty
              ? 'bg-primary text-white hover:opacity-90 active:scale-95'
              : 'bg-cell text-muted cursor-default'
          }`}
          title="Save project (Ctrl+S)"
        >
          <Save className="w-4 h-4" /> Save
        </button>

        <button
          onClick={onPlayTest}
          className="px-4 py-2 bg-complete text-white font-semibold text-xs rounded-xl shadow-sm hover:opacity-90 flex items-center gap-2 transition-all active:scale-95"
        >
          <Play className="w-4 h-4 fill-current" /> Play / Test Story
        </button>
      </div>

      {/* Right: Analytics, Script Export, Help, Theme, File Actions */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onOpenStats}
          className="p-2 text-text hover:bg-variant rounded-lg transition-colors border border-outline/25"
          title="Story Analytics & Health"
        >
          <BarChart3 className="w-4 h-4 text-primary" />
        </button>

        <button
          onClick={onOpenScriptExport}
          className="p-2 text-text hover:bg-variant rounded-lg transition-colors border border-outline/25"
          title="Export Narrative Script (Markdown)"
        >
          <FileText className="w-4 h-4 text-complete" />
        </button>

        <button
          onClick={onOpenShortcuts}
          className="p-2 text-text hover:bg-variant rounded-lg transition-colors border border-outline/25"
          title="Keyboard Shortcuts"
        >
          <HelpCircle className="w-4 h-4 text-secondary" />
        </button>

        <button
          onClick={onToggleTheme}
          className="p-2 text-text hover:bg-variant rounded-lg transition-colors border border-outline/25"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-secondary" /> : <Moon className="w-4 h-4 text-primary" />}
        </button>

        <div className="h-5 w-[1px] bg-outline/25 mx-1" />

        <button
          onClick={() => {
            if (window.confirm('Start a new empty project? All unsaved canvas nodes will be cleared.')) {
              onClearProject();
            }
          }}
          className="px-2.5 py-1.5 bg-cell hover:bg-variant text-text text-xs font-medium rounded-lg border border-outline/25 flex items-center gap-1.5 transition-colors"
          title="Start a new blank project"
        >
          <FilePlus className="w-3.5 h-3.5" /> New
        </button>

        <button
          onClick={onExport}
          className="px-2.5 py-1.5 bg-cell hover:bg-variant text-text text-xs font-medium rounded-lg border border-outline/25 flex items-center gap-1.5 transition-colors"
          title="Export project JSON file"
        >
          <Download className="w-3.5 h-3.5" /> Export JSON
        </button>

        <label className="px-2.5 py-1.5 bg-cell hover:bg-variant text-text text-xs font-medium rounded-lg border border-outline/25 flex items-center gap-1.5 cursor-pointer transition-colors">
          <Upload className="w-3.5 h-3.5" /> Import JSON
          <input type="file" accept=".json" onChange={handleFileChange} className="hidden" />
        </label>
      </div>
    </header>
  );
};
