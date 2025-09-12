import React, { useContext, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import {Sidebar, Navbar} from '../Components/export.js'
import { UserContext } from '../Contexts/export.js'

function Home() {

  return (
    <div className='flex flex-col h-full w-full'>
      <Navbar/>
      <div className='flex flex-grow overflow-y-auto'>
        <Sidebar/>
        <Outlet/>
      </div>
    </div>
  )
}

export default Home
