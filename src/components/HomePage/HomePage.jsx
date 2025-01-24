import styles from './HomePage.module.css';
import CreatePostComponent from '../CreatePostComponent/CreatePostComponent.jsx'
import PostListComponent from '../PostListComponent/PostListComponent.jsx';


const HomePage = () => {
    return (
        <div className={styles.homePage}>
            <h1>Benvenuto su TheNet!</h1>
            <div className={styles.createPostSection}>
                <CreatePostComponent />
            </div>
            <div className={styles.postListContainer}>
                <PostListComponent />
            </div>
        </div>
    );
};

export default HomePage;

