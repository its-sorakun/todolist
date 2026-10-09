# Notes Web

A React-based single-page application for taking notes. This project began as a shitty, soulless university assignment because modern computer science education is apparently incapable of imagining anything beyond a painfully generic JS todolist. Instead of submitting another cookie-cutter CRUD app that looks like it was designed in 2005, I decided to take out my frustration on it.

I like designing things—whether it's web or IRL—and I refuse to build boring software. So I threw out their unimaginative requirements, wired up ReactJS to make it a proper single-page application, and integrated it directly with my personal AI assistant, [Kiko](https://github.com/its-sorakun/kiko), through a custom REST API. This completely mutated it from a disposable academic chore into an actual, living application.

It became my personal sandbox to prove how far UI paradigms and low-level DOM mechanics can be pushed in a browser, without relying on the bloated enterprise libraries that universities love to preach about.

## Themes & Paradigms

The application doesn't just change colors; it completely swaps the layout and interaction model based on the selected theme.

- **Sky**: An ultra-minimalist, floating aesthetic. It features an edge-to-edge, backdrop-blurred glassmorphic sidebar and procedural drifting clouds in the background (powered entirely by GPU-accelerated CSS and SVG filters). 
- **NotesOS**: A desktop environment built in the DOM. Notes are rendered as standalone windows that can be dragged by their title bars, resized from any of the four corners, minimized, or maximized to perfectly snap against the taskbar. It implements its own window coordinate math natively in React.
- **Aesthetic (MD3)**: A modern, conventional sidebar-driven layout inspired by Material Design 3.
- **Sticky (Corkboard)**: A physical metaphor. Notes are rendered as sticky notes pinned to a corkboard. The cork texture uses an inline SVG Data URI with the `<feTurbulence>` primitive to generate procedural noise without any image assets.
- **Retro Degen**: A brutalist, terminal-inspired layout with stark colors and hard shadows.

## Mechanics

- **Rich Text**: Uses `tiptap` as a headless wrapper around ProseMirror to provide a clean WYSIWYG editing experience.
- **Dual Authentication**: Implements a strict dual-auth system. Human users use HTTP-only cookies in the browser, while external agents (like Kiko) authenticate via plaintext API keys passed in `x-api-key` headers to execute CRUD operations remotely.
- **Window Management (NotesOS)**: Draggable windows are handled natively. When dragging, `setPointerCapture` ensures the drag event isn't lost if the mouse moves too fast. Resizing calculates deltas from the `startX`/`startY` coordinates and dynamically updates the bounds. 
- **Persistence**: Relies on a MongoDB backend connected via Mongoose to store the HTML string of the note, and handles raw markdown dynamically parsing it mechanically via Turndown so Kiko doesn't break the UI.

## Architecture

The component tree is kept intentionally flat to avoid unnecessary abstraction layers.

- `App.jsx`: The global state container. It handles the API fetching, routing, active theme hydration, and renders the corresponding theme component.
- `themes/*`: Each theme (`NotesOSTheme`, `SkyTheme`, etc.) receives the notes state and mutation functions as props. They are fully responsible for their own internal UI layout and local interactions.
- `components/RichTextEditor.jsx`: A universal text editor component shared across all themes.

## Setup Guide

### Prerequisites
- [Node.js](https://nodejs.org/) installed. Verify by running:
  ```bash
  node -v
  ```
- MongoDB running locally or a connection string ready.

### Installation

1. Clone the repository and navigate into it:
   ```bash
   git clone https://github.com/its-sorakun/todolist.git
   cd todolist
   ```
2. Install the required dependencies:
   ```bash
   npm install
   cd backend && npm install
   ```

### Running Locally

You can run both the frontend and backend with the simple VBScript provided in the root directory:
Double-click `notes-web.vbs` to silently start MongoDB, the Node API server, and the Vite dev server in the background.

The application will be accessible at `http://127.0.0.1:3001` and the API docs at `http://localhost:5000/api-docs`.
