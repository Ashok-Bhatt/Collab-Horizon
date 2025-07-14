import './App.css'
import {Outlet} from "react-router-dom"
import { ThemeContext, UserContext } from "./Contexts/export.js"
import { useContext, useEffect } from 'react'
import {ToastContainer, Zoom} from "react-toastify"

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
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Zoom}
        />
    </div>
  )
}

export default App
