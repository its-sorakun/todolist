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
      className={`group flex items-start px-4 py-2 transition-all duration-200 ${
        item.completed 
          ? 'opacity-70' 
          : 'hover:bg-black/5'
      } rounded-lg`}
    >
      <div className="flex items-start w-full flex-grow mt-1">
        {/* Hand-drawn style checkbox toggle */}
        <button 
          onClick={() => toggleComplete(item.id)}
          className={`flex-shrink-0 mr-3 mt-1 focus:outline-none transition-colors ${
            item.completed 
              ? 'text-primary' 
              : 'text-gray-700/40 hover:text-primary'
          }`}
          aria-label={item.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {item.completed ? (
            <Check className="w-6 h-6" strokeWidth={3} />
          ) : (
            <Circle className="w-6 h-6" strokeWidth={2} />
          )}
        </button>

        {/* Content */}
        <div className="flex-grow min-w-0">
          {isEditing ? (
            <input
              type="text"
              className="w-full bg-transparent text-gray-900 outline-none border-b-2 border-primary transition-all text-2xl"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEditSubmit()}
              onBlur={handleEditSubmit}
              autoFocus
            />
          ) : (
            <span 
              className={`text-2xl transition-all duration-200 block break-words ${
                item.completed 
                  // Scribble-out effect for completed items
                  ? 'line-through decoration-wavy decoration-2 decoration-gray-600 text-gray-600' 
                  : 'text-gray-900'
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
            className="p-2 text-blue-700/60 hover:text-blue-900 transition-colors focus:outline-none"
            title="Edit"
          >
            <Pencil className="w-5 h-5" strokeWidth={2.5} />
          </button>
        )}
        <button 
          onClick={() => deleteItem(item.id)}
          className="p-2 text-red-700/60 hover:text-red-900 transition-colors focus:outline-none"
          title="Delete"
        >
          <Trash2 className="w-5 h-5" strokeWidth={2.5} />
        </button>
      </div>
    </li>
  );
}
