import { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Trash2, Plus, Maximize2, Minimize2 } from 'lucide-react';
import RichTextEditor from '../components/RichTextEditor';

export default function WaifuTheme({
  notes, activeNoteId, setActiveNoteId, activeNote,
  addNote, deleteNote, updateActiveNote,
  darkMode, setDarkMode, theme
}) {
  // Keep track of which windows are open on the desktop
  const [openWindows, setOpenWindows] = useState([]);

  // Automatically open the active note if it's not already open
  useEffect(() => {
    if (activeNoteId && !openWindows.includes(activeNoteId)) {
      setOpenWindows(prev => [...prev, activeNoteId]);
    }
  }, [activeNoteId, openWindows]);

  const toggleWindow = (id) => {
    if (openWindows.includes(id)) {
      if (activeNoteId === id) {
        // Minimize (close) if it's currently focused
        setOpenWindows(openWindows.filter(wId => wId !== id));
      } else {
        // Bring to front
        setActiveNoteId(id);
      }
    } else {
      // Open and focus
      setOpenWindows([...openWindows, id]);
      setActiveNoteId(id);
    }
  };

  const closeWindow = (id) => {
    setOpenWindows(openWindows.filter(wId => wId !== id));
  };

  return (
    <div className="min-h-screen w-full overflow-hidden relative font-anime selection:bg-pink-300/50">
      
      {/* Background Image Setup */}
      <style>{`
        body {
          background-color: #1a1a2e;
          background-image: url("/bg.png");
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }
      `}</style>
      
      {/* Desktop Area */}
      <div className="absolute inset-0 z-10 overflow-hidden">
         {openWindows.map(wId => {
           const note = notes.find(n => n.id === wId);
           if (!note) return null;
           return (
             <DraggableWindow 
               key={note.id}
               note={note}
               isActive={activeNoteId === note.id}
               onFocus={() => setActiveNoteId(note.id)}
               updateActiveNote={updateActiveNote}
               deleteNote={deleteNote}
               closeWindow={() => closeWindow(note.id)}
               theme={theme}
             />
           );
         })}
      </div>

      {/* Glassy macOS-style Dock at the bottom */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom-8 duration-500">
        <div className="bg-white/20 dark:bg-black/40 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-[2rem] p-3 flex items-center gap-3 shadow-[0_8px_32px_0_rgba(255,126,179,0.4)]">
          {notes.map(note => (
            <button
              key={note.id}
              onClick={() => toggleWindow(note.id)}
              title={note.title || "Untitled"}
              className={`relative px-5 py-2.5 rounded-2xl font-bold transition-all duration-300 max-w-[150px] truncate ${
                activeNoteId === note.id 
                  ? 'bg-pink-400 text-white scale-110 shadow-lg shadow-pink-400/50 -translate-y-2' 
                  : 'bg-white/40 dark:bg-black/40 hover:bg-white/60 dark:hover:bg-black/60 hover:-translate-y-1 text-gray-900 dark:text-gray-100'
              }`}
            >
              {note.title || "Untitled"}
              {openWindows.includes(note.id) && (
                <div className={`absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full ${activeNoteId === note.id ? 'bg-white' : 'bg-pink-500'}`}></div>
              )}
            </button>
          ))}
          
          <div className="w-px h-10 bg-black/10 dark:bg-white/20 mx-1 rounded-full"></div>
          
          <button onClick={addNote} className="p-3 rounded-2xl bg-white/40 dark:bg-black/40 hover:bg-pink-400 hover:text-white hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-400/50 transition-all text-gray-900 dark:text-white">
            <Plus className="w-6 h-6" />
          </button>
          
          <button onClick={() => setDarkMode(!darkMode)} className="p-3 rounded-2xl bg-white/40 dark:bg-black/40 hover:bg-white/60 dark:hover:bg-black/60 hover:-translate-y-1 transition-all text-gray-900 dark:text-white">
            {darkMode ? <Sun className="w-6 h-6 text-yellow-300 drop-shadow-md" /> : <Moon className="w-6 h-6 text-blue-700 drop-shadow-md" />}
          </button>
        </div>
      </div>
    </div>
  );
}

function DraggableWindow({ note, isActive, onFocus, updateActiveNote, deleteNote, closeWindow, theme }) {
  // Stagger initial positions slightly
  const [position, setPosition] = useState({ 
    x: Math.random() * 100 + 50, 
    y: Math.random() * 50 + 50 
  });
  const [size, setSize] = useState({ width: 700, height: 550 });
  const [isMaximized, setIsMaximized] = useState(false);
  const dragRef = useRef(null);

  const handlePointerDown = (e) => {
    if (e.target.closest('.no-drag')) return;
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: position.x,
      initY: position.y
    };
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current || isMaximized) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPosition({
      x: dragRef.current.initX + dx,
      y: dragRef.current.initY + dy
    });
  };

  const handlePointerUp = (e) => {
    if (dragRef.current) {
      e.target.releasePointerCapture(e.pointerId);
      dragRef.current = null;
    }
  };

  return (
    <div 
      onPointerDownCapture={onFocus}
      className={`absolute flex flex-col bg-white/50 dark:bg-[#1a1a2e]/70 backdrop-blur-3xl border border-white/60 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-all duration-200 ${
        isActive ? 'z-40 ring-1 ring-pink-400/50 shadow-[0_20px_50px_rgba(255,126,179,0.3)]' : 'z-30 hover:z-30 opacity-95'
      }`}
      style={
        isMaximized 
        ? { top: '20px', left: '20px', right: '20px', bottom: '120px', width: 'auto', height: 'auto' }
        : { left: position.x, top: position.y, width: size.width, height: size.height }
      }
    >
      {/* Window Header */}
      <div 
        className="h-12 bg-white/40 dark:bg-black/40 flex justify-between items-center px-4 cursor-grab active:cursor-grabbing border-b border-white/40 dark:border-white/10 flex-shrink-0 group"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onDoubleClick={() => setIsMaximized(!isMaximized)}
      >
        <div className="flex items-center gap-2 no-drag w-20">
          <button onClick={closeWindow} className="w-3.5 h-3.5 rounded-full bg-red-400 hover:bg-red-500 transition-colors shadow-sm flex items-center justify-center text-transparent hover:text-red-900">
             <span className="text-[9px] font-black leading-none pb-0.5 opacity-0 hover:opacity-100 transition-opacity">×</span>
          </button>
          <button onClick={() => setIsMaximized(!isMaximized)} className="w-3.5 h-3.5 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors shadow-sm"></button>
          <button onClick={() => setIsMaximized(!isMaximized)} className="w-3.5 h-3.5 rounded-full bg-green-400 hover:bg-green-500 transition-colors shadow-sm"></button>
        </div>
        <div className="font-bold text-gray-800 dark:text-gray-200 text-sm tracking-widest pointer-events-none drop-shadow-sm truncate px-4 flex-1 text-center">
          {note.title || "UNTITLED.MD"}
        </div>
        <div className="w-20 flex justify-end no-drag opacity-0 group-hover:opacity-100 transition-opacity">
           <button onClick={() => { deleteNote(note.id); closeWindow(); }} className="text-red-500 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors">
             <Trash2 className="w-4 h-4" />
           </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden no-drag bg-white/30 dark:bg-black/30">
        <input 
          type="text"
          value={note.title}
          onChange={(e) => updateActiveNote({ title: e.target.value })}
          className="text-4xl font-black bg-transparent outline-none border-b-2 border-transparent focus:border-pink-400/50 pb-2 mb-4 w-full text-gray-900 dark:text-gray-100 placeholder-gray-500/60 transition-colors"
          placeholder="Document Title..."
        />
        <div className="flex-1 overflow-hidden relative rounded-2xl bg-white/60 dark:bg-black/50 border border-white/70 dark:border-white/10 shadow-inner">
          <RichTextEditor 
            theme={theme}
            content={note.content} 
            onChange={(html) => updateActiveNote({ content: html })} 
          />
        </div>
      </div>
    </div>
  );
}
