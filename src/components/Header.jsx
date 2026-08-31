import { Sun, Moon } from 'lucide-react';

export default function Header({ darkMode, setDarkMode }) {
  return (
    <header className="flex justify-between items-end px-8 pt-6 pb-2 transition-colors duration-300">
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
        Quick Notes
      </h1>
      <button 
        onClick={() => setDarkMode(!darkMode)}
        className="p-2 mb-1 rounded-full hover:bg-black/10 transition-colors focus:outline-none text-gray-700"
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun className="w-6 h-6" strokeWidth={2.5} /> : <Moon className="w-6 h-6" strokeWidth={2.5} />}
      </button>
    </header>
  );
}
