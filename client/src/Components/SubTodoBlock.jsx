import React, {useState} from 'react';
import { OptionBlock } from './export.js';
import axios from 'axios';
import conf from '../config/config.js';
import { MdDelete } from 'react-icons/md';

function SubTodoBlock(props) {
  const { subTodoInfo } = props;
  const [showSubTodoDeleteOption, setShowSubTodoDeleteOption] = useState(false);

  const deleteSubTodo = () => {
    axios
    .delete(`${conf.serverUrl}/api/v1/subTodo/removeSubTodo?projectId=${subTodoInfo.projectId}&todoId=${subTodoInfo.todoId}&subTodoId=${subTodoInfo._id}`, {
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
      setShowSubTodoDeleteOption(false);
    })
  }

  return (
    <>
      <div className="w-full max-w-md p-4 rounded-lg shadow-sm bg-white border border-gray-200">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{subTodoInfo.title}</h3>

        {/* Status and Done By */}
        <div className="flex justify-between text-sm text-gray-700">
          <div>
            <span className="font-medium">Status: </span>{subTodoInfo.status}
          </div>
        </div>

        {/* Delete Button */}
        <MdDelete className='h-10 w-10 z-10 text-2xl text-red-500 bg-black rounded-full p-1' onClick={(e) => {e.stopPropagation(); setShowSubTodoDeleteOption(true);}} />
      </div>

      {/* Delete Option */}
      {showSubTodoDeleteOption && <OptionBlock mainText="Delete Sub Todo" acceptText="Delete" cancelText="Cancel" acceptCallback={deleteSubTodo} cancelCallback={()=>setShowSubTodoDeleteOption(false)}/>}
    </>
  );
}

export default SubTodoBlock;
