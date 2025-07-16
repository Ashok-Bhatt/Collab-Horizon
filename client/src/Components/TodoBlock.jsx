import React from 'react';

function TodoBlock(props) {

  const { title, shortDescription, deadline, priority } = props;

  const formattedDeadline = deadline
    ? new Date(deadline).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'No deadline';

  return (
    <div className="w-full max-w-md p-4 rounded-xl shadow-md bg-white border border-gray-200">
      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-800 mb-1">{title}</h2>

      {/* Short Description */}
      {shortDescription && (
        <p className="text-sm text-gray-600 mb-3">{shortDescription}</p>
      )}

      {/* Deadline & Priority */}
      <div className="flex justify-between text-sm text-gray-700">
        <div>
          <span className="font-medium">Deadline: </span>
          {formattedDeadline}
        </div>
        <div>
          <span className="font-medium">Priority: </span>
          {priority}
        </div>
      </div>
    </div>
  );
}

export default TodoBlock;