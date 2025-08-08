import React, { useEffect, useRef, useState } from 'react'
import axios from "axios"
import {useNavigate, useParams, useSearchParams} from "react-router-dom"
import { FaCopy, FaPlus } from "react-icons/fa";
import { showErrorToast } from '../Utils/toastUtils.js';
import {useForm} from "react-hook-form";
import {Input, Select, DateInput, TodoBlock, ToggleButton, SubTodoBlock } from "../Components/export.js"
import conf from "../config/config.js";

function Todo() {

  const [searchParams, setSearchParams] = useSearchParams();
  const [todoInfo, setTodoInfo] = useState(null);
  const [showSubTodoCreationBlock, setShowSubTodoCreationBlock] = useState(false);

  const {
    register,
    formState: {errors},
    handleSubmit
  } = useForm();



  const onSubmit = (data)=>{
    const projectId = searchParams.get("projectId");
    const todoId = searchParams.get("todoId");

    const formData = new FormData();
    formData.append("subTodoTitle", data.subTodoTitle);
    formData.append("subTodoDescription", data.subTodoDescription);
    formData.append("projectId", projectId);
    formData.append("todoId", todoId);

    axios.post(
        `${conf.serverUrl}/api/v1/subTodo/addSubTodo`, 
        formData,
        {
            headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`},
            withCredentials: true,
        }
    )
    .then((res)=>{
      console.log(res.data);
    })
    .catch((error)=>{
        console.log(error);
        showErrorToast("Couldn't create new project");
    })
  }

  useEffect(()=>{
    const projectId = searchParams.get("projectId");
    const todoId = searchParams.get("todoId");

    axios
    .get(
      `${conf.serverUrl}/api/v1/mainTodo/getTodoInfo?projectId=${projectId}&todoId=${todoId}`,
      {withCredentials: true},
    )
    .then((res)=>{
      console.log(res.data.data[0]);
      setTodoInfo(res.data.data[0]);
    })
    .catch((error)=>{
      showErrorToast("Couldn't fetch todo data")
    })
  }, [])

  return (
    <div className='flex flex-col h-full w-full p-2 gap-y-5'>
      {
        todoInfo && <>
          <div className="flex justify-between items-center">
            <div className="">
              <h2 className='text-3xl font-bold'>{todoInfo.title}</h2>
              <h3 className='text-sm italic text-gray-500'>{`Priority: ${todoInfo.priority}`}</h3>
            </div>
            <div className="flex gap-x-5 items-center">
              <p className="text-lg text-gray-400">{todoInfo.status}</p>
              {/* You can attach a toggle callback later if needed */}
              <ToggleButton toggleState={todoInfo.status === "Completed"} toggleCallback={() => {}} />
            </div>
          </div>

          {/* Short & Detailed Description could go here if available */}
          {todoInfo.shortDescription && (
            <p className='text-md'>{todoInfo.shortDescription}</p>
          )}

          {todoInfo.detailedDescription && (
            <p className='text-md'>{todoInfo.detailedDescription}</p>
          )}

          <div className="flex flex-col w-full gap-y-2">
            <div className='w-full flex justify-between'>
              <h3 className='text-3xl'>Tasks</h3>
              {todoInfo["subTodos"]?.length>0 && <FaPlus className='mt-2 text-3xl' onClick={()=>setShowSubTodoCreationBlock(true)}/>}
            </div>
            {
              (todoInfo.subTodos && todoInfo.subTodos.length > 0) ? (
                <div className="flex flex-wrap gap-x-2">
                  {todoInfo.subTodos.map((subTodo, index) => (
                    <SubTodoBlock key={index} subTodoInfo={subTodo} />
                  ))}
                </div>
              ) : (
                <div className='flex flex-col bg-gray-300 h-[200px] w-full justify-center items-center rounded border'>
                  <div className="text-3xl">No Sub Tasks Available</div>
                  <div className="mt-5 text-xl">Add a new sub task</div>
                  <FaPlus className='mt-2 text-3xl' onClick={() => setShowSubTodoCreationBlock(true)} />
                </div>
              )
            }
          </div>

          <div className="flex flex-col absolute bg-white top-1/2 left-1/2 -translate-1/2 w-1/2 rounded-lg border items-center p-2 gap-y-5" style={{ visibility: showSubTodoCreationBlock ? "visible" : "hidden" }}>
            <h2 className="text-3xl">Add SubTodo</h2>
            <form className="flex flex-col gap-y-2" onSubmit={handleSubmit(onSubmit)}>
              <Input placeholder="Title" inputType="text" {...register("subTodoTitle", { required: "SubTodo title is required" })} errorObj={errors.subTodoTitle} />
              <Input placeholder="Description" inputType="text"{...register("subTodoDescription", { required: "Description is required" })} errorObj={errors.subTodoDescription}
              />

              <div className="flex justify-between">
                <button type='submit' className="bg-green-400">Add SubTodo</button>
                <button type='button' onClick={()=>setShowSubTodoCreationBlock(false)} className="bg-red-400">Cancel</button>
              </div>
            </form>
          </div>

        </>
      }
    </div>
  );
}

export default Todo
