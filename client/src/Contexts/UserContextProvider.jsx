import { useState } from "react";
import { UserContext } from "./UserContext.js"

const UserContextProvider = ({children}) => {

    const [user, setUser] = useState(null);
    
    const changeUser = (newUser)=>{
        setUser(newUser);
    }
    
    return (
        <UserContext.Provider value={{user, changeUser}}>
            {children}
        </UserContext.Provider>
    )    
}

export default UserContextProvider;