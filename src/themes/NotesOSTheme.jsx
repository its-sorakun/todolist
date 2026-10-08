import { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Trash2, Plus, Maximize2, Minimize2, Terminal, Wifi, Volume2, BatteryMedium, Image as ImageIcon, LayoutGrid, Monitor, Key } from 'lucide-react';
import { getModalClasses } from '../utils/themeConfig';
import RichTextEditor from '../components/RichTextEditor';

const extractAccentColor = (url, callback) => {
  if (!url) return;
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.onload = () => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 50;
      canvas.height = 50;
      ctx.drawImage(img, 0, 0, 50, 50);
      const data = ctx.getImageData(0, 0, 50, 50).data;
      
      let maxSaturation = -1;
      let bestHsl = [330, 100, 60]; // Fallback

      for (let i = 0; i < data.length; i += 4 * 10) {
        const r = data[i], g = data[i+1], b = data[i+2];
        const r1 = r / 255, g1 = g / 255, b1 = b / 255;
        const max = Math.max(r1, g1, b1), min = Math.min(r1, g1, b1);
        let h = 0, s = 0, l = (max + min) / 2;

        if (max !== min) {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r1: h = (g1 - b1) / d + (g1 < b1 ? 6 : 0); break;
            case g1: h = (b1 - r1) / d + 2; break;
            case b1: h = (r1 - g1) / d + 4; break;
          }
          h /= 6;
        }

        if (s > maxSaturation && l > 0.15 && l < 0.85) {
          maxSaturation = s;
          bestHsl = [h * 360, s * 100, l * 100];
        }
      }
      callback(bestHsl);
    } catch (e) {
      console.warn("Could not extract color from background", e);
    }
  };
  img.src = url;
};

export default function NotesOSTheme({
  notes, activeNoteId, setActiveNoteId, activeNote,
  addNote, deleteNote, updateActiveNote,
  darkMode, setDarkMode, theme, setTheme,
  currentUser, handleLogout, setShowApiKeys
}) {
  // Keep track of which windows are open on the desktop
  const [openWindows, setOpenWindows] = useState([]);

  // Keep track of size and position preferences so they persist when minimized
  const [windowPrefs, setWindowPrefs] = useState(() => {
    try {
      const stored = localStorage.getItem('waifu_window_prefs');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bgUrl, setBgUrl] = useState(() => localStorage.getItem('waifu_bg') || '/bg.png');
  const [showBgPrompt, setShowBgPrompt] = useState(false);
  const [tempBgUrl, setTempBgUrl] = useState('');
  const [accentHsl, setAccentHsl] = useState([330, 100, 60]);

  useEffect(() => {
    if (bgUrl) extractAccentColor(bgUrl, setAccentHsl);
  }, [bgUrl]);

  useEffect(() => {
    try {
      localStorage.setItem('waifu_bg', bgUrl);
    } catch (e) {
      console.warn("Could not save background to localStorage, it might be too large.", e);
      alert("Note: This image is too large to save permanently (browser storage limit). It will work for this session but will reset when you refresh.");
    }
  }, [bgUrl]);

  useEffect(() => {
    localStorage.setItem('waifu_window_prefs', JSON.stringify(windowPrefs));
  }, [windowPrefs]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

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
    <div 
      className="min-h-screen w-full overflow-hidden relative font-anime selection:bg-[var(--os-accent-transparent)]"
      style={{
        '--os-accent': `hsl(${accentHsl[0]}, ${Math.max(50, accentHsl[1])}%, ${darkMode ? 70 : 45}%)`,
        '--os-accent-transparent': `hsla(${accentHsl[0]}, ${Math.max(50, accentHsl[1])}%, ${darkMode ? 70 : 45}%, 0.3)`,
      }}
    >

      {/* Background Image Setup */}
      <style>{`
        body {
          background-color: ${darkMode ? '#1a1a2e' : '#f5f5f5'};
          background-image: url("${bgUrl}");
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
      <div className="absolute bottom-0 left-0 w-full h-12 bg-white/80 dark:bg-[#0a0a14]/95 backdrop-blur-3xl border-t border-black/10 dark:border-white/10 z-[60] flex items-center justify-between px-2 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">

        {/* Left: Application Launcher & Add Note */}
        <div className="flex items-center h-full gap-1">
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="h-10 px-3 flex items-center justify-center gap-2 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-black dark:text-white group"
              title="Application Launcher"
            >
              <LayoutGrid className="w-5 h-5 text-[var(--os-accent)] opacity-80 group-hover:opacity-100 transition-opacity" />
            </button>

            {/* Start Menu Popover */}
            {isMenuOpen && (
              <div className="absolute bottom-12 left-0 mb-2 w-64 bg-white/90 dark:bg-[#1a1a2e]/95 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-xl shadow-2xl p-2 flex flex-col gap-1 z-[70] animate-in fade-in slide-in-from-bottom-2">
                <div className="px-3 py-3 text-sm font-bold text-gray-800 dark:text-gray-200 border-b border-black/5 dark:border-white/10 mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[var(--os-accent)] flex items-center justify-center text-white text-xs">
                      {currentUser?.username?.charAt(0).toUpperCase()}
                    </div>
                    <span>{currentUser?.username}</span>
                  </div>
                  <button 
                    onClick={handleLogout} 
                    className="text-xs text-red-500 hover:text-red-600 transition-colors uppercase tracking-widest font-bold"
                  >
                    Logout
                  </button>
                </div>
                
                <div className="px-3 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1 mb-1">
                  System Settings
                </div>
                <button
                  onClick={() => { toggleFullScreen(); setIsMenuOpen(false); }}
                  className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-800 dark:text-gray-200 font-medium"
                >
                  <Monitor className="w-5 h-5 text-teal-500" />
                  Toggle Fullscreen
                </button>
                <button
                  onClick={() => { setDarkMode(!darkMode); setIsMenuOpen(false); }}
                  className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-800 dark:text-gray-200 font-medium"
                >
                  {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-blue-600" />}
                  Toggle {darkMode ? 'Light' : 'Dark'} Mode
                </button>
                <button
                  onClick={() => { setShowBgPrompt(true); setIsMenuOpen(false); }}
                  className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-800 dark:text-gray-200 font-medium"
                >
                  <ImageIcon className="w-5 h-5 text-purple-500" />
                  Change Background
                </button>
                <button
                  onClick={() => { window.open(`http://${window.location.hostname}:5000/api-docs`, '_blank'); setIsMenuOpen(false); }}
                  className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-800 dark:text-gray-200 font-medium"
                >
                  <Terminal className="w-5 h-5 text-orange-500" />
                  API Documentation
                </button>
                <button
                  onClick={() => { setShowApiKeys(true); setIsMenuOpen(false); }}
                  className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-800 dark:text-gray-200 font-medium"
                >
                  <Key className="w-5 h-5 text-yellow-500" />
                  Manage API Keys
                </button>

                <div className="px-3 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest border-b border-t border-black/5 dark:border-white/10 my-1 mt-2">
                  Change Theme
                </div>
                <button onClick={() => setTheme('aesthetic')} className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300">✨ Aesthetic (MD3)</button>
                <button onClick={() => setTheme('sticky')} className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300">📌 Corkboard</button>
                <button onClick={() => setTheme('retro')} className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300">👾 Retro Degen</button>
              </div>
            )}
          </div>

          <button
            onClick={addNote}
            className="h-10 px-3 flex items-center justify-center rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
            title="Create New File"
          >
            <Plus className="w-5 h-5 text-green-600 dark:text-green-400" />
          </button>
        </div>

        {/* Center: Task Manager (Windows) */}
        <div className="flex-1 flex items-center h-full gap-1 px-4 overflow-x-hidden">
          {notes.map(note => (
            <button
              key={note.id}
              onClick={() => toggleWindow(note.id)}
              title={note.title || "Untitled"}
              className={`h-10 px-4 flex items-center max-w-[200px] rounded transition-all duration-200 border-b-2 ${activeNoteId === note.id
                  ? 'bg-black/5 dark:bg-white/10 border-[var(--os-accent)] text-[var(--os-accent)] shadow-inner shadow-black/5 dark:shadow-white/5'
                  : openWindows.includes(note.id)
                    ? 'bg-black/5 dark:bg-white/5 border-black/20 dark:border-white/20 hover:bg-black/10 dark:hover:bg-white/10 text-gray-800 dark:text-gray-300'
                    : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5 text-gray-600 dark:text-gray-500 hover:text-black dark:hover:text-gray-300'
                }`}
            >
              <span className="truncate text-sm font-medium tracking-wide">
                {note.title || "Untitled"}
              </span>
            </button>
          ))}
        </div>

        {/* Right: System Tray */}
        <div className="flex items-center h-full gap-2 px-2 text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-3 px-2">
            <Wifi className="w-4 h-4" />
            <Volume2 className="w-4 h-4" />
            <BatteryMedium className="w-4 h-4" />
          </div>
          <div className="text-xs font-mono font-medium text-gray-800 dark:text-gray-300 px-2 flex flex-col items-center leading-[1.2] justify-center">
            <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span className="text-[10px] opacity-70">{currentTime.toLocaleDateString('en-GB')}</span>
          </div>
        </div>
      </div>

      {/* Change Background Modal */}
      {showBgPrompt && (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center animate-in fade-in duration-200 ${getModalClasses(theme).overlay}`}>
          <div className={`m-4 max-w-sm w-full transform transition-all scale-in-100 ${getModalClasses(theme).container}`}>
            <h2 className={`${getModalClasses(theme).title}`}>Change Background</h2>
            <p className={`${getModalClasses(theme).text}`}>Enter a direct URL to an image to set it as your wallpaper.</p>
            <div className="flex flex-col gap-4 mb-4 mt-2">
              <input
                type="text"
                value={tempBgUrl}
                onChange={(e) => setTempBgUrl(e.target.value)}
                className={`${getModalClasses(theme).input} !mb-0`}
                placeholder="https://example.com/wallpaper.jpg"
                autoFocus
              />
              <div className="flex items-center gap-2">
                <div className="h-px bg-gray-500/30 flex-1"></div>
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">OR</span>
                <div className="h-px bg-gray-500/30 flex-1"></div>
              </div>
              <label className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white/40 dark:bg-black/40 border-2 border-dashed border-gray-400/50 hover:border-pink-400/50 hover:bg-white/60 dark:hover:bg-black/60 rounded-xl cursor-pointer transition-colors text-sm font-bold text-gray-700 dark:text-gray-300">
                <ImageIcon className="w-4 h-4" />
                Upload Local Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        setBgUrl(e.target.result);
                        setShowBgPrompt(false);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setShowBgPrompt(false); setTempBgUrl(''); }}
                className={`${getModalClasses(theme).buttonSecondary}`}
              >
                Cancel
              </button>
              <button
                onClick={() => { setBgUrl(tempBgUrl || '/bg.png'); setShowBgPrompt(false); setTempBgUrl(''); }}
                className={`${getModalClasses(theme).buttonPrimary}`}
              >
                Set Background
              </button>
            </div>
          </div>
        </div>
      )}
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

  const handleResizeDown = (e, corner) => {
    e.stopPropagation();
    e.preventDefault();
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initW: size.width,
      initH: size.height,
      initX: position.x,
      initY: position.y,
      corner
    };
    e.target.setPointerCapture(e.pointerId);
  };

  const handleResizeMove = (e) => {
    if (!resizeRef.current || isMaximized) return;
    const { startX, startY, initW, initH, initX, initY, corner } = resizeRef.current;
    const dw = e.clientX - startX;
    const dh = e.clientY - startY;

    let newW = initW;
    let newH = initH;
    let newX = initX;
    let newY = initY;

    if (corner.includes('e')) newW = Math.max(400, initW + dw);
    if (corner.includes('s')) newH = Math.max(300, initH + dh);
    if (corner.includes('w')) {
      newW = Math.max(400, initW - dw);
      if (initW - dw >= 400) newX = initX + dw;
    }
    if (corner.includes('n')) {
      newH = Math.max(300, initH - dh);
      if (initH - dh >= 300) newY = initY + dh;
    }

    setSize({ width: newW, height: newH });
    setPosition({ x: newX, y: newY });

    resizeRef.current.currentW = newW;
    resizeRef.current.currentH = newH;
    resizeRef.current.currentX = newX;
    resizeRef.current.currentY = newY;
  };

  const handleResizeUp = (e) => {
    if (resizeRef.current) {
      e.target.releasePointerCapture(e.pointerId);
      const r = resizeRef.current;
      onSavePrefs({
        x: r.currentX ?? position.x,
        y: r.currentY ?? position.y,
        width: r.currentW ?? size.width,
        height: r.currentH ?? size.height
      });
      resizeRef.current = null;
    }
  };

  return (
    <div
      onPointerDownCapture={onFocus}
      className={`absolute flex flex-col bg-white/50 dark:bg-[#1a1a2e]/70 backdrop-blur-3xl border border-white/60 dark:border-white/10 overflow-hidden shadow-2xl transition-shadow duration-200 ${isActive ? 'z-40 ring-1 ring-[var(--os-accent)] shadow-[0_20px_50px_var(--os-accent-transparent)]' : 'z-30 hover:z-30 opacity-95'
        } ${isMaximized ? 'rounded-none border-0' : 'rounded-2xl'}`}
      style={
        isMaximized
          ? { top: '0px', left: '0px', right: '0px', bottom: '48px', width: 'auto', height: 'auto' }
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
        <div className="flex-1 flex items-center pl-2 h-full pointer-events-none">
          <input
            type="text"
            value={note.title}
            onChange={(e) => updateActiveNote({ title: e.target.value })}
            className="font-bold text-gray-800 dark:text-gray-200 text-sm tracking-wide bg-transparent outline-none truncate text-left pointer-events-auto no-drag w-full max-w-[250px] focus:bg-white/30 dark:focus:bg-black/30 rounded px-1 transition-colors"
            placeholder="Untitled Note"
          />
        </div>
        <div className="flex items-center no-drag px-2">
          <button onClick={() => deleteNote(note.id)} className="w-10 h-10 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors text-gray-800 dark:text-gray-200" title="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
          <button onClick={() => closeWindow()} className="w-10 h-10 flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-gray-800 dark:text-gray-200" title="Minimize">
            <span className="text-lg leading-none mt-[-8px]">_</span>
          </button>
          <button onClick={() => setIsMaximized(!isMaximized)} className="w-10 h-10 flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-gray-800 dark:text-gray-200" title="Maximize">
            <span className="text-lg leading-none mt-[-2px]">□</span>
          </button>
          <button onClick={() => closeWindow()} className="w-10 h-10 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors text-gray-800 dark:text-gray-200" title="Close">
            <span className="text-xl leading-none mt-[-2px]">×</span>
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className={`flex-1 flex flex-col overflow-hidden no-drag bg-white/30 dark:bg-black/30 ${isMaximized ? 'p-0' : 'p-4'}`}>
        <div className={`flex-1 overflow-hidden relative bg-white/60 dark:bg-black/50 shadow-inner ${isMaximized ? 'rounded-none border-0' : 'rounded-2xl border border-white/70 dark:border-white/10'}`}>
          <RichTextEditor
            theme={theme}
            content={note.content}
            onChange={(html) => updateActiveNote({ content: html })}
          />
        </div>
      </div>

      {/* Resize Handles */}
      {!isMaximized && (
        <>
          <div
            className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize z-50 no-drag"
            onPointerDown={(e) => handleResizeDown(e, 'nw')}
            onPointerMove={handleResizeMove}
            onPointerUp={handleResizeUp}
          />
          <div
            className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize z-50 no-drag"
            onPointerDown={(e) => handleResizeDown(e, 'ne')}
            onPointerMove={handleResizeMove}
            onPointerUp={handleResizeUp}
          />
          <div
            className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize z-50 no-drag"
            onPointerDown={(e) => handleResizeDown(e, 'sw')}
            onPointerMove={handleResizeMove}
            onPointerUp={handleResizeUp}
          />
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50 no-drag"
            onPointerDown={(e) => handleResizeDown(e, 'se')}
            onPointerMove={handleResizeMove}
            onPointerUp={handleResizeUp}
          />
        </>
      )}
    </div>
  );
}
