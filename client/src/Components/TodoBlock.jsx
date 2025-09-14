import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import { OptionBlock } from './export.js';
import axios from 'axios';
import conf from '../config/config.js';
import { showErrorToast, showAcceptToast } from '../Utils/toastUtils.js';

function TodoBlock(props) {
  const { todoInfo, showDeleteButton = false } = props;
  const [showTodoDeleteOption, setShowTodoDeleteOption] = useState(false);
  const navigate = useNavigate();

  const navigateToSubTodo = () => {
    navigate(`/todo?todoId=${todoInfo._id}&projectId=${todoInfo.projectId}`);
  };

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
        headers: { 'Authorization': `Bearer ${localStorage.getItem("accessToken")}` },
        withCredentials: true,
      })
      .then(() => {
        showAcceptToast("Todo deleted successfully");
        // You might need to refresh the parent component's state to reflect the deletion
      })
      .catch((err) => {
        console.error(err);
        showErrorToast("Failed to delete todo");
      })
      .finally(() => {
        setShowTodoDeleteOption(false);
      });
  };

  return (
    <>
      <div
        className="flex items-center justify-between p-4 bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
        onClick={navigateToSubTodo}
      >
        <div className="flex-1 min-w-0 pr-4">
          <div className="font-semibold text-lg truncate">{todoInfo.title}</div>
          <div className="text-gray-600 text-sm truncate">{todoInfo.shortDescription}</div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-white text-xs px-2 py-1 rounded-full ${priorityColor[todoInfo.priority]}`}>{todoInfo.priority}</span>
          <span className={`text-white text-xs px-2 py-1 rounded-full ${statusColor[todoInfo.status]}`}>{todoInfo.status}</span>
        </div>
        {showDeleteButton && (
          <MdDelete
            className='h-6 w-6 text-gray-400 hover:text-red-500 transition-colors duration-200 ml-4'
            onClick={(e) => {
              e.stopPropagation();
              setShowTodoDeleteOption(true);
            }}
          />
        )}
      </div>

      {showTodoDeleteOption && (
        <OptionBlock
          mainText="Delete Todo"
          acceptText="Delete"
          cancelText="Cancel"
          acceptCallback={deleteTodo}
          cancelCallback={() => setShowTodoDeleteOption(false)}
        />
      )}
    </>
  );
}

export default TodoBlock;