# Notes Web

A React-based single-page application for taking notes. This project began as a simple to-do list but evolved into a multi-theme rich-text editor to investigate how far UI paradigms can be pushed in a browser without relying on heavy external state managers or windowing libraries.

## Themes & Paradigms

The application doesn't just change colors; it completely swaps the layout and interaction model based on the selected theme.

- **NotesOS**: A desktop environment built in the DOM. Notes are rendered as standalone windows that can be dragged by their title bars, resized from any of the four corners, minimized, or maximized to perfectly snap against the taskbar. It implements its own window coordinate math natively in React.
- **Aesthetic (MD3)**: A modern, conventional sidebar-driven layout inspired by Material Design 3.
- **Sticky (Corkboard)**: A physical metaphor. Notes are rendered as sticky notes pinned to a corkboard. The cork texture uses an inline SVG Data URI with the `<feTurbulence>` primitive to generate procedural noise without any image assets.
- **Retro Degen**: A brutalist, terminal-inspired layout with stark colors and hard shadows.

## Mechanics

- **Rich Text**: Uses `tiptap` as a headless wrapper around ProseMirror to provide a clean WYSIWYG editing experience.
- **Window Management (NotesOS)**: Draggable windows are handled natively. When dragging, `setPointerCapture` ensures the drag event isn't lost if the mouse moves too fast. Resizing calculates deltas from the `startX`/`startY` coordinates and dynamically updates the bounds. 
- **Persistence**: There is no backend. The application relies entirely on `localStorage` to persist the state between sessions. This includes the notes themselves (saved as HTML strings), the active theme, the user's uploaded local wallpaper (saved as a base64 Data URL), and the absolute `x/y/width/height` geometry of every window in NotesOS so they stay exactly where they were left.

## Architecture

The component tree is kept intentionally flat to avoid unnecessary abstraction layers.

- `App.jsx`: The global state container. It handles the `localStorage` hydration for notes and the active theme, and renders the corresponding theme component.
- `themes/*`: Each theme (`NotesOSTheme`, `AestheticTheme`, etc.) receives the notes state and mutation functions as props. They are fully responsible for their own internal UI layout and local interactions (like window coordinates).
- `components/RichTextEditor.jsx`: A universal text editor component shared across all themes.

## Setup Guide

### Prerequisites
- [Node.js](https://nodejs.org/) installed. Verify by running:
  ```bash
  node -v
  ```

### Installation

1. Clone the repository and navigate into it:
   ```bash
   git clone https://github.com/its-sorakun/todolist.git
   cd todolist
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```

### Running Locally

Start the local development server:
```bash
npm run dev
```

The application will be accessible at `http://localhost:5173`.
