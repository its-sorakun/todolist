import ToDoItem from './ToDoItem';

export default function ToDoList({ items, toggleComplete, deleteItem, editItem }) {
  if (items.length === 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-20 px-16 sm:px-20 text-gray-400 dark:text-gray-500">
        <p className="text-2xl sm:text-3xl text-center transform -rotate-2">Nothing written here yet...</p>
      </div>
    );
  }

  return (
    <div className="flex-grow overflow-y-auto max-h-[65vh] custom-scrollbar">
      <ul className="flex flex-col">
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
