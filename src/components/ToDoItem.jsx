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
      className={`group flex items-start px-6 py-4 transition-all duration-200 ${
        item.completed 
          ? 'opacity-60 bg-transparent' 
          : 'bg-surface dark:bg-surface-dark hover:bg-surface-variant dark:hover:bg-surface-variant-dark shadow-sm'
      } rounded-2xl`}
    >
      <div className="flex items-center w-full flex-grow">
        {/* Checkbox toggle */}
        <button 
          onClick={() => toggleComplete(item.id)}
          className={`flex-shrink-0 mr-4 focus:outline-none transition-transform active:scale-75 ${
            item.completed 
              ? 'text-primary dark:text-primary-dark' 
              : 'text-gray-400 hover:text-primary dark:hover:text-primary-dark'
          }`}
          aria-label={item.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {item.completed ? (
            <div className="bg-primary dark:bg-primary-dark text-white dark:text-surface-dark rounded-full p-1 shadow-sm">
              <Check className="w-6 h-6" strokeWidth={3} />
            </div>
          ) : (
            <Circle className="w-8 h-8" strokeWidth={2} />
          )}
        </button>

        {/* Content */}
        <div className="flex-grow min-w-0 flex items-center">
          {isEditing ? (
            <input
              type="text"
              className="w-full bg-transparent outline-none border-b-2 border-primary dark:border-primary-dark transition-all text-xl py-1 text-gray-900 dark:text-gray-100"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEditSubmit()}
              onBlur={handleEditSubmit}
              autoFocus
            />
          ) : (
            <span 
              className={`text-xl transition-all duration-200 block break-words py-1 ${
                item.completed 
                  ? 'line-through text-gray-500' 
                  : 'text-gray-800 dark:text-gray-100'
              }`}
            >
              {item.text}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2 ml-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200 self-center">
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="p-3 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none rounded-full hover:bg-white dark:hover:bg-black/20"
            title="Edit"
          >
            <Pencil className="w-5 h-5" strokeWidth={2.5} />
          </button>
        )}
        <button 
          onClick={() => deleteItem(item.id)}
          className="p-3 text-gray-500 hover:text-red-500 transition-colors focus:outline-none rounded-full hover:bg-white dark:hover:bg-black/20"
          title="Delete"
        >
          <Trash2 className="w-5 h-5" strokeWidth={2.5} />
        </button>
      </div>
    </li>
  );
}
