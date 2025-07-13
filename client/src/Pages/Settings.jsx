import React, { useEffect } from 'react'
import {SettingOption, ToggleButton} from '../Components/export.js'
import { FaExchangeAlt } from "react-icons/fa";
import { useState, useContext } from 'react'
import {useForm} from "react-hook-form"
import { ThemeContext } from '../Contexts/export.js';

function Settings() {

  const [OptionBlockVisibility, setOptionBlockVisibility] = useState(false); 
  const {theme, toggleTheme} = useContext(ThemeContext);

  const {
    register,
    error,
    handleSubmit
  } = useForm();

  useEffect(()=>{
    localStorage.setItem("theme", theme);
  }, [theme]);

  const showOptionBlock = () => {
    setOptionBlockVisibility(true);
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

      <form className='flex flex-col absolute top-1/2 left-1/2 -translate-1/2 bg-blue-100 p-2 gap-y-2 rounded-lg' style={{visibility : (OptionBlockVisibility ? 'visible' : 'hidden')}}>
        <input type="text" className="" placeholder='Enter Old Password'/>
        <input type="text" className="" placeholder='Enter New Password'/>
        <div className="flex justify-between w-125">
          <button className="py-1 rounded text-center bg-green-400 w-50" type='submit'>Change Password</button>
          <button className="py-1 rounded text-center bg-red-400 w-50" onClick={()=>setOptionBlockVisibility(false)}>Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default Settings
