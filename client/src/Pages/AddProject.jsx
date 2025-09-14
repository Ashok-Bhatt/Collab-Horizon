import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../Contexts/export.js';
import { showErrorToast, showAcceptToast } from '../Utils/toastUtils.js';
import conf from "../config/config.js";
import { FaSpinner } from 'react-icons/fa'; // Importing a spinner icon

// Reusable Input Component to keep the form clean and consistent
const InputField = ({ label, type = 'text', placeholder, error, ...rest }) => (
    <div className='flex flex-col w-full'>
        {label && <label className='text-gray-700 font-medium mb-1'>{label}</label>}
        <input
            type={type}
            placeholder={placeholder}
            className={`w-full px-4 py-2 text-gray-800 bg-gray-50 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500
                ${error ? 'border-red-500' : 'border-gray-300'}`}
            {...rest}
        />
        {error && <p className='text-red-500 text-sm mt-1'>{error}</p>}
    </div>
);

// Custom File Input Component
const FileInput = ({ label, error, ...rest }) => (
    <div className='flex flex-col w-full'>
        <label className='text-gray-700 font-medium mb-1'>{label}</label>
        <div className="flex items-center gap-4">
            <input type="file" className="hidden" id="file-upload" {...rest} />
            <label htmlFor="file-upload" className="cursor-pointer bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200">
                Choose Image
            </label>
            <span className="text-gray-600 truncate max-w-xs">
                {rest.files && rest.files[0] ? rest.files[0].name : 'No file chosen'}
            </span>
        </div>
        {error && <p className='text-red-500 text-sm mt-1'>{error}</p>}
    </div>
);

function AddProject() {
    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
    } = useForm();

    const navigate = useNavigate();
    const { user, changeUser } = useContext(UserContext);

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('projectName', data.projectName);
        formData.append('projectTagline', data.projectTagline);
        formData.append('projectDescription', data.projectDescription); // Corrected from data.email
        formData.append('srcCodeLink', data.srcCodeLink);
        if (data.projectImage && data.projectImage[0]) {
            formData.append('projectImage', data.projectImage[0]);
        }
        if (data.startDate) {
            formData.append('startDate', data.startDate);
        }
        if (data.deadline) {
            formData.append('deadline', data.deadline);
        }

        try {
            const res = await axios.post(
                `${conf.serverUrl}/api/v1/project/createProject`,
                formData,
                {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem("accessToken")}` },
                    withCredentials: true,
                }
            );

            const newUserData = { ...user };
            newUserData.projects.push(res.data.data);
            changeUser(newUserData);
            localStorage.setItem("loggedInUser", JSON.stringify(newUserData));
            showAcceptToast("Project created successfully!");
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            showErrorToast("Couldn't create new project");
        }
    };

    return (
        <div className="flex h-full w-full justify-center p-8 bg-orange-100">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className='flex flex-col gap-y-6 bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl overflow-y-auto'
            >
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Create New Project</h1>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <InputField
                            label="Project Name"
                            placeholder="Enter project name"
                            {...register("projectName", { required: "Project Name is required" })}
                            error={errors.projectName?.message}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <InputField
                            label="Project Tagline"
                            placeholder="A short, catchy tagline"
                            {...register("projectTagline", { required: "Project Tagline is required" })}
                            error={errors.projectTagline?.message}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <InputField
                            label="Project Description"
                            placeholder="Describe your project"
                            {...register("projectDescription")}
                            type="textarea"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <InputField
                            label="Source Code Link"
                            placeholder="Link to GitHub, GitLab, etc."
                            {...register("srcCodeLink")}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <FileInput
                            label="Project Image"
                            {...register("projectImage")}
                        />
                    </div>
                    <InputField
                        label="Start Date"
                        type="date"
                        {...register("startDate")}
                    />
                    <InputField
                        label="Deadline"
                        type="date"
                        {...register("deadline")}
                    />
                </div>

                <div className="mt-8 flex justify-center">
                    <button
                        type='submit'
                        className='flex items-center justify-center gap-2 bg-green-500 text-white text-lg font-semibold px-8 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Create Project"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddProject;