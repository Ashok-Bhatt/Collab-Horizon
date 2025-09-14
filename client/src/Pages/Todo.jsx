import React, { useEffect, useRef, useState } from 'react';
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { FaPlus, FaSave, FaTimes, FaEdit } from "react-icons/fa";
import { showErrorToast, showAcceptToast } from '../Utils/toastUtils.js';
import { useForm } from "react-hook-form";
import { Input, Select, TodoBlock, ToggleButton, SubTodoBlock } from "../Components/export.js";
import conf from "../config/config.js";

function Todo() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [todoInfo, setTodoInfo] = useState(null);
  const [showSubTodoCreationBlock, setShowSubTodoCreationBlock] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  useEffect(() => {
    if (isEditing) {
      setEditedInfo(todoInfo);
    } else {
      setEditedInfo(null);
      reset();
    }
  }, [isEditing, todoInfo, reset]);

  const editTodoDetails = () => {
    const projectId = searchParams.get("projectId");
    const todoId = searchParams.get("todoId");

    axios
      .patch(
        `${conf.serverUrl}/api/v1/mainTodo/updateTodo`,
        {
          projectId: projectId,
          todoId: todoId,
          todoTitle: editedInfo.title,
          shortDescription: editedInfo.shortDescription,
          detailedDescription: editedInfo.detailedDescription,
        },
        {
          headers: { 'Authorization': `Bearer ${localStorage.getItem("accessToken")}` },
          withCredentials: true,
        },
      )
      .then((res) => {
        setTodoInfo(editedInfo);
        showAcceptToast("Todo updated successfully");
      })
      .catch((err) => {
        showErrorToast("Couldn't update todo");
      })
      .finally(() => {
        setIsEditing(false);
      });
  };

  const onSubmit = (data) => {
    const projectId = searchParams.get("projectId");
    const todoId = searchParams.get("todoId");

    const formData = new FormData();
    formData.append("subTodoTitle", data.subTodoTitle);
    formData.append("description", data.subTodoDescription);
    formData.append("projectId", projectId);
    formData.append("todoId", todoId);

    axios.post(
      `${conf.serverUrl}/api/v1/subTodo/addSubTodo`,
      formData,
      {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("accessToken")}` },
        withCredentials: true,
      }
    )
      .then((res) => {
        showAcceptToast("SubTodo created successfully");
        setTodoInfo(prev => ({ ...prev, subTodos: [...prev.subTodos, res.data.data] }));
      })
      .catch((error) => {
        showErrorToast("Couldn't create new SubTodo");
      })
      .finally(() => {
        setShowSubTodoCreationBlock(false);
        reset();
      });
  };

  useEffect(() => {
    const projectId = searchParams.get("projectId");
    const todoId = searchParams.get("todoId");

    axios
      .get(
        `${conf.serverUrl}/api/v1/mainTodo/getTodoInfo?projectId=${projectId}&todoId=${todoId}`,
        { withCredentials: true },
      )
      .then((res) => {
        setTodoInfo(res.data.data[0]);
      })
      .catch((error) => {
        showErrorToast("Couldn't fetch todo data");
      });
  }, [searchParams]);

  return (
    <div className='flex flex-col flex-grow w-full overflow-y-auto p-6 md:p-10 bg-gray-50 text-gray-800 space-y-8'>
      {todoInfo && (
        <>
          <div className="flex flex-col gap-6 p-6 md:p-8 bg-white rounded-2xl shadow-lg">
            <div className="flex justify-between items-start gap-4 flex-wrap">
              <div className="flex-grow">
                {!isEditing ? (
                  <>
                    <h2 className='text-4xl font-extrabold mb-1'>{todoInfo.title}</h2>
                    <h3 className='text-md font-semibold text-gray-600'>Priority: <span className={`font-bold ${todoInfo.priority === 'High' ? 'text-red-500' : todoInfo.priority === 'Medium' ? 'text-yellow-500' : 'text-green-500'}`}>{todoInfo.priority}</span></h3>
                  </>
                ) : (
                  <div className='flex flex-col gap-2 flex-grow'>
                    <Input
                      placeholder="Enter Todo title"
                      inputType="text"
                      value={editedInfo?.title || ""}
                      onChange={(e) => setEditedInfo({ ...editedInfo, title: e.target.value })}
                      className="text-4xl font-extrabold bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none"
                    />
                    <Select
                      label="Priority"
                      options={["Low", "Medium", "High"]}
                      value={editedInfo?.priority || todoInfo.priority}
                      onChange={(e) => setEditedInfo({ ...editedInfo, priority: e.target.value })}
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-md font-semibold px-3 py-1 rounded-full ${todoInfo.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {todoInfo.status}
                </span>
                <ToggleButton toggleState={todoInfo.status === "Completed"} toggleCallback={() => {}} />
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)} className='p-3 rounded-full text-blue-500 bg-blue-100 hover:bg-blue-200 transition-colors duration-200'>
                    <FaEdit className='text-xl' />
                  </button>
                ) : (
                  <>
                    <button onClick={editTodoDetails} className='p-3 rounded-full text-green-500 bg-green-100 hover:bg-green-200 transition-colors duration-200'>
                      <FaSave className='text-xl' />
                    </button>
                    <button onClick={() => setIsEditing(false)} className='p-3 rounded-full text-red-500 bg-red-100 hover:bg-red-200 transition-colors duration-200'>
                      <FaTimes className='text-xl' />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="prose max-w-none text-gray-700 leading-relaxed">
              {!isEditing ? (
                <>
                  {todoInfo.shortDescription && (
                    <p className='text-md font-medium'>{todoInfo.shortDescription}</p>
                  )}
                  {todoInfo.detailedDescription && (
                    <p className='text-md'>{todoInfo.detailedDescription}</p>
                  )}
                </>
              ) : (
                <div className='flex flex-col gap-4'>
                  <Input
                    placeholder="Short Description"
                    inputType="text"
                    value={editedInfo?.shortDescription || ""}
                    onChange={(e) => setEditedInfo({ ...editedInfo, shortDescription: e.target.value })}
                  />
                  <Input
                    placeholder="Detailed Description"
                    inputType="textarea"
                    value={editedInfo?.detailedDescription || ""}
                    onChange={(e) => setEditedInfo({ ...editedInfo, detailedDescription: e.target.value })}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 p-6 md:p-8 bg-white rounded-2xl shadow-lg mt-8">
            <div className='w-full flex justify-between items-center'>
              <h3 className='text-3xl font-extrabold text-gray-800'>Sub Tasks</h3>
              <button onClick={() => setShowSubTodoCreationBlock(true)} className='p-3 rounded-full text-white bg-blue-500 hover:bg-blue-600 transition-colors duration-200 shadow-md'>
                <FaPlus className='text-xl' />
              </button>
            </div>
            {todoInfo.subTodos?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {todoInfo.subTodos.map((subTodo, index) => (
                  <SubTodoBlock key={index} subTodoInfo={subTodo} />
                ))}
              </div>
            ) : (
              <div className='flex flex-col bg-gray-100 h-[200px] w-full justify-center items-center rounded-xl border border-dashed border-gray-300'>
                <div className="text-xl font-semibold text-gray-500">No Sub Tasks Available</div>
                <div className="mt-2 text-md text-gray-400">Add a new sub task to get started</div>
                <button onClick={() => setShowSubTodoCreationBlock(true)} className='mt-4 p-3 rounded-full text-blue-500 bg-blue-100 hover:bg-blue-200 transition-colors duration-200'>
                  <FaPlus className='text-2xl' />
                </button>
              </div>
            )}
          </div>

          {showSubTodoCreationBlock && (
            <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm'>
              <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-xl w-full relative animate-fade-in-up">
                <button
                  onClick={() => { setShowSubTodoCreationBlock(false); reset(); }}
                  className='absolute top-4 right-4 text-gray-400 hover:text-gray-600'
                >
                  <FaTimes className='text-xl' />
                </button>
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Add Sub-Task</h2>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                  <Input
                    placeholder="Sub-Task Title"
                    inputType="text"
                    {...register("subTodoTitle", { required: "Title is required" })}
                    errorObj={errors.subTodoTitle}
                  />
                  <Input
                    placeholder="Description"
                    inputType="textarea"
                    {...register("subTodoDescription", { required: "Description is required" })}
                    errorObj={errors.subTodoDescription}
                  />
                  <div className="flex justify-end gap-4 mt-4">
                    <button
                      type='button'
                      onClick={() => { setShowSubTodoCreationBlock(false); reset(); }}
                      className="px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type='submit'
                      className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors duration-200"
                    >
                      Add Sub-Task
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Todo;