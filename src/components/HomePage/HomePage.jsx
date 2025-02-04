import styles from './HomePage.module.css';
import CreatePostComponent from '../CreatePostComponent/CreatePostComponent.jsx'
import PostListComponent from '../PostListComponent/PostListComponent.jsx';
import {updateCommentPost} from "../../services/commentPost.service.js";
import React, {useRef} from 'react';

const HomePage = () => {
    const postListRef = useRef(null);

    const updateList = () => {
        console.log("Updating list");
        if (postListRef.current) {
            postListRef.current.aggiornaLista();
        }
    };


    return (
        <div className={styles.homePage}>
            
            <div className={styles.createPostSection}>
                <CreatePostComponent updateListEvent={updateList} />
            </div>
            <div className={styles.postListContainer}>
                <PostListComponent ref={postListRef} />
            </div>
        </div>
    );
};

export default HomePage;

