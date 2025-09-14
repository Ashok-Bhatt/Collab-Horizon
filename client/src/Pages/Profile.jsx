import axios from 'axios'
import { useEffect, useState, useRef, useContext } from 'react'
import { useParams } from 'react-router-dom';
import {SocialProfileBlock, ProjectBlock, MessageBox, EditProfile } from "../Components/export.js"
import { FaCamera, FaPencilAlt } from "react-icons/fa";
import { UserContext } from '../Contexts/export.js';
import { showErrorToast, showAcceptToast } from '../Utils/toastUtils.js';
import conf from "../config/config.js";

function Profile() {

  const [userData, setUserData] = useState(null);
  const [editedData, setEditedData] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoggedInUserProfile, setIsLoggedInUserProfile] = useState(false);
  const avatarInput = useRef(null);
  const coverImageInput = useRef(null);
  
  const {user} = useContext(UserContext);
  const params = useParams();
  const id = params.id;


  const changeAvatarFile = async (e)=>{
    if (e.target.files && e.target.files.length > 0){
      setAvatarFile(e.target.files[0]);
    }
  }

  const changeCoverImageFile = async (e)=>{
    if (e.target.files && e.target.files.length > 0){
      setCoverImageFile(e.target.files[0]);
    }
  }

  const updateAvatar = async () => {
    avatarInput.current.click();
  }

  const updateCoverImage = async () => {
    coverImageInput.current.click();
  }

  // To update cover image whenever a change is detected
  useEffect(()=>{

    if (coverImageFile){
      const formData = new FormData();
      formData.append("coverImage", coverImageFile);

      axios
      .patch(`${conf.serverUrl}/api/v1/user/updateCoverImage`, formData, {
        headers: "multipart/form-data",
        withCredentials: true,
      })
      .then((res)=>{
        setUserData((prev)=>(
          {...prev, ["coverImage"] : res.data.data["image"]}
        ))
        showAcceptToast("Cover image updated successfully");
      })
      .catch((error)=>{
          showErrorToast("Couldn't upload cover image");
      })
      .finally(()=>{
        setCoverImageFile(null);
      })
    }
  }, [coverImageFile]);


  // To update avatar whenever a change is detected
  useEffect(()=>{

    if (avatarFile){

      const formData = new FormData();
      formData.append("avatar", avatarFile);

      axios
      .patch(`${conf.serverUrl}/api/v1/user/updateAvatar`, formData, {
        headers: "multipart/form-data",
        withCredentials: true,
      })
      .then((res)=>{
        setUserData((prev)=>(
          {...prev, ["avatar"] : res.data.data["image"]}
        ))
        showAcceptToast("Profile picture updated successfully");
      })
      .catch((error)=>{
        showErrorToast("Couldn't upload profile pic");
      })
      .finally(()=>{
        setAvatarFile(null);
      })
    }
  }, [avatarFile]);


  // To initialize the updated data with current data whenever a click event happens
  useEffect(()=>{
    if (isEditing){
      setEditedData(userData);
    } else {
      setEditedData(null);
    }
  }, [isEditing])


  useEffect(()=>{
    axios
    .get(`${conf.serverUrl}/api/v1/user/getUserInfo/${id}`, { withCredentials: true })
    .then((res)=>{
      if (res.data.data.length > 0){
        setUserData(res.data.data[0]);
        if (id === user?._id){
          setIsLoggedInUserProfile(true);
        }
      }
    })
    .catch((error)=>{
      console.log(error);
      showErrorToast("couldn't fetch user info");
    })
  }, [])

  return (
    <div className='flex flex-col relative w-full h-full overflow-y-auto'>

      {/* Cover Image */}
      <div className='min-h-[300px] w-full relative bg-blue-300'>
        <img src={userData?.coverImage} className='h-full w-full'/>
        <p className='absolute text-white font-bold text-3xl bottom-[25px] right-[50px] text-shadow-lg text-shadow-black'>{userData?.username}</p>
        {(isLoggedInUserProfile && !isEditing)?(<>
          {<div className='h-[50px] w-[50px] absolute top-[25px] right-[25px] rounded-full border-2 bg-white' onClick={updateCoverImage}>
            <FaCamera className='text-blue-500 p-3 h-full w-full'/>
          </div>}
          <input type="file" ref={coverImageInput} onChange={changeCoverImageFile} className='hidden'/>
        </>) : null}
      </div>

      {/* User Info : Includes Avatar, bio, and other stuff */}
      <div className='flex w-full px-[100px]'>

        {/* Left Section */}
        <div className='flex flex-col h-[200px] w-[450px] relative items-center justify-end p-2 gap-y-2'>

          {/* User Avatar */}
          <div className='rounded-full border-5 border-white overflow-hidden h-[200px] w-[200px] absolute -top-[100px]' onClick={(isLoggedInUserProfile)?updateAvatar:null}>
            <img src={userData?.avatar} className='h-[200px] w-[200px]'/>
          </div>

          <input type="file" ref={avatarInput} onChange={changeAvatarFile} className='hidden'/>

          {/* {(user?._id && user._id == id)?(<>
            
            <button className='rounded-md px-4 py-2 text-white bg-green-400 w-[150px]' onClick={updateAvatar}>Update Avatar</button>
          </>):null} */}
          
        </div>

        {/* Right Section */}
        <div className='flex flex-col flex-grow py-5 gap-y-4'>

          {/* Profile Editing Option */}
          <button className='flex items-center px-5 py-1 text-lg gap-2 bg-green-400 w-max self-end rounded' onClick={()=>setIsEditing(true)}>
            <FaPencilAlt /> Edit
          </button>

          {/* Bio Section */}
          <div className="flex flex-col gap-y-1 p-1">
            <p className="text-2xl font-semibold">Bio</p>
            <div className='w-full'>
              {
                (userData?.bio) ? <p className="text-lg">{userData.bio}</p> : <MessageBox containerClasses="flex justify-center items-center h-[100px] w-full bg-gray-300 border border-gray-500 rounded-lg" text="No Description Provided" textClasses="text-black text-md font-semibold"/>
              }
            </div>
          </div>
          {/* Skills Section */}
          <div className="flex flex-col gap-y-1 p-1">
            <p className="text-2xl font-semibold">Skills</p>
             <div className='flex flex-wrap gap-2 w-full'>
              {
                (userData?.skills && userData.skills.length>0) ? (userData.skills.map((skill)=>(
                  <div className='rounded-md bg-gray-200 text-blue-400 px-5 py-1 min-w-20 text-center hover:bg-blue-400 hover:text-white font-semibold hover:cursor-pointer' key={skill}>{skill}</div>
                ))) : <MessageBox containerClasses="flex justify-center items-center h-[100px] w-full bg-gray-300 border border-fray-500 rounded-lg" text="No Skills Added" textClasses="text-black text-md font-semibold"/>
              }
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
<div className='flex flex-col p-6 md:p-10 bg-gray-50 rounded-lg shadow-inner'>
  <div className='flex justify-between items-center mb-4'>
    <p className='text-3xl font-extrabold text-gray-800'>Projects</p>
    <button className='text-blue-500 hover:text-blue-700 transition-colors duration-200 text-lg font-semibold'>
      View All
    </button>
  </div>
  <div className='flex w-full gap-5 overflow-x-auto scrollbar-hide'>
    {(userData?.projects && userData.projects.length > 0) ? (
      userData.projects.map((project) => (
        <ProjectBlock 
          height="h-[200px]" 
          width="min-w-[350px]" 
          textSize="text-md" 
          projectInfo={project} 
          key={project._id}
        />
      ))
    ) : (
      <div className="flex items-center justify-center h-[200px] w-full bg-gray-200 rounded-xl">
        <p className="text-gray-500 text-lg font-semibold">No Projects Added</p>
      </div>
    )}
  </div>
</div>

{/* Social Profile Links */}
<div className='flex flex-col w-full p-6 md:p-10 bg-gray-50 rounded-lg shadow-inner mt-8'>
  <p className='text-3xl font-extrabold text-gray-800 mb-6'>Social Profiles</p>
  <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4'>
    <SocialProfileBlock 
      profileIcon={<img src="/Images/github_logo.png" alt="Github" className="h-10 w-10"/>} 
      appName="Github" 
      profileLink={userData?.socialProfilesLinks?.github}
    />
    <SocialProfileBlock 
      profileIcon={<img src="/Images/linkedin_logo.png" alt="LinkedIn" className="h-10 w-10"/>} 
      appName="Linkedin" 
      profileLink={userData?.socialProfilesLinks?.linkedin}
    />
    <SocialProfileBlock 
      profileIcon={<img src="/Images/twitter_logo.png" alt="Twitter" className="h-10 w-10"/>} 
      appName="Twitter" 
      profileLink={userData?.socialProfilesLinks?.twitter}
    />
    <SocialProfileBlock 
      profileIcon={<img src="/Images/website_logo.png" alt="Portfolio" className="h-10 w-10"/>} 
      appName="Portfolio" 
      profileLink={userData?.socialProfilesLinks?.portfolioWebsite}
    />
    {userData?.socialProfilesLinks?.others.map((socialProfile) => (
      <SocialProfileBlock 
        profileIcon={<img src="/Images/website_logo.png" alt={socialProfile.appName} className="h-10 w-10"/>} 
        appName={socialProfile.appName} 
        profileLink={socialProfile.profileLink} 
        key={socialProfile._id}
      />
    ))}
  </div>
</div>

      {editedData && <EditProfile editedData={editedData} setEditedData={setEditedData} setIsEditing={setIsEditing} setUserData={setUserData}/>}
    </div>
  )
}

export default Profile