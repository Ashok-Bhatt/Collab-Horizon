import React from 'react'
import {useForm} from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { showErrorToast, showAcceptToast } from '../Utils/toastUtils.js';
import conf from "../config/config.js";

function Signup() {

  const navigate = useNavigate();
  const {
    register, 
    handleSubmit,
    formState: {errors, isSubmitting}
  } = useForm();

  const onSubmit = async (data)=>{

    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);
    formData.append('email', data.email);
    formData.append('avatar', data.avatar[0]);
    
    axios
    .post(`${conf.serverUrl}/api/v1/user/createAccount`, formData, {
      headers : { 'Content-Type' : 'multipart/form-data'}
    })
    .then((res)=>{
      showAcceptToast("Account created successfully!");
      navigate("/");
    })
    .catch((error)=>{
     showErrorToast("Something went wrong! Couldn't create account");
    })

  }

  return (
    <div className='flex h-full w-full'>
      {/* Left Side Containing Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center justify-center h-full w-7/10 bg-white gap-y-10">
        <p className="text-5xl text-black font-semibold">Create New Account</p>
        <div className='flex flex-col gap-y-2'>

          {/* Username Field */}
          <div className='flex flex-col pad-y-2'>
            <input type="text" placeholder='Username' className='text-black w-100 bg-green-50 border border-green-300 px-5 py-2 rounded-full' {
              ...register(
                "username", 
                {
                  required: "Username is required",
                }
              )
            }/>

            {errors.username && <p className='text-red-600'>{errors.username.message}</p>}
          </div>

          {/* Email Field */}
          <div className='flex flex-col pad-y-2'>
            <input type="text" placeholder='Email' className='text-black w-100 bg-green-50 border border-green-300 px-5 py-2 rounded-full' {
              ...register(
                "email", 
                {
                  required: "Email is required",
                  pattern: {
                    value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                    message : "Invalid gmail",
                  },
                }
              )
            }/>

            {errors.email && <p className='text-red-600'>{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div className='flex flex-col pad-y-2'>
            <input type="text" placeholder='Password' className='text-black w-100 bg-green-50 border border-green-300 px-5 py-2 rounded-full' {
              ...register(
                "password", 
                {
                  required: "Password is required", 
                  minLength: {
                    value: 8,
                    message: "Password length should be at least 8"
                  }
                }
              )
            }/>

            {errors.password && <p className='text-red-600'>{errors.password.message}</p>}
          </div>

          {/* Avatar Input */}
          <div className='flex flex-col gap-y-5'>
            <div className="flex gap-x-5">
              <label className='font-semibold'>Avatar</label>
              <input type="file" className='border-2' {
                ...register(
                  "avatar", 
                  {
                    required: "Avatar is required", 
                  }
                )
              }/>
            </div>
            {errors.avatar && <p className='text-red-600'>{errors.avatar.message}</p>}
          </div>
        </div>

        {/* Submit Button */}
        <button type='submit' className='bg-teal-400 text-white py-2 px-15 rounded-full' disabled={isSubmitting}>Sign Up</button>
      </form>

      {/* Right Side Containing Sign Up Option*/}
      <div className="flex flex-col items-center justify-center gap-y-10 h-full w-3/10 p-5 bg-teal-400">
        <p className='text-4xl text-white font-semibold'>Already have account?</p>
        <p className='text-white text-lg'>Sign in and have a great experience of Collab Horizon</p>
        <button className='bg-white text-black py-2 px-15 rounded-full' onClick={()=>navigate("/login")}>Login</button>
      </div>

    </div>
  )
}

export default Signup