import axios from 'axios'
import { useEffect, useState, useRef, useContext } from 'react'
import { useParams } from 'react-router-dom';
import {SocialProfileBlock, ProjectBlock, MessageBox} from "../Components/export.js"
import { FaPencilAlt } from "react-icons/fa";
import { UserContext } from '../Contexts/export.js';
import { toast, Zoom } from 'react-toastify';
import conf from "../config/config.js";

function Profile() {

  const [userData, setUserData] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
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
          {...prev, ["coverImage"] : res.data["image"]}
        ))
      })
      .catch((error)=>{
          toast.error("Couldn't upload cover image", {
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
          {...prev, ["avatar"] : res.data["image"]}
        ))
      })
      .catch((error)=>{
        toast.error("Couldn't upload profile pic", {
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
      })
      .finally(()=>{
        setAvatarFile(null);
      })
    }
  }, [avatarFile]);


  useEffect(()=>{
    axios
    .get(`${conf.serverUrl}/api/v1/user/getUserInfo/${id}`, { withCredentials: true })
    .then((res)=>{
      if (res.data.length > 0){
        setUserData(res.data[0]);
      }
    })
    .catch((error)=>{
      toast.error("Couldn't fetch user info", {
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
    })
  }, [])

  return (
    <div className='flex flex-col w-full h-full overflow-y-auto'>

      {/* Cover Image */}
      <div className='min-h-[300px] w-full relative bg-blue-300'>
        <img src={userData?.coverImage} className='h-full w-full'/>
        <p className='absolute text-white font-bold text-3xl bottom-[25px] right-[50px]'>{userData?.username}</p>
        {(user?._id && user._id === id)?(<>
          <div className='h-[50px] w-[50px] absolute top-[25px] right-[25px] rounded-full border-2 bg-white' onClick={updateCoverImage}>
            <FaPencilAlt className='text-blue-500 p-3 h-full w-full'/>
          </div>
          <input type="file" ref={coverImageInput} onChange={changeCoverImageFile} className='hidden'/>
        </>) : null}
      </div>

      {/* User Info : Includes Avatar, bio, and other stuff */}
      <div className='flex w-full px-[100px]'>

        {/* Left Section */}
        <div className='flex flex-col h-[200px] w-[450px] relative items-center justify-end p-2 gap-y-2'>

          {/* User Avatar */}
          <div className='rounded-full border-5 border-white overflow-hidden h-[200px] w-[200px] absolute -top-[100px]'>
            <img src={userData?.avatar} className='h-[200px] w-[200px]'/>
          </div>

          {(user?._id && user._id == id)?(<>
            <input type="file" ref={avatarInput} onChange={changeAvatarFile} className='hidden'/>
            <button className='rounded-md px-4 py-2 text-white bg-green-400 w-[150px]' onClick={updateAvatar}>Update Avatar</button>
          </>):null}
          
        </div>

        {/* Right Section */}
        <div className='flex flex-col flex-grow py-5 gap-y-4'>
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
      <div className='flex flex-col p-2 gap-y-5 px-[50px]'>
        <p className='text-3xl font-bold'>Projects Worked On</p>
        <div className='flex w-full gap-x-5 overflow-x-auto'>
            {
              (userData?.projects && userData.projects.length > 0) ? (userData.projects.map((project)=>(
                <ProjectBlock height="h-[150px]" width="min-w-[300px]" textSize="text-md" projectInfo={project} key={project._id}/>
              ))) : <MessageBox containerClasses="flex justify-center items-center h-[200px] w-full bg-gray-400 rounded-lg" text="No Projects Added" textClasses="text-white text-lg font-semibold"/>
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
