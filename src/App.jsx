import { useState, useEffect } from 'react';
import AestheticTheme from './themes/AestheticTheme';
import RetroTheme from './themes/RetroTheme';
import WaifuTheme from './themes/WaifuTheme';
import { Settings2 } from 'lucide-react';

export default function App() {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('todo_notes');
    if (savedNotes) {
      const parsed = JSON.parse(savedNotes);
      if (parsed.length > 0) return parsed;
    }
    const oldItems = localStorage.getItem('todo_items');
    if (oldItems) {
      const parsed = JSON.parse(oldItems);
      if (parsed.length > 0) {
        return [{ id: Date.now(), title: "Main Notes", items: parsed }];
      }
    }
    return [{ id: Date.now(), title: "Main Notes", items: [] }];
  });

  const [activeNoteId, setActiveNoteId] = useState(() => notes[0]?.id);
  const [inputValue, setInputValue] = useState('');

  const [theme, setTheme] = useState(() => localStorage.getItem('app_theme') || 'aesthetic');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('todo_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [showThemeSelector, setShowThemeSelector] = useState(false);

  useEffect(() => {
    localStorage.setItem('todo_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    if (!notes.find(n => n.id === activeNoteId) && notes.length > 0) {
      setActiveNoteId(notes[0].id);
    }
  }, [notes, activeNoteId]);

  useEffect(() => {
    localStorage.setItem('todo_theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  const activeNote = notes.find(n => n.id === activeNoteId) || notes[0];

  const updateActiveNote = (updates) => {
    setNotes(notes.map(note => 
      note.id === activeNoteId ? { ...note, ...updates } : note
    ));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeNote) return;
    const newItem = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false,
    };
    updateActiveNote({ items: [...activeNote.items, newItem] });
    setInputValue('');
  };

  const toggleComplete = (id) => {
    if (!activeNote) return;
    updateActiveNote({
      items: activeNote.items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    });
  };

  const deleteItem = (id) => {
    if (!activeNote) return;
    updateActiveNote({
      items: activeNote.items.filter((item) => item.id !== id)
    });
  };

  const editItem = (id, newText) => {
    if (!activeNote) return;
    updateActiveNote({
      items: activeNote.items.map((item) =>
        item.id === id ? { ...item, text: newText } : item
      )
    });
  };

  const addNote = () => {
    const newNote = {
      id: Date.now(),
      title: "New Note",
      items: []
    };
    setNotes([...notes, newNote]);
    setActiveNoteId(newNote.id);
  };

  const deleteNote = (id) => {
    if (notes.length === 1) {
      setNotes([{ id: Date.now(), title: "Main Notes", items: [] }]);
    } else {
      setNotes(notes.filter(n => n.id !== id));
    }
  };

  const themeProps = {
    notes, activeNoteId, setActiveNoteId,
    inputValue, setInputValue, activeNote,
    handleAdd, toggleComplete, deleteItem, editItem,
    addNote, deleteNote, updateActiveNote,
    darkMode, setDarkMode
  };

  return (
    <>
      {theme === 'aesthetic' && <AestheticTheme {...themeProps} />}
      {theme === 'retro' && <RetroTheme {...themeProps} />}
      {theme === 'waifu' && <WaifuTheme {...themeProps} />}

      {/* Global Theme Selector FAB */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {showThemeSelector && (
            <div className="absolute bottom-20 right-0 bg-white dark:bg-gray-800 rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.2)] dark:shadow-none p-4 flex flex-col gap-2 w-56 border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest px-2">Select Theme</h3>
              <button onClick={() => {setTheme('aesthetic'); setShowThemeSelector(false)}} className={`p-4 text-left rounded-2xl font-bold transition-all ${theme === 'aesthetic' ? 'bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 shadow-sm' : 'hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200'}`}>✨ Aesthetic (MD3)</button>
              <button onClick={() => {setTheme('retro'); setShowThemeSelector(false)}} className={`p-4 text-left rounded-2xl font-bold transition-all ${theme === 'retro' ? 'bg-yellow-200 dark:bg-yellow-900/40 text-yellow-900 dark:text-yellow-300 shadow-sm' : 'hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200'}`}>👾 Retro Degen</button>
              <button onClick={() => {setTheme('waifu'); setShowThemeSelector(false)}} className={`p-4 text-left rounded-2xl font-bold transition-all ${theme === 'waifu' ? 'bg-purple-200 dark:bg-purple-900/40 text-purple-900 dark:text-purple-300 shadow-sm' : 'hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200'}`}>🌸 Waifu Glass</button>
            </div>
          )}
          <button 
            onClick={() => setShowThemeSelector(!showThemeSelector)}
            className="w-16 h-16 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform focus:outline-none"
            aria-label="Toggle Theme Selector"
          >
            <Settings2 className="w-8 h-8" />
          </button>
        </div>
      </div>
    </>
  );
}
