# PaperTrail - Visual Novel & Gameplay Dialogue Flow Editor

PaperTrail is a desktop-first web application designed for drafting choice-based gameplay dialogue and visual-novel-style narrative flows using an infinite node-based canvas.

It allows writers and narrative game designers to construct story structures by organizing characters, locations, dialogue, narration prose, in-game action triggers, and branching choices.

## Core Features

- Infinite Node Canvas: Powered by React Flow (@xyflow/react v12) supporting high-performance panning, zooming, node dragging, multi-selection, and connection routing.
- Narrative Node Types:
  - Dialogue Node: Spoken character lines with linked cast member badges.
  - Narration Node: Atmospheric scene description and narrator prose.
  - Action Node: Trigger events, visual cues, or environmental changes.
  - Choice Node: Decision prompts with dynamic branching handles for each choice option.
- Cast & Location Management: Define characters with display names and portraits, and locations with background images. Updating a character name immediately reflects across all referencing dialogue nodes.
- Quick Search Menu: Press Spacebar or right-click anywhere on the canvas to open the floating quick-add menu and place new nodes at cursor location.
- Contextual Inspector: Real-time editing panel for modifying node content, managing choice branch options, setting the graph start node, or editing cast/location properties.
- Interactive Playtest Mode: Built-in visual novel simulator that allows stepping through dialogue, narration, action events, and player choices to test branching narrative routes.
- Persistence & Portability: Automatic saving to LocalStorage, full Undo/Redo history stack (Ctrl+Z / Ctrl+Shift+Z), and JSON export/import.

## Tech Stack

- Framework: React 18 + TypeScript + Vite
- Canvas Engine: @xyflow/react (React Flow v12)
- Styling: Tailwind CSS
- Icons: Lucide React
- State: React Hooks with LocalStorage persistence & snapshot history

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## License

MIT License.
