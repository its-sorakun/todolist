import { useState } from 'react';
import { Pencil, Trash2, Check, Circle } from 'lucide-react';

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
      className={`group flex items-center pl-16 sm:pl-20 pr-4 sm:pr-6 py-3 sm:py-4 border-b border-blue-200 dark:border-blue-800/50 transition-all duration-200 ${
        item.completed 
          ? 'opacity-70' 
          : 'hover:bg-blue-50/40 dark:hover:bg-blue-900/20'
      }`}
    >
      <div className="flex items-center w-full flex-grow">
        {/* Hand-drawn style checkbox toggle */}
        <button 
          onClick={() => toggleComplete(item.id)}
          className={`flex-shrink-0 mr-4 focus:outline-none transition-colors ${
            item.completed 
              ? 'text-primary' 
              : 'text-gray-300 dark:text-gray-600 hover:text-primary dark:hover:text-primary'
          }`}
          aria-label={item.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {item.completed ? (
            <Check className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={3} />
          ) : (
            <Circle className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2} />
          )}
        </button>

        {/* Content */}
        <div className="flex-grow min-w-0">
          {isEditing ? (
            <input
              type="text"
              className="w-full bg-transparent text-gray-900 dark:text-gray-100 outline-none focus:border-b-2 focus:border-primary transition-all text-xl sm:text-2xl"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEditSubmit()}
              onBlur={handleEditSubmit}
              autoFocus
            />
          ) : (
            <span 
              className={`text-xl sm:text-2xl transition-all duration-200 block break-words ${
                item.completed 
                  // Scribble-out effect for completed items
                  ? 'line-through decoration-wavy decoration-2 decoration-gray-400 dark:decoration-gray-500 text-gray-500 dark:text-gray-400' 
                  : 'text-gray-800 dark:text-gray-200'
              }`}
            >
              {item.text}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-1 sm:space-x-2 ml-4 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="p-2 text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors focus:outline-none"
            title="Edit"
          >
            <Pencil className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
          </button>
        )}
        <button 
          onClick={() => deleteItem(item.id)}
          className="p-2 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors focus:outline-none"
          title="Delete"
        >
          <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
        </button>
      </div>
    </li>
  );
}
