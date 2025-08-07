import React, { useRef } from 'react'
import { FaCopy } from 'react-icons/fa';

function SocialProfileBlock(props) {

  const {profileIcon, appName, profileLink} = props;
  const profileLinkRef = useRef(null);

  const copyLinkToClipboard = async () => {
    await navigator.clipboard.writeText(profileLinkRef.current.value);
    profileLinkRef.current.select();
    setTimeout(()=>{
      window.getSelection().removeAllRanges();
    }, 2000);
  }

  return (
    <div className='flex w-full h-[50px] rounded-lg overflow-hidden border-2'>
      {profileIcon && <div className='h-[50px] w-[50px] border-r-2 border-black'>{profileIcon}</div>}
      <div className='flex justify-center items-center h-[50px] w-[100px] px-2 bg-gray-200 font-bold border-r-2 text-lg'>{appName}</div>
      <input className='flex justify-center items-center h-[50px] flex-grow align-middle px-2 border-r-2' value={profileLink} ref={profileLinkRef} readOnly/>
      <FaCopy className='h-[50px] w-[50px] p-3' onClick={copyLinkToClipboard}/>
    </div>
  )
}

export default SocialProfileBlock
