# Notes Web

This project started out as a shitty university assignment. Most college web dev courses can't seem to think beyond making a basic JS todo list, so instead of just turning that in, I decided to build something I'd actually use.

I figured, why not let my personal assistant, [Kiko](https://github.com/its-sorakun/kiko-assistant), write and manage notes for me? So I hooked up a proper backend and wrote a bunch of REST endpoints to let it interact with the app programmatically. And since I sometimes like making things look aesthetic (aesthetic ka 14), I ended up creating multiple themes and turned it into a simple, single-page application.

Under the hood, it's a straightforward CRUD app built with ReactJS, Node.js, Express, and MongoDB. It supports HTTP-only JWT cookies for browser sessions and API keys for programmatic access.

## Themes

The frontend includes several themes that change the layout. Each theme has its own flavor.

- **Sky**: A minimalist, glassmorphic UI with animated CSS clouds.
- **NotesOS**: A fake desktop environment where notes are draggable, resizable windows.
- **Aesthetic**: A standard modern sidebar layout.
- **Sticky**: A corkboard with sticky notes (uses SVG filters for the cork texture).
- **Retro Degen**: A retro gaming theme with chunky borders, bright arcade colors, and a gamepad icon.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, tiptap (for the rich text editor).
- **Backend**: Node.js, Express, MongoDB (via Mongoose).
- **Auth**: Dual-auth flow using standard HTTP-only JWT cookies for the browser UI, and `x-api-key` headers for programmatic API access (details in [api-internals.md](api-internals.md)).
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
