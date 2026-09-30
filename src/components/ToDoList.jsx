import ToDoItem from './ToDoItem';
import { ListTodo } from 'lucide-react';

export default function ToDoList({ items, toggleComplete, deleteItem, editItem }) {
  if (items.length === 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-20 px-16 sm:px-24 text-center">
        <ListTodo className="w-24 h-24 mb-6 text-primary-container dark:text-primary-container-dark animate-pulse" strokeWidth={1} />
        <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">Empty!</p>
        <p className="text-xl text-gray-500 mt-2">Add some tasks below.</p>
      </div>
    );
  }

  return (
    <ul className="flex-grow overflow-y-auto px-6 sm:px-10 py-2 space-y-3 custom-scrollbar">
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
  );
}
