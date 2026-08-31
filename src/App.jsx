import { useState, useEffect } from 'react';
import Header from './components/Header';
import ToDoList from './components/ToDoList';

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
    <div className="min-h-screen flex justify-center items-start pt-4 sm:pt-12 px-2 sm:px-4 pb-12">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-colors duration-300 border border-gray-100 dark:border-gray-700">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        
        <ToDoList
          items={items}
          toggleComplete={toggleComplete}
          deleteItem={deleteItem}
          editItem={editItem}
        />
        
        <div className="p-4 sm:p-8 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <form className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4" onSubmit={handleAdd}>
            <input
              type="text"
              className="flex-grow px-4 py-3 sm:px-6 sm:py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl text-base sm:text-lg outline-none focus:border-primary dark:focus:border-primary transition-colors text-gray-900 dark:text-gray-100 placeholder-gray-400"
              placeholder="What needs to be done?"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button 
              type="submit" 
              className="px-6 py-3 sm:px-8 sm:py-4 bg-primary hover:bg-primary-hover text-white rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 focus:outline-none focus:ring-4 focus:ring-primary/30"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Task</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
