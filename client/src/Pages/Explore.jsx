import React, { useState, useEffect } from 'react';
import axios from 'axios';
import conf from '../config/config.js';
import { Notifications, ProjectBlock } from '../Components/export.js';
import { showErrorToast } from '../Utils/toastUtils.js';

function Explore() {
  const [publicProjects, setPublicProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicProjects = async () => {
      try {
        const response = await axios.get(`${conf.serverUrl}/api/v1/project/getPublicProjects`);
        setPublicProjects(response.data.data);
      } catch (err) {
        console.error("Failed to fetch public projects:", err);
        setError("Failed to load projects. Please try again later.");
        showErrorToast("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProjects();
  }, []);

  return (
    <div className='flex flex-col h-full w-full'>

      <div className="flex w-full">
        <h1 className="mb-6 flex-grow text-3xl font-bold text-gray-800">Explore Public Projects</h1>
        <Notifications />
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading projects...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : publicProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 p-5">
          {publicProjects.map(project => (
            <ProjectBlock projectInfo={project} key={project._id}/>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">No public projects available.</div>
      )}
    </div>
  );
}

export default Explore;