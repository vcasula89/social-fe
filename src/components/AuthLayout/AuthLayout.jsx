import styles from "./AuthLayout.module.css"
import {Outlet} from "react-router-dom";

const AuthLayout = () => {
    return <main className={styles.auth__container}>
        <Outlet/>
    </main>
}

export default AuthLayout;