import { useState, useEffect } from 'react';
import Header from './components/Header';
import ToDoList from './components/ToDoList';
import { Plus } from 'lucide-react';

export default function App() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('todo_items');
    return saved ? JSON.parse(saved) : [];
  });

  const [inputValue, setInputValue] = useState('');

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('todo_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('todo_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('todo_theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newItem = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false,
    };

    setItems([...items, newItem]);
    setInputValue('');
  };

  const toggleComplete = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const editItem = (id, newText) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, text: newText } : item
      )
    );
  };

  return (
    <div className="min-h-screen flex justify-center items-start pt-6 sm:pt-16 px-2 sm:px-6 pb-12 overflow-hidden">
      {/* 
        This is the main "Sheet of Paper".
        Notice the absolute positioned red line that simulates the margin. 
      */}
      <div className="w-full max-w-2xl bg-[#fdfbf7] dark:bg-slate-800 shadow-2xl relative transition-colors duration-300 font-paper text-xl border border-gray-200 dark:border-slate-700">
        
        {/* The Red Margin Line typical of notebook paper */}
        <div className="absolute top-0 bottom-0 left-12 sm:left-16 w-[2px] bg-red-400 dark:bg-red-800 opacity-60 pointer-events-none z-0"></div>

        <div className="relative z-10 flex flex-col h-full">
          <Header darkMode={darkMode} setDarkMode={setDarkMode} />
          
          <ToDoList
            items={items}
            toggleComplete={toggleComplete}
            deleteItem={deleteItem}
            editItem={editItem}
          />
          
          <div className="border-t-2 border-blue-400/50 dark:border-blue-700/50 transition-colors duration-300">
            <form className="flex items-center space-x-2 pl-16 sm:pl-20 pr-4 py-4" onSubmit={handleAdd}>
              <input
                type="text"
                className="flex-grow px-2 py-1 bg-transparent outline-none text-2xl sm:text-3xl text-gray-800 dark:text-gray-200 placeholder-gray-400/60 dark:placeholder-gray-500/60"
                placeholder="Write a new task..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button 
                type="submit" 
                className="px-4 py-2 text-primary hover:text-primary-hover font-bold text-xl transition-colors focus:outline-none flex items-center gap-1"
              >
                <Plus strokeWidth={3} className="w-6 h-6" />
                <span className="hidden sm:inline">Add</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
