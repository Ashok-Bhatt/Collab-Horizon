import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import { OptionBlock } from './export.js';
import axios from 'axios';
import conf from '../config/config.js';

function TodoBlock(props) {
  const { height = "h-[200px]", width = "w-[350px]", textSize = "text-md", todoInfo, showDeleteButton = false } = props;
  const todoImage = todoInfo.projectImage || "/Images/default_project.png";
  const [showTodoDeleteOption, setShowTodoDeleteOption] = useState(false);
  const navigate = useNavigate();

  const navigateToSubTodo = () => {
    navigate(`/todo?todoId=${todoInfo._id}&projectId=${todoInfo.projectId}`);
  }

  const priorityColor = {
    Low: "bg-green-500",
    Medium: "bg-yellow-500",
    High: "bg-red-500",
  };

  const statusColor = {
    Done: "bg-green-600",
    Remaining: "bg-gray-500",
  };

  const deleteTodo = () => {
    axios
    .delete(`${conf.serverUrl}/api/v1/mainTodo/removeTodo?projectId=${todoInfo.projectId}&todoId=${todoInfo._id}`, {
      headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`},
      withCredentials: true,
    })
    .then((res)=>{
      console.log(res.data);
    })
    .catch((err)=>{
      console.log(err);
    })
    .finally(()=>{
      setShowTodoDeleteOption(false);
    })
  }

  return (
    <>
        <div className={`flex flex-col ${width} rounded-lg overflow-hidden relative group border border-gray-400 cursor-pointer`} onClick={navigateToSubTodo}>
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
        
        {/* Delete Button */}
        {showDeleteButton && <MdDelete className='absolute top-2 right-2 h-10 w-10 z-10 text-2xl text-red-500 bg-black rounded-full p-1' onClick={(e) => {e.stopPropagation(); setShowTodoDeleteOption(true);}} />}
      </div>

      {/* Delete Option */}
      {showTodoDeleteOption && <OptionBlock mainText="Delete Todo" acceptText="Delete" cancelText="Cancel" acceptCallback={deleteTodo} cancelCallback={()=>setShowTodoDeleteOption(false)}/>}
    </>
  );
}

export default TodoBlock;
