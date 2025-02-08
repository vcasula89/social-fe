import styles from './Header.module.css';
import {useContext} from "react";
import { Link } from 'react-router-dom';
import {ThemeContext} from "../../contexts/ThemeProvider.jsx";
import {useSelector} from "react-redux";
import {UserSelector} from "../../reducers/user.slice.js";
import {FaArrowRightFromBracket} from "react-icons/fa6";
import useLogout from "../../hooks/useLogout.jsx";
import Logo from "../../assets/logosocial.png";


const Header = () => {
    const {theme} = useContext(ThemeContext);
    const user = useSelector(UserSelector);
    const {logout} = useLogout();

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <Link to="/">
                    <img
                        src={Logo}
                        alt="Logo"
                        style={{ height: '50px', width: 'auto' }}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src='/default-logo.png';
                        }}
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
