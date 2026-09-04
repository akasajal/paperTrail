import React, { useState } from 'react';
import { Project, Character, Location, NodeType } from '../../types';
import {
  Users,
  MapPin,
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  BookOpen,
  Zap,
  GitFork,
  Search
} from 'lucide-react';

interface LeftSidebarProps {
  project: Project;
  onAddCharacter: () => void;
  onEditCharacter: (character: Character) => void;
  onDeleteCharacter: (id: string) => void;
  onAddLocation: () => void;
  onEditLocation: (location: Location) => void;
  onDeleteLocation: (id: string) => void;
  onAddNode: (type: NodeType) => void;
  selectedEntityType: 'character' | 'location' | null;
  selectedEntityId: string | null;
  onSelectEntity: (type: 'character' | 'location', id: string) => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  project,
  onAddCharacter,
  onEditCharacter,
  onDeleteCharacter,
  onAddLocation,
  onEditLocation,
  onDeleteLocation,
  onAddNode,
  selectedEntityType,
  selectedEntityId,
  onSelectEntity
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'characters' | 'locations' | 'nodes'>('characters');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCharacters = project.characters.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLocations = project.locations.filter((l) =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (collapsed) {
    return (
      <div className="w-12 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center py-3 justify-between z-20 transition-colors duration-200">
        <div className="flex flex-col gap-4 items-center">
          <button
            onClick={() => setCollapsed(false)}
            title="Expand Sidebar"
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              setCollapsed(false);
              setActiveTab('characters');
            }}
            title="Characters"
            className={`p-2 rounded-lg transition-colors ${
              activeTab === 'characters'
                ? 'bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Users className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              setCollapsed(false);
              setActiveTab('locations');
            }}
            title="Locations"
            className={`p-2 rounded-lg transition-colors ${
              activeTab === 'locations'
                ? 'bg-amber-50 dark:bg-amber-600/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <MapPin className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              setCollapsed(false);
              setActiveTab('nodes');
            }}
            title="Add Nodes"
            className={`p-2 rounded-lg transition-colors ${
              activeTab === 'nodes'
                ? 'bg-sky-50 dark:bg-sky-600/20 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-500/30'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full z-20 shadow-lg select-none transition-colors duration-200">
      {/* Sidebar Header Tabs */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40">
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('characters')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
              activeTab === 'characters'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Cast</span>
          </button>
          <button
            onClick={() => setActiveTab('locations')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
              activeTab === 'locations'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Places</span>
          </button>
          <button
            onClick={() => setActiveTab('nodes')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
              activeTab === 'nodes'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nodes</span>
          </button>
        </div>

        <button
          onClick={() => setCollapsed(true)}
          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title="Collapse Sidebar"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Search Bar */}
        {activeTab !== 'nodes' && (
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-slate-400 dark:focus:border-slate-700"
            />
          </div>
        )}

        {/* CHARACTERS TAB */}
        {activeTab === 'characters' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Characters ({project.characters.length})
              </span>
              <button
                onClick={onAddCharacter}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/50 px-2 py-1 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>

            {filteredCharacters.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-950/30 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
                No characters found.
              </div>
            ) : (
              <div className="space-y-1.5">
                {filteredCharacters.map((char) => {
                  const isSelected =
                    selectedEntityType === 'character' && selectedEntityId === char.id;
                  return (
                    <div
                      key={char.id}
                      onClick={() => onSelectEntity('character', char.id)}
                      className={`group flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-500/50 text-indigo-900 dark:text-indigo-200 shadow-sm'
                          : 'bg-slate-50/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {char.portrait ? (
                          <img
                            src={char.portrait}
                            alt={char.displayName}
                            className="w-8 h-8 rounded-full object-cover border border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 border border-indigo-300 dark:border-indigo-700/50 flex items-center justify-center font-bold text-indigo-700 dark:text-indigo-300 text-xs shrink-0">
                            {char.displayName.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="text-xs font-semibold truncate text-slate-800 dark:text-slate-100">
                            {char.displayName}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate font-mono">
                            @{char.name}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditCharacter(char);
                          }}
                          className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 rounded transition-colors"
                          title="Edit Character"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteCharacter(char.id);
                          }}
                          className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                          title="Delete Character"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* LOCATIONS TAB */}
        {activeTab === 'locations' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Locations ({project.locations.length})
              </span>
              <button
                onClick={onAddLocation}
                className="flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/50 px-2 py-1 rounded-md hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>

            {filteredLocations.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-950/30 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
                No locations found.
              </div>
            ) : (
              <div className="space-y-1.5">
                {filteredLocations.map((loc) => {
                  const isSelected =
                    selectedEntityType === 'location' && selectedEntityId === loc.id;
                  return (
                    <div
                      key={loc.id}
                      onClick={() => onSelectEntity('location', loc.id)}
                      className={`group flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 dark:border-amber-500/50 text-amber-900 dark:text-amber-200 shadow-sm'
                          : 'bg-slate-50/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {loc.background ? (
                          <img
                            src={loc.background}
                            alt={loc.name}
                            className="w-10 h-7 rounded object-cover border border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-10 h-7 rounded bg-amber-100 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/50 flex items-center justify-center font-bold text-amber-700 dark:text-amber-400 text-xs shrink-0">
                            <MapPin className="w-4 h-4" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="text-xs font-semibold truncate text-slate-800 dark:text-slate-100">
                            {loc.name}
                          </div>
                          {loc.description && (
                            <div className="text-[11px] text-slate-500 truncate">
                              {loc.description}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditLocation(loc);
                          }}
                          className="p-1 text-slate-400 hover:text-amber-600 dark:hover:text-amber-300 rounded transition-colors"
                          title="Edit Location"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteLocation(loc.id);
                          }}
                          className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                          title="Delete Location"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* NODES TAB */}
        {activeTab === 'nodes' && (
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block px-1">
              Add Node to Canvas
            </span>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => onAddNode('dialogue')}
                className="flex items-center gap-3 p-3 bg-indigo-50/50 dark:bg-slate-950/60 border border-indigo-200 dark:border-indigo-900/40 hover:border-indigo-400 dark:hover:border-indigo-500/60 rounded-xl transition-all text-left group"
              >
                <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-200">
                    Dialogue Node
                  </div>
                  <div className="text-[11px] text-slate-500">Character spoken dialogue line</div>
                </div>
              </button>

              <button
                onClick={() => onAddNode('narration')}
                className="flex items-center gap-3 p-3 bg-emerald-50/50 dark:bg-slate-950/60 border border-emerald-200 dark:border-emerald-900/40 hover:border-emerald-400 dark:hover:border-emerald-500/60 rounded-xl transition-all text-left group"
              >
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-200">
                    Narration Node
                  </div>
                  <div className="text-[11px] text-slate-500">Narrator or scene prose</div>
                </div>
              </button>

              <button
                onClick={() => onAddNode('action')}
                className="flex items-center gap-3 p-3 bg-purple-50/50 dark:bg-slate-950/60 border border-purple-200 dark:border-purple-900/40 hover:border-purple-400 dark:hover:border-purple-500/60 rounded-xl transition-all text-left group"
              >
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/50 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-200">
                    Action Node
                  </div>
                  <div className="text-[11px] text-slate-500">In-game visual event or trigger</div>
                </div>
              </button>

              <button
                onClick={() => onAddNode('choice')}
                className="flex items-center gap-3 p-3 bg-amber-50/50 dark:bg-slate-950/60 border border-amber-200 dark:border-amber-900/40 hover:border-amber-400 dark:hover:border-amber-500/60 rounded-xl transition-all text-left group"
              >
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <GitFork className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-amber-700 dark:group-hover:text-amber-200">
                    Choice Node
                  </div>
                  <div className="text-[11px] text-slate-500">Branching decision options</div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
