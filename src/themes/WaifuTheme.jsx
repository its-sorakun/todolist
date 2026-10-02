import { Sun, Moon, Trash2, Plus } from 'lucide-react';
import RichTextEditor from '../components/RichTextEditor';

export default function WaifuTheme({
  notes, activeNoteId, setActiveNoteId, activeNote,
  addNote, deleteNote, updateActiveNote,
  darkMode, setDarkMode
}) {
  return (
    <div className="min-h-screen flex justify-end items-center p-4 sm:p-12 sm:pr-24 overflow-hidden relative font-anime">
      
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
      
      {/* Frosted Glass Dashboard Panel */}
      <div className="w-full max-w-md bg-white/30 dark:bg-black/40 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(255,126,179,0.37)] border border-white/40 dark:border-white/10 rounded-3xl relative transition-all duration-300 flex flex-col max-h-[85vh] animate-float">
        
        {/* Tabs Bar */}
        <div className="flex items-center overflow-x-auto border-b border-black/10 dark:border-white/10 custom-scrollbar px-4 py-3 mx-2 gap-2 flex-shrink-0">
           {notes.map(note => (
              <button 
                key={note.id} 
                onClick={() => setActiveNoteId(note.id)}
                className={`px-4 py-1.5 whitespace-nowrap rounded-full transition-colors text-sm font-bold ${
                  activeNoteId === note.id 
                    ? 'bg-pink-400 text-white shadow-md' 
                    : 'bg-white/20 dark:bg-black/20 hover:bg-white/40 dark:hover:bg-white/10 text-gray-800 dark:text-gray-200'
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
              <header className="flex justify-between items-center px-8 pt-2 pb-2 transition-colors duration-300 border-b border-black/10 dark:border-white/10 mx-6 mb-2 group flex-shrink-0">
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
              
              {/* Rich Text Editor */}
              <div className="flex-grow overflow-hidden px-6 py-2 text-gray-900 dark:text-gray-100">
                <div className="bg-white/20 dark:bg-black/20 rounded-2xl h-full p-1 border border-white/30 dark:border-white/5">
                  <RichTextEditor 
                    content={activeNote.content} 
                    onChange={(html) => updateActiveNote({ content: html })} 
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
