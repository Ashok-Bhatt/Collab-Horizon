import './App.css'
import {Outlet} from "react-router-dom"
import { ThemeContext, UserContext } from "./Contexts/export.js"
import { useContext, useEffect } from 'react'
import {ToastContainer, Zoom} from "react-toastify"
import { useNavigate } from 'react-router-dom'

function App() {

  const {checkAuth} = useContext(UserContext);
  const {theme, toggleTheme} = useContext(ThemeContext);
  const navigate = useNavigate();

  useEffect(()=>{
    if (localStorage.getItem("theme")){
      const storedTheme = localStorage.getItem("theme");
      if (theme != storedTheme){
        toggleTheme();
      }
    }
  }, []);

  return (
    <div className='flex flex-col h-screen w-full'>
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