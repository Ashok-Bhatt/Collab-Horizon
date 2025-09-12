import { useState } from "react";
import { UserContext } from "./UserContext.js"
import axios from "axios";

const UserContextProvider = ({children}) => {

    const [user, setUser] = useState(null);
    
    const changeUser = (newUser)=>{
        setUser(newUser);
    }

    const checkAuth = () => {
        axios.post()
    }
    
    return (
        <UserContext.Provider value={{user, changeUser, checkAuth}}>
            {children}
        </UserContext.Provider>
    )    
}

export default UserContextProvider;