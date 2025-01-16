import React from 'react';
import styles from "./PostListComponent.module.css";
import VisualizationPost from "../VisualizationPostComponent/VisualizationPost.jsx";

const PostListComponent = () => {
    return (
        <div className={styles.postList}>
            <VisualizationPost />
        </div>
    );
};

export default PostListComponent;