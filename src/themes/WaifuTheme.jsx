import { Sun, Moon, Trash2, Plus, ListTodo, Pencil, Check, Circle } from 'lucide-react';
import { useState } from 'react';

export default function WaifuTheme({
  notes, activeNoteId, setActiveNoteId,
  inputValue, setInputValue, activeNote,
  handleAdd, toggleComplete, deleteItem, editItem,
  addNote, deleteNote, updateActiveNote,
  darkMode, setDarkMode
}) {
  return (
    <div className="min-h-screen flex justify-end items-center p-4 sm:p-12 sm:pr-24 overflow-hidden relative font-anime">
      
      {/* Background Image Setup using inline styles to override the body background for this theme */}
      <style>{`
        body {
          background-color: #1a1a2e;
          background-image: url("/bg.png");
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }
      `}</style>
      
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
                    ? 'bg-pink-400 text-white shadow-md' 
                    : 'bg-white/20 dark:bg-black/20 hover:bg-white/40 dark:hover:bg-white/10'
                }`}
              >
                {note.title || "Untitled"}
              </button>
           ))}
           <button onClick={addNote} className="p-1.5 rounded-full hover:bg-white/40 dark:hover:bg-white/10 transition-colors flex-shrink-0">
             <Plus className="w-5 h-5 text-gray-800 dark:text-gray-200" strokeWidth={2.5} />
           </button>
        </div>

        <div className="relative z-10 flex flex-col flex-1 mt-2 overflow-hidden">
          {activeNote && (
            <>
              {/* Header */}
              <header className="flex justify-between items-center px-8 pt-2 pb-2 transition-colors duration-300 border-b border-black/10 dark:border-white/10 mx-6 mb-2 group">
                <input 
                  type="text"
                  value={activeNote.title}
                  onChange={(e) => updateActiveNote({ title: e.target.value })}
                  className="text-3xl font-bold tracking-tight bg-transparent outline-none border-b-2 border-transparent focus:border-pink-400 transition-colors w-full mr-4 text-gray-900 dark:text-gray-100 placeholder-gray-500"
                  placeholder="Note Title..."
                />
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button onClick={() => deleteNote(activeNote.id)} className="p-2 rounded-full hover:bg-red-500/20 text-red-500 transition-colors focus:outline-none opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-5 h-5" strokeWidth={2.5} />
                  </button>
                  <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-white/20 dark:hover:bg-black/20 transition-colors focus:outline-none">
                    {darkMode ? <Sun className="w-6 h-6 text-yellow-200" strokeWidth={2.5} /> : <Moon className="w-6 h-6 text-blue-800" strokeWidth={2.5} />}
                  </button>
                </div>
              </header>
              
              {/* List */}
              <ul className="flex-grow overflow-y-auto px-4 py-2 space-y-1 custom-scrollbar">
                {activeNote.items.length === 0 ? (
                  <div className="flex-grow flex flex-col items-center justify-center py-20 px-16 text-center">
                    <ListTodo className="w-20 h-20 mb-6 text-pink-400 opacity-40 animate-pulse" strokeWidth={1} />
                    <p className="text-2xl font-bold opacity-60">Empty!</p>
                  </div>
                ) : (
                  activeNote.items.map((item) => (
                    <WaifuToDoItem key={item.id} item={item} toggleComplete={toggleComplete} deleteItem={deleteItem} editItem={editItem} />
                  ))
                )}
              </ul>
            </>
          )}
          
          <div className="pt-2 px-6 pb-6 transition-colors duration-300">
            <form className="flex items-center space-x-2 border-b-2 border-black/20 dark:border-white/20 focus-within:border-pink-400 transition-colors" onSubmit={handleAdd}>
              <input
                type="text"
                className="flex-grow px-2 py-2 bg-transparent outline-none text-xl transition-colors placeholder-gray-600 dark:placeholder-gray-400 text-gray-900 dark:text-white"
                placeholder="New Task..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button type="submit" className="p-2 text-pink-400 hover:text-pink-600 font-bold transition-colors focus:outline-none">
                <Plus strokeWidth={3} className="w-7 h-7" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function WaifuToDoItem({ item, toggleComplete, deleteItem, editItem }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);

  const handleEditSubmit = () => {
    if (editText.trim()) { editItem(item.id, editText.trim()); setIsEditing(false); }
    else { setEditText(item.text); setIsEditing(false); }
  };

  return (
    <li className={`group flex items-start px-5 py-4 transition-all duration-200 ${item.completed ? 'opacity-60' : 'hover:bg-white/10 dark:hover:bg-black/10'} rounded-2xl`}>
      <button onClick={() => toggleComplete(item.id)} className={`flex-shrink-0 mr-4 mt-1 transition-transform active:scale-75 ${item.completed ? 'text-pink-400' : 'text-gray-600 hover:text-pink-400'}`}>
        {item.completed ? <Check className="w-6 h-6 text-white bg-pink-400 rounded-full p-0.5" strokeWidth={3} /> : <Circle className="w-7 h-7" strokeWidth={2} />}
      </button>
      <div className="flex-grow min-w-0">
        {isEditing ? (
          <input type="text" className="w-full bg-transparent outline-none border-b-2 border-pink-400 text-xl py-1 text-gray-900 dark:text-white" value={editText} onChange={(e) => setEditText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleEditSubmit()} onBlur={handleEditSubmit} autoFocus />
        ) : (
          <span className={`text-xl transition-all block break-words py-1 ${item.completed ? 'line-through text-gray-500' : 'text-gray-800 dark:text-gray-100'}`}>{item.text}</span>
        )}
      </div>
      <div className="flex items-center space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {!isEditing && <button onClick={() => setIsEditing(true)} className="p-2 text-gray-500 hover:text-blue-500 rounded-full hover:bg-white/20"><Pencil className="w-5 h-5" /></button>}
        <button onClick={() => deleteItem(item.id)} className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-white/20"><Trash2 className="w-5 h-5" /></button>
      </div>
    </li>
  );
}
