import { useState } from 'react';
import { Check, Pencil, Trash2 } from 'lucide-react';

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
      className={`flex flex-col sm:flex-row items-start sm:items-center p-4 sm:p-5 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-200 ${
        item.completed 
          ? 'opacity-60 bg-gray-100 dark:bg-gray-800' 
          : 'hover:shadow-md sm:hover:-translate-y-0.5'
      }`}
    >
      <div className="flex items-center w-full sm:w-auto flex-grow mb-3 sm:mb-0">
        {/* Checkbox (Custom) */}
        <button 
          onClick={() => toggleComplete(item.id)}
          className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 mr-3 sm:mr-5 rounded-full border-2 flex items-center justify-center transition-colors focus:outline-none focus:ring-4 focus:ring-primary/30 ${
            item.completed 
              ? 'bg-primary border-primary text-white' 
              : 'border-gray-400 dark:border-gray-500 text-transparent hover:border-primary dark:hover:border-primary'
          }`}
          aria-label={item.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          <Check className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={3} />
        </button>

        {/* Content */}
        <div className="flex-grow">
          {isEditing ? (
            <input
              type="text"
              className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 sm:px-4 sm:py-2 border-2 border-primary rounded-md sm:rounded-lg outline-none focus:ring-4 focus:ring-primary/20 transition-all text-base sm:text-lg"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEditSubmit()}
              onBlur={handleEditSubmit}
              autoFocus
            />
          ) : (
            <span 
              className={`text-lg sm:text-xl transition-all block break-words ${
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
      <div className="flex items-center space-x-2 self-end sm:self-center mt-1 sm:mt-0 sm:ml-4">
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="p-2 sm:p-3 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
            title="Edit"
          >
            <Pencil className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}
        <button 
          onClick={() => deleteItem(item.id)}
          className="p-2 sm:p-3 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50"
          title="Delete"
        >
          <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </li>
  );
}
