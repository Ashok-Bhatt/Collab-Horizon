import React from 'react'
import { useNavigate } from 'react-router-dom';

function ProjectBlock(props) {

    const {height="h-[200px]", width="w-[350px]", textSize="text-md", projectInfo} = props;
    const projectImage = projectInfo.projectImage || "/Images/default_project.png";
    const navigate = useNavigate();

  return (
    <div className={`flex flex-col ${width} rounded-lg overflow-hidden relative group border border-gray-500`} style={{backgroundColor:projectInfo.backgroundColor, foregroundColor:projectInfo.foregroundColor}} onClick={()=>navigate(`/project/${projectInfo._id}`)}>
      <div className={`flex w-[full] ${height} flex-grow rounded-lg overflow-hidden`}>
        <img src={projectImage} className='h-full w-full'/>
      </div>
      <div className='flex flex-col bg-blue-300 h-20 absolute transition-all duration-300 -bottom-20 group-hover:bottom-0 p-2'  style={{width: '100%'}}>
        <div className={`flex justify-start font-bold items-center overflow-hidden ${textSize}`}>{projectInfo.projectName}</div>
        <div className={`flex justify-start items-center text-gray-600 overflow-hidden ${textSize}`}>{projectInfo.projectTagline}</div>
      </div>
    </div>
  )
}

export default ProjectBlock