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
    <div className="min-h-screen flex justify-end items-center p-4 sm:p-12 sm:pr-24 overflow-hidden relative">
      
      {/* Frosted Glass Dashboard Panel */}
      <div className="w-full max-w-md bg-white/30 dark:bg-black/40 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(255,126,179,0.37)] border border-white/40 dark:border-white/10 rounded-3xl relative transition-all duration-300 flex flex-col max-h-[85vh] animate-float">
        
        <div className="relative z-10 flex flex-col h-full mt-4">
          <Header darkMode={darkMode} setDarkMode={setDarkMode} />
          
          <ToDoList
            items={items}
            toggleComplete={toggleComplete}
            deleteItem={deleteItem}
            editItem={editItem}
          />
          
          <div className="pt-2 px-6 pb-6 transition-colors duration-300">
            <form className="flex items-center space-x-2 border-b-2 border-black/20 dark:border-white/20 focus-within:border-primary transition-colors" onSubmit={handleAdd}>
              <input
                type="text"
                className="flex-grow px-2 py-2 bg-transparent outline-none text-xl transition-colors placeholder-gray-600 dark:placeholder-gray-400"
                placeholder="新しいタスク (New Task)..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button 
                type="submit" 
                className="p-2 text-primary hover:text-pink-600 font-bold transition-colors focus:outline-none"
                title="Add Task"
              >
                <Plus strokeWidth={3} className="w-7 h-7" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
