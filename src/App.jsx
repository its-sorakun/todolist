import { useState, useEffect } from 'react';
import Header from './components/Header';
import ToDoList from './components/ToDoList';
import { Plus } from 'lucide-react';

export default function App() {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('todo_notes');
    if (savedNotes) {
      const parsed = JSON.parse(savedNotes);
      if (parsed.length > 0) return parsed;
    }

    // Migration from old single-note structure
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
    // Keep activeNoteId valid if the active note is deleted
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
      // If it's the last note, just clear it instead of removing it completely
      setNotes([{ id: Date.now(), title: "Notes", items: [] }]);
    } else {
      setNotes(notes.filter(n => n.id !== id));
    }
  };

  return (
    <div className="min-h-screen flex justify-end items-center p-4 sm:p-12 sm:pr-24 overflow-hidden relative">
      
      {/* Frosted Glass Dashboard Panel */}
      <div className="w-full max-w-md bg-white/30 dark:bg-black/40 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(255,126,179,0.37)] border border-white/40 dark:border-white/10 rounded-3xl relative transition-all duration-300 flex flex-col max-h-[85vh] animate-float">
        
        {/* Tabs Bar */}
        <div className="flex items-center overflow-x-auto border-b border-black/10 dark:border-white/10 custom-scrollbar px-4 py-3 mx-2 gap-2">
           {notes.map(note => (
              <button 
                key={note.id} 
                onClick={() => setActiveNoteId(note.id)}
                className={`px-4 py-1.5 whitespace-nowrap rounded-full transition-colors text-sm font-bold ${
                  activeNoteId === note.id 
                    ? 'bg-primary text-white shadow-md' 
                    : 'bg-white/20 dark:bg-black/20 hover:bg-white/40 dark:hover:bg-white/10'
                }`}
              >
                {note.title || "Untitled"}
              </button>
           ))}
           <button 
             onClick={addNote} 
             className="p-1.5 rounded-full hover:bg-white/40 dark:hover:bg-white/10 transition-colors flex-shrink-0"
             title="Create New Note"
           >
             <Plus className="w-5 h-5 text-gray-800 dark:text-gray-200" strokeWidth={2.5} />
           </button>
        </div>

        <div className="relative z-10 flex flex-col flex-1 mt-2 overflow-hidden">
          {activeNote && (
            <>
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
            </>
          )}
          
          <div className="pt-2 px-6 pb-6 transition-colors duration-300">
            <form className="flex items-center space-x-2 border-b-2 border-black/20 dark:border-white/20 focus-within:border-primary transition-colors" onSubmit={handleAdd}>
              <input
                type="text"
                className="flex-grow px-2 py-2 bg-transparent outline-none text-xl transition-colors placeholder-gray-600 dark:placeholder-gray-400"
                placeholder="New Task..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button 
                type="submit" 
                className="p-2 text-primary hover:text-pink-600 font-bold transition-colors focus:outline-none"
                title="Add Task"
              >
                <Plus strokeWidth={3} className="w-7 h-7" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
