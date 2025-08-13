import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../Contexts/export.js';
import { showErrorToast, showAcceptToast } from '../Utils/toastUtils.js';
import conf from "../config/config.js";

function AddProject(props) {

    const {
        register,
        handleSubmit,
        formState: {isSubmitting, errors},
    } = useForm();

    const navigate = useNavigate();
    const {user, changeUser} = useContext(UserContext);
    console.log(user);

    const onSubmit = async (data)=>{

        const formData = new FormData();

        formData.append('projectName', data.projectName);
        formData.append('projectTagline', data.projectTagline);
        formData.append('projectDescription', data.email);
        formData.append('srcCodeLink', data.scrCodeLink);
        if (data.projectImage) formData.append('projectImage', data.projectImage[0]);
        if (data.startDate) formData.append('startDate', data.startDate);
        if (data.deadline) formData.append('deadline', data.deadline);

        axios.post(
            `${conf.serverUrl}/api/v1/project/createProject`, 
            formData,
            {
                headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`},
                withCredentials: true,
            }
        )
        .then((res)=>{
            console.log(res);
            const newUserData = user;
            newUserData["projects"].push(res.data.data);
            changeUser(newUserData);
            localStorage.setItem("loggedInUser", JSON.stringify(newUserData));
            showAcceptToast("Project created successfully!");
            navigate("/dashboard"); 
        })
        .catch((error)=>{
            console.log(error);
            showErrorToast("Couldn't create new project");
        })
        
    }

  return (
    <div className="flex h-full w-full p-10 overflow-y-auto">
        <form action={handleSubmit(onSubmit)} className='flex h-full w-full flex-col gap-y-10 items-center'>
            <p className="text-4xl text-black font-semibold">Create New Project</p>

            {/* Project Fields */}
            <div className="flex flex-col gap-y-5 w-full items-center">

                {/* Project Name */}
                <div className='flex flex-col'>
                    <input type="text" placeholder='Project Name' className='text-black w-100 bg-green-50 border border-green-300 px-5 py-2 rounded-full' {
                    ...register(
                        "projectName",
                        {
                            required: "Project Name is required",
                        }
                    )
                    }/>

                    {errors.projectName && <p className='text-red-600'>{errors.projectName.message}</p>}
                </div>

                {/* Project Tagline */}
                <div className='flex flex-col pad-y-2'>
                    <input type="text" placeholder='Project Tagline' className='text-black w-100 bg-green-50 border border-green-300 px-5 py-2 rounded-full' {
                    ...register(
                        "projectTagline", 
                        {
                            required: "Project Tagline is required",
                        }
                    )
                    }/>

                    {errors.projectTagline && <p className='text-red-600'>{errors.projectTagline.message}</p>}
                </div>

                {/* Project Description */}
                <div className='flex flex-col pad-y-2'>
                    <input type="text" placeholder='Project Description' className='text-black w-100 bg-green-50 border border-green-300 px-5 py-2 rounded-full' {
                    ...register(
                        "projectDescription", 
                    )
                    }/>
                </div>

                {/* Source Code Link */}
                <div className='flex flex-col pad-y-2'>
                    <input type="text" placeholder='Source Code Link' className='text-black w-100 bg-green-50 border border-green-300 px-5 py-2 rounded-full' {
                    ...register(
                        "srcCodeLink", 
                    )
                    }/>
                </div>

                {/* Project Image */}
                <div className='flex flex-col pad-y-2'>
                    <div className="flex gap-x-5">
                        <label className='font-semibold'>Project Image</label>
                        <input type="file" className='border-2' {
                            ...register(
                            "projectImage",
                            )
                        }/>
                    </div>
                </div>

                {/* Start Date and Deadline */}
                <div className='flex flex-col pad-y-2'>
                    <div className="flex">

                        {/* StartDate */}
                        <div className="flex gap-x-5">
                            <label className='font-semibold'>Start Date</label>
                            <input type="date" className='border-2' {
                                ...register(
                                "startDate",
                                )
                            }/>
                        </div>

                        {/* Deadline */}
                        <div className="flex gap-x-5">
                            <label className='font-semibold'>Deadline</label>
                            <input type="date" className='border-2' {
                                ...register(
                                "deadline",
                                )
                            }/>
                        </div>
                    </div>

                </div>
            </div>

            {/* Cancel and Create Button */}
            <div className="flex justify-center w-full">
                <button className='rounded-lg text-lg bg-green-400 px-10 py-2 text-semibold hover:cursor-pointer' type='submit' disabled={isSubmitting}>Create Project</button>
            </div>

        </form>
    </div>
  )
}

export default AddProject
