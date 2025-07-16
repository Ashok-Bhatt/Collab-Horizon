import React from 'react';

function SubTodoBlock({ subTodo }) {
  const { title, status, doneBy } = subTodo;

  return (
    <div className="w-full max-w-md p-4 rounded-lg shadow-sm bg-white border border-gray-200">
      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>

      {/* Status and Done By */}
      <div className="flex justify-between text-sm text-gray-700">
        <div>
          <span className="font-medium">Status: </span>{status}
        </div>
        <div>
          <span className="font-medium">Done by: </span>
          {"None"}
        </div>
      </div>
    </div>
  );
}

export default SubTodoBlock;
