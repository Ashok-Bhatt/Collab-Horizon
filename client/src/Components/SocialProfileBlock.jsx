import React from 'react'

function SocialProfileBlock(props) {

  const {profileIcon, appName, profileLink} = props;

  return (
    <div className='flex w-[500px] h-[50px] rounded-lg overflow-hidden border-2'>
      <div className='h-[50px] w-[50px] border-r-2 border-black'>{profileIcon}</div>
      <div className='flex justify-center items-center h-[50px] px-2 bg-gray-200 font-bold border-r-2 text-lg'>{appName}</div>
      <div className='flex justify-center items-center h-[50px] align-middle px-2'>{profileLink}</div>
    </div>
  )
}

export default SocialProfileBlock
