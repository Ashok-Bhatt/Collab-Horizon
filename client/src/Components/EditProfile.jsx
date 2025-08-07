import React, { useEffect, useState } from 'react'
import {Input, ListItem} from "./export.js"
import {FaPlus} from "react-icons/fa"
import {useForm} from "react-hook-form"
import {v4 as uuid} from "uuid"
import { toast, Zoom } from 'react-toastify'
import axios from 'axios'
import conf from "../config/config.js"
import { useContext } from 'react'
import { UserContext } from '../Contexts/export.js'

function EditProfile(props) {

  const {editedData, setEditedData, setIsEditing, setUserData} = props;
  const [newSkill, setNewSkill] = useState("");

  const {user, changeUser} = useContext(UserContext);

  const {
    register,
    handleSubmit,
    formState : {errors, isSubmitting},
  } = useForm({
    defaultValues : {
        username : editedData["username"],
        bio : editedData["bio"],
        githubLink : editedData["socialProfilesLinks"]["github"],
        linkedinLink : editedData["socialProfilesLinks"]["linkedin"],
        twitterLink: editedData["socialProfilesLinks"]["twitter"],
        portfolioWebsite: editedData["socialProfilesLinks"]["portfolioWebsite"],
    }
  });

  const showErrorText = (message) => {
    toast.error(message, {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Zoom,
    });
  }

  const showSuccessMessage = (message) => {
    toast.success(message, {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Zoom,
    })
  }

  const removeSkill = (index) => {
    setEditedData((prev)=>({
        ...prev,
        ["skills"] : prev["skills"].filter((_, i)=> i != index)
    }))
  }

  const addSkill = () => {
    if (newSkill.trim() === ""){
        showErrorText("Skill name can't be empty");
    } else {
      setEditedData((prev)=>({
        ...prev,
        ["skills"] : [...prev["skills"], newSkill]
      }))
    }
  }

  const onSubmit = async (data) => {
    const updatedData = {
      ...editedData,
      ["username"]: data["username"],
      ["bio"]: data["bio"],
      ["socialProfilesLinks"]: {
        ...editedData["socialProfilesLinks"],
        ["github"]: data["githubLink"],
        ["linkedin"]: data["linkedinLink"],
        ["twitter"]: data["twitterLink"],
        ["portfolioWebsite"]: data["portfolioWebsite"],
      }
    };

    setEditedData(updatedData);

    axios
    .patch(
        `${conf.serverUrl}/api/v1/user/updateProfile`,
        {
            username : updatedData["username"],
            bio : updatedData["bio"],
            skills : updatedData["skills"],
            socialProfilesLinks : updatedData["socialProfilesLinks"],
        },
        {
            headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`},
            withCredentials: true,
        }
    )
    .then((res)=>{
      const updatedData = {
        ...editedData,
        ["username"] : res.data.data["username"],
        ["bio"] : res.data.data["bio"],
        ["skills"] : res.data.data["skills"],
        ["socialProfilesLinks"] : res.data.data["socialProfilesLinks"],
      }
      localStorage.setItem("loggedInUser", JSON.stringify(updatedData));
      changeUser(updatedData);
      setUserData(updatedData);
      setIsEditing(false);
      showSuccessMessage("Data updated successfully!");
    })
    .catch((error)=>{
        showErrorText("Couldn't update user profile");
    })

  }

  return (
    <form className='flex flex-col gap-y-5 fixed bg-blue-200 border-2 p-2 rounded-lg h-2/3 w-1/3 top-1/2 left-1/2 -translate-1/2 overflow-y-scroll' onSubmit={handleSubmit(onSubmit)}>
      <Input placeholder="Username" type="text" {...register("username", {required: "Username is required"})} errorObj={errors.username}/>
      <Input placeholder="Bio" type="text"  {...register("bio", {required: "Bio is required"})} errorObj={errors.bio}/>

      <div className="flex flex-col gap-y-5">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
            {
                editedData["skills"].map((skill, index)=>(
                    <ListItem key={uuid()} label={skill} cancelListener={()=>{removeSkill(index)}}/>
                ))
            }
        </div>
        <div className='flex gap-x-2'>
            <input className='rounded bg-white' value={newSkill} onChange={(e)=>setNewSkill(e.target.value)}/>
            <button type="button" onClick={addSkill}>Add</button>
        </div>
      </div>

      <Input placeholder="Github Profile" type="text" {...register("githubLink")} errorObj={errors.githubLink}/>
      <Input placeholder="LinkedIn Profile" type="text" {...register("linkedinLink")} errorObj={errors.linkedinLink}/>
      <Input placeholder="Twitter Profile" type="text" {...register("twitterLink")} errorObj={errors.twitterLink}/>
      <Input placeholder="Portfolio Website" type="text" {...register("portfolioWebsite")} errorObj={errors.portfolioWebsite}/>

      <button className='flex bg-gray-400'>
        <p>Add More Profiles</p>
        <FaPlus/>
      </button>

      {/* Save and cancel button */}
      {
        <div className="flex gap-x-5 px-[50px] p-2">
          <button type="submit" className='bg-green-400 text-white px-5 py-1 text-lg font-semibold rounded min-w-30'>Save</button>
          <button type="button" className='bg-red-400 text-white px-5 py-1 text-lg font-semibold rounded min-w-30' onClick={()=>setIsEditing(false)}>Cancel</button>
        </div>
      }
    </form>
  )
}

export default EditProfile
