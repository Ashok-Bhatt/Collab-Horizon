import React, { useEffect, useRef, useState } from 'react'
import axios from "axios"
import {useNavigate, useParams} from "react-router-dom"
import { FaCopy, FaPlus } from "react-icons/fa";
import { toast, Zoom } from 'react-toastify';
import {useForm} from "react-hook-form";
import {Input, Select, DateInput, TodoBlock, ToggleButton} from "../Components/export.js"
import conf from "../config/config.js";

function Project() {

  const {id} = useParams();
  const projectCodeRef = useRef(null);
  const [showTodoCreationBlock, setShowTodoCreationBlock] = useState(false);
  const [projectInfo, setProjectInfo] = useState(null);
  const [projectVisibility, setProjectVisibility] = useState(false);

  const {
    register,
    formState: {errors},
    handleSubmit
  } = useForm();


  const copyProjectCode = async () => {
    await navigator.clipboard.writeText(projectCodeRef.current.value);
    projectCodeRef.current.select();
    setTimeout(()=>{
      window.getSelection().removeAllRanges();
    }, 2000);
  }

  const showErrorText = (toastText) => { 
    toast.error(toastText, {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Zoom,
    })
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
      showErrorText(projectVisibility ? "Couldn't make project private" : "Couldn't make project public")
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
      showErrorText("Couldn't fetch project info");
    })
  }, [])

  return (
    <div className='flex flex-col h-full w-full p-2 gap-y-5'>
      {
        projectInfo && <>
          <div className="flex justify-between items-center">
            <div className="">
              <h2 className='text-3xl font-bold'>{projectInfo["projectName"]}</h2>
              <h3 className='text-sm italic'>{projectInfo["projectTagline"]}</h3>
            </div>
            <div className="flex gap-x-5 items-center">
              <p className="text-lg text-gray-400">{projectVisibility ? "Public" : "Private"}</p>
              <ToggleButton toggleState={projectVisibility} toggleCallback={toggleVisibility}/>
            </div>
          </div>
          <div className="flex w-full border rounded-lg overflow-hidden">
            <p className='px-5 py-1 h-full border-r'>Project Code</p>
            <input className='px-5 py-1 h-full flex-grow border-r' value={projectInfo["uniqueCode"]} readOnly={true} ref={projectCodeRef}></input>
            <div className='px-3 py-1'>
              <FaCopy className='h-full' onClick={()=>copyProjectCode()}/>
            </div>
          </div>
          {projectInfo["projectDescription"] && <p>{projectInfo["projectDescription"]}</p>}
          <div className="flex flex-col w-full gap-y-2">
            <h3 className='text-3xl'>Tasks</h3>
            {
              projectInfo && (
                (projectInfo["tasks"]?.length>0) ? (
                  <div className="flex flex-wrap gap-x-2">
                    {
                      projectInfo["tasks"].map((task)=>(
                        <TodoBlock todoInfo={task} key={task?._id} />
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
            <form className="flex flex-col gap-y-2">
              <Input placeholder="Title" inputType="text" {...register("todoTitle", {required: "Todo title is required"})} errorObj={errors.todoTitle}/>
              <Input placeholder="Short Description shown with title" inputType="text" {...register("shortDescription")} errorObj={null}/>
              <Input placeholder="Detailed Description about project" inputType="text" {...register("detailedDescription")} errorObj={null}/>
              <DateInput placeholder="Deadline" {...register("deadline", {required: "Todo title is required"})} errorObj={errors.deadline}/>
              <Select label="Priority" options={["Low", "Medium", "High"]} {...register("priority", {required: "Priority is required"})} errorObj={errors.priority}/>
            </form>
          </div>
        </>
      }
    </div>
  )
}

export default Project
