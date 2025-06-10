import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom';
import {SocialProfileBlock, ProjectBlock} from "../Components/export.js"
import { FaPencilAlt } from "react-icons/fa";

function Profile() {

  const {id} = useParams();

  const [userData, setUserData] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const avatarInput = useRef(null);


  const changeFile = async (e)=>{
    if (e.target.files && e.target.files.length > 0){
      setAvatarFile(e.target.files[0]);
    }
  }

  const updateAvatar = async () => {
    avatarInput.current.click();
  }

  const saveNewAvatar = () => {

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    axios
    .patch("http://localhost:8000/api/v1/user/updateAvatar", formData, {
      headers: "multipart/form-data",
      withCredentials: true,
    })
    .then((res)=>{
      setUserData((prev)=>(
        {...prev, ["avatar"] : res.data["image"]}
      ))
    })
    .catch((error)=>{
      console.log("Couldn't update profile pic");
    })
  }


  useEffect(()=>{
    axios
    .get(`http://localhost:8000/api/v1/user/getUserInfo/${id}`, { withCredentials: true })
    .then((res)=>{
      if (res.data.length > 0){
        setUserData(res.data[0]);
      }
    })
    .catch((error)=>{
      console.log("Cannot fetch user info");
    })
  }, [])

  return (
    <div className='flex flex-col w-full h-full overflow-y-auto'>

      {/* Cover Image */}
      <div className='min-h-[300px] w-full relative bg-blue-300'>
        <img src={userData?.coverImage} className='h-full w-full'/>
        <p className='absolute text-white font-bold text-3xl bottom-[25px] right-[50px]'>{userData?.username}</p>
      </div>

      {/* User Info : Includes Avatar, bio, and other stuff */}
      <div className='flex min-h-[200px] w-full px-[100px]'>

        {/* Left Section */}
        <div className='flex flex-col h-full w-[450px] relative items-center justify-end p-2 gap-y-2'>

          {/* User Avatar */}
          <div className='rounded-full border-5 border-white overflow-hidden h-[200px] w-[200px] absolute -top-[100px]'>
            <img src={userData?.avatar} className='h-[200px] w-[200px]'/>
          </div>

          <input type="file" ref={avatarInput} onChange={changeFile} className='hidden'/>
          <button className='rounded-md px-4 py-2 text-white bg-green-400 w-[150px]' onClick={updateAvatar}>Update Avatar</button>
          <button className='rounded-md px-4 py-2 text-white bg-blue-400 w-[150px]' onClick={saveNewAvatar}>Save Avatar</button>
        </div>

        {/* Right Section */}
        <div className='flex flex-col flex-grow'>
          {/* Skills Section */}
          <div className='flex flex-wrap gap-2 w-full p-1'>
            {
              userData?.skills.map((skill)=>(
                <div className='rounded-md bg-gray-200 text-blue-400 px-5 py-1' key={skill}>{skill}</div>
              ))
            }
          </div>
          {/* Bio Section */}
          <div className='w-full bg-green-400'>
            {userData?.bio}
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className='flex flex-col p-2 gap-y-5 px-[50px]'>
        <p className='text-3xl font-bold'>Projects Worked On</p>
        <div className='flex w-full gap-x-5 overflow-x-auto'>
            {
              userData?.projects?.map((project)=>(
                <ProjectBlock height="h-[200px]" width="min-w-[350px]" textSize="text-md" projectInfo={project} key={project._id}/>
              ))
            }
        </div>
      </div>

      {/* Social Profile Links */}
      <div className='flex flex-col w-full px-[50px] p-2'>
        <p className='text-3xl font-bold'>Social Profiles</p>
        <div className='flex flex-wrap gap-y-2 justify-between content-start mt-5 min-h-[200px] w-full'>
            <SocialProfileBlock profileIcon = {<img src="/Images/github_logo.png"/>} appName="Github" profileLink={userData?.
socialProfilesLinks?.github}/>
            <SocialProfileBlock profileIcon = {<img src="/Images/linkedin_logo.png"/>} appName="Linkedin" profileLink={userData?.
socialProfilesLinks?.linkedin}/>
            <SocialProfileBlock profileIcon = {<img src="/Images/twitter_logo.png"/>} appName="Twitter" profileLink={userData?.
socialProfilesLinks?.twitter}/>
            <SocialProfileBlock profileIcon = {<img src="/Images/website_logo.png"/>} appName="Portfolio" profileLink={userData?.
socialProfilesLinks?.portfolioWebsite}/>
        </div>
      </div>

    </div>
  )
}

export default Profile
