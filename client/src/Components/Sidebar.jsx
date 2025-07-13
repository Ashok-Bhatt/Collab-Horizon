import React, { useState, useContext } from 'react'
import classNames from "classnames"
import { UserContext } from '../Contexts/export.js';
import { useNavigate } from 'react-router-dom';

function Sidebar() {

  const [sidebarWidth, setSidebarWidth] = useState(200);
  const [sidebarOptionNo, setSidebarOptionNo] = useState(0);

  const {user, changeUser} = useContext(UserContext);
  const navigate = useNavigate();

  const sidebarOptions = [
    {
      text : "Home",
      link : "/",
    },
    {
      text : "Dashboard",
      link : "/dashboard",
    },
    {
      text : "Settings",
      link : "/settings",
    }
  ]

  const changeOption = (i) => {
    setSidebarOptionNo(i);
    navigate(sidebarOptions[i].link);
  }

  return (
    <div className={'flex flex-col gap-y-2 h-full overflow-y-auto overflow-x-hidden bg-green-100'} style={{width:sidebarWidth}}>
      {sidebarOptions.map((option, i)=>(
        <div className={`w-full px-2 py-1 text-black font-semibold rounded ${(i==sidebarOptionNo)?'bg-blue-100':''}`} key={option.text} onClick={()=>changeOption(i)}>{option.text}</div>
      ))}
    </div>
  )
}

export default Sidebar
