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
    <div className="min-h-screen flex justify-center items-center p-4 sm:p-12 overflow-hidden">
      
      {/* The Sticky Note Container */}
      <div className="w-full max-w-md bg-[#fdf39b] dark:bg-[#d0c151] shadow-[10px_15px_25px_rgba(0,0,0,0.4)] dark:shadow-[10px_15px_30px_rgba(0,0,0,0.8)] relative transition-all duration-300 font-paper text-gray-800 dark:text-gray-900 transform sm:rotate-2 rotate-0 pb-6 rounded-br-3xl">
        
        {/* Push Pin constructed purely with divs */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center drop-shadow-lg">
           <div className="w-7 h-7 rounded-full bg-red-600 shadow-inner relative border border-red-800">
             <div className="absolute top-1 left-1 w-2.5 h-2.5 bg-red-300 rounded-full opacity-60"></div>
           </div>
           <div className="w-1 h-4 bg-gradient-to-b from-gray-300 to-gray-500 -mt-1 shadow-sm"></div>
        </div>

        <div className="relative z-10 flex flex-col h-full mt-4">
          <Header darkMode={darkMode} setDarkMode={setDarkMode} />
          
          <ToDoList
            items={items}
            toggleComplete={toggleComplete}
            deleteItem={deleteItem}
            editItem={editItem}
          />
          
          <div className="pt-2 px-6 pb-2 transition-colors duration-300">
            <form className="flex items-center space-x-2 border-b-2 border-black/10 focus-within:border-black/30 transition-colors" onSubmit={handleAdd}>
              <input
                type="text"
                className="flex-grow px-2 py-1 bg-transparent outline-none text-2xl transition-colors text-gray-800 placeholder-gray-600/40"
                placeholder="Jot down a task..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button 
                type="submit" 
                className="p-2 text-primary hover:text-blue-900 font-bold transition-colors focus:outline-none"
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
