import React, { useContext } from 'react'
import { UserContext } from '../Contexts/export.js'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, Zoom } from 'react-toastify';

function Navbar() {

    const navigate = useNavigate();
    const {user, changeUser} = useContext(UserContext);
    const userAvatar = user ? user.avatar : "/Image/profile_logo.png";


    const logout = () => {
        axios
        .post(
            "http://localhost:8000/api/v1/user/logout", 
            { withCredentials: true }, 
            {
                headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`}
            }
        )
        .then((res)=>{
            changeUser(null);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("loggedInUser");
            navigate("/login");
        })
        .catch((error)=>{
            toast.error("Couldn't logout", {
                position: "bottom-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Zoom,
            });
        })
    }

    const navigateProfile = () => {
        if (user){
            navigate(`/profile/${user._id}`);
        }
    }


  return (
    <nav className='flex justify-end items-center bg-blue-100 p-2 gap-x-5'>
        <button className='border-0 bg-blue-100 hover:bg-blue-200 text-lg py-1 px-3 rounded-lg' onClick={logout}>Logout</button>
        <div className='rounded-full h-[50px] w-[50px] overflow-hidden' onClick={navigateProfile}>
            <img src={userAvatar} className='h-full w-full'/>
        </div>
    </nav>
  )
}

export default Navbar
