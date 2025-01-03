import styles from "./PostListComponent.module.css";
import PostComponent from "../PostComponent/PostComponent.jsx";

const PostListComponent = () => {
    return <>
        <div className={styles.postList}>
            <PostComponent/>
            <PostComponent/>
            <PostComponent/>
            <PostComponent/>
        </div>
    </>
}
export default PostListComponent;