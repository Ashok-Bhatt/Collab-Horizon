import React from 'react';
import { useNavigate } from 'react-router-dom';

function ProjectBlock(props) {
  const { projectInfo } = props;
  const projectImage = projectInfo.projectImage || "/Images/default_project.png";
  const navigate = useNavigate();

  return (
    <div
      className="relative w-full h-64 bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl group"
      onClick={() => navigate(`/project/${projectInfo._id}`)}
    >
      {/* Project Image and Gradient Overlay */}
      <div className="relative h-full w-full">
        <img
          src={projectImage}
          alt={projectInfo.projectName}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-70"></div>
      </div>

      {/* Project Details Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-4 transform transition-all duration-300 translate-y-full group-hover:translate-y-0">
        <div className="bg-white rounded-lg p-4 shadow-md transition-all duration-300 group-hover:bg-opacity-95">
          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-gray-900 leading-tight mb-1 truncate">
              {projectInfo.projectName}
            </h3>
            <p className="text-sm text-gray-600 truncate">
              {projectInfo.projectTagline}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectBlock;
