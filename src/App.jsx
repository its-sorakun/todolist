import { useState, useEffect } from 'react';
import Header from './components/Header';
import ToDoList from './components/ToDoList';
import { Plus, BookHeart } from 'lucide-react';

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
        return [{ id: Date.now(), title: "Notes", items: parsed }];
      }
    }
    
    return [{ id: Date.now(), title: "Notes", items: [] }];
  });

  const [activeNoteId, setActiveNoteId] = useState(() => notes[0]?.id);
  const [inputValue, setInputValue] = useState('');

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('todo_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

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
      setNotes([{ id: Date.now(), title: "Notes", items: [] }]);
    } else {
      setNotes(notes.filter(n => n.id !== id));
    }
  };

  return (
    <div className="h-screen w-full flex flex-col sm:flex-row overflow-hidden transition-colors duration-300">
      
      {/* Sidebar Navigation Drawer */}
      <div className="w-full sm:w-72 bg-surface dark:bg-surface-dark flex flex-col p-4 border-r border-surface-variant dark:border-surface-variant-dark z-10">
        <div className="flex items-center gap-3 px-4 py-4 mb-4">
           <BookHeart className="w-8 h-8 text-primary dark:text-primary-dark" strokeWidth={2.5} />
           <h1 className="text-2xl font-bold tracking-tight text-on-primary-container dark:text-on-primary-container-dark">Notes</h1>
        </div>
        
        <div className="flex-grow overflow-y-auto space-y-1 custom-scrollbar px-2">
           {notes.map(note => (
              <button 
                key={note.id} 
                onClick={() => setActiveNoteId(note.id)}
                className={`w-full text-left px-5 py-4 rounded-full transition-all text-sm font-bold flex items-center ${
                  activeNoteId === note.id 
                    ? 'bg-primary-container text-on-primary-container dark:bg-primary-container-dark dark:text-on-primary-container-dark' 
                    : 'hover:bg-surface-variant dark:hover:bg-surface-variant-dark text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="truncate">{note.title || "Untitled"}</span>
              </button>
           ))}
        </div>

        <div className="p-2 mt-auto">
          <button 
            onClick={addNote} 
            className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-surface-variant dark:bg-surface-variant-dark hover:bg-primary-container dark:hover:bg-primary-container-dark hover:text-on-primary-container dark:hover:text-on-primary-container-dark rounded-full transition-colors font-bold"
          >
            <Plus className="w-5 h-5" strokeWidth={2.5} />
            New Note
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-4 sm:p-6 bg-surface dark:bg-surface-dark relative">
        {activeNote && (
          <div className="flex-1 bg-surface-container dark:bg-surface-container-dark rounded-[32px] flex flex-col overflow-hidden relative transition-colors duration-300">
            <Header 
              darkMode={darkMode} 
              setDarkMode={setDarkMode} 
              title={activeNote.title}
              onTitleChange={(newTitle) => updateActiveNote({ title: newTitle })}
              onDelete={() => deleteNote(activeNote.id)}
            />
            
            <ToDoList
              items={activeNote.items}
              toggleComplete={toggleComplete}
              deleteItem={deleteItem}
              editItem={editItem}
            />
            
            <div className="p-4 sm:p-8 pb-8">
              <form 
                className="flex items-center space-x-4 bg-surface dark:bg-surface-dark px-6 py-2 rounded-full focus-within:ring-2 ring-primary dark:ring-primary-dark transition-all shadow-sm"
                onSubmit={handleAdd}
              >
                <input
                  type="text"
                  className="flex-grow py-4 bg-transparent outline-none text-xl transition-colors placeholder-gray-500"
                  placeholder="New Task..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="p-4 bg-primary dark:bg-primary-dark text-white dark:text-surface-dark rounded-full hover:opacity-80 font-bold transition-opacity focus:outline-none flex-shrink-0"
                  title="Add Task"
                >
                  <Plus strokeWidth={3} className="w-6 h-6" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
