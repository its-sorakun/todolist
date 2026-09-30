import { useState } from 'react';
import { Pencil, Trash2, Check } from 'lucide-react';

const itemColors = [
  { bg: 'bg-pink-300 dark:bg-pink-600', text: 'text-black dark:text-white' },
  { bg: 'bg-cyan-300 dark:bg-cyan-600', text: 'text-black dark:text-white' },
  { bg: 'bg-yellow-300 dark:bg-yellow-600', text: 'text-black dark:text-white' },
  { bg: 'bg-green-300 dark:bg-green-600', text: 'text-black dark:text-white' },
  { bg: 'bg-purple-300 dark:bg-purple-600', text: 'text-black dark:text-white' },
];

export default function ToDoItem({ item, index, toggleComplete, deleteItem, editItem }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);

  const color = itemColors[index % itemColors.length];

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
      className={`group flex items-start px-6 py-4 transition-all duration-200 brutal-border ${
        item.completed 
          ? 'bg-gray-200 dark:bg-slate-800 brutal-shadow-sm opacity-60 grayscale' 
          : `${color.bg} brutal-shadow hover:-translate-y-1 hover:translate-x-1`
      } rounded-xl`}
    >
      <div className="flex items-center w-full flex-grow">
        {/* Checkbox toggle */}
        <button 
          onClick={() => toggleComplete(item.id)}
          className={`flex-shrink-0 mr-4 w-8 h-8 rounded bg-white dark:bg-slate-900 brutal-border brutal-shadow-sm flex items-center justify-center focus:outline-none transition-transform active:scale-90`}
          aria-label={item.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {item.completed && (
            <Check className="w-6 h-6 text-black dark:text-white" strokeWidth={4} />
          )}
        </button>

        {/* Content */}
        <div className="flex-grow min-w-0 flex items-center">
          {isEditing ? (
            <input
              type="text"
              className={`w-full bg-white dark:bg-slate-900 brutal-border outline-none transition-all text-2xl py-2 px-3 text-black dark:text-white font-black rounded-lg`}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEditSubmit()}
              onBlur={handleEditSubmit}
              autoFocus
            />
          ) : (
            <span 
              className={`text-2xl transition-all duration-200 block break-words py-1 font-black uppercase tracking-tight ${
                item.completed 
                  ? 'line-through text-gray-500 dark:text-gray-400' 
                  : color.text
              }`}
            >
              {item.text}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2 ml-4 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200 self-center">
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="p-2 bg-white dark:bg-slate-900 brutal-border brutal-shadow-sm hover:-translate-y-1 active:translate-y-0 text-black dark:text-white rounded-lg transition-all focus:outline-none"
            title="Edit"
          >
            <Pencil className="w-5 h-5" strokeWidth={3} />
          </button>
        )}
        <button 
          onClick={() => deleteItem(item.id)}
          className="p-2 bg-white dark:bg-slate-900 brutal-border brutal-shadow-sm hover:-translate-y-1 active:translate-y-0 text-red-500 rounded-lg transition-all focus:outline-none"
          title="Delete"
        >
          <Trash2 className="w-5 h-5" strokeWidth={3} />
        </button>
      </div>
    </li>
  );
}
