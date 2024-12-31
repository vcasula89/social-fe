import {createContext, useEffect, useState} from "react";

export const ThemeContext = createContext({})

export const ThemeProvider = ({children}) => {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || 'light');

    useEffect(() => {
        console.log(theme);
        document.querySelector('html').setAttribute('data-theme', theme)
        localStorage.setItem('theme', theme);
    }, [theme]);

    return <ThemeContext.Provider value={{theme, setTheme}}>
        {children}
    </ThemeContext.Provider>
}