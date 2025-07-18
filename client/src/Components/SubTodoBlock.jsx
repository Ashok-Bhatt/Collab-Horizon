import React from 'react';

function SubTodoBlock(props) {
  const { subTodoInfo } = props;

  return (
    <div className="w-full max-w-md p-4 rounded-lg shadow-sm bg-white border border-gray-200">
      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{subTodoInfo.title}</h3>

      {/* Status and Done By */}
      <div className="flex justify-between text-sm text-gray-700">
        <div>
          <span className="font-medium">Status: </span>{subTodoInfo.status}
        </div>
      </div>
    </div>
  );
}

export default SubTodoBlock;
