import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Contexts/export.js';

function AuthLayout(props) {

  const {authentication, children} = props;
  const navigate = useNavigate();
  const {user} = useContext(UserContext);

  useEffect(()=>{
    console.log(user);
    console.log(authentication);
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
