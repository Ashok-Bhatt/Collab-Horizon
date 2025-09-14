import React, { useEffect, useRef, useState, useContext } from 'react';
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaCopy, FaPlus, FaEdit, FaTrashAlt, FaTimes } from "react-icons/fa";
import { showErrorToast, showAcceptToast } from '../Utils/toastUtils.js';
import { useForm } from "react-hook-form";
import { Input, Select, DateInput, TodoBlock, ToggleButton, OptionBlock, ProjectJoiningRequests } from "../Components/export.js";
import conf from "../config/config.js";

function Project() {
  const { id } = useParams();
  const projectCodeRef = useRef(null);
  const srcCodeLinkRef = useRef(null);
  const messageRef = useRef(null);
  const [showTodoCreationBlock, setShowTodoCreationBlock] = useState(false);
  const [projectInfo, setProjectInfo] = useState(null);
  const [projectVisibility, setProjectVisibility] = useState(false);
  const [showProjectDeleteOption, setShowProjectDeleteOption] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showRequestSendingBlock, setShowRequestSendingBlock] = useState(false);

  const {
    register: todoRegister,
    formState: { errors: todoErrors },
    handleSubmit: todoHandleSubmit,
    reset: todoReset,
  } = useForm();

  const {
    register: projectRegister,
    formState: { errors: projectErrors },
    handleSubmit: projectHandleSubmit,
    reset: projectReset,
  } = useForm();

  const copyProjectCode = async () => {
    await navigator.clipboard.writeText(projectCodeRef.current.value);
    showAcceptToast("Project code copied!");
  };

  const copySrcCodeLink = async () => {
    await navigator.clipboard.writeText(srcCodeLinkRef.current.value);
    showAcceptToast("Source code link copied!");
  };

  const toggleVisibility = async () => {
    axios
      .patch(
        `${conf.serverUrl}/api/v1/project/toggleVisibilityStatus?projectId=${id}`,
        {},
        {
          headers: { 'Authorization': `Bearer ${localStorage.getItem("accessToken")}` },
          withCredentials: true,
        }
      )
      .then((res) => {
        setProjectVisibility((prev) => !prev);
      })
      .catch((error) => {
        showErrorToast(projectVisibility ? "Couldn't make project private" : "Couldn't make project public");
      });
  };

  const deleteProject = () => {
    axios
      .delete(
        `${conf.serverUrl}/api/v1/project/removeProject?projectId=${id}`,
        {
          headers: { 'Authorization': `Bearer ${localStorage.getItem("accessToken")}` },
          withCredentials: true,
        }
      )
      .then((res) => {
        showAcceptToast("Project deleted successfully");
        // Redirect or handle UI after deletion
      })
      .catch((error) => {
        showErrorToast("Failed to delete project");
      });
  };

  const submitAddTodo = (data) => {
    const formData = new FormData();
    formData.append("projectId", id);
    formData.append("todoTitle", data.todoTitle);
    formData.append("deadline", data.deadline);
    formData.append("priority", data.priority);
    if (data.shortDescription) formData.append("shortDescription", data.shortDescription);
    if (data.detailedDescription) formData.append("detailedDescription", data.detailedDescription);

    axios.post(
      `${conf.serverUrl}/api/v1/mainTodo/addTodo`,
      formData,
      {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("accessToken")}` },
        withCredentials: true,
      }
    )
      .then((res) => {
        showAcceptToast("Todo created successfully");
        setProjectInfo((prev) => ({
          ...prev,
          tasks: [...prev.tasks, res.data.data]
        }));
      })
      .catch((error) => {
        showErrorToast("Couldn't create new todo");
      })
      .finally(() => {
        setShowTodoCreationBlock(false);
        todoReset();
      });
  };

  const submitUpdateProject = (data) => {
    const formData = new FormData();
    formData.append("projectId", projectInfo._id);
    if (data.projectName) formData.append("projectName", data.projectName);
    if (data.projectTagline) formData.append("projectTagline", data.projectTagline);
    if (data.projectDescription) formData.append("projectDescription", data.projectDescription);
    if (data.projectImage && data.projectImage.length > 0) formData.append("projectImage", data.projectImage[0]);

    axios.patch(
      `${conf.serverUrl}/api/v1/project/changeProjectInfo`,
      formData,
      {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("accessToken")}` },
        withCredentials: true,
      }
    )
      .then((res) => {
        setProjectInfo(res.data.data);
        showAcceptToast("Project Updated Successfully");
      })
      .catch((error) => {
        showErrorToast("Couldn't update project");
      })
      .finally(() => {
        setIsEditing(false);
      });
  };

  const sendProjectJoiningRequest = (requestMessage) => {
    axios
      .post(
        `${conf.serverUrl}/api/v1/project/sendProjectJoiningRequest`,
        {
          projectCode: projectInfo.uniqueCode,
          requestText: requestMessage,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        showAcceptToast("Project Joining Request Sent");
      })
      .catch((error) => {
        showErrorToast("Couldn't Send Project Joining Request");
      })
      .finally(() => {
        setShowRequestSendingBlock(false);
      });
  };

  useEffect(() => {
    axios
      .get(`${conf.serverUrl}/api/v1/project/getProjectInfo?projectId=${id}`, { withCredentials: true })
      .then((res) => {
        setProjectInfo(res.data.data[0]);
        setProjectVisibility(res.data.data[0]["visibilityStatus"]);
      })
      .catch((error) => {
        showErrorToast("Couldn't fetch project info");
      });
  }, [id]);

  useEffect(() => {
    if (isEditing && projectInfo) {
      projectReset({
        projectName: projectInfo.projectName || "",
        projectTagline: projectInfo.projectTagline || "",
        projectDescription: projectInfo.projectDescription || "",
      });
    }
  }, [isEditing, projectInfo, projectReset]);

  return (
    <div className='flex flex-col h-full w-full p-6 md:p-10 gap-y-8 bg-gray-50 text-gray-800'>
      {projectInfo && (
        <>
          <div className="flex flex-col gap-6 p-6 md:p-8 bg-white rounded-2xl shadow-lg">
            {!isEditing ? (
              // Display mode
              <>
                <div className="flex justify-between items-start gap-4 flex-wrap">
                  <div className="flex-grow">
                    <h2 className='text-4xl font-extrabold mb-1'>{projectInfo["projectName"]}</h2>
                    <h3 className='text-lg italic text-gray-600'>{projectInfo["projectTagline"]}</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-md font-semibold px-3 py-1 rounded-full ${projectVisibility ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {projectVisibility ? "Public" : "Private"}
                    </span>
                    <ToggleButton toggleState={projectVisibility} toggleCallback={toggleVisibility} />
                  </div>
                </div>

                <ProjectJoiningRequests projectInfo={projectInfo} />

                {projectInfo["projectImage"] && (
                  <img className='rounded-xl w-full max-h-96 object-cover shadow-md' src={projectInfo["projectImage"]} alt="Project Banner" />
                )}

                <div className="prose max-w-none text-gray-700 leading-relaxed">
                  <p>{projectInfo["projectDescription"]}</p>
                </div>

                <div className="flex flex-col gap-4 mt-4">
                  <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <span className='px-4 py-2 font-semibold text-gray-600 whitespace-nowrap'>Project Code:</span>
                    <input className='flex-grow px-4 py-2 bg-transparent text-gray-900 focus:outline-none' value={projectInfo["uniqueCode"]} readOnly={true} ref={projectCodeRef} />
                    <button onClick={copyProjectCode} className='p-3 text-gray-600 hover:text-blue-500 transition-colors duration-200'>
                      <FaCopy className='text-lg' />
                    </button>
                  </div>
                  {projectInfo["srcCodeLink"] && (
                    <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      <span className='px-4 py-2 font-semibold text-gray-600 whitespace-nowrap'>Source Code:</span>
                      <input className='flex-grow px-4 py-2 bg-transparent text-blue-500 underline focus:outline-none' value={projectInfo["srcCodeLink"]} readOnly={true} ref={srcCodeLinkRef} onClick={copySrcCodeLink} />
                      <button onClick={copySrcCodeLink} className='p-3 text-gray-600 hover:text-blue-500 transition-colors duration-200'>
                        <FaCopy className='text-lg' />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 mt-6">
                  <button type='button' className='flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-200' onClick={() => setIsEditing(true)}>
                    <FaEdit /> Update Project
                  </button>
                  <button type='button' className='flex items-center gap-2 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors duration-200' onClick={() => setShowProjectDeleteOption(true)}>
                    <FaTrashAlt /> Delete Project
                  </button>
                  <button type='button' className='flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors duration-200' onClick={() => setShowRequestSendingBlock(true)}>
                    <FaPlus /> Join Project
                  </button>
                </div>
              </>
            ) : (
              // Edit mode
              <form className='flex flex-col gap-6' onSubmit={projectHandleSubmit(submitUpdateProject)}>
                <div className="flex justify-between items-start gap-4 flex-wrap">
                  <div className="flex flex-col gap-4 flex-grow">
                    <Input placeholder="Project Name" inputType="text" {...projectRegister("projectName")} errorObj={projectErrors.projectName} />
                    <Input placeholder="Project Tagline" inputType="text" {...projectRegister("projectTagline")} errorObj={projectErrors.projectTagline} />
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-md font-semibold px-3 py-1 rounded-full ${projectVisibility ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {projectVisibility ? "Public" : "Private"}
                    </span>
                    <ToggleButton toggleState={projectVisibility} toggleCallback={toggleVisibility} />
                  </div>
                </div>
                <Input placeholder="Project Image" inputType="file" {...projectRegister("projectImage")} errorObj={projectErrors.projectImage} />
                <Input placeholder="Project Description" inputType="textarea" {...projectRegister("projectDescription")} errorObj={projectErrors.projectDescription} />
                <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                  <span className='px-4 py-2 font-semibold text-gray-600'>Project Code:</span>
                  <input className='flex-grow px-4 py-2 bg-transparent text-gray-900 focus:outline-none' value={projectInfo["uniqueCode"]} readOnly={true} ref={projectCodeRef} />
                  <button onClick={copyProjectCode} className='p-3 text-gray-600 hover:text-blue-500 transition-colors duration-200'>
                    <FaCopy className='text-lg' />
                  </button>
                </div>
                <div className="flex gap-4 mt-6">
                  <button type='submit' className="flex-grow px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors duration-200">Save</button>
                  <button type='button' className="flex-grow px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors duration-200" onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
              </form>
            )}
          </div>

          {/* Tasks Section */}
          <div className="flex flex-col gap-4 p-6 md:p-8 bg-white rounded-2xl shadow-lg mt-8">
            <div className='w-full flex justify-between items-center'>
              <h3 className='text-3xl font-extrabold text-gray-800'>Tasks</h3>
              <button onClick={() => setShowTodoCreationBlock(true)} className='p-3 rounded-full text-white bg-blue-500 hover:bg-blue-600 transition-colors duration-200 shadow-md'>
                <FaPlus className='text-xl' />
              </button>
            </div>
            {projectInfo["tasks"]?.length > 0 ? (
              <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
                {projectInfo["tasks"].map((task) => (
                  <TodoBlock todoInfo={task} key={task?._id} showDeleteButton={true} />
                ))}
              </div>
            ) : (
              <div className='flex flex-col bg-gray-100 h-[200px] w-full justify-center items-center rounded-xl border border-dashed border-gray-300'>
                <div className="text-xl font-semibold text-gray-500">No Tasks Available</div>
                <div className="mt-2 text-md text-gray-400">Add a new task to get started</div>
                <button onClick={() => setShowTodoCreationBlock(true)} className='mt-4 p-3 rounded-full text-blue-500 bg-blue-100 hover:bg-blue-200 transition-colors duration-200'>
                  <FaPlus className='text-2xl' />
                </button>
              </div>
            )}
          </div>

          {/* Modals */}
          {showTodoCreationBlock && (
            <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm'>
              <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-xl w-full relative">
                <button className='absolute top-4 right-4 text-gray-400 hover:text-gray-600' onClick={() => setShowTodoCreationBlock(false)}>
                  <FaTimes className='text-xl' />
                </button>
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Add New Task</h2>
                <form className="flex flex-col gap-4" onSubmit={todoHandleSubmit(submitAddTodo)}>
                  <Input placeholder="Task Title" inputType="text" {...todoRegister("todoTitle", { required: "Todo title is required" })} errorObj={todoErrors.todoTitle} />
                  <Input placeholder="Short Description" inputType="text" {...todoRegister("shortDescription")} />
                  <Input placeholder="Detailed Description" inputType="textarea" {...todoRegister("detailedDescription")} />
                  <DateInput placeholder="Deadline" {...todoRegister("deadline", { required: "Todo deadline is required" })} errorObj={todoErrors.deadline} />
                  <Select label="Priority" options={["Low", "Medium", "High"]} {...todoRegister("priority", { required: "Priority is required" })} errorObj={todoErrors.priority} />
                  <div className="flex justify-end gap-4 mt-4">
                    <button type='button' onClick={() => setShowTodoCreationBlock(false)} className="px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-colors duration-200">Cancel</button>
                    <button type='submit' className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors duration-200">Add Task</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showProjectDeleteOption && (
            <OptionBlock
              mainText="Are you sure you want to delete this project?"
              acceptText="Delete"
              cancelText="Cancel"
              acceptCallback={deleteProject}
              cancelCallback={() => setShowProjectDeleteOption(false)}
            />
          )}

          {showRequestSendingBlock && (
            <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm'>
              <div className='bg-white p-8 rounded-2xl shadow-2xl max-w-lg w-full relative'>
                <button className='absolute top-4 right-4 text-gray-400 hover:text-gray-600' onClick={() => setShowRequestSendingBlock(false)}>
                  <FaTimes className='text-xl' />
                </button>
                <h2 className='text-2xl font-bold mb-4'>Join Project</h2>
                <p className='text-gray-600 mb-4'>Enter a message to send with your joining request.</p>
                <textarea rows="5" ref={messageRef} className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none' placeholder='Enter your message here...'></textarea>
                <div className='flex justify-end space-x-4 mt-4'>
                  <button className='px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors duration-200' onClick={() => setShowRequestSendingBlock(false)}>Cancel</button>
                  <button className='px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-200' onClick={() => sendProjectJoiningRequest(messageRef.current.value)}>Send Request</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Project;