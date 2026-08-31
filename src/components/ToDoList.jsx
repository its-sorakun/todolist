import ToDoItem from './ToDoItem';

export default function ToDoList({ items, toggleComplete, deleteItem, editItem }) {
  if (items.length === 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500">
        <svg className="w-24 h-24 mb-6 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <p className="text-2xl font-medium mb-2">You're all caught up!</p>
        <p className="text-lg">Add a new task below to get started.</p>
      </div>
    );
  }

  return (
    <div className="flex-grow overflow-y-auto max-h-[60vh] p-6 custom-scrollbar">
      <ul className="space-y-4">
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
