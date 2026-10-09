# Notes Web

A basic React-based note taking application. This project began as a shitty university assignment because universities can't seem to imagine anything beyond asking for a simple JS todolist. Since I enjoy designing things, I decided to take out my frustration on the UI and extend it a bit further.

At its core, it's just a standard CRUD app with a Node/Express backend and a React frontend. However, to make it more useful than a disposable academic chore, I integrated it with my personal AI assistant, [Kiko](https://github.com/its-sorakun/kiko), via REST APIs so it can read and write notes programmatically.

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
