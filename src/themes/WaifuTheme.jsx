import { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Trash2, Plus, Maximize2, Minimize2, Terminal, Wifi, Volume2, BatteryMedium } from 'lucide-react';
import RichTextEditor from '../components/RichTextEditor';

export default function WaifuTheme({
  notes, activeNoteId, setActiveNoteId, activeNote,
  addNote, deleteNote, updateActiveNote,
  darkMode, setDarkMode, theme
}) {
  // Keep track of which windows are open on the desktop
  const [openWindows, setOpenWindows] = useState([]);
  
  // Keep track of size and position preferences so they persist when minimized
  const [windowPrefs, setWindowPrefs] = useState({});

  // Automatically open the active note if it's not already open
  useEffect(() => {
    if (activeNoteId) {
      setOpenWindows(prev => {
        if (!prev.includes(activeNoteId)) {
          return [...prev, activeNoteId];
        }
        return prev;
      });
    }
  }, [activeNoteId]);

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
               prefs={windowPrefs[note.id] || {}}
               onSavePrefs={(prefs) => setWindowPrefs(prev => ({ ...prev, [note.id]: prefs }))}
             />
           );
         })}
      </div>

      {/* KDE Plasma Style Bottom Panel */}
      <div className="absolute bottom-0 left-0 w-full h-12 bg-[#1a1a2e]/90 dark:bg-[#0a0a14]/95 backdrop-blur-3xl border-t border-white/10 z-50 flex items-center justify-between px-2 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
        
        {/* Left: Application Launcher & Add Note */}
        <div className="flex items-center h-full gap-1">
          <button 
            className="h-10 px-3 flex items-center justify-center gap-2 rounded hover:bg-white/10 transition-colors text-white group"
            title="Application Launcher"
          >
            <Terminal className="w-5 h-5 text-pink-400 group-hover:text-pink-300" />
          </button>
          <button 
            onClick={addNote} 
            className="h-10 px-3 flex items-center justify-center rounded hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
            title="Create New File"
          >
            <Plus className="w-5 h-5 text-green-400" />
          </button>
        </div>

        {/* Center: Task Manager (Windows) */}
        <div className="flex-1 flex items-center h-full gap-1 px-4 overflow-x-hidden">
          {notes.map(note => (
            <button
              key={note.id}
              onClick={() => toggleWindow(note.id)}
              title={note.title || "Untitled"}
              className={`h-10 px-4 flex items-center max-w-[200px] rounded transition-all duration-200 border-b-2 ${
                activeNoteId === note.id 
                  ? 'bg-white/10 border-pink-400 text-white shadow-inner shadow-white/5' 
                  : openWindows.includes(note.id)
                    ? 'bg-white/5 border-white/20 hover:bg-white/10 text-gray-300'
                    : 'border-transparent hover:bg-white/5 text-gray-500 hover:text-gray-300'
              }`}
            >
              <span className="truncate text-sm font-medium tracking-wide">
                {note.title || "Untitled"}
              </span>
            </button>
          ))}
        </div>
        
        {/* Right: System Tray */}
        <div className="flex items-center h-full gap-2 px-2 text-gray-400">
          <button onClick={() => setDarkMode(!darkMode)} className="h-10 w-10 flex items-center justify-center rounded hover:bg-white/10 transition-colors text-gray-300 hover:text-white">
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <div className="flex items-center gap-3 px-2">
            <Wifi className="w-4 h-4" />
            <Volume2 className="w-4 h-4" />
            <BatteryMedium className="w-4 h-4" />
          </div>
          <div className="text-xs font-mono font-medium text-gray-300 px-2 flex flex-col items-end leading-none justify-center">
            <span>{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            <span className="text-[10px] text-gray-500">{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DraggableWindow({ note, isActive, onFocus, updateActiveNote, deleteNote, closeWindow, theme, prefs, onSavePrefs }) {
  const [position, setPosition] = useState({ 
    x: prefs.x !== undefined ? prefs.x : Math.random() * 100 + 50, 
    y: prefs.y !== undefined ? prefs.y : Math.random() * 50 + 50 
  });
  const [size, setSize] = useState({ 
    width: prefs.width !== undefined ? prefs.width : 700, 
    height: prefs.height !== undefined ? prefs.height : 550 
  });
  const [isMaximized, setIsMaximized] = useState(false);
  const dragRef = useRef(null);
  const resizeRef = useRef(null);

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
      onSavePrefs({ x: position.x, y: position.y, width: size.width, height: size.height });
      dragRef.current = null;
    }
  };

  const handleResizeDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initW: size.width,
      initH: size.height
    };
    e.target.setPointerCapture(e.pointerId);
  };

  const handleResizeMove = (e) => {
    if (!resizeRef.current || isMaximized) return;
    const dw = e.clientX - resizeRef.current.startX;
    const dh = e.clientY - resizeRef.current.startY;
    setSize({
      width: Math.max(400, resizeRef.current.initW + dw),
      height: Math.max(300, resizeRef.current.initH + dh)
    });
  };

  const handleResizeUp = (e) => {
    if (resizeRef.current) {
      e.target.releasePointerCapture(e.pointerId);
      onSavePrefs({ x: position.x, y: position.y, width: size.width, height: size.height });
      resizeRef.current = null;
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
        className="h-10 bg-white/40 dark:bg-black/40 flex justify-between items-center cursor-grab active:cursor-grabbing border-b border-white/40 dark:border-white/10 flex-shrink-0 group"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onDoubleClick={() => setIsMaximized(!isMaximized)}
      >
        <div className="flex items-center gap-2 px-4 no-drag">
           {/* We can put a small icon here if we want, or just leave it empty for windows style */}
        </div>
        <div className="font-bold text-gray-800 dark:text-gray-200 text-xs tracking-widest pointer-events-none drop-shadow-sm truncate flex-1 text-left pl-2">
          {note.title || "UNTITLED.MD"}
        </div>
        <div className="flex items-center no-drag px-2">
          <button onClick={() => closeWindow()} className="w-10 h-10 flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-gray-800 dark:text-gray-200">
             <span className="text-lg leading-none mt-[-8px]">_</span>
          </button>
          <button onClick={() => setIsMaximized(!isMaximized)} className="w-10 h-10 flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-gray-800 dark:text-gray-200">
             <span className="text-lg leading-none mt-[-2px]">□</span>
          </button>
          <button onClick={() => closeWindow()} className="w-10 h-10 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors text-gray-800 dark:text-gray-200">
             <span className="text-xl leading-none mt-[-2px]">×</span>
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
        <div className="mt-3 flex justify-end no-drag">
           <button onClick={() => { deleteNote(note.id); closeWindow(); }} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors font-bold">
             <Trash2 className="w-4 h-4" /> Delete File
           </button>
        </div>
      </div>

      {/* Resize Handle */}
      {!isMaximized && (
        <div 
          className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize z-50 no-drag"
          onPointerDown={handleResizeDown}
          onPointerMove={handleResizeMove}
          onPointerUp={handleResizeUp}
        />
      )}
    </div>
  );
}
