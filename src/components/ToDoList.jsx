import ToDoItem from './ToDoItem';
import { CheckCircle2 } from 'lucide-react';

export default function ToDoList({ items, toggleComplete, deleteItem, editItem }) {
  if (items.length === 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-12 sm:py-20 px-4 text-gray-400 dark:text-gray-500">
        <CheckCircle2 className="w-16 h-16 sm:w-24 sm:h-24 mb-4 sm:mb-6 opacity-30" strokeWidth={1} />
        <p className="text-xl sm:text-2xl font-medium mb-1 sm:mb-2 text-center">You're all caught up!</p>
        <p className="text-base sm:text-lg text-center">Add a new task below to get started.</p>
      </div>
    );
  }

  return (
    <div className="flex-grow overflow-y-auto max-h-[60vh] p-4 sm:p-6 custom-scrollbar">
      <ul className="space-y-3 sm:space-y-4">
        {items.map((item) => (
          <ToDoItem
            key={item.id}
            item={item}
            toggleComplete={toggleComplete}
            deleteItem={deleteItem}
            editItem={editItem}
          />
        ))}
      </ul>
    </div>
  );
}
