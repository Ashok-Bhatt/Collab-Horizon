import { Outlet } from 'react-router-dom'
import {Sidebar, Navbar} from '../Components/export.js'

function Home() {

  return (
    <div className='flex flex-col h-full w-full'>
      <Navbar/>
      <div className='flex w-full flex-grow'>
        <Sidebar/>
        <Outlet/>
      </div>
    </div>
  )
}

export default Home
