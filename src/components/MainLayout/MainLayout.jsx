import styles from "./MainLayout.module.css"
import Header from "../Header/Header.jsx";
import {Outlet} from "react-router-dom";

const MainLayout = () => {
    return <>
        <Header/>
        <main className={styles.main__container}>
            <Outlet />
        </main>
    </>
}

export default MainLayout;