import React, { useEffect, useState } from 'react'
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import {OptionBlock} from "../Components/export.js";
import axios from 'axios';
import conf from "../config/config.js" 
import { showAcceptToast, showErrorToast } from '../Utils/toastUtils.js';

function ProjectJoiningRequests(props) {

    const {projectInfo} = props;
    const [showRequestsBlock, setShowRequestsBlock] = useState(false);
    const [showAcceptBlock, setShowAcceptBlock] = useState(false);
    const [showRejectBlock, setShowRejectBlock] = useState(false);
    const [selected, setSelected] = useState(null);

    useEffect(()=>{
        if (projectInfo?.projectRequests?.length > 0){
            setSelected(new Array(projectInfo.projectRequests.length).fill(false));
        }
    }, [projectInfo])

    const handleProjectJoiningRequest = async (response) => {
        
        // Check if selected array exists and has any selected items
        if (!selected || !Array.isArray(selected)) {
            showErrorToast("No requests selected");
            return;
        }
        
        const selectedRequests = selected.filter(item => item === true);
        if (selectedRequests.length === 0) {
            showErrorToast("Please select at least one request");
            return;
        }
        
        try {
            // Process all selected requests
            const promises = [];
            for (let i = 0; i < selected.length; i++) {
                if (selected[i]) {
                    const requestId = projectInfo.projectRequests[i]._id;
                    console.log(`Processing request: ${requestId}`);
                    
                    const promise = axios
                    .delete(
                        `${conf.serverUrl}/api/v1/project/handleProjectJoiningRequest?projectId=${projectInfo._id}&requestId=${requestId}&isRequestAccepted=${response}`,
                        {
                            headers: { 
                                'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
                            },
                            withCredentials: true,
                        }
                    )
                    .then(()=>{
                        console.log(`request resolved: ${requestId}`);
                    })
                    .catch((error)=>{
                        console.log(`request not resolved: ${requestId}`);
                    });
                    promises.push(promise);
                }
            }
            
            // Wait for all requests to complete
            const results = await Promise.all(promises);
            console.log("All requests processed:", results);
            showAcceptToast("Project Joining Requests Resolved Successfully");
            
            // Reset selected state
            setSelected(new Array(projectInfo.projectRequests.length).fill(false));
            
        } catch (error) {
            console.error("Error handling project joining requests:", error);
            showErrorToast("Failed to resolve some requests");
        }
    }

    const toggleCheckbox = (index) => {
        const newSelected = [...selected];
        newSelected[index] = !newSelected[index];
        setSelected(newSelected);
    }

  return (
    <div className="flex justify-end w-full">
        <div className="relative">
            <img className="h-[30px] w-[30px] rounded-full"
                src="/Images/requests_logo.jpg"
                onClick={() => setShowRequestsBlock((prev) => !prev)}
                alt="Requests Logo"
            />
            {projectInfo.projectRequests?.length>0 && <div className='flex justify-center items-center rounded-full absolute h-[15px] w-[15px] bg-red-500 text-white -translate-1/2 text-sm' style={{top: `${15 + 15*Math.sin(Math.PI/4)}px`, left: `${15 + 15*Math.cos(Math.PI/4)}px`}}>{projectInfo.projectRequests.length}</div>}
            {showRequestsBlock && (
                <div className="flex flex-col absolute top-10 right-0 w-[250px] h-[400px] bg-red-100 z-20 overflow-y-scroll overflow-x-hidden" style={{justifyContent: projectInfo.projectRequests?.length==0 ? 'center' : 'flex-start', alignItems:'center'}}>
                    <div className="w-full flex-grow">
                        {
                            projectInfo.projectRequests?.length == 0 ? (<div className='text-gray-400'>No Project Joining Requests</div>) : (<>
                                {
                                    projectInfo.projectRequests?.map((request, requestIndex)=>(
                                        <div className="flex items-center w-full bg-green-200 p-2 gap-2" onClick={()=>toggleCheckbox(requestIndex)} key={request._id}>
                                            <input type="checkbox" checked={selected[requestIndex]} onChange={()=>toggleCheckbox(requestIndex)}/>
                                            <div className="text-lg">{request._id}</div>
                                        </div>
                                    ))
                                }
                            </>)
                        }
                    </div>
                    <div className='w-full'>
                        <button className='bg-red-500' onClick={()=>handleProjectJoiningRequest(true)}>Accept</button>
                        <button className='bg-green-500' onClick={()=>handleProjectJoiningRequest(false)}>Reject</button>
                    </div>
                </div>
            )}
        </div>
        {showAcceptBlock && <OptionBlock mainText="Accept Project Joining Request?" acceptText="Accept Request" cancelText="Cancel" acceptCallback={()=>handleProjectJoiningRequest(true)} cancelCallback={()=>setShowAcceptBlock(false)}/>}
        {showRejectBlock && <OptionBlock mainText="Reject Project Joining Request?" acceptText="Reject Request" cancelText="Cancel" acceptCallback={()=>handleProjectJoiningRequest(false)} cancelCallback={()=>setShowRejectBlock(false)}/>}
    </div>
  )
}

export default ProjectJoiningRequests