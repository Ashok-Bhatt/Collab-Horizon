import { useNavigate } from 'react-router-dom';
import {useForm} from "react-hook-form";
import axios from "axios";
import { UserContext } from '../Contexts/export.js';
import { useContext } from 'react';
import { showErrorToast } from '../Utils/toastUtils.js';
import conf from "../config/config.js";

function Login() {

  const navigate = useNavigate();
  const {user, changeUser} = useContext(UserContext);

  const {
    register, 
    handleSubmit,
    formState: {errors, isSubmitting}
  } = useForm();

  const onSubmit = async (data)=>{
    
    const formData = new FormData();
    formData.append('password', data.password);
    formData.append('email', data.email);
    
    axios
    .post(`${conf.serverUrl}/api/v1/user/login`, formData, {
      headers : { 'Content-Type' : 'multipart/form-data'},
      withCredentials: true,
    })
    .then((res)=>{
      localStorage.setItem("accessToken", res.data["accessToken"]);
      const loggedInUser = res["data"]["user"][0];
      changeUser(loggedInUser);
      localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
      navigate("/");
    })
    .catch((error)=>{
      showErrorToast("Something went wrong! login unsuccessful!");
    })

  }

  return (
    <div className='flex h-full w-full'>
      {/* Left Side Containing Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center justify-center h-full w-7/10 bg-white gap-y-10">
        <p className="text-5xl text-black font-semibold">Login to Your Account</p>
        <div className='flex flex-col gap-y-2'>

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
          </div>

        {/* Submit Button */}
        <button type='submit' className='bg-teal-400 text-white py-2 px-15 rounded-full' disabled={isSubmitting}>Sign In</button>
      </form>

      {/* Right Side Containing Sign Up Option*/}
      <div className="flex flex-col items-center justify-center gap-y-10 h-full w-3/10 p-5 bg-teal-400">
        <p className='text-4xl text-white font-semibold'>New Here?</p>
        <p className='text-white text-lg'>Sign up and discover a great amount of new opportunities</p>
        <button className='bg-white text-black py-2 px-15 rounded-full' onClick={()=>navigate("/signup")}>Sign Up</button>
      </div>

    </div>
  )
}

export default Login