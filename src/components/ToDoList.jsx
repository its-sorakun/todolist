import ToDoItem from './ToDoItem';

export default function ToDoList({ items, toggleComplete, deleteItem, editItem }) {
  if (items.length === 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-12 sm:py-20 px-4 text-gray-400 dark:text-gray-500">
        <svg className="w-16 h-16 sm:w-24 sm:h-24 mb-4 sm:mb-6 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
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
