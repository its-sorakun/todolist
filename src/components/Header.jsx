import { Sun, Moon } from 'lucide-react';

export default function Header({ darkMode, setDarkMode }) {
  return (
    <header className="flex justify-between items-end pl-16 sm:pl-20 pr-6 pt-10 pb-4 border-b-2 border-blue-400 dark:border-blue-700/80 transition-colors duration-300">
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
        My Notes
      </h1>
      <button 
        onClick={() => setDarkMode(!darkMode)}
        className="p-2 mb-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors focus:outline-none text-gray-600 dark:text-gray-400"
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun className="w-6 h-6 sm:w-7 sm:h-7" /> : <Moon className="w-6 h-6 sm:w-7 sm:h-7" />}
      </button>
    </header>
  );
}
