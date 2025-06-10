import React from 'react'

function ProjectBlock(props) {

    const {height="h-[200px]", width="w-[350px]", textSize="text-md", projectInfo} = props;

    const backgroundColor = `bg-[${projectInfo.backgroundColor}]`;
    const foregroundColor = `bg-[${projectInfo.foregroundColor}]`;
    const projectImage = projectInfo.projectImage || "/Images/default_project.png";

  return (
    <div className={`flex flex-col ${height} ${width} ${backgroundColor} ${foregroundColor} rounded-lg p-2 border border-gray-500`}>
      <div className="flex w-[full] flex-grow rounded-lg overflow-hidden">
        <img src={projectImage} className='h-full w-full'/>
      </div>
      <div className={`flex justify-center items-center w-[full] p-2 overflow-x-auto ${textSize}`}>{projectInfo.projectName}</div>
    </div>
  )
}

export default ProjectBlock