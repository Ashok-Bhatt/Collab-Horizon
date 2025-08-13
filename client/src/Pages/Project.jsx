import React, { useEffect, useRef, useState, useContext } from 'react'
import axios from "axios"
import {useParams} from "react-router-dom"
import { FaCopy, FaPlus } from "react-icons/fa";
import { showErrorToast,  showAcceptToast } from '../Utils/toastUtils.js';
import {useForm} from "react-hook-form";
import {Input, Select, DateInput, TodoBlock, ToggleButton, OptionBlock, ProjectJoiningRequests} from "../Components/export.js"
import conf from "../config/config.js";

function Project() {

  const {id} = useParams();
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
    register : todoRegister,
    formState: {errors : todoErrors},
    handleSubmit : todoHandleSubmit
  } = useForm();

  const {
    register : projectRegister,
    formState: {errors : projectErrors},
    handleSubmit: projectHandleSubmit,
    reset: projectReset
  } = useForm();

  const copyProjectCode = async () => {
    await navigator.clipboard.writeText(projectCodeRef.current.value);
    projectCodeRef.current.select();
    setTimeout(()=>{
      window.getSelection().removeAllRanges();
    }, 2000);
  }

  const copySrcCodeLink = async () => {
    await navigator.clipboard.writeText(srcCodeLinkRef.current.value);
    srcCodeLinkRef.current.select();
    setTimeout(()=>{
      window.getSelection().removeAllRanges();
    }, 2000);
  }

  const toggleVisibility = async () => {
    axios
    .patch(
      `${conf.serverUrl}/api/v1/project/toggleVisibilityStatus?projectId=${id}`,
      {},
      {
        headers: {'Authorization' : `Bearer ${localStorage.getItem("accessToken")}`},
        withCredentials: true,
      }
    )
    .then((res)=>{
      setProjectVisibility((prev)=>!prev)
    })
    .catch((error)=>{
      showErrorToast(projectVisibility ? "Couldn't make project private" : "Couldn't make project public")
    })
  }

  const deleteProject = () => {
    axios
    .delete(
      `${conf.serverUrl}/api/v1/project/removeProject?projectId=${id}`,
      {
        headers: {'Authorization' : `Bearer ${localStorage.getItem("accessToken")}`},
        withCredentials: true,
      }
    )
    .then((res)=>{
      console.log("project deleted!");
      showAcceptToast("Project deleted successfully");
    })
    .catch((error)=>{
      console.log("project not deleted!");
      showErrorToast("Failed to delete project");
    })
  }

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
            headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`},
            withCredentials: true,
        }
    )
    .then((res)=>{
      console.log(res.data);
      showAcceptToast("Todo created successfully");
    })
    .catch((error)=>{
        console.log(error);
        showErrorToast("Couldn't create new todo");
    })
    .finally(()=>{
      setShowTodoCreationBlock(false);
    })
  }

  const submitUpdateProject = (data) => {
    const formData = new FormData();
    formData.append("projectId", projectInfo._id);
    if (data.projectName) formData.append("projectName", data.projectName);
    if (data.projectTagline) formData.append("projectTagline", data.projectTagline);
    if (data.projectDescription) formData.append("projectDescription", data.projectDescription);
    if (data.projectImage) formData.append("projectImage", data.projectImage[0]);

    axios.patch(
        `${conf.serverUrl}/api/v1/project/changeProjectInfo`,
        formData,
        {
            headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`},
            withCredentials: true,
        }
    )
    .then((res)=>{ 
      console.log(res.data);
      showAcceptToast("Project Updated Successfully");
    })
    .catch((error)=>{
        console.log(error);
        showErrorToast("Couldn't update project");
    })
    .finally(()=>{
      setIsEditing(false);
    })
  }

  const sendProjectJoiningRequest = (requestMessage) => {
    
    axios
    .post(
      `${conf.serverUrl}/api/v1/project/sendProjectJoiningRequest`,
      {
        projectCode : projectInfo.uniqueCode,
        requestText : requestMessage,
      },
      {
        headers : { 
          'Content-Type' : 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
        },
        withCredentials: true,
      }
    )
    .then((res)=>{
      showAcceptToast("Project Joining Request Send");
    })
    .catch((error)=>{
      console.log(error);
      showErrorToast("Couldn't Send Project Joining Request");
    })
    .finally(()=>{
      setShowRequestSendingBlock(false);
    })
  }

  useEffect(()=>{
    
    axios
    .get(`${conf.serverUrl}/api/v1/project/getProjectInfo?projectId=${id}`, {withCredentials: true})
    .then((res)=>{
      setProjectInfo(res.data.data[0]);
      setProjectVisibility(res.data.data[0]["visibilityStatus"]);
    })
    .catch((error)=>{
      showErrorToast("Couldn't fetch project info");
    })
  }, [])

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
    <>
      <div className='flex flex-col h-full w-full p-2 gap-y-5'>
        {
          projectInfo && <>
            {!isEditing ? (
              // Display mode
              <>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col gap-2 flex-grow">
                    <h2 className='text-3xl font-bold'>{projectInfo["projectName"]}</h2>
                    <h3 className='text-sm italic'>{projectInfo["projectTagline"]}</h3>
                  </div>
                  <div className="flex gap-x-5 items-center">
                    <p className="text-lg text-gray-400">{projectVisibility ? "Public" : "Private"}</p>
                    <ToggleButton toggleState={projectVisibility} toggleCallback={toggleVisibility}/>
                  </div>
                </div>
                <ProjectJoiningRequests projectInfo={projectInfo}/>
                {projectInfo["projectImage"] && <img className='rounded-lg w-full' src={projectInfo["projectImage"]}/>}
                <p className='text-sm'>{projectInfo["projectDescription"]}</p>
                <div className="flex w-full border rounded-lg overflow-hidden">
                  <p className='px-5 py-1 h-full border-r'>Project Code</p>
                  <input className='px-5 py-1 h-full flex-grow border-r' value={projectInfo["uniqueCode"]} readOnly={true} ref={projectCodeRef}></input>
                  <div className='px-3 py-1'>
                    <FaCopy className='h-full' onClick={()=>copyProjectCode()}/>
                  </div>
                </div>
                {projectInfo["srcCodeLink"] && <div className="flex w-full border rounded-lg overflow-hidden">
                  <p className='px-5 py-1 h-full border-r'>Source Code Link</p>
                  <input className='px-5 py-1 h-full flex-grow border-r' value={projectInfo["srcCodeLink"]} readOnly={true} ref={srcCodeLinkRef}></input>
                  <div className='px-3 py-1'>
                    <FaCopy className='h-full' onClick={()=>copySrcCodeLink()}/>
                  </div>
                </div>}
                <div className="">
                  <button type='button' className='bg-red-500' onClick={()=>setShowProjectDeleteOption(true)}>Delete Project</button>
                  <button type='button' className='bg-green-500' onClick={()=>setIsEditing(true)}>Update Project</button>
                </div>
                <button className='bg-orange-500' onClick={()=>setShowRequestSendingBlock(true)}>Join Project</button>
              </>
            ) : (
              // Edit mode
              <form className='flex flex-col gap-2' onSubmit={projectHandleSubmit(submitUpdateProject)}>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col gap-2 flex-grow">
                    <Input placeholder="Enter Project Name" inputType="text" {...projectRegister("projectName")} errorObj={projectErrors.projectName} />
                    <Input placeholder="Enter Project Tagline" inputType="text" {...projectRegister("projectTagline")} errorObj={projectErrors.projectTagline} />
                  </div>
                  <div className="flex gap-x-5 items-center">
                    <p className="text-lg text-gray-400">{projectVisibility ? "Public" : "Private"}</p>
                    <ToggleButton toggleState={projectVisibility} toggleCallback={toggleVisibility}/>
                  </div>
                </div>
                <Input placeholder="Enter Project Image" inputType="file" {...projectRegister("projectImage")} errorObj={projectErrors.projectImage}/>
                <Input placeholder="Enter Project Description" inputType="text" {...projectRegister("projectDescription")} errorObj={projectErrors.projectDescription}/>
                <div className="flex w-full border rounded-lg overflow-hidden">
                  <p className='px-5 py-1 h-full border-r'>Project Code</p>
                  <input className='px-5 py-1 h-full flex-grow border-r' value={projectInfo["uniqueCode"]} readOnly={true} ref={projectCodeRef}></input>
                  <div className='px-3 py-1'>
                    <FaCopy className='h-full' onClick={()=>copyProjectCode()}/>
                  </div>
                </div>
                <div className="">
                  <button type='submit' className="bg-green-500">Save</button>
                  <button type='button' className="bg-red-500" onClick={()=>setIsEditing(false)}>Cancel</button>
                </div>
              </form>
            )}

            <div className="flex flex-col w-full gap-y-2">
              <div className='w-full flex justify-between'>
                <h3 className='text-3xl'>Tasks</h3>
                {projectInfo["tasks"]?.length>0 && <FaPlus className='mt-2 text-3xl' onClick={()=>setShowTodoCreationBlock(true)}/>}
              </div>
              {
                projectInfo && (
                  (projectInfo["tasks"]?.length>0) ? (
                    <div className="flex flex-wrap gap-x-2">
                      {
                        projectInfo["tasks"].map((task)=>(
                          <TodoBlock todoInfo={task} key={task?._id} showDeleteButton={true}/>
                        ))
                      }
                    </div>
                  ) : (
                  <div className='flex flex-col bg-gray-300 h-[200px] w-full justify-center items-center rounded border'>
                    <div className="text-3xl">No Tasks Available</div>
                    <div className="mt-5 text-xl">Add a new task</div>
                    <FaPlus className='mt-2 text-3xl' onClick={()=>setShowTodoCreationBlock(true)}/>
                  </div>
                  )
                )
              }
            </div>
            
            <div className="flex flex-col absolute bg-white top-1/2 left-1/2 -translate-1/2 w-1/2 rounded-lg border items-center p-2 gap-y-5" style={{visibility: (showTodoCreationBlock) ? "visible" : "hidden"}}>
              <h2 className="text-3xl">Add Todo</h2>
              <form className="flex flex-col gap-y-2" onSubmit={todoHandleSubmit(submitAddTodo)}>
                <Input placeholder="Title" inputType="text" {...todoRegister("todoTitle", {required: "Todo title is required"})} errorObj={todoErrors.todoTitle}/>
                <Input placeholder="Short Description shown with title" inputType="text" {...todoRegister("shortDescription")} errorObj={null}/>
                <Input placeholder="Detailed Description about project" inputType="text" {...todoRegister("detailedDescription")} errorObj={null}/>
                <DateInput placeholder="Deadline" {...todoRegister("deadline", {required: "Todo deadline is required"})} errorObj={todoErrors.deadline}/>
                <Select label="Priority" options={["Low", "Medium", "High"]} {...todoRegister("priority", {required: "Priority is required"})} errorObj={todoErrors.priority}/>

                <div className="flex justify-between">
                  <button type='submit' className="bg-green-400">Add Todo</button>
                  <button type='button' onClick={()=>setShowTodoCreationBlock(false)} className="bg-red-400">Cancel</button>
                </div>
              </form>
            </div>
            {showProjectDeleteOption && <OptionBlock mainText="Do you want to delete this project?" acceptText="Delete" cancelText="Cancel" acceptCallback={deleteProject} cancelCallback={()=>setShowProjectDeleteOption(false)}/>}
            
            {
              showRequestSendingBlock && <div className='flex flex-col absolute top-1/2 left-1/2 -translate-1/2 bg-blue-300 '>
                <textarea rows="5" cols="100" ref={messageRef} placeholder='Enter message you want to send along project joining request'></textarea>
                <button className='bg-green-500' onClick={()=>sendProjectJoiningRequest(messageRef.current.value)}>Send</button>
                <button className='bg-red-500' onClick={()=>setShowRequestSendingBlock(false)}>Cancel</button>
              </div>
            }
          </>
        }
      </div>
    </>
  )
}

export default Project
