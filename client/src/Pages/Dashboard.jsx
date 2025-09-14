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
      showAcceptToast("Project Joining Request Sent");
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
    <div className='flex flex-col flex-grow w-full overflow-y-auto p-4 md:p-8 bg-gray-50 relative'>
      <header className='flex justify-between items-center py-4 px-6 md:px-10 border-b border-gray-200 mb-6'>
        <h1 className='text-3xl font-bold text-gray-800'>Your Projects</h1>
        <button 
          className='p-3 rounded-full text-white bg-blue-500 hover:bg-blue-600 transition-colors duration-200 shadow-md' 
          onClick={()=>navigate("/addProject")}
        >
          <FaPlus className='text-xl' />
        </button>
      </header>

      <div className='flex w-full max-w-2xl mx-auto space-x-2 mb-8'>
        <input 
          type="text" 
          className='flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200' 
          placeholder='Enter a project code to join' 
          ref={projectCodeRef}
        />
        <button 
          className='bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md' 
          onClick={()=>setShowProjectRequestBlock(true)}
        >
          Join
        </button>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-6 md:p-10'>
        {user?.projects.map((project) => (
          <ProjectBlock projectInfo={project} key={project._id} />
        ))}
      </div>

      {showProjectRequestBlock && (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm'>
          <div className='bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full'>
            <h2 className='text-2xl font-bold text-gray-800 mb-4'>Join Project</h2>
            <p className='text-gray-600 mb-4'>Write a message to the project owner to enhance your chances of joining.</p>
            <textarea 
              rows="5" 
              className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-4' 
              ref={requestMessageRef} 
              placeholder='Write a message while sending the project joining request. It enhances the chances of the request being accepted.'
            ></textarea>
            <div className='flex justify-end space-x-4'>
              <button 
                onClick={()=>setShowProjectRequestBlock(false)}
                className='bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors duration-200'
              >
                Cancel
              </button>
              <button 
                onClick={sendProjectJoiningRequest}
                className='bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200'
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard