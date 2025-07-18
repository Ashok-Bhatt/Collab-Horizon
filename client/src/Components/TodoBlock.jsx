import React from 'react';
import { useNavigate } from 'react-router-dom';

function TodoBlock(props) {
  const { height = "h-[200px]", width = "w-[350px]", textSize = "text-md", todoInfo } = props;
  const todoImage = todoInfo.projectImage || "/Images/default_project.png";
  const navigate = useNavigate();

  const priorityColor = {
    Low: "bg-green-500",
    Medium: "bg-yellow-500",
    High: "bg-red-500",
  };

  const statusColor = {
    Done: "bg-green-600",
    Remaining: "bg-gray-500",
  };

  return (
    <div className={`flex flex-col ${width} rounded-lg overflow-hidden relative group border border-gray-400 cursor-pointer`} onClick={()=>navigate(`/todo?todoId=${todoInfo._id}&projectId=${todoInfo.projectId}`)}>
      {/* Image */}
      <div className={`flex w-full ${height} flex-grow rounded-lg overflow-hidden`}>
        <img src={todoImage} className='h-full w-full object-cover' alt="todo" />
      </div>

      {/* Info on hover */}
      <div className='flex flex-col bg-white h-24 absolute transition-all duration-300 -bottom-24 group-hover:bottom-0 p-2' style={{ width: '100%' }}>
        <div className={`font-bold ${textSize} truncate`}>{todoInfo.title}</div>
        <div className={`text-gray-600 ${textSize} truncate`}>{todoInfo.shortDescription}</div>
        <div className='flex justify-between items-center mt-1'>
          <span className={`text-white text-xs px-2 py-1 rounded-full ${priorityColor[todoInfo.priority]}`}>{todoInfo.priority}</span>
          <span className={`text-white text-xs px-2 py-1 rounded-full ${statusColor[todoInfo.status]}`}>{todoInfo.status}</span>
        </div>
      </div>
    </div>
  );
}

export default TodoBlock;
