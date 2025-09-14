import React, { useContext } from 'react'
import { UserContext } from '../Contexts/export.js'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { showErrorToast, showAcceptToast } from '../Utils/toastUtils.js';
import conf from "../config/config.js";

function Navbar() {

    const navigate = useNavigate();
    const {user, changeUser} = useContext(UserContext);
    const userAvatar = user ? user.avatar : "/Image/profile_logo.png";


    const logout = () => {
        axios
        .post(
            `${conf.serverUrl}/api/v1/user/logout`, 
            { withCredentials: true }, 
            {
                headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`}
            }
        )
        .then((res)=>{
            changeUser(null);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("loggedInUser");
            showAcceptToast("Logged out successfully");
            navigate("/login");
        })
        .catch((error)=>{
            showErrorToast("Couldn't logout");
        })
    }

    const navigateProfile = () => {
        if (user){
            navigate(`/profile/${user._id}`);
        }
    }


  return (
    <nav className='flex items-center justify-between border-b border-gray-300 bg-white px-6 py-3 shadow-sm'>
        {/* Left section for a potential logo or title */}
        <div className='flex items-center'>
        <span className='text-xl font-bold text-gray-800'>MyApp</span>
        </div>

        {/* Right section with user actions */}
        <div className='flex items-center gap-x-4'>
        <button 
            className='rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2' 
            onClick={logout}
        >
            Logout
        </button>
        <button 
            className='relative h-10 w-10 overflow-hidden rounded-full border-2 border-transparent transition-all duration-200 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500' 
            onClick={navigateProfile}
        >
            <img src={userAvatar} className='h-full w-full object-cover' alt="User Avatar" />
        </button>
        </div>
    </nav>
    );
}

export default Navbar
