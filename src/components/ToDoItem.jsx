import { useState } from 'react';
import { Pencil, Trash2, Heart } from 'lucide-react';

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
      className={`group flex items-start px-4 py-3 transition-all duration-200 ${
        item.completed 
          ? 'opacity-70' 
          : 'hover:bg-white/20 dark:hover:bg-white/5'
      } rounded-xl mx-2`}
    >
      <div className="flex items-start w-full flex-grow mt-1">
        {/* Heart checkbox toggle */}
        <button 
          onClick={() => toggleComplete(item.id)}
          className={`flex-shrink-0 mr-3 mt-1 focus:outline-none transition-transform active:scale-75 ${
            item.completed 
              ? 'text-primary' 
              : 'text-gray-500/50 hover:text-primary'
          }`}
          aria-label={item.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {item.completed ? (
            <Heart className="w-6 h-6" fill="currentColor" strokeWidth={2} />
          ) : (
            <Heart className="w-6 h-6" strokeWidth={2} />
          )}
        </button>

        {/* Content */}
        <div className="flex-grow min-w-0">
          {isEditing ? (
            <input
              type="text"
              className="w-full bg-transparent outline-none border-b-2 border-primary transition-all text-xl py-1"
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
                  ? 'line-through opacity-50' 
                  : ''
              }`}
            >
              {item.text}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-1 ml-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="p-2 text-blue-600/80 hover:text-blue-500 transition-colors focus:outline-none"
            title="Edit"
          >
            <Pencil className="w-5 h-5" strokeWidth={2.5} />
          </button>
        )}
        <button 
          onClick={() => deleteItem(item.id)}
          className="p-2 text-red-500/80 hover:text-red-500 transition-colors focus:outline-none"
          title="Delete"
        >
          <Trash2 className="w-5 h-5" strokeWidth={2.5} />
        </button>
      </div>
    </li>
  );
}
