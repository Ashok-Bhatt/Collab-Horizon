import React, { useContext, useRef, useState } from 'react'
import { UserContext } from '../Contexts/export.js'
import {ProjectBlock} from "../Components/export.js"
import { FaPlus } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import conf from '../config/config.js';
import {showAcceptToast, showErrorToast} from "../Utils/toastUtils.js"

function Dashboard() {

  const {user} = useContext(UserContext);  
  const navigate = useNavigate();
  const projectCodeRef = useRef(null);
  const requestMessageRef = useRef(null);
  const [showProjectRequestBlock, setShowProjectRequestBlock] = useState(false);

  const sendProjectJoiningRequest = () => {
    
    axios
    .post(
      `${conf.serverUrl}/api/v1/project/sendProjectJoiningRequest`,
      {
        projectCode : projectCodeRef.current.value,
        requestText : requestMessageRef.current.value,
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
      setShowProjectRequestBlock(false);
    })
  }

  return (
    <div className='flex flex-col p-2 gap-y-10 bg-yellow-50 h-full w-full relative'>
      <div className='flex justify-between px-15'>
        <p className='text-3xl font-semibold'>Your Projects</p>
        <FaPlus className='rounded-full text-black text-3xl hover:cursor-pointer hover:text-blue-600' onClick={()=>navigate("/addProject")}/>
      </div>
      <div className='flex w-full'>
        <input type="text" className='flex-grow' placeholder='Enter the project code to join new project' ref={projectCodeRef}/>
        <button className='bg-green-500' onClick={()=>setShowProjectRequestBlock(true)}>Join</button>
      </div>
      <div className='flex max-h-full flex-wrap gap-2 justify-start content-start overflow-y-auto'>
        {
          user?.projects.map((project)=>(
            <ProjectBlock height="h-[200px]" width="min-w-[350px]" textSize="text-md" projectInfo={project} key={project._id}/>
          ))
        }
      </div>

      {showProjectRequestBlock && <div className="absolute top-1/2 left-1/2 -translate-1/2 bg-white">
        <textarea rows="10" cols="100" ref={requestMessageRef} placeholder='Write some message while sending project joining request. It enhances the chances of request getting accepted by 65%'></textarea>
        <div className="flex justify-around">
          <button onClick={sendProjectJoiningRequest}>Send Request</button>
          <button onClick={()=>setShowProjectRequestBlock(false)}>Cancel Request</button>
        </div>
      </div>}
    </div>
  )
}

export default Dashboard
