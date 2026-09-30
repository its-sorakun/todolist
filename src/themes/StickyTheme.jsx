import { Trash2, Plus, Check, Circle } from 'lucide-react';
import { useState } from 'react';

export default function StickyTheme({
  notes, activeNoteId, setActiveNoteId,
  inputValue, setInputValue, activeNote,
  handleAdd, toggleComplete, deleteItem, editItem,
  addNote, deleteNote, updateActiveNote,
  darkMode, setDarkMode
}) {
  return (
    <div className="h-screen w-full overflow-y-auto bg-[#c19a6b] relative font-handwriting">
      
      {/* SVG Noise for Corkboard Texture */}
      <style>{`
        .bg-corkboard {
          background-color: #c19a6b;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.25'/%3E%3C/svg%3E");
        }
      `}</style>

      <div className="absolute inset-0 bg-corkboard pointer-events-none z-0"></div>

      {/* Top Bar for Global Actions */}
      <div className="relative z-10 flex justify-between items-center p-6">
        <button 
          onClick={addNote} 
          className="bg-yellow-200 text-yellow-900 px-6 py-3 rounded shadow-lg transform -rotate-2 hover:rotate-0 hover:scale-110 transition-all font-bold text-3xl flex items-center gap-2"
        >
          <Plus strokeWidth={3} /> New Sticky
        </button>
      </div>

      {/* Sticky Notes Grid */}
      <div className="relative z-10 flex flex-wrap gap-12 p-8 pb-32 justify-center items-start">
        {notes.map((note, index) => (
          <StickyNote 
            key={note.id} 
            note={note} 
            index={index}
            isActive={note.id === activeNoteId}
            onFocus={() => setActiveNoteId(note.id)}
            updateActiveNote={updateActiveNote}
            toggleComplete={toggleComplete}
            deleteItem={deleteItem}
            editItem={editItem}
            deleteNote={deleteNote}
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleAdd={handleAdd}
          />
        ))}
      </div>
    </div>
  );
}

function StickyNote({ 
  note, index, isActive, onFocus, updateActiveNote, 
  toggleComplete, deleteItem, editItem, deleteNote,
  inputValue, setInputValue, handleAdd
}) {
  const rotation = [-2, 3, -1, 2, -3][index % 5];
  const color = ['bg-[#fdf09d]', 'bg-[#ff9e9e]', 'bg-[#98f5ff]', 'bg-[#b9ffb0]', 'bg-[#eecbad]'][index % 5];

  return (
    <div 
      className={`relative w-80 min-h-[300px] ${color} shadow-[0_10px_30px_rgba(0,0,0,0.3)] p-6 transition-all duration-300 flex flex-col ${isActive ? 'scale-110 z-20 shadow-[0_20px_50px_rgba(0,0,0,0.4)]' : 'hover:scale-105 z-10'}`}
      style={{ transform: isActive ? `rotate(0deg)` : `rotate(${rotation}deg)` }}
      onClick={onFocus}
    >
      {/* Thumbtack */}
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-red-600 rounded-full shadow-[2px_4px_4px_rgba(0,0,0,0.5)] z-30 flex items-center justify-center border border-red-800">
        <div className="w-2 h-2 bg-red-300 rounded-full absolute top-1 left-1 opacity-80"></div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-4 group border-b border-black/10 pb-2 flex-shrink-0 mt-2">
        <input 
          type="text"
          value={note.title}
          onChange={(e) => isActive && updateActiveNote({ title: e.target.value })}
          className="text-4xl font-bold bg-transparent outline-none w-full text-black placeholder-black/40"
          placeholder="Quick Notes"
          disabled={!isActive}
        />
        <button 
          onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
          className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 transition-opacity p-1"
        >
          <Trash2 className="w-6 h-6" />
        </button>
      </div>

      {/* Items */}
      <ul className="space-y-2 mb-14 flex-grow overflow-y-auto custom-scrollbar pr-2">
        {note.items.map(item => (
          <li key={item.id} className="flex items-start group">
            <button 
              onClick={(e) => { e.stopPropagation(); if (isActive) toggleComplete(item.id); }}
              className="mt-1 mr-2 text-black/70 hover:text-black transition-colors"
              disabled={!isActive}
            >
              {item.completed ? <Check className="w-6 h-6 text-blue-600" /> : <Circle className="w-6 h-6" />}
            </button>
            <span className={`text-2xl flex-grow font-bold ${item.completed ? 'line-through text-black/40' : 'text-black/80'}`}>
              {item.text}
            </span>
            <button 
              onClick={(e) => { e.stopPropagation(); if (isActive) deleteItem(item.id); }}
              className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 ml-2"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </li>
        ))}
      </ul>

      {/* Input Form (Only visible when active) */}
      {isActive && (
        <form 
          className="absolute bottom-4 left-6 right-6 flex items-center border-b border-black/30 pb-1"
          onSubmit={(e) => {
            e.preventDefault();
            if (!inputValue.trim()) return;
            handleAdd(e);
          }}
        >
          <input
            type="text"
            className="flex-grow bg-transparent outline-none text-2xl placeholder-black/30 text-black font-bold"
            placeholder="Jot down a task..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit" className="text-blue-600 hover:text-blue-800 font-bold">
            <Plus strokeWidth={3} className="w-6 h-6" />
          </button>
        </form>
      )}
    </div>
  );
}
