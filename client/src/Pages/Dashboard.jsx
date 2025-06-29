import React, { useContext } from 'react'
import { UserContext } from '../Contexts/export.js'
import {ProjectBlock} from "../Components/export.js"

function Dashboard() {

  const {user} = useContext(UserContext);
  console.log(user?.projects);

  return (
    <div className='flex flex-col p-2 gap-y-5 bg-yellow-50 h-full w-full'>
        <p className='text-3xl font-semibold'>Your Projects</p>
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
