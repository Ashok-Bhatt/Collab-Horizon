import React, { useEffect } from 'react'
import {SettingOption, ToggleButton, Input} from '../Components/export.js'
import { FaExchangeAlt } from "react-icons/fa";
import { useState, useContext } from 'react'
import {useForm} from "react-hook-form"
import { ThemeContext } from '../Contexts/export.js';
import conf from "../config/config.js";
import axios from 'axios';
import {showErrorToast, showAcceptToast} from "../Utils/toastUtils.js"

function Settings() {

  const [OptionBlockVisibility, setOptionBlockVisibility] = useState(false); 
  const {theme, toggleTheme} = useContext(ThemeContext);

  const {
    register,
    handleSubmit,
    formState,
    errors,
  } = useForm();

  useEffect(()=>{
    localStorage.setItem("theme", theme);
  }, [theme]);

  const showOptionBlock = () => {
    setOptionBlockVisibility(true);
  }

  const changePassword = (data) => {
    const oldPassword = data.oldPassword;
    const newPassword = data.newPassword;

    const formData = new FormData();
    formData.append('oldPassword', data.oldPassword);
    formData.append('newPassword', data.newPassword);

    axios
    .post(
      `${conf.serverUrl}/api/v1/user/changePassword`,
      formData,
      {
        headers : { 'Content-Type' : 'multipart/form-data'},
        withCredentials: true,
      }
    )
    .then((res)=>{
      showAcceptToast("Password changed successfully!");
    })
    .catch((error)=>{
      showErrorToast("Failed to change password!");
    })
    .finally(()=>{
      setOptionBlockVisibility(false);
    })
  }

  return (
    <div className='flex flex-col relative h-full w-full bg-red-100 p-2 gap-y-2'>
      <SettingOption 
        settingOptionText="Dark Mode"
        settingOptionBlock={<ToggleButton toggleState={theme=='dark'} toggleCallback={toggleTheme}/>}
      />
      <SettingOption 
        settingOptionText="Change Password" 
        settingOptionBlock={<FaExchangeAlt onClick={showOptionBlock} className='border rounded p-1 h-5 w-5'/>}
      />

      <form className='flex flex-col absolute top-1/2 left-1/2 -translate-1/2 bg-blue-100 p-2 gap-y-2 rounded-lg' style={{visibility : (OptionBlockVisibility ? 'visible' : 'hidden')}} onSubmit={handleSubmit(changePassword)}>
        <Input placeholder="Enter Old Password" inputType="text" {...register("oldPassword")} errorObj={errors?.oldPassword}/>
        <Input placeholder="Enter New Password" inputType="text" {...register("newPassword")} errorObj={errors?.newPassword}/>
        <div className="flex justify-between w-125">
          <button className="py-1 rounded text-center bg-green-400 w-50" type='submit'>Change Password</button>
          <button className="py-1 rounded text-center bg-red-400 w-50" type='button' onClick={()=>setOptionBlockVisibility(false)}>Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default Settings
