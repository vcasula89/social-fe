import styles from "./Profile.module.css";

const Profile = () => {
    return (
        <div className={styles.profile}>
            <img 
                alt="Profile"
                className={styles.img}
            />
        </div>
    );
};

export default Profile;