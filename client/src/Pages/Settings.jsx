import React, { useEffect, useState, useContext } from 'react';
import { SettingOption, ToggleButton, Input } from '../Components/export.js';
import { FaExchangeAlt, FaTimes } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { ThemeContext } from '../Contexts/export.js';
import conf from "../config/config.js";
import axios from 'axios';
import { showErrorToast, showAcceptToast } from "../Utils/toastUtils.js";

function Settings() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const changePassword = (data) => {
    // Check if old and new passwords are the same
    if (data.oldPassword === data.newPassword) {
      showErrorToast("New password cannot be the same as the old password!");
      return;
    }

    const formData = new FormData();
    formData.append('oldPassword', data.oldPassword);
    formData.append('newPassword', data.newPassword);

    axios
      .post(
        `${conf.serverUrl}/api/v1/user/changePassword`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      )
      .then((res) => {
        showAcceptToast("Password changed successfully!");
        reset();
      })
      .catch((error) => {
        showErrorToast("Failed to change password!");
      })
      .finally(() => {
        setIsModalOpen(false);
      });
  };

  return (
    <div className='flex flex-col h-full w-full p-6 md:p-10 bg-gray-50 text-gray-800 space-y-6'>
      <h2 className="text-3xl font-extrabold text-gray-800 mb-4">Settings</h2>
      
      <SettingOption
        settingOptionText="Dark Mode"
        settingOptionBlock={<ToggleButton toggleState={theme === 'dark'} toggleCallback={toggleTheme} />}
      />
      
      <SettingOption
        settingOptionText="Change Password"
        settingOptionBlock={
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 rounded-full text-white bg-blue-500 hover:bg-blue-600 transition-colors duration-200 shadow-md"
            aria-label="Change Password"
          >
            <FaExchangeAlt />
          </button>
        }
      />

      {isModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm'>
          <form
            className='flex flex-col w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl relative space-y-4 animate-fade-in-up'
            onSubmit={handleSubmit(changePassword)}
          >
            <button
              type='button'
              onClick={() => setIsModalOpen(false)}
              className='absolute top-4 right-4 text-gray-400 hover:text-gray-600'
              aria-label="Close"
            >
              <FaTimes className='text-xl' />
            </button>
            <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">Change Password</h3>
            <Input
              placeholder="Enter Old Password"
              inputType="password"
              {...register("oldPassword", { required: "Old password is required" })}
              errorObj={errors?.oldPassword}
            />
            <Input
              placeholder="Enter New Password"
              inputType="password"
              {...register("newPassword", {
                required: "New password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" }
              })}
              errorObj={errors?.newPassword}
            />
            <div className="flex justify-end gap-4 pt-2">
              <button
                type='button'
                onClick={() => setIsModalOpen(false)}
                className="py-2 px-6 rounded-lg text-gray-800 font-semibold bg-gray-300 hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type='submit'
                className="py-2 px-6 rounded-lg text-white font-semibold bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
              >
                Change Password
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Settings;