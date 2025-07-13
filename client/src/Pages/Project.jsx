import React, { useEffect, useRef, useState } from 'react'
import axios from "axios"
import {useParams} from "react-router-dom"
import { FaCopy } from "react-icons/fa";

function Project() {

  const {id} = useParams();
  const [projectInfo, setProjectInfo] = useState(null);
  const [projectVisibility, setProjectVisibility] = useState(false);
  const projectCodeRef = useRef(null);


  const copyProjectCode = async () => {
    console.log(projectCodeRef.current.value);
    await navigator.clipboard.writeText(projectCodeRef.current.value);
    projectCodeRef.current.select();
    setTimeout(()=>{
      window.getSelection().removeAllRanges();
    }, 2000);
  }

  const toggleVisibility = async () => {
    console.log(localStorage.getItem("accessToken"))
    axios
    .patch(
      `http://localhost:8000/api/v1/project/toggleVisibilityStatus?projectId=${id}`,
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
      console.log(error);
      console.log("Couldn't toggle the visibility of the project.");
    })
  }

  useEffect(()=>{
    
    axios
    .get(`http://localhost:8000/api/v1/project/getProjectInfo?projectId=${id}`, {withCredentials: true})
    .then((res)=>{
      setProjectInfo(res.data);
      setProjectVisibility(res.data["visibilityStatus"]);
    })
    .catch((error)=>{
      console.log("Couldn't fetch project data");
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
              <div className="flex h-[30px] w-[60px] rounded-full bg-red-200"  onClick={()=>toggleVisibility()} style={{justifyContent:(projectVisibility==true ? "flex-start" : "flex-end")}}>
              <div className="h-[30px] w-[30px] rounded-full bg-blue-200"></div>
            </div>
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
                (projectInfo["tasks"].length>0) ? (
                  <div className="">

                  </div>
                ) : <div className='flex h-[100px] w-full justify-center items-center rounded border'>No Tasks Assigned</div>
              )
            }
          </div>
        </>
      }
    </div>
  )
}

export default Project
