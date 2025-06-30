import React, { useContext, useState } from 'react'
import { UserContext } from '../Contexts/export.js'
import {ProjectBlock} from "../Components/export.js"
import { FaPlus } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

function Dashboard() {

  const {user} = useContext(UserContext);  
  const navigate = useNavigate();

  return (
    <div className='flex flex-col p-2 gap-y-10 bg-yellow-50 h-full w-full'>
      <div className='flex justify-between px-15'>
        <p className='text-3xl font-semibold'>Your Projects</p>
        <FaPlus className='rounded-full text-black text-3xl hover:cursor-pointer hover:text-blue-600' onClick={()=>navigate("/addProject")}/>
      </div>
      <div className='flex max-h-full flex-wrap gap-2 justify-start content-start overflow-y-auto'>
        {
          user?.projects.map((project)=>(
            <ProjectBlock height="h-[200px]" width="min-w-[350px]" textSize="text-md" projectInfo={project} key={project._id}/>
          ))
        }
      </div>
    </div>
  )
}

export default Dashboard
