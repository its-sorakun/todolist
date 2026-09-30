import ToDoItem from './ToDoItem';
import { Gamepad2 } from 'lucide-react';

export default function ToDoList({ items, toggleComplete, deleteItem, editItem }) {
  if (items.length === 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-20 px-16 sm:px-24 text-center">
        <div className="bg-pink-400 p-6 brutal-border brutal-shadow rounded-full mb-6 rotate-12">
          <Gamepad2 className="w-20 h-20 text-white" strokeWidth={2} />
        </div>
        <p className="text-4xl font-black text-black dark:text-white uppercase tracking-tighter">No Objectives!</p>
        <p className="text-2xl font-bold text-gray-500 dark:text-gray-400 mt-2">Awaiting input...</p>
      </div>
    );
  }

  return (
    <ul className="flex-grow overflow-y-auto px-6 sm:px-10 py-8 space-y-6 custom-scrollbar bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9InJnYmEoMCwgMCwgMCwgMC4wNSkiLz48L3N2Zz4=')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSkiLz48L3N2Zz4=')]">
      {items.map((item, index) => (
        <ToDoItem 
          key={item.id} 
          item={item}
          index={index}
          toggleComplete={toggleComplete} 
          deleteItem={deleteItem}
          editItem={editItem}
        />
      ))}
    </ul>
  );
}
