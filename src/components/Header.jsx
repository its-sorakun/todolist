import { ClipboardList, Sun, Moon } from 'lucide-react';

export default function Header({ darkMode, setDarkMode }) {
  return (
    <header className="bg-primary text-white p-5 sm:p-8 flex justify-between items-center transition-colors duration-300">
      <h1 className="text-2xl sm:text-4xl font-bold tracking-wide flex items-center gap-3 sm:gap-4">
        <ClipboardList className="w-7 h-7 sm:w-10 sm:h-10" />
        Tasks
      </h1>
      <button 
        onClick={() => setDarkMode(!darkMode)}
        className="p-2 sm:p-3 rounded-full hover:bg-white/20 transition-colors focus:outline-none focus:ring-4 focus:ring-white/30"
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <Sun className="w-6 h-6 sm:w-8 sm:h-8" />
        ) : (
          <Moon className="w-6 h-6 sm:w-8 sm:h-8" />
        )}
      </button>
    </header>
  );
}
