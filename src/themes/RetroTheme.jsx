import { Sun, Moon, Trash2, Plus, Gamepad2, Settings } from 'lucide-react';
import { useState } from 'react';
import RichTextEditor from '../components/RichTextEditor';

const retroColors = [
  { bg: 'bg-pink-400', text: 'text-white' },
  { bg: 'bg-cyan-400', text: 'text-black' },
  { bg: 'bg-yellow-400', text: 'text-black' },
  { bg: 'bg-green-400', text: 'text-black' },
  { bg: 'bg-purple-400', text: 'text-white' },
];

export default function RetroTheme({
  notes, activeNoteId, setActiveNoteId, activeNote,
  addNote, deleteNote, updateActiveNote,
  darkMode, setDarkMode, theme, setTheme
}) {
  const [showThemeSelector, setShowThemeSelector] = useState(false);
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
            <header className="flex justify-between items-center px-8 sm:px-10 pt-10 pb-6 transition-colors duration-300 group border-b-4 border-black dark:border-white bg-yellow-300 dark:bg-pink-600 flex-shrink-0">
              <input 
                type="text"
                value={activeNote.title}
                onChange={(e) => updateActiveNote({ title: e.target.value })}
                className="text-4xl sm:text-6xl font-black tracking-tighter bg-transparent outline-none w-full mr-4 text-black dark:text-white placeholder-black/50 dark:placeholder-white/50 uppercase"
                placeholder="TITLE..."
              />
              <div className="flex items-center space-x-4 flex-shrink-0 relative">
                <button onClick={() => deleteNote(activeNote.id)} className="p-3 bg-white dark:bg-slate-900 brutal-border brutal-shadow-sm hover:brutal-shadow hover:-translate-y-1 active:translate-y-0 text-red-500 rounded-xl transition-all focus:outline-none opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-7 h-7" strokeWidth={3} />
                </button>
                <div className="relative">
                  <button onClick={() => setShowThemeSelector(!showThemeSelector)} className="p-3 bg-white dark:bg-slate-900 brutal-border brutal-shadow-sm hover:brutal-shadow hover:-translate-y-1 active:translate-y-0 text-blue-500 rounded-xl transition-all focus:outline-none">
                    <Settings className="w-7 h-7" strokeWidth={3} />
                  </button>
                  {showThemeSelector && (
                    <div className="absolute top-full right-0 mt-2 bg-white dark:bg-slate-900 brutal-border brutal-shadow-sm rounded-xl p-2 flex flex-col gap-2 w-48 z-50">
                      <div className="text-xs font-black text-gray-500 dark:text-gray-400 mb-1 px-2">CHANGE THEME</div>
                      <button onClick={() => {setTheme('aesthetic'); setShowThemeSelector(false)}} className="text-left px-3 py-2 bg-pink-400 text-white brutal-border brutal-shadow-sm hover:translate-x-1 hover:-translate-y-1 rounded-lg font-bold">MD3</button>
                      <button onClick={() => {setTheme('sticky'); setShowThemeSelector(false)}} className="text-left px-3 py-2 bg-orange-400 text-white brutal-border brutal-shadow-sm hover:translate-x-1 hover:-translate-y-1 rounded-lg font-bold">Corkboard</button>
                      <button onClick={() => {setTheme('retro'); setShowThemeSelector(false)}} className="text-left px-3 py-2 bg-yellow-400 text-black brutal-border brutal-shadow-sm hover:translate-x-1 hover:-translate-y-1 rounded-lg font-bold">Retro</button>
                      <button onClick={() => {setTheme('waifu'); setShowThemeSelector(false)}} className="text-left px-3 py-2 bg-purple-400 text-white brutal-border brutal-shadow-sm hover:translate-x-1 hover:-translate-y-1 rounded-lg font-bold">Waifu</button>
                    </div>
                  )}
                </div>
                <button onClick={() => setDarkMode(!darkMode)} className="p-3 bg-white dark:bg-slate-900 brutal-border brutal-shadow-sm hover:brutal-shadow hover:-translate-y-1 active:translate-y-0 text-black dark:text-white rounded-xl transition-all focus:outline-none">
                  {darkMode ? <Sun className="w-7 h-7" strokeWidth={3} /> : <Moon className="w-7 h-7" strokeWidth={3} />}
                </button>
              </div>
            </header>
            
            {/* Rich Text Editor with Retro Background */}
            <div className="flex-grow overflow-hidden px-4 sm:px-8 py-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9InJnYmEoMCwgMCwgMCwgMC4wNSkiLz48L3N2Zz4=')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSkiLz48L3N2Zz4=')]">
              <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl brutal-border h-full p-2 backdrop-blur-sm">
                <RichTextEditor 
                  theme={theme}
                  key={activeNote.id}
                  content={activeNote.content} 
                  onChange={(html) => updateActiveNote({ content: html })} 
                />
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
