import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Contexts/export.js';

function AuthLayout(props) {

  const {authentication, children} = props;
  const navigate = useNavigate();
  const {user, changeUser, checkAuth} = useContext(UserContext);

  const logoutUser = () => {
    changeUser(null);
    localStorage.setItem("accessToken", "");
  }

  useEffect(()=>{
    checkAuth(logoutUser);
  }, []);

  useEffect(()=>{
    if (user && !authentication){
      navigate("/");
    } else if (!user && authentication){
      navigate("/login");
    }
  }, [authentication, user]);

  return (
    <>
      {children}
    </>
  )
}

export default AuthLayout
