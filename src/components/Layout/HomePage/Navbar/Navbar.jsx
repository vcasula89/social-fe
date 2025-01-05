import { Link } from 'react-router-dom';

import styles from './Navbar.module.css'; // impostata più o meno ma da rivedere
import Profile from '../Profile/Profile';

const Navbar = () => {

    

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <Link to="/">SocialApp</Link>
            </div>
            <ul className={styles.navLinks}>
                
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                        <li>
                            <Link to="/registration">Registrati</Link>
                        </li>
                        </ul>

                    <div>
                    <span alt="userName"> </span> {/* Nome dell'utente */}
                    <img
                        alt="Avatar"
                        
                    />
                </div>
            
        </nav>
    );
};

export default Navbar;