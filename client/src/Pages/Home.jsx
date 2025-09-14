import { Outlet } from 'react-router-dom'
import {Sidebar, Navbar} from '../Components/export.js'

function Home() {

  return (
    <div className='flex flex-col h-screen w-full'>
      <Navbar/>
      <div className='flex flex-grow overflow-hidden'>
        <Sidebar/>
        <Outlet/>
      </div>
    </div>
  )
}

export default Home
