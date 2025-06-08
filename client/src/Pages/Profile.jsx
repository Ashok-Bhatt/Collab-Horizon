import axios from 'axios'
import React, { useEffect } from 'react'

function Profile() {

  useEffect(()=>{
    axios
    .get("http://localhost:8000/api/v1/user/getUserInfo/6828934e5274f61a56164fe8", { withCredentials: true })
    .then((res)=>{
      console.log(res.data);
    })
    .catch((error)=>{
      console.log("Cannot fetch user info");
    })
  })

  return (
    <div className='flex flex-col w-full h-full overflow-y-auto'>

      {/* Cover Image */}
      <div className='h-[300px] w-full relative'>
        <img src="https://pbs.twimg.com/media/FPYna4oXIAwA6eX.jpg:large" className='h-full w-full'/>
        <p className='absolute text-white font-bold text-3xl bottom-[25px] left-[400px]'>Ashok Bhatt</p>
      </div>

      {/* User Info : Includes Avatar, bio, and other stuff */}
      <div className='flex h-[200px] w-full px-[100px]'>

        {/* Left Section */}
        <div className='flex flex-col h-full w-[300px] relative items-center justify-end p-2'>

          {/* User Avatar */}
          <div className='rounded-full border-5 border-white overflow-hidden h-[200px] w-[200px] absolute -top-[100px]'>
            <img src="https://assets.leetcode.com/users/avatars/avatar_1706408779.png" className='h-[200px] w-[200px]'/>
          </div>

          <button className='rounded-md px-4 py-2 text-white bg-green-400'>Update Avatar</button>
        </div>

        {/* Right Section */}
        <div className='flex flex-col h-full flex-grow'>
          {/* Skills Section */}
          <div className='w-full h-1/2'>
            
          </div>

          {/* Bio Section */}
          <div className='w-full h-1/2'>

          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className='flex flex-col bg-red-100 px-[50px]'>
        <p className='text-3xl'>Projects Worked On</p>
        <div className='flex h-[200px] w-full'>

        </div>
      </div>

      {/* Social Profile Links */}
      <div className='flex w-full'>

      </div>

    </div>
  )
}

export default Profile
