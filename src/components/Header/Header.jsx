import styles from './Header.module.css';
import {useContext, useEffect, useState} from "react";
import { Link } from 'react-router-dom';
import {ThemeContext} from "../../contexts/ThemeProvider.jsx";
import {useSelector} from "react-redux";
import {UserSelector} from "../../reducers/user.slice.js";
import {FaRegSun, FaMoon, FaArrowRightFromBracket} from "react-icons/fa6";
import useLogout from "../../hooks/useLogout.jsx";
import Logo from "../../assets/logosocial.png"
import Logodark from "../../assets/logodark.png"

const Header = () => {
    const {theme, setTheme} = useContext(ThemeContext);
    const user = useSelector(UserSelector);
    const {logout} = useLogout();


    const switchTheme = () => {
        setTheme((prevTheme) => prevTheme === 'light' ? 'dark' : 'light');
    };

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <Link to="/">
                <img 
                src={theme === 'light' ? Logodark : Logo}
                alt="Logo" 
                style={{ height: '50px', width: 'auto' }} 
                />
                </Link>
            </div>

            <div className={styles.button__container}>
                {user && user.displayName ? (
                    <>
                        <img src={user.avatarUrl || '/default-avatar.png'} alt="Avatar" className={styles.avatar} />
                        <div>{user.displayName}</div>
                        <button onClick={logout} aria-label="Logout">
                            <FaArrowRightFromBracket />
                        </button>
                    </>
                ) : (
                    <Link to="/login" className={styles.loginButton}>
                        Login
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;