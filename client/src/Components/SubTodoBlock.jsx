import React, {useEffect, useState} from 'react';
import { OptionBlock } from './export.js';
import axios from 'axios';
import conf from '../config/config.js';
import { MdDelete, MdEdit, MdSave, MdCancel } from 'react-icons/md';
import { showErrorToast, showAcceptToast } from '../Utils/toastUtils.js';

function SubTodoBlock(props) {
  const { subTodoInfo } = props;
  const [showSubTodoDeleteOption, setShowSubTodoDeleteOption] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState(null);

  useEffect(()=>{
    if (isEditing){
      setEditedInfo(subTodoInfo);
    }
  }, [isEditing]);

  const deleteSubTodo = () => {
    axios
    .delete(`${conf.serverUrl}/api/v1/subTodo/removeSubTodo?projectId=${subTodoInfo.projectId}&todoId=${subTodoInfo.todoId}&subTodoId=${subTodoInfo._id}`, {
      headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`},
      withCredentials: true,
    })
    .then((res)=>{
      console.log(res.data);
      showAcceptToast("SubTodo deleted successfully");
    })
    .catch((err)=>{
      console.log(err);
      showErrorToast("Failed to delete SubTodo");
    })
    .finally(()=>{
      setShowSubTodoDeleteOption(false);
    })
  }

  const editDetails = ()=>{
    axios
    .patch(
      `${conf.serverUrl}/api/v1/subTodo/updateSubTodo`,
      {
        projectId : subTodoInfo.projectId,
        todoId : subTodoInfo.todoId,
        subTodoId: subTodoInfo._id,
        subTodoTitle: editedInfo.title,
        description: editedInfo.description,
      },
      {
        headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`},
        withCredentials: true,
      },
    )
    .then((res)=>{
      console.log(res.data);
      showAcceptToast("SubTodo updated successfully");
    })
    .catch((err)=>{
      console.log(err);
      showErrorToast("Failed to update SubTodo");
    })
    .finally(()=>{
      setIsEditing(false);
    })
  }

  return (
    <>
      <div className="w-full max-w-md p-4 rounded-lg shadow-sm bg-white border border-gray-200">
        <div className="flex gap-5 w-full justify-end">
          {/* Delete Button */}
          {!isEditing && <MdDelete className='h-7 w-7 text-2xl text-red-500 bg-black rounded-full p-1' onClick={(e) => {e.stopPropagation(); setShowSubTodoDeleteOption(true);}} />}
          {/* Update Button */}
          {!isEditing && <MdEdit className='h-7 w-7 text-2xl text-blue-500 bg-black rounded-full p-1' onClick={()=>setIsEditing(true)}/>}
          {/* Save Button */}
          {isEditing && <MdSave className='h-7 w-7 text-2xl text-green-500 bg-black rounded-full p-1' onClick={()=>editDetails()}/>}
          {/* Cancel Button */}
          {isEditing && <MdCancel className='h-7 w-7 text-2xl text-red-500 bg-black rounded-full p-1' onClick={()=>setIsEditing(false)}/>}
        </div>

        {
          !isEditing ? 
          <>
            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{subTodoInfo.title}</h3>
            <p className=''>{subTodoInfo.description}</p>

            {/* Status and Done By */}
            <div className="flex justify-between text-sm text-gray-700">
              <div>
                <span className="font-medium">Status: </span>{subTodoInfo.status}
              </div>
            </div>
          </> : 
          <div className='flex flex-col'>
            <input type="text" placeholder="Enter SubTodo title" value={editedInfo?.title ? editedInfo.title : ""} onChange={(e)=>setEditedInfo({...editedInfo, title: e.target.value})}/>
            <input type="text" placeholder="Enter SubTodo description" value={editedInfo?.description ? editedInfo.description : ""} onChange={(e)=>setEditedInfo({...editedInfo, description: e.target.value})}/>
          </div>
        }
      </div>

      {/* Delete Option */}
      {showSubTodoDeleteOption && <OptionBlock mainText="Delete Sub Todo" acceptText="Delete" cancelText="Cancel" acceptCallback={deleteSubTodo} cancelCallback={()=>setShowSubTodoDeleteOption(false)}/>}
    </>
  );
}

export default SubTodoBlock;
