import { Sun, Moon, Trash2 } from 'lucide-react';

export default function Header({ darkMode, setDarkMode, title, onTitleChange, onDelete }) {
  return (
    <header className="flex justify-between items-center px-8 sm:px-12 pt-10 pb-6 transition-colors duration-300 group">
      <input 
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="text-4xl sm:text-6xl font-bold tracking-tight bg-transparent outline-none border-b-2 border-transparent focus:border-primary dark:focus:border-primary-dark transition-colors w-full mr-4 text-gray-900 dark:text-gray-100 placeholder-gray-500"
        placeholder="Note Title..."
      />
      <div className="flex items-center space-x-4 flex-shrink-0">
        <button 
          onClick={onDelete}
          className="p-4 rounded-full hover:bg-surface-variant dark:hover:bg-surface-variant-dark text-gray-500 hover:text-red-500 transition-colors focus:outline-none opacity-0 group-hover:opacity-100"
          title="Delete Note"
        >
          <Trash2 className="w-6 h-6" strokeWidth={2.5} />
        </button>
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-4 rounded-full hover:bg-surface-variant dark:hover:bg-surface-variant-dark text-gray-600 dark:text-gray-300 transition-colors focus:outline-none"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun className="w-7 h-7" strokeWidth={2.5} /> : <Moon className="w-7 h-7" strokeWidth={2.5} />}
        </button>
      </div>
    </header>
  );
}
