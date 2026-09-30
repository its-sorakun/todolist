import { Sun, Moon, Trash2 } from 'lucide-react';

export default function Header({ darkMode, setDarkMode, title, onTitleChange, onDelete }) {
  return (
    <header className="flex justify-between items-center px-8 pt-2 pb-2 transition-colors duration-300 border-b border-black/10 dark:border-white/10 mx-6 mb-2 group">
      <input 
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="text-3xl font-bold tracking-tight bg-transparent outline-none border-b-2 border-transparent focus:border-primary transition-colors w-full mr-4 text-gray-900 dark:text-gray-100 placeholder-gray-500"
        placeholder="Note Title..."
      />
      <div className="flex items-center space-x-2 flex-shrink-0">
        <button 
          onClick={onDelete}
          className="p-2 rounded-full hover:bg-red-500/20 text-red-500 transition-colors focus:outline-none opacity-0 group-hover:opacity-100"
          title="Delete Note"
        >
          <Trash2 className="w-5 h-5" strokeWidth={2.5} />
        </button>
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full hover:bg-white/20 dark:hover:bg-black/20 transition-colors focus:outline-none"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun className="w-6 h-6 text-yellow-200" strokeWidth={2.5} /> : <Moon className="w-6 h-6 text-blue-800" strokeWidth={2.5} />}
        </button>
      </div>
    </header>
  );
}
