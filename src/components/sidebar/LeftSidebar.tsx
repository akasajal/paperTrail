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
      <div className="w-12 bg-surface border-r border-outline/30 flex flex-col items-center py-3 justify-between z-20 transition-colors duration-200">
        <div className="flex flex-col gap-4 items-center">
          <button
            onClick={() => setCollapsed(false)}
            title="Expand Sidebar"
            className="p-2 text-muted hover:text-text hover:bg-variant rounded-lg transition-colors"
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
                ? 'bg-primary-container/60 text-primary border border-primary/30'
                : 'text-muted hover:bg-variant'
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
                ? 'bg-secondary-container/60 text-secondary border border-secondary/30'
                : 'text-muted hover:bg-variant'
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
                ? 'bg-complete/15 text-complete border border-complete/30'
                : 'text-muted hover:bg-variant'
            }`}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-72 bg-surface border-r border-outline/30 flex flex-col h-full z-20 shadow-md select-none transition-colors duration-200">
      {/* Sidebar Header Tabs */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-outline/30 bg-variant/40">
        <div className="flex items-center gap-1 bg-cell p-1 rounded-lg border border-outline/30 text-xs">
          <button
            onClick={() => setActiveTab('characters')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
              activeTab === 'characters'
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted hover:text-text'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Cast</span>
          </button>
          <button
            onClick={() => setActiveTab('locations')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
              activeTab === 'locations'
                ? 'bg-secondary text-white shadow-sm'
                : 'text-muted hover:text-text'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Places</span>
          </button>
          <button
            onClick={() => setActiveTab('nodes')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
              activeTab === 'nodes'
                ? 'bg-complete text-white shadow-sm'
                : 'text-muted hover:text-text'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nodes</span>
          </button>
        </div>

        <button
          onClick={() => setCollapsed(true)}
          className="p-1.5 text-muted hover:text-text hover:bg-variant rounded-lg transition-colors"
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
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-muted" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-cell border border-outline/30 rounded-lg pl-8 pr-3 py-1.5 text-xs text-text placeholder-muted focus:outline-none focus:border-outline"
            />
          </div>
        )}

        {/* CHARACTERS TAB */}
        {activeTab === 'characters' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">
                Characters ({project.characters.length})
              </span>
              <button
                onClick={onAddCharacter}
                className="flex items-center gap-1 text-xs font-semibold text-primary bg-primary-container/40 border border-primary/30 px-2 py-1 rounded-md hover:bg-primary-container/70 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>

            {filteredCharacters.length === 0 ? (
              <div className="text-center py-8 text-xs text-muted bg-cell/50 rounded-lg border border-dashed border-outline/30">
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
                          ? 'bg-primary-container/40 border-primary text-text shadow-sm'
                          : 'bg-cell border-outline/30 hover:border-outline text-text'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {char.portrait ? (
                          <img
                            src={char.portrait}
                            alt={char.displayName}
                            className="w-8 h-8 rounded-full object-cover border border-outline/40 bg-variant shrink-0"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary-container/60 border border-primary/40 flex items-center justify-center font-bold text-primary text-xs shrink-0">
                            {char.displayName.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="text-xs font-semibold truncate text-text">
                            {char.displayName}
                          </div>
                          <div className="text-[11px] text-muted truncate font-mono">
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
                          className="p-1 text-muted hover:text-primary rounded transition-colors"
                          title="Edit Character"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteCharacter(char.id);
                          }}
                          className="p-1 text-muted hover:text-called rounded transition-colors"
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
              <span className="text-xs font-bold text-muted uppercase tracking-wider">
                Locations ({project.locations.length})
              </span>
              <button
                onClick={onAddLocation}
                className="flex items-center gap-1 text-xs font-semibold text-secondary bg-secondary-container/40 border border-secondary/30 px-2 py-1 rounded-md hover:bg-secondary-container/70 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>

            {filteredLocations.length === 0 ? (
              <div className="text-center py-8 text-xs text-muted bg-cell/50 rounded-lg border border-dashed border-outline/30">
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
                          ? 'bg-secondary-container/40 border-secondary text-text shadow-sm'
                          : 'bg-cell border-outline/30 hover:border-outline text-text'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {loc.background ? (
                          <img
                            src={loc.background}
                            alt={loc.name}
                            className="w-10 h-7 rounded object-cover border border-outline/40 bg-variant shrink-0"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-10 h-7 rounded bg-secondary-container/60 border border-secondary/40 flex items-center justify-center font-bold text-secondary text-xs shrink-0">
                            <MapPin className="w-4 h-4" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="text-xs font-semibold truncate text-text">
                            {loc.name}
                          </div>
                          {loc.description && (
                            <div className="text-[11px] text-muted truncate">
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
                          className="p-1 text-muted hover:text-secondary rounded transition-colors"
                          title="Edit Location"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteLocation(loc.id);
                          }}
                          className="p-1 text-muted hover:text-called rounded transition-colors"
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
            <span className="text-xs font-bold text-muted uppercase tracking-wider block px-1">
              Add Node to Canvas
            </span>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => onAddNode('dialogue')}
                className="flex items-center gap-3 p-3 bg-cell border border-outline/30 hover:border-primary rounded-xl transition-all text-left group"
              >
                <div className="p-2 rounded-lg bg-primary-container/60 text-primary border border-primary/30 group-hover:bg-primary group-hover:text-white transition-colors">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-text group-hover:text-primary">
                    Dialogue Node
                  </div>
                  <div className="text-[11px] text-muted">Character spoken dialogue line</div>
                </div>
              </button>

              <button
                onClick={() => onAddNode('narration')}
                className="flex items-center gap-3 p-3 bg-cell border border-outline/30 hover:border-complete rounded-xl transition-all text-left group"
              >
                <div className="p-2 rounded-lg bg-complete/15 text-complete border border-complete/30 group-hover:bg-complete group-hover:text-white transition-colors">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-text group-hover:text-complete">
                    Narration Node
                  </div>
                  <div className="text-[11px] text-muted">Narrator or scene prose</div>
                </div>
              </button>

              <button
                onClick={() => onAddNode('action')}
                className="flex items-center gap-3 p-3 bg-cell border border-outline/30 hover:border-called rounded-xl transition-all text-left group"
              >
                <div className="p-2 rounded-lg bg-called/15 text-called border border-called/30 group-hover:bg-called group-hover:text-white transition-colors">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-text group-hover:text-called">
                    Action Node
                  </div>
                  <div className="text-[11px] text-muted">In-game visual event or trigger</div>
                </div>
              </button>

              <button
                onClick={() => onAddNode('choice')}
                className="flex items-center gap-3 p-3 bg-cell border border-outline/30 hover:border-secondary rounded-xl transition-all text-left group"
              >
                <div className="p-2 rounded-lg bg-secondary-container/60 text-secondary border border-secondary/30 group-hover:bg-secondary group-hover:text-white transition-colors">
                  <GitFork className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-text group-hover:text-secondary">
                    Choice Node
                  </div>
                  <div className="text-[11px] text-muted">Branching decision options</div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
