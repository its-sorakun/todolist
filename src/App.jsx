import { useState, useEffect } from 'react';
import Header from './components/Header';
import ToDoList from './components/ToDoList';
import { Plus, Gamepad2 } from 'lucide-react';

const noteColors = [
  { bg: 'bg-pink-400', text: 'text-white' },
  { bg: 'bg-cyan-400', text: 'text-black' },
  { bg: 'bg-yellow-400', text: 'text-black' },
  { bg: 'bg-green-400', text: 'text-black' },
  { bg: 'bg-purple-400', text: 'text-white' },
];

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
        return [{ id: Date.now(), title: "Main Quest", items: parsed }];
      }
    }
    return [{ id: Date.now(), title: "Main Quest", items: [] }];
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
  const activeNoteIndex = notes.findIndex(n => n.id === activeNoteId);
  const activeNoteColor = noteColors[Math.max(0, activeNoteIndex) % noteColors.length];

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
      title: "Side Quest",
      items: []
    };
    setNotes([...notes, newNote]);
    setActiveNoteId(newNote.id);
  };

  const deleteNote = (id) => {
    if (notes.length === 1) {
      setNotes([{ id: Date.now(), title: "Main Quest", items: [] }]);
    } else {
      setNotes(notes.filter(n => n.id !== id));
    }
  };

  return (
    <div className="h-screen w-full flex flex-col sm:flex-row overflow-hidden">
      
      {/* Sidebar: Neo-Brutalist Weeb */}
      <div className="w-full sm:w-72 bg-fuchsia-500 dark:bg-slate-900 flex flex-col p-4 sm:border-r-4 border-b-4 sm:border-b-0 border-black dark:border-white z-10 transition-colors">
        <div className="flex items-center gap-3 px-2 py-4 mb-4">
           <div className="bg-yellow-400 p-2 rounded-full brutal-border brutal-shadow-sm">
             <Gamepad2 className="w-8 h-8 text-black" strokeWidth={3} />
           </div>
           <h1 className="text-3xl font-black tracking-tight text-white dark:text-pink-400" style={{ textShadow: '2px 2px 0 #000' }}>DATA.LOG</h1>
        </div>
        
        <div className="flex-grow overflow-y-auto space-y-4 custom-scrollbar px-2 py-2">
           {notes.map((note, index) => {
             const color = noteColors[index % noteColors.length];
             const isActive = activeNoteId === note.id;
             return (
               <button 
                 key={note.id} 
                 onClick={() => setActiveNoteId(note.id)}
                 className={`w-full text-left px-5 py-4 rounded-xl transition-transform text-lg font-black flex items-center brutal-border ${
                   isActive 
                     ? `${color.bg} ${color.text} brutal-shadow translate-x-1 -translate-y-1` 
                     : `bg-white dark:bg-slate-800 text-black dark:text-white brutal-shadow-sm hover:translate-x-1 hover:-translate-y-1 hover:brutal-shadow`
                 }`}
               >
                 <span className="truncate">{note.title || "Untitled"}</span>
               </button>
             );
           })}
        </div>

        <div className="p-2 mt-auto">
          <button 
            onClick={addNote} 
            className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-white dark:bg-slate-800 text-black dark:text-white brutal-border brutal-shadow-sm hover:brutal-shadow hover:-translate-y-1 transition-all rounded-xl font-black text-xl"
          >
            <Plus className="w-6 h-6" strokeWidth={4} />
            NEW FILE
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-4 sm:p-8 relative transition-colors">
        {activeNote && (
          <div className="flex-1 bg-white dark:bg-slate-900 brutal-border brutal-shadow rounded-2xl flex flex-col overflow-hidden relative transition-colors duration-300">
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
            
            <div className="p-4 sm:p-8 pb-8 bg-gray-50 dark:bg-slate-800 border-t-4 border-black dark:border-white">
              <form 
                className="flex items-center space-x-4 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl brutal-border brutal-shadow-sm focus-within:translate-x-1 focus-within:-translate-y-1 focus-within:brutal-shadow transition-all"
                onSubmit={handleAdd}
              >
                <input
                  type="text"
                  className="flex-grow py-3 bg-transparent outline-none text-2xl transition-colors placeholder-gray-400 text-gray-900 dark:text-gray-100 font-bold"
                  placeholder="ENTER NEW OBJECTIVE..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <button 
                  type="submit" 
                  className={`p-3 ${activeNoteColor.bg} ${activeNoteColor.text} brutal-border brutal-shadow-sm hover:brutal-shadow hover:-translate-y-1 active:translate-y-0 active:box-shadow-none rounded-xl font-black transition-all focus:outline-none flex-shrink-0`}
                  title="Add Task"
                >
                  <Plus strokeWidth={4} className="w-7 h-7" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
