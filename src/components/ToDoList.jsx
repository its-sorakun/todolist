import ToDoItem from './ToDoItem';

export default function ToDoList({ items, toggleComplete, deleteItem, editItem }) {
  if (items.length === 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-16 px-8 text-gray-800/40">
        <p className="text-3xl text-center transform -rotate-3">Blank slate!</p>
      </div>
    );
  }

  return (
    <div className="flex-grow overflow-y-auto max-h-[55vh] px-2 sm:px-4">
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
