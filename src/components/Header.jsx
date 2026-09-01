import { Sun, Moon } from 'lucide-react';

export default function Header({ darkMode, setDarkMode }) {
  return (
    <header className="flex justify-between items-end px-8 pt-4 pb-2 transition-colors duration-300 border-b border-black/10 dark:border-white/10 mx-6 mb-2">
      <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
        <span>ノート</span>
        <span className="text-lg opacity-70">/ Notes</span>
      </h1>
      <button 
        onClick={() => setDarkMode(!darkMode)}
        className="p-2 mb-1 rounded-full hover:bg-white/20 dark:hover:bg-black/20 transition-colors focus:outline-none"
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun className="w-6 h-6 text-yellow-200" strokeWidth={2.5} /> : <Moon className="w-6 h-6 text-blue-800" strokeWidth={2.5} />}
      </button>
    </header>
  );
}
