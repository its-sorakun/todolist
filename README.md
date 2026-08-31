# Notes App

A React-based single-page application for managing a simple to-do list. The interface is designed to visually mimic a physical sticky note pinned to a procedural corkboard.

![Screenshot of the App](/path/to/your/screenshot.png)

## Features

- Add, edit, and delete tasks
- Mark tasks as completed
- Toggle between light and dark modes
- Automatically saves tasks so you don't lose them when you refresh(using localStorage)

## Architecture

- **Framework**: React via Vite
- **Styling**: Tailwind CSS
- **Icons**: lucide-react
- **State Management**: React `useState` and `useEffect` synced directly to `localStorage`.
- **Assets**: The corkboard background relies entirely on an inline SVG Data URI using the `<feTurbulence>` primitive to generate procedural noise. There are no external image dependencies.

## Technical Details

The application is built around a flat component tree to prioritize straightforward control flow over unnecessary abstraction. 

- `App.jsx`: Manages the primary application state (`items`, `darkMode`) and handles the `localStorage` synchronization.
- `Header.jsx`: Renders the title and the theme toggle.
- `ToDoList.jsx`: Maps over the item state and handles the empty-state layout.
- `ToDoItem.jsx`: Handles individual item display, the local editing state, and dispatches mutations (edit, delete, toggle) back to `App.jsx`.

## Setup Guide

### Prerequisites
- Node.js installed on your system.

### Installation

1. Clone the repository and navigate into the project directory.
2. Install the required dependencies:
   ```bash
   npm install
   ```

### Running Locally

To start the local development server:

```bash
npm run dev
```

The application will typically be accessible at `http://localhost:5173`.
