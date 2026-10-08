import { Sun, Moon, Trash2, Plus, Sparkles, Settings2, Key } from 'lucide-react';
import { useState } from 'react';
import RichTextEditor from '../components/RichTextEditor';

const aestheticColors = [
  { bg: 'bg-rose-100 dark:bg-rose-900/40', text: 'text-rose-900 dark:text-rose-100', primary: 'bg-rose-300 dark:bg-rose-700', hover: 'hover:bg-rose-200 dark:hover:bg-rose-800/50' },
  { bg: 'bg-indigo-100 dark:bg-indigo-900/40', text: 'text-indigo-900 dark:text-indigo-100', primary: 'bg-indigo-300 dark:bg-indigo-700', hover: 'hover:bg-indigo-200 dark:hover:bg-indigo-800/50' },
  { bg: 'bg-teal-100 dark:bg-teal-900/40', text: 'text-teal-900 dark:text-teal-100', primary: 'bg-teal-300 dark:bg-teal-700', hover: 'hover:bg-teal-200 dark:hover:bg-teal-800/50' },
  { bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-900 dark:text-amber-100', primary: 'bg-amber-300 dark:bg-amber-700', hover: 'hover:bg-amber-200 dark:hover:bg-amber-800/50' },
  { bg: 'bg-fuchsia-100 dark:bg-fuchsia-900/40', text: 'text-fuchsia-900 dark:text-fuchsia-100', primary: 'bg-fuchsia-300 dark:bg-fuchsia-700', hover: 'hover:bg-fuchsia-200 dark:hover:bg-fuchsia-800/50' },
];

export default function AestheticTheme({
  notes, activeNoteId, setActiveNoteId, activeNote,
  addNote, deleteNote, updateActiveNote,
  darkMode, setDarkMode, theme, setTheme,
  currentUser, handleLogout, setShowApiKeys
}) {
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const activeNoteIndex = notes.findIndex(n => n.id === activeNoteId);

  return (
    <div className="h-screen w-full flex flex-col sm:flex-row overflow-hidden bg-slate-50 dark:bg-[#121212] transition-colors duration-500 font-anime">
      
      {/* Material You Navigation Drawer */}
      <div className="w-full sm:w-80 bg-slate-100/50 dark:bg-[#1e1e1e]/50 flex flex-col p-6 z-10">
        <div className="flex items-center gap-3 px-4 py-6 mb-2">
           <Sparkles className="w-8 h-8 text-pink-400 dark:text-pink-300" strokeWidth={2.5} />
           <h1 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-100">Notes</h1>
        </div>
        
        {/* User Info & API Docs */}
        <div className="px-2 mb-6 flex flex-col gap-2">
          <div className="flex items-center justify-between bg-white dark:bg-[#2a2a2a] p-3 rounded-[24px] shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 flex items-center justify-center font-bold text-lg">
                {currentUser?.username?.charAt(0).toUpperCase()}
              </div>
              <span className="font-bold text-gray-800 dark:text-gray-200">{currentUser?.username}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-full transition-colors uppercase tracking-wider"
            >
              Logout
            </button>
          </div>
          <button 
            onClick={() => window.open(`http://${window.location.hostname}:5000/api-docs`, '_blank')}
            className="w-full text-left px-5 py-3 rounded-[24px] text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-[#2a2a2a] transition-colors shadow-sm"
          >
            📚 API Documentation
          </button>
          <button 
            onClick={() => setShowApiKeys(true)}
            className="w-full text-left px-5 py-3 rounded-[24px] text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-[#2a2a2a] transition-colors shadow-sm flex items-center gap-2"
          >
            <Key className="w-4 h-4" /> Manage API Keys
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto space-y-2 custom-scrollbar px-2">
           {notes.map((note, index) => {
             const color = aestheticColors[index % aestheticColors.length];
             const isActive = activeNoteId === note.id;
             return (
               <button 
                 key={note.id} 
                 onClick={() => setActiveNoteId(note.id)}
                 className={`w-full text-left px-6 py-4 rounded-[28px] transition-all duration-300 text-lg font-bold flex items-center ${
                   isActive 
                     ? `${color.bg} ${color.text} shadow-sm scale-[1.02]` 
                     : `bg-transparent ${color.hover} text-gray-600 dark:text-gray-400 opacity-80`
                 }`}
               >
                 <span className="truncate">{note.title || "Untitled"}</span>
               </button>
             );
           })}
        </div>

        <div className="p-2 mt-auto flex gap-2 relative">
          <button 
            onClick={addNote} 
            className="flex-grow flex items-center justify-center gap-2 px-4 py-4 bg-white dark:bg-[#2a2a2a] hover:bg-gray-50 dark:hover:bg-[#333] text-gray-800 dark:text-gray-200 rounded-[28px] transition-all font-bold shadow-sm hover:shadow-md h-[64px]"
          >
            <Plus className="w-6 h-6 flex-shrink-0" strokeWidth={2.5} />
            <span className="whitespace-nowrap">New Document</span>
          </button>
          
          <button 
            onClick={() => setShowThemeSelector(!showThemeSelector)}
            className="w-[64px] h-[64px] flex-shrink-0 bg-white dark:bg-[#2a2a2a] hover:bg-gray-50 dark:hover:bg-[#333] text-gray-800 dark:text-gray-200 rounded-[28px] flex items-center justify-center shadow-sm hover:shadow-md transition-all focus:outline-none"
            aria-label="Toggle Theme Selector"
          >
            <Settings2 className="w-6 h-6" strokeWidth={2.5} />
          </button>

          {showThemeSelector && (
            <div className="absolute bottom-[80px] left-2 bg-white dark:bg-[#2a2a2a] rounded-[28px] shadow-2xl p-4 flex flex-col gap-2 w-64 border border-gray-100 dark:border-white/5 animate-in fade-in slide-in-from-bottom-4 z-50">
              <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest px-2">Select Theme</h3>
              <button onClick={() => {setTheme('aesthetic'); setShowThemeSelector(false)}} className={`p-4 text-left rounded-[20px] font-bold transition-all ${theme === 'aesthetic' ? 'bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 shadow-sm' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 dark:text-gray-200'}`}>✨ Aesthetic (MD3)</button>
              <button onClick={() => {setTheme('sticky'); setShowThemeSelector(false)}} className={`p-4 text-left rounded-[20px] font-bold transition-all ${theme === 'sticky' ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300 shadow-sm' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 dark:text-gray-200'}`}>📌 Corkboard</button>
              <button onClick={() => {setTheme('retro'); setShowThemeSelector(false)}} className={`p-4 text-left rounded-[20px] font-bold transition-all ${theme === 'retro' ? 'bg-yellow-200 dark:bg-yellow-900/40 text-yellow-900 dark:text-yellow-300 shadow-sm' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 dark:text-gray-200'}`}>👾 Retro Degen</button>
              <button onClick={() => {setTheme('notesos'); setShowThemeSelector(false)}} className={`p-4 text-left rounded-[20px] font-bold transition-all ${theme === 'notesos' ? 'bg-purple-200 dark:bg-purple-900/40 text-purple-900 dark:text-purple-300 shadow-sm' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 dark:text-gray-200'}`}>🌸 NotesOS</button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-4 sm:p-8 relative">
        {activeNote && (
          <div className="flex-1 bg-white dark:bg-[#1e1e1e] rounded-[40px] flex flex-col overflow-hidden relative transition-colors duration-500 shadow-sm border border-gray-100 dark:border-white/5">
            
            {/* Header */}
            <header className="flex justify-between items-center px-10 sm:px-16 pt-12 pb-2 transition-colors duration-300 group flex-shrink-0">
              <input 
                type="text"
                value={activeNote.title}
                onChange={(e) => updateActiveNote({ title: e.target.value })}
                className="text-5xl sm:text-6xl font-bold tracking-tight bg-transparent outline-none w-full mr-4 text-gray-800 dark:text-gray-50 placeholder-gray-300 dark:placeholder-gray-700"
                placeholder="Document Title..."
              />
              <div className="flex items-center space-x-4 flex-shrink-0">
                <button 
                  onClick={() => deleteNote(activeNote.id)}
                  className="p-4 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors focus:outline-none opacity-0 group-hover:opacity-100"
                  title="Delete Note"
                >
                  <Trash2 className="w-6 h-6" strokeWidth={2.5} />
                </button>
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-4 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-300 transition-colors focus:outline-none"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <Sun className="w-7 h-7" strokeWidth={2.5} /> : <Moon className="w-7 h-7" strokeWidth={2.5} />}
                </button>
              </div>
            </header>
            
            {/* Rich Text Editor */}
            <div className="flex-grow overflow-hidden px-8 sm:px-14 pb-8 text-gray-800 dark:text-gray-200">
              <RichTextEditor 
                theme={theme}
                key={activeNote.id}
                content={activeNote.content} 
                onChange={(html) => updateActiveNote({ content: html })} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
