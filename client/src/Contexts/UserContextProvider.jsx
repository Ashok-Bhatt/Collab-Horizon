import { useState } from "react";
import { UserContext } from "./UserContext.js"
import axios from "axios";
import conf from "../config/config.js";
import { useNavigate } from "react-router-dom";

const UserContextProvider = ({children}) => {

    const [user, setUser] = useState(null);
        
    const changeUser = (newUser)=>{
        console.log(newUser);
        setUser(newUser);
    }

    const checkAuth = async (callback) => {
        axios
        .get(`${conf.serverUrl}/api/v1/user/checkAuth`, {withCredentials: true})
        .then((res)=>{
            if (res.status > 400){
                axios
                .get(`${conf.serverUrl}/api/v1/user/getNewTokens`, {withCredentials: true})
                .then((res)=>{
                    if (res.status < 400){
                        const data = res.data.data;
                        localStorage.setItem("accessToken", data.accessToken);
                        axios
                        .get(`${conf.serverUrl}/api/v1/user/getUserInfo/${id}`, { withCredentials: true })
                        .then((res)=>{
                            if (res.data.data.length > 0){
                                setUserData(res.data.data[0]);
                            }
                        })
                        .catch((error)=>{
                            showErrorToast("couldn't fetch user info");
                        })
                    } else {
                        callback();
                    }
                })
                .catch((error)=>{
                    callback();
                })
            }
        })
        .catch((error)=>{
            console.log(error);
            axios
            .get(`${conf.serverUrl}/api/v1/user/getNewTokens`, {withCredentials: true})
            .then((res)=>{
                if (res.status < 400){
                    const data = res.data.data;
                    localStorage.setItem("accessToken", data.accessToken);
                } else {
                    callback();
                }
            })
            .catch((error)=>{
                callback();
            })
        })
    }
    
    return (
        <UserContext.Provider value={{user, changeUser, checkAuth}}>
            {children}
        </UserContext.Provider>
    )    
}

export default UserContextProvider;