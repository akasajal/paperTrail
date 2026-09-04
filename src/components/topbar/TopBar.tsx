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
    <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between select-none z-30 shrink-0 transition-colors duration-200 shadow-sm">
      {/* Left: Project Title & Save Status */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 rounded-xl shadow-sm">
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
              className="bg-slate-50 dark:bg-slate-950 border border-indigo-500 rounded px-2 py-0.5 text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none"
            />
          ) : (
            <div
              onClick={() => {
                setTitleInput(project.name);
                setIsEditingTitle(true);
              }}
              className="flex items-center gap-1.5 cursor-pointer group"
            >
              <h1 className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                {project.name}
              </h1>
              <Edit3 className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
          
          {isDirty ? (
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Unsaved changes
            </span>
          ) : (
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> All changes saved
            </span>
          )}
        </div>
      </div>

      {/* Center: Action Controls (Undo, Redo, Save, Play/Test) */}
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 gap-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 disabled:opacity-30 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 disabled:opacity-30 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
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
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 active:scale-95'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-default'
          }`}
          title="Save project (Ctrl+S)"
        >
          <Save className="w-4 h-4" /> Save
        </button>

        <button
          onClick={onPlayTest}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all active:scale-95"
        >
          <Play className="w-4 h-4 fill-current" /> Play / Test Story
        </button>
      </div>

      {/* Right: Theme Toggle, Export, Import & New Project */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleTheme}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-800"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>

        <button
          onClick={() => {
            if (window.confirm('Start a new empty project? All unsaved canvas nodes will be cleared.')) {
              onClearProject();
            }
          }}
          className="px-3 py-1.5 bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 flex items-center gap-1.5 transition-colors"
          title="Start a new blank project"
        >
          <FilePlus className="w-3.5 h-3.5" /> New Project
        </button>

        <button
          onClick={onExport}
          className="px-3 py-1.5 bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 flex items-center gap-1.5 transition-colors"
          title="Export project JSON file"
        >
          <Download className="w-3.5 h-3.5" /> Export JSON
        </button>

        <label className="px-3 py-1.5 bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 flex items-center gap-1.5 cursor-pointer transition-colors">
          <Upload className="w-3.5 h-3.5" /> Import JSON
          <input type="file" accept=".json" onChange={handleFileChange} className="hidden" />
        </label>
      </div>
    </header>
  );
};
