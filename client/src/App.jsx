import './App.css'
import {Outlet} from "react-router-dom"
import { UserContext } from "./Contexts/export.js"
import { useContext, useEffect } from 'react'

function App() {

  const {user, changeUser} = useContext(UserContext);

  useEffect(()=>{
    if (localStorage.getItem("loggedInUser")){
      changeUser(JSON.parse(localStorage.getItem("loggedInUser")));
    }
  }, []);

  return (
    <div className='h-screen w-screen'>
      <Outlet/>
    </div>
  )
}

export default App
