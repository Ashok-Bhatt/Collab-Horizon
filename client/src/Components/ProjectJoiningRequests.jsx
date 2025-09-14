import React, { useEffect, useState } from 'react';
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import { FaBell } from "react-icons/fa";
import { OptionBlock } from "../Components/export.js";
import axios from 'axios';
import conf from "../config/config.js";
import { showAcceptToast, showErrorToast } from '../Utils/toastUtils.js';

function ProjectJoiningRequests(props) {
  const { projectInfo } = props;
  const [showRequestsBlock, setShowRequestsBlock] = useState(false);
  const [showAcceptBlock, setShowAcceptBlock] = useState(false);
  const [showRejectBlock, setShowRejectBlock] = useState(false);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (projectInfo?.projectRequests?.length > 0) {
      setSelected(new Array(projectInfo.projectRequests.length).fill(false));
    }
  }, [projectInfo]);

  const handleProjectJoiningRequest = async (response) => {
    if (!selected || selected.every(item => item === false)) {
      showErrorToast("Please select at least one request.");
      return;
    }

    try {
      const promises = selected.map((isSelected, index) => {
        if (isSelected) {
          const requestId = projectInfo.projectRequests[index]._id;
          return axios.delete(
            `${conf.serverUrl}/api/v1/project/handleProjectJoiningRequest?projectId=${projectInfo._id}&requestId=${requestId}&isRequestAccepted=${response}`,
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
              },
              withCredentials: true,
            }
          );
        }
        return Promise.resolve(); // Return a resolved promise for unselected items
      });

      await Promise.all(promises);
      showAcceptToast("Project Joining Requests Processed.");
      setShowAcceptBlock(false);
      setShowRejectBlock(false);
      setShowRequestsBlock(false);
      setSelected([]);
    } catch (error) {
      showErrorToast("Failed to process requests.");
    }
  };

  const toggleCheckbox = (index) => {
    const newSelected = [...selected];
    newSelected[index] = !newSelected[index];
    setSelected(newSelected);
  };

  const handleAcceptClick = () => {
    if (selected.some(item => item === true)) {
      setShowAcceptBlock(true);
    } else {
      showErrorToast("Please select requests to accept.");
    }
  };

  const handleRejectClick = () => {
    if (selected.some(item => item === true)) {
      setShowRejectBlock(true);
    } else {
      showErrorToast("Please select requests to reject.");
    }
  };

  const totalRequests = projectInfo?.projectRequests?.length || 0;
  const isSelected = selected.some(item => item === true);

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className="relative p-2 rounded-full text-blue-600 hover:bg-gray-200 transition-colors duration-200"
        onClick={() => setShowRequestsBlock((prev) => !prev)}
      >
        <FaBell className="text-2xl" />
        {totalRequests > 0 && (
          <div className="absolute top-0 right-0 inline-flex items-center justify-center h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full transform translate-x-1/4 -translate-y-1/4">
            {totalRequests}
          </div>
        )}
      </button>

      {showRequestsBlock && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 bg-white rounded-lg shadow-xl z-20 flex flex-col overflow-hidden animate-fade-in-down">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-800">Joining Requests</h3>
            <button onClick={() => setShowRequestsBlock(false)} className="text-gray-400 hover:text-gray-600">
              <RxCross2 className="text-xl" />
            </button>
          </div>

          <div className="flex-grow p-4 overflow-y-auto custom-scrollbar">
            {totalRequests === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                <FaBell className="text-5xl mb-2" />
                <p>No new requests.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {projectInfo.projectRequests.map((request, requestIndex) => (
                  <div
                    key={request._id}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors duration-200 ${selected[requestIndex] ? 'bg-blue-50 border-blue-400' : 'bg-gray-50 hover:bg-gray-100 border-gray-200'}`}
                    onClick={() => toggleCheckbox(requestIndex)}
                  >
                    <input
                      type="checkbox"
                      checked={selected[requestIndex]}
                      onChange={() => toggleCheckbox(requestIndex)}
                      className="mt-1 h-4 w-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <div className="flex-grow">
                      <p className="font-semibold text-gray-800 break-words">{request.requesterName}</p>
                      <p className="text-sm text-gray-600 break-words line-clamp-2">{request.requestText || "No message provided."}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={`p-4 border-t border-gray-200 transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-50'}`}>
            <div className="flex gap-2">
              <button
                className="flex-grow py-2 px-4 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleAcceptClick}
                disabled={!isSelected}
              >
                <TiTick className="inline-block mr-1 text-xl" />
                Accept
              </button>
              <button
                className="flex-grow py-2 px-4 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleRejectClick}
                disabled={!isSelected}
              >
                <RxCross2 className="inline-block mr-1 text-xl" />
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {showAcceptBlock && (
        <OptionBlock
          mainText={`Are you sure you want to accept ${selected.filter(Boolean).length} request(s)?`}
          acceptText="Accept"
          cancelText="Cancel"
          acceptCallback={() => handleProjectJoiningRequest(true)}
          cancelCallback={() => setShowAcceptBlock(false)}
        />
      )}
      {showRejectBlock && (
        <OptionBlock
          mainText={`Are you sure you want to reject ${selected.filter(Boolean).length} request(s)?`}
          acceptText="Reject"
          cancelText="Cancel"
          acceptCallback={() => handleProjectJoiningRequest(false)}
          cancelCallback={() => setShowRejectBlock(false)}
        />
      )}
    </div>
  );
}

export default ProjectJoiningRequests;