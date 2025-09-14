import React, { useState, useContext } from 'react';
import { Input, ListItem } from "./export.js";
import { FaPlus, FaSpinner } from "react-icons/fa"; // Added FaSpinner for loading state
import { useForm } from "react-hook-form";
import { v4 as uuid } from "uuid";
import { showErrorToast, showAcceptToast } from '../Utils/toastUtils.js';
import axios from 'axios';
import conf from "../config/config.js";
import { UserContext } from '../Contexts/export.js';

function EditProfile(props) {
    const { editedData, setEditedData, setIsEditing, setUserData } = props;
    const [newSkill, setNewSkill] = useState("");
    const { user, changeUser } = useContext(UserContext);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            username: editedData["username"],
            bio: editedData["bio"],
            githubLink: editedData["socialProfilesLinks"]["github"],
            linkedinLink: editedData["socialProfilesLinks"]["linkedin"],
            twitterLink: editedData["socialProfilesLinks"]["twitter"],
            portfolioWebsite: editedData["socialProfilesLinks"]["portfolioWebsite"],
        },
    });

    const removeSkill = (index) => {
        setEditedData((prev) => ({
            ...prev,
            skills: prev["skills"].filter((_, i) => i !== index),
        }));
    };

    const handleAddSkill = () => {
        if (newSkill.trim() === "") {
            showErrorToast("Skill name can't be empty");
        } else {
            setEditedData((prev) => ({
                ...prev,
                skills: [...prev["skills"], newSkill],
            }));
            setNewSkill("");
        }
    };

    const onSubmit = async (data) => {
        const updatedData = {
            ...editedData,
            username: data["username"],
            bio: data["bio"],
            socialProfilesLinks: {
                ...editedData["socialProfilesLinks"],
                github: data["githubLink"],
                linkedin: data["linkedinLink"],
                twitter: data["twitterLink"],
                portfolioWebsite: data["portfolioWebsite"],
            },
        };

        setEditedData(updatedData);

        axios.patch(
            `${conf.serverUrl}/api/v1/user/updateProfile`,
            {
                username: updatedData["username"],
                bio: updatedData["bio"],
                skills: updatedData["skills"],
                socialProfilesLinks: updatedData["socialProfilesLinks"],
            },
            {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
                withCredentials: true,
            }
        )
        .then((res) => {
            const serverUpdatedData = {
                ...editedData,
                username: res.data.data.username,
                bio: res.data.data.bio,
                skills: res.data.data.skills,
                socialProfilesLinks: res.data.data.socialProfilesLinks,
            };
            localStorage.setItem("loggedInUser", JSON.stringify(serverUpdatedData));
            changeUser(serverUpdatedData);
            setUserData(serverUpdatedData);
            setIsEditing(false);
            showAcceptToast("Data updated successfully!");
        })
        .catch((error) => {
            showErrorToast("Couldn't update user profile");
        });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
            <form 
                className='bg-white rounded-xl shadow-2xl p-6 md:p-8 w-11/12 md:w-2/3 lg:w-1/2 max-h-[85vh] overflow-y-auto transform transition-all'
                onSubmit={handleSubmit(onSubmit)}
            >
                <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Edit Profile</h2>

                {/* Personal Information Section */}
                <div className="flex flex-col gap-y-4 mb-6">
                    <h3 className="text-lg font-semibold text-gray-700">Personal Information</h3>
                    <Input 
                        placeholder="Username" 
                        type="text" 
                        {...register("username", { required: "Username is required" })} 
                        errorObj={errors.username} 
                    />
                    <Input 
                        placeholder="Bio" 
                        type="text" 
                        {...register("bio", { required: "Bio is required" })} 
                        errorObj={errors.bio} 
                    />
                </div>

                <hr className="my-4" />

                {/* Skills Section */}
                <div className="flex flex-col gap-y-4 mb-6">
                    <h3 className="text-lg font-semibold text-gray-700">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {editedData["skills"].map((skill, index) => (
                            <ListItem key={uuid()} label={skill} cancelListener={() => removeSkill(index)} />
                        ))}
                    </div>
                    <div className='flex gap-2 items-center'>
                        <input 
                            className='flex-1 rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500' 
                            value={newSkill} 
                            onChange={(e) => setNewSkill(e.target.value)} 
                            placeholder="Add new skill..."
                        />
                        <button 
                            type="button" 
                            onClick={handleAddSkill}
                            className='bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors duration-200'
                        >
                            <FaPlus className="text-lg" />
                        </button>
                    </div>
                </div>

                <hr className="my-4" />

                {/* Social Profiles Section */}
                <div className="flex flex-col gap-y-4 mb-6">
                    <h3 className="text-lg font-semibold text-gray-700">Social Profiles</h3>
                    <Input 
                        placeholder="Github Profile" 
                        type="text" 
                        {...register("githubLink")} 
                        errorObj={errors.githubLink} 
                    />
                    <Input 
                        placeholder="LinkedIn Profile" 
                        type="text" 
                        {...register("linkedinLink")} 
                        errorObj={errors.linkedinLink} 
                    />
                    <Input 
                        placeholder="Twitter Profile" 
                        type="text" 
                        {...register("twitterLink")} 
                        errorObj={errors.twitterLink} 
                    />
                    <Input 
                        placeholder="Portfolio Website" 
                        type="text" 
                        {...register("portfolioWebsite")} 
                        errorObj={errors.portfolioWebsite} 
                    />
                    {/* The "Add More Profiles" button is kept but its functionality would need to be implemented */}
                    <button type="button" className='flex items-center gap-2 text-blue-500 font-medium hover:text-blue-700 transition-colors'>
                        <FaPlus />
                        <p>Add More Profiles</p>
                    </button>
                </div>

                <hr className="my-4" />

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 p-4 sticky bottom-0 bg-gray-300 rounded-xl">
                    <button
                        type="button"
                        className='bg-gray-200 text-gray-800 px-6 py-2 rounded-md font-semibold hover:bg-gray-300 transition-colors duration-200'
                        onClick={() => setIsEditing(false)}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className='bg-green-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <FaSpinner className="animate-spin" /> : "Save"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditProfile;