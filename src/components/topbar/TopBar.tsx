import React, { useState } from 'react';
import { Undo2, Redo2, Play, Download, Upload, FilePlus, FolderGit2, Edit3, Save, Sun, Moon } from 'lucide-react';
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
  onToggleTheme
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
    <header className="h-14 bg-theme-surface border-b border-theme-variant/60 px-4 flex items-center justify-between select-none z-30 shrink-0 shadow-sm transition-colors duration-200">
      {/* Left: Project Title & Save Status */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-theme-primary-container/40 border border-theme-primary/30 text-theme-primary rounded-xl shadow-sm">
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
              className="bg-theme-bg border border-theme-primary rounded px-2 py-0.5 text-sm font-bold text-theme-text focus:outline-none"
            />
          ) : (
            <div
              onClick={() => {
                setTitleInput(project.name);
                setIsEditingTitle(true);
              }}
              className="flex items-center gap-1.5 cursor-pointer group"
            >
              <h1 className="text-sm font-bold text-theme-text tracking-tight group-hover:text-theme-primary transition-colors">
                {project.name}
              </h1>
              <Edit3 className="w-3.5 h-3.5 text-theme-muted opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
          
          {isDirty ? (
            <span className="text-[10px] text-theme-secondary font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-theme-secondary animate-pulse" /> Unsaved changes
            </span>
          ) : (
            <span className="text-[10px] text-theme-complete font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-theme-complete" /> All changes saved
            </span>
          )}
        </div>
      </div>

      {/* Center: Action Controls (Undo, Redo, Save, Play/Test) */}
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-theme-cell p-1 rounded-xl border border-theme-variant gap-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 text-theme-muted hover:text-theme-text disabled:opacity-30 rounded-lg hover:bg-theme-variant transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 text-theme-muted hover:text-theme-text disabled:opacity-30 rounded-lg hover:bg-theme-variant transition-colors"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={onSave}
          disabled={!isDirty}
          className={`px-3.5 py-2 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md ${
            isDirty
              ? 'bg-theme-primary text-white hover:opacity-90 active:scale-95'
              : 'bg-theme-cell text-theme-muted cursor-default'
          }`}
          title="Save project (Ctrl+S)"
        >
          <Save className="w-4 h-4" /> Save
        </button>

        <button
          onClick={onPlayTest}
          className="px-4 py-2 bg-theme-complete text-white font-semibold text-xs rounded-xl shadow-md hover:opacity-90 flex items-center gap-2 transition-all active:scale-95"
        >
          <Play className="w-4 h-4 fill-current" /> Play / Test Story
        </button>
      </div>

      {/* Right: Theme Toggle, Export, Import & New Project */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleTheme}
          className="p-2 text-theme-text hover:bg-theme-variant rounded-lg transition-colors border border-theme-variant"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-theme-secondary" /> : <Moon className="w-4 h-4 text-theme-primary" />}
        </button>

        <button
          onClick={() => {
            if (window.confirm('Start a new empty project? All unsaved canvas nodes will be cleared.')) {
              onClearProject();
            }
          }}
          className="px-3 py-1.5 bg-theme-cell hover:bg-theme-variant text-theme-text text-xs font-medium rounded-lg border border-theme-variant flex items-center gap-1.5 transition-colors"
          title="Start a new blank project"
        >
          <FilePlus className="w-3.5 h-3.5" /> New Project
        </button>

        <button
          onClick={onExport}
          className="px-3 py-1.5 bg-theme-cell hover:bg-theme-variant text-theme-text text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 flex items-center gap-1.5 transition-colors"
          title="Export project JSON file"
        >
          <Download className="w-3.5 h-3.5" /> Export JSON
        </button>

        <label className="px-3 py-1.5 bg-theme-cell hover:bg-theme-variant text-theme-text text-xs font-medium rounded-lg border border-theme-variant flex items-center gap-1.5 cursor-pointer transition-colors">
          <Upload className="w-3.5 h-3.5" /> Import JSON
          <input type="file" accept=".json" onChange={handleFileChange} className="hidden" />
        </label>
      </div>
    </header>
  );
};
