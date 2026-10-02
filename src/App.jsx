import { useState, useEffect } from 'react';
import AestheticTheme from './themes/AestheticTheme';
import RetroTheme from './themes/RetroTheme';
import NotesOSTheme from './themes/NotesOSTheme';
import StickyTheme from './themes/StickyTheme';
import { Settings2 } from 'lucide-react';
import { getModalClasses } from './utils/themeConfig';

export default function App() {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('todo_notes');
    if (savedNotes) {
      let parsed = JSON.parse(savedNotes);
      // Migration script: if notes have 'items' from old checklist structure, convert them to HTML 'content'
      if (parsed.length > 0 && parsed[0].items !== undefined) {
        parsed = parsed.map(note => {
          let htmlContent = '';
          if (note.items && note.items.length > 0) {
            htmlContent = `<ul>${note.items.map(item => `<li><p>${item.completed ? `<s>${item.text}</s>` : item.text}</p></li>`).join('')}</ul>`;
          }
          return { id: note.id, title: note.title, content: htmlContent };
        });
      }
      if (parsed.length > 0) return parsed;
    }
    return [{ id: Date.now(), title: "Main Notes", content: "" }];
  });

  const [activeNoteId, setActiveNoteId] = useState(() => notes[0]?.id);
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

  const addNote = () => {
    const newNote = {
      id: Date.now(),
      title: "New Document",
      content: ""
    };
    setNotes([...notes, newNote]);
    setActiveNoteId(newNote.id);
  };

  const [noteToDelete, setNoteToDelete] = useState(null);

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

  const executeDelete = (id) => {
    if (notes.length === 1) {
      setNotes([{ id: Date.now(), title: "Main Notes", content: "" }]);
    } else {
      setNotes(notes.filter(n => n.id !== id));
    }
    setNoteToDelete(null);
  };

  const themeProps = {
    notes, activeNoteId, setActiveNoteId, activeNote,
    addNote, deleteNote: requestDeleteNote, updateActiveNote,
    darkMode, setDarkMode, theme, setTheme
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
