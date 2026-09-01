import ToDoItem from './ToDoItem';
import { ListTodo } from 'lucide-react';

export default function ToDoList({ items, toggleComplete, deleteItem, editItem }) {
  if (items.length === 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-20 px-16 sm:px-24 text-center">
        <ListTodo className="w-20 h-20 mb-6 text-primary opacity-40 animate-pulse" strokeWidth={1} />
        <p className="text-2xl font-bold opacity-60">Empty!</p>
        <p className="text-lg opacity-50 mt-2">No tasks yet.</p>
      </div>
    );
  }

  return (
    <ul className="flex-grow overflow-y-auto px-4 py-2 space-y-1 custom-scrollbar">
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
