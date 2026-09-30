import { Sun, Moon, Trash2, Plus, Gamepad2, Check, Circle, Pencil } from 'lucide-react';
import { useState } from 'react';

const retroColors = [
  { bg: 'bg-pink-400', text: 'text-white', check: 'bg-white text-black' },
  { bg: 'bg-cyan-400', text: 'text-black', check: 'bg-black text-white' },
  { bg: 'bg-yellow-400', text: 'text-black', check: 'bg-black text-white' },
  { bg: 'bg-green-400', text: 'text-black', check: 'bg-black text-white' },
  { bg: 'bg-purple-400', text: 'text-white', check: 'bg-white text-black' },
];

export default function RetroTheme({
  notes, activeNoteId, setActiveNoteId,
  inputValue, setInputValue, activeNote,
  handleAdd, toggleComplete, deleteItem, editItem,
  addNote, deleteNote, updateActiveNote,
  darkMode, setDarkMode
}) {
  const activeNoteIndex = notes.findIndex(n => n.id === activeNoteId);
  const activeColor = retroColors[Math.max(0, activeNoteIndex) % retroColors.length];

  return (
    <div className="h-screen w-full flex flex-col sm:flex-row overflow-hidden bg-retro-grid font-anime text-black dark:text-white transition-colors">
      
      {/* Sidebar: Neo-Brutalist */}
      <div className="w-full sm:w-72 bg-fuchsia-500 dark:bg-slate-900 flex flex-col p-4 sm:border-r-4 border-b-4 sm:border-b-0 border-black dark:border-white z-10 transition-colors">
        <div className="flex items-center gap-3 px-2 py-4 mb-4">
           <div className="bg-yellow-400 p-2 rounded-full brutal-border brutal-shadow-sm">
             <Gamepad2 className="w-8 h-8 text-black" strokeWidth={3} />
           </div>
           <h1 className="text-3xl font-black tracking-tight text-white dark:text-pink-400" style={{ textShadow: '2px 2px 0 #000' }}>DATA.LOG</h1>
        </div>
        
        <div className="flex-grow overflow-y-auto space-y-4 custom-scrollbar px-2 py-2">
           {notes.map((note, index) => {
             const color = retroColors[index % retroColors.length];
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
            
            {/* Header */}
            <header className="flex justify-between items-center px-8 sm:px-10 pt-10 pb-6 transition-colors duration-300 group border-b-4 border-black dark:border-white bg-yellow-300 dark:bg-pink-600">
              <input 
                type="text"
                value={activeNote.title}
                onChange={(e) => updateActiveNote({ title: e.target.value })}
                className="text-4xl sm:text-6xl font-black tracking-tighter bg-transparent outline-none w-full mr-4 text-black dark:text-white placeholder-black/50 dark:placeholder-white/50 uppercase"
                placeholder="TITLE..."
              />
              <div className="flex items-center space-x-4 flex-shrink-0">
                <button onClick={() => deleteNote(activeNote.id)} className="p-3 bg-white dark:bg-slate-900 brutal-border brutal-shadow-sm hover:brutal-shadow hover:-translate-y-1 active:translate-y-0 text-red-500 rounded-xl transition-all focus:outline-none opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-7 h-7" strokeWidth={3} />
                </button>
                <button onClick={() => setDarkMode(!darkMode)} className="p-3 bg-white dark:bg-slate-900 brutal-border brutal-shadow-sm hover:brutal-shadow hover:-translate-y-1 active:translate-y-0 text-black dark:text-white rounded-xl transition-all focus:outline-none">
                  {darkMode ? <Sun className="w-7 h-7" strokeWidth={3} /> : <Moon className="w-7 h-7" strokeWidth={3} />}
                </button>
              </div>
            </header>
            
            {/* To Do List */}
            <ul className="flex-grow overflow-y-auto px-6 sm:px-10 py-8 space-y-6 custom-scrollbar bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9InJnYmEoMCwgMCwgMCwgMC4wNSkiLz48L3N2Zz4=')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSkiLz48L3N2Zz4=')]">
              {activeNote.items.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center py-10 text-center">
                  <div className="bg-pink-400 p-6 brutal-border brutal-shadow rounded-full mb-6 rotate-12">
                    <Gamepad2 className="w-20 h-20 text-white" strokeWidth={2} />
                  </div>
                  <p className="text-4xl font-black text-black dark:text-white uppercase tracking-tighter">No Objectives!</p>
                </div>
              ) : (
                activeNote.items.map((item, index) => {
                  const itemColor = retroColors[index % retroColors.length];
                  return <RetroToDoItem key={item.id} item={item} color={itemColor} toggleComplete={toggleComplete} deleteItem={deleteItem} editItem={editItem} />
                })
              )}
            </ul>
            
            {/* Input Form */}
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
                <button type="submit" className={`p-3 ${activeColor.bg} ${activeColor.text} brutal-border brutal-shadow-sm hover:brutal-shadow hover:-translate-y-1 active:translate-y-0 rounded-xl font-black transition-all focus:outline-none flex-shrink-0`}>
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

function RetroToDoItem({ item, color, toggleComplete, deleteItem, editItem }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);

  const handleEditSubmit = () => {
    if (editText.trim()) { editItem(item.id, editText.trim()); setIsEditing(false); }
    else { setEditText(item.text); setIsEditing(false); }
  };

  return (
    <li className={`group flex items-start px-6 py-4 transition-all duration-200 brutal-border ${item.completed ? 'bg-gray-200 dark:bg-slate-800 brutal-shadow-sm opacity-60 grayscale' : `${color.bg} brutal-shadow hover:-translate-y-1 hover:translate-x-1`} rounded-xl`}>
      <div className="flex items-center w-full flex-grow">
        <button onClick={() => toggleComplete(item.id)} className={`flex-shrink-0 mr-4 w-8 h-8 rounded bg-white dark:bg-slate-900 brutal-border brutal-shadow-sm flex items-center justify-center focus:outline-none transition-transform active:scale-90`}>
          {item.completed && <Check className={`w-6 h-6 text-black dark:text-white`} strokeWidth={4} />}
        </button>
        <div className="flex-grow min-w-0 flex items-center">
          {isEditing ? (
            <input type="text" className={`w-full bg-white dark:bg-slate-900 brutal-border outline-none transition-all text-2xl py-2 px-3 text-black dark:text-white font-black rounded-lg`} value={editText} onChange={(e) => setEditText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleEditSubmit()} onBlur={handleEditSubmit} autoFocus />
          ) : (
            <span className={`text-2xl transition-all duration-200 block break-words py-1 font-black uppercase tracking-tight ${item.completed ? 'line-through text-gray-500' : color.text}`}>{item.text}</span>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2 ml-4 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200 self-center">
        {!isEditing && <button onClick={() => setIsEditing(true)} className="p-2 bg-white dark:bg-slate-900 brutal-border brutal-shadow-sm hover:-translate-y-1 active:translate-y-0 text-black dark:text-white rounded-lg transition-all focus:outline-none"><Pencil className="w-5 h-5" strokeWidth={3} /></button>}
        <button onClick={() => deleteItem(item.id)} className="p-2 bg-white dark:bg-slate-900 brutal-border brutal-shadow-sm hover:-translate-y-1 active:translate-y-0 text-red-500 rounded-lg transition-all focus:outline-none"><Trash2 className="w-5 h-5" strokeWidth={3} /></button>
      </div>
    </li>
  );
}
