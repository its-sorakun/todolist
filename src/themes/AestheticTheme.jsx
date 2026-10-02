import { Sun, Moon, Trash2, Plus, Sparkles } from 'lucide-react';
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
  darkMode, setDarkMode
}) {
  const activeNoteIndex = notes.findIndex(n => n.id === activeNoteId);

  return (
    <div className="h-screen w-full flex flex-col sm:flex-row overflow-hidden bg-slate-50 dark:bg-[#121212] transition-colors duration-500 font-anime">
      
      {/* Material You Navigation Drawer */}
      <div className="w-full sm:w-80 bg-slate-100/50 dark:bg-[#1e1e1e]/50 flex flex-col p-6 z-10">
        <div className="flex items-center gap-3 px-4 py-6 mb-4">
           <Sparkles className="w-8 h-8 text-pink-400 dark:text-pink-300" strokeWidth={2.5} />
           <h1 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-100">Lofi Notes</h1>
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

        <div className="p-2 mt-auto">
          <button 
            onClick={addNote} 
            className="w-full flex items-center justify-center gap-2 px-6 py-5 bg-white dark:bg-[#2a2a2a] hover:bg-gray-50 dark:hover:bg-[#333] text-gray-800 dark:text-gray-200 rounded-[28px] transition-all font-bold shadow-sm hover:shadow-md"
          >
            <Plus className="w-6 h-6" strokeWidth={2.5} />
            New Document
          </button>
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
