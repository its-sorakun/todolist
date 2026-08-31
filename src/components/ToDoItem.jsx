import { useState } from 'react';

export default function ToDoItem({ item, toggleComplete, deleteItem, editItem }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);

  const handleEditSubmit = () => {
    if (editText.trim()) {
      editItem(item.id, editText.trim());
      setIsEditing(false);
    } else {
      setEditText(item.text);
      setIsEditing(false);
    }
  };

  return (
    <li 
      className={`flex flex-col sm:flex-row items-start sm:items-center p-5 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-200 ${
        item.completed 
          ? 'opacity-60 bg-gray-100 dark:bg-gray-800' 
          : 'hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      <div className="flex items-center w-full sm:w-auto flex-grow mb-3 sm:mb-0">
        {/* Checkbox (Custom) */}
        <button 
          onClick={() => toggleComplete(item.id)}
          className={`flex-shrink-0 w-8 h-8 mr-5 rounded-full border-2 flex items-center justify-center transition-colors focus:outline-none focus:ring-4 focus:ring-primary/30 ${
            item.completed 
              ? 'bg-primary border-primary text-white' 
              : 'border-gray-400 dark:border-gray-500 text-transparent hover:border-primary dark:hover:border-primary'
          }`}
          aria-label={item.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </button>

        {/* Content */}
        <div className="flex-grow">
          {isEditing ? (
            <input
              type="text"
              className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2 border-2 border-primary rounded-lg outline-none focus:ring-4 focus:ring-primary/20 transition-all text-lg"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEditSubmit()}
              onBlur={handleEditSubmit}
              autoFocus
            />
          ) : (
            <span 
              className={`text-xl transition-all block break-words ${
                item.completed 
                  ? 'line-through text-gray-500 dark:text-gray-400' 
                  : 'text-gray-800 dark:text-gray-200'
              }`}
            >
              {item.text}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2 self-end sm:self-center ml-13 sm:ml-4">
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="p-3 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
            title="Edit"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        )}
        <button 
          onClick={() => deleteItem(item.id)}
          className="p-3 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50"
          title="Delete"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </li>
  );
}
