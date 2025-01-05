import styles from "./Feed.module.css";
/*import Post from "../Feed/Post/Post.jsx" è un esempio per inserire poi la parte dei post*/

const Feed = () => {
    const posts = [];

    return (
        <div className={styles.feed}>
            <h2>Post recenti...</h2>
            {posts.map((post) => (
                <div key={post.id} className={styles.post}>
                </div>
            ))}
        </div>
    );
};

export default Feed;