# Notes Web

This project began as a shitty university assignment because universities can't seem to imagine anything beyond asking for a simple JS todolist. It was a basic todolist application at first, but then I thought of giving it a backend and some APIs so that my personal AI assistant, [Kiko](https://github.com/its-sorakun/kiko), can have one more functionality of creating notes for me. 

Since I also sometimes like making things beautiful and look aesthetic (aesthetic ka 14), I thought of making it look beautiful. At its core, it's a standard CRUD app with a Node/Express backend and a React frontend, though it implements a proper dual-auth system with secure cookies and API keys to handle programmatic access securely.

## Themes

The frontend includes several themes that change the layout:

- **Sky**: A minimalist, glassmorphic UI with animated CSS clouds.
- **NotesOS**: A fake desktop environment where notes are draggable, resizable windows.
- **Aesthetic**: A standard modern sidebar layout.
- **Sticky**: A corkboard with sticky notes (uses SVG filters for the cork texture).
- **Retro Degen**: A terminal-inspired brutalist layout.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, tiptap (for the rich text editor).
- **Backend**: Node.js, Express, MongoDB (via Mongoose).
- **Auth**: Uses standard HTTP-only cookies for the browser UI, and a simple `x-api-key` header so Kiko can interact with the API directly.
- **Markdown**: The backend intercepts raw Markdown from Kiko and parses it into HTML so it renders correctly in the WYSIWYG editor.

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
