import './App.css'
import {Outlet} from "react-router-dom"
import { ThemeContext, UserContext } from "./Contexts/export.js"
import { useContext, useEffect } from 'react'

function App() {

  const {user, changeUser} = useContext(UserContext);
  const {theme, toggleTheme} = useContext(ThemeContext)

  useEffect(()=>{
    if (localStorage.getItem("loggedInUser")){
      changeUser(JSON.parse(localStorage.getItem("loggedInUser")));
    }
  }, []);

  useEffect(()=>{
    if (localStorage.getItem("theme")){
      const storedTheme = localStorage.getItem("theme");
      if (theme != storedTheme){
        toggleTheme();
      }
    }
  }, []);

  return (
    <div className='h-screen w-screen'>
      <Outlet/>
    </div>
  )
}

export default App
