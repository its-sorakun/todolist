import { Sun, Moon, Trash2 } from 'lucide-react';

export default function Header({ darkMode, setDarkMode, title, onTitleChange, onDelete }) {
  return (
    <header className="flex justify-between items-center px-8 sm:px-10 pt-10 pb-6 transition-colors duration-300 group border-b-4 border-black dark:border-white bg-yellow-300 dark:bg-pink-600">
      <input 
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="text-4xl sm:text-6xl font-black tracking-tighter bg-transparent outline-none w-full mr-4 text-black dark:text-white placeholder-black/50 dark:placeholder-white/50 uppercase"
        placeholder="TITLE..."
      />
      <div className="flex items-center space-x-4 flex-shrink-0">
        <button 
          onClick={onDelete}
          className="p-3 bg-white dark:bg-slate-900 brutal-border brutal-shadow-sm hover:brutal-shadow hover:-translate-y-1 active:translate-y-0 text-red-500 rounded-xl transition-all focus:outline-none opacity-0 group-hover:opacity-100"
          title="Delete Note"
        >
          <Trash2 className="w-7 h-7" strokeWidth={3} />
        </button>
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-3 bg-white dark:bg-slate-900 brutal-border brutal-shadow-sm hover:brutal-shadow hover:-translate-y-1 active:translate-y-0 text-black dark:text-white rounded-xl transition-all focus:outline-none"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun className="w-7 h-7" strokeWidth={3} /> : <Moon className="w-7 h-7" strokeWidth={3} />}
        </button>
      </div>
    </header>
  );
}
