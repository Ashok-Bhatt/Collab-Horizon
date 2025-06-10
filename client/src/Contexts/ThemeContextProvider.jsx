import { useState } from "react";
import { ThemeContext } from "./ThemeContext.js";

const ThemeContextProvider = ({children}) => {

    const [theme, setTheme] = useState("light");

    const toggleTheme = ()=>{
        setTheme(theme=="light" ? "dark" : "light");
    }
    
    return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )    
}

export default ThemeContextProvider;