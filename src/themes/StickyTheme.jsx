import { Trash2, Plus, Key } from 'lucide-react';
import RichTextEditor from '../components/RichTextEditor';

export default function StickyTheme({
  notes, activeNoteId, setActiveNoteId, activeNote,
  addNote, deleteNote, updateActiveNote,
  darkMode, setDarkMode, theme, setTheme,
  currentUser, handleLogout, setShowApiKeys
}) {
  return (
    <div className="h-screen w-full overflow-y-auto bg-[#c19a6b] relative font-handwriting text-black">
      
      {/* SVG Noise for Corkboard Texture */}
      <style>{`
        .bg-corkboard {
          background-color: #c19a6b;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.25'/%3E%3C/svg%3E");
        }
      `}</style>

      <div className="absolute inset-0 bg-corkboard pointer-events-none z-0"></div>

      {/* Top Bar for Global Actions */}
      <div className="relative z-10 flex justify-between items-start p-6">
        <div className="flex flex-col gap-4">
          <button 
            onClick={addNote} 
            className="bg-yellow-200 text-yellow-900 px-6 py-3 rounded shadow-lg transform -rotate-2 hover:rotate-0 hover:scale-110 transition-all font-bold text-3xl flex items-center gap-2"
          >
            <Plus strokeWidth={3} /> New Sticky
          </button>
          
          <div className="bg-[#eecbad] p-3 rounded shadow-md transform rotate-1 text-orange-900 font-bold flex flex-col gap-2 w-max border border-[#d6a57a]">
            <div className="flex items-center gap-3">
              <span className="text-xl uppercase truncate max-w-[150px]">{currentUser?.username}</span>
              <button onClick={handleLogout} className="bg-red-400 text-white px-2 py-1 rounded text-sm hover:scale-105 transition-transform shadow">Logout</button>
            </div>
            <button 
              onClick={() => window.open(`http://${window.location.hostname}:5000/api-docs`, '_blank')}
              className="bg-cyan-600 text-white px-3 py-1.5 rounded text-sm hover:scale-105 transition-transform shadow text-center uppercase"
            >
              📚 API Docs
            </button>
            <button 
              onClick={() => setShowApiKeys(true)}
              className="bg-purple-600 text-white px-3 py-1.5 rounded text-sm hover:scale-105 transition-transform shadow text-center uppercase flex items-center justify-center gap-2"
            >
              <Key className="w-4 h-4" /> API Keys
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          {['aesthetic', 'sticky', 'retro', 'notesos'].map((t) => (
            <button 
              key={t}
              onClick={() => setTheme(t)}
              className={`px-4 py-2 text-xl font-bold rounded shadow-md transform rotate-1 hover:rotate-0 hover:scale-110 transition-all ${
                theme === t ? 'bg-[#ff9e9e] text-red-900' : 'bg-[#eecbad] text-orange-900'
              }`}
            >
              {t === 'aesthetic' ? 'MD3' : t === 'sticky' ? 'Cork' : t === 'retro' ? 'Retro' : 'NotesOS'}
            </button>
          ))}
        </div>
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
            deleteNote={deleteNote}
            theme={theme}
          />
        ))}
      </div>
    </div>
  );
}

function StickyNote({ 
  note, index, isActive, onFocus, updateActiveNote, deleteNote, theme
}) {
  const rotation = [-2, 3, -1, 2, -3][index % 5];
  const color = ['bg-[#fdf09d]', 'bg-[#ff9e9e]', 'bg-[#98f5ff]', 'bg-[#b9ffb0]', 'bg-[#eecbad]'][index % 5];

  return (
    <div 
      className={`relative w-80 h-[350px] ${color} shadow-[0_10px_30px_rgba(0,0,0,0.3)] p-6 transition-all duration-300 flex flex-col ${isActive ? 'scale-110 z-20 shadow-[0_20px_50px_rgba(0,0,0,0.4)] w-[450px] h-[550px]' : 'hover:scale-105 z-10'}`}
      style={{ transform: isActive ? `rotate(0deg)` : `rotate(${rotation}deg)` }}
      onClick={onFocus}
    >
      {/* Thumbtack */}
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-red-600 rounded-full shadow-[2px_4px_4px_rgba(0,0,0,0.5)] z-30 flex items-center justify-center border border-red-800">
        <div className="w-2 h-2 bg-red-300 rounded-full absolute top-1 left-1 opacity-80"></div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-2 group border-b border-black/10 pb-2 flex-shrink-0 mt-2">
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

      {/* Editor */}
      <div className="flex-grow overflow-hidden text-black/80">
        <RichTextEditor 
          theme={theme}
          content={note.content} 
          onChange={(html) => isActive && updateActiveNote({ content: html })} 
          editable={isActive}
        />
      </div>
    </div>
  );
}
