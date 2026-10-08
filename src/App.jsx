import { useState, useEffect } from 'react';
import AestheticTheme from './themes/AestheticTheme';
import RetroTheme from './themes/RetroTheme';
import NotesOSTheme from './themes/NotesOSTheme';
import StickyTheme from './themes/StickyTheme';
import AuthScreen from './components/AuthScreen';
import { getModalClasses } from './utils/themeConfig';
import { api } from './api';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [theme, setTheme] = useState(() => {
    let saved = localStorage.getItem('app_theme');
    if (saved === 'waifu') saved = 'notesos';
    return saved || 'aesthetic';
  });

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('todo_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [noteToDelete, setNoteToDelete] = useState(null);

  // Listen for 401 Unauthorized events from our API wrapper
  useEffect(() => {
    const handleAuthError = () => setCurrentUser(null);
    window.addEventListener('auth_error', handleAuthError);
    return () => window.removeEventListener('auth_error', handleAuthError);
  }, []);

  // Fetch Notes on login
  useEffect(() => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    api.getNotes()
      .then(fetchedNotes => {
        // Map _id to id for our UI components
        const mapped = fetchedNotes.map(n => ({ ...n, id: n._id }));
        setNotes(mapped);
        if (mapped.length > 0 && !activeNoteId) {
          setActiveNoteId(mapped[0].id);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [currentUser]);

  // Handle Focus
  useEffect(() => {
    if (activeNoteId && !notes.find(n => n.id === activeNoteId) && notes.length > 0) {
      if (theme === 'notesos') {
        setActiveNoteId(null);
      } else {
        setActiveNoteId(notes[0].id);
      }
    }
  }, [notes, activeNoteId, theme]);

  // Handle Theme Saves
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

  // API Actions
  const updateActiveNote = async (updates) => {
    // Optimistic UI update
    setNotes(notes.map(note => 
      note.id === activeNoteId ? { ...note, ...updates } : note
    ));
    
    try {
      await api.updateNote(activeNoteId, updates);
    } catch (err) {
      console.error('Failed to update note:', err);
    }
  };

  const addNote = async () => {
    try {
      const newNoteData = { title: "New Document", content: "", theme: theme };
      const savedNote = await api.createNote(newNoteData);
      const mappedNote = { ...savedNote, id: savedNote._id };
      
      setNotes([...notes, mappedNote]);
      setActiveNoteId(mappedNote.id);
    } catch (err) {
      console.error('Failed to create note:', err);
    }
  };

  const executeDelete = async (id) => {
    try {
      await api.deleteNote(id);
      setNotes(notes.filter(n => n.id !== id));
      setNoteToDelete(null);
    } catch (err) {
      console.error('Failed to delete note:', err);
    }
  };

  const requestDeleteNote = (id) => {
    const note = notes.find(n => n.id === id);
    if (!note) return;
    
    const isEmpty = !note.content || note.content === '<p></p>' || note.content.trim() === '';
    if (isEmpty) {
      executeDelete(id);
    } else {
      setNoteToDelete(note);
    }
  };

  const handleLogin = (userData) => {
    localStorage.setItem('current_user', JSON.stringify(userData));
    setCurrentUser(userData);
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      localStorage.removeItem('current_user');
      setCurrentUser(null);
    }
  };

  // Render Auth Screen if not logged in
  if (!currentUser) {
    return <AuthScreen onLogin={handleLogin} darkMode={darkMode} theme={theme} />;
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading secure workspace...</div>;
  }

  const activeNote = notes.find(n => n.id === activeNoteId) || notes[0];

  const themeProps = {
    notes, activeNoteId, setActiveNoteId, activeNote,
    addNote, deleteNote: requestDeleteNote, updateActiveNote,
    darkMode, setDarkMode, theme, setTheme,
    currentUser, handleLogout
  };

  const modalClasses = getModalClasses(theme);

  return (
    <>
      {theme === 'aesthetic' && <AestheticTheme {...themeProps} />}
      {theme === 'retro' && <RetroTheme {...themeProps} />}
      {theme === 'notesos' && <NotesOSTheme {...themeProps} />}
      {theme === 'sticky' && <StickyTheme {...themeProps} />}

      {/* Delete Confirmation Modal */}
      {noteToDelete && (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center animate-in fade-in duration-200 ${modalClasses.overlay}`}>
          <div className={`m-4 max-w-sm w-full transform transition-all scale-in-100 ${modalClasses.container}`}>
            <h2 className={`${modalClasses.title}`}>Delete Note?</h2>
            <p className={`${modalClasses.text} mb-8`}>
              Are you sure you want to delete <span className="opacity-80 font-bold">"{noteToDelete.title || 'Untitled'}"</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setNoteToDelete(null)}
                className={`${modalClasses.buttonCancel}`}
              >
                Cancel
              </button>
              <button 
                onClick={() => executeDelete(noteToDelete.id)}
                className={`${modalClasses.buttonSubmit}`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
