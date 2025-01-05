import styles from './Header.module.css';
import {useContext, useEffect, useState} from "react";
import {ThemeContext} from "../../../contexts/ThemeProvider.jsx";
import {useSelector} from "react-redux";
import {UserSelector} from "../../../reducers/user.slice.js";
import {FaRegSun, FaMoon, FaArrowRightFromBracket} from "react-icons/fa6";
import useLogout from "../../../hooks/useLogout.jsx";

const Header = () => {
    const {theme, setTheme} = useContext(ThemeContext);
    const user = useSelector(UserSelector);
    const {logout} = useLogout();

    const switchTheme = () => {
        setTheme((prevTheme) => prevTheme === 'light' ? 'dark' : 'light');
    }

    return <header className={styles.header}>
        <div>{user.displayName || 'Non sei loggato'}</div>
        <div className={styles.button__container}>
            <button onClick={switchTheme}>
                { theme === 'dark' ? <FaRegSun /> : <FaMoon /> }
            </button>
            <button onClick={logout}>️<FaArrowRightFromBracket/></button>
        </div>
    </header>
}

export default Header;