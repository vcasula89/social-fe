import React, { useState } from 'react';
import CreatePostComponent from '../CreatePostComponent/CreatePostComponent.jsx'
import PostListComponent from '../PostListComponent/PostListComponent.jsx'

const HomePage = () =>{
    const [posts, setPosts] = useState([]); 
    const addPost = (newPost) => { 
        setPosts([newPost, ...posts]); 
    };

    return <>
    <CreatePostComponent/>
    <PostListComponent/>

    </>
}

export default HomePage;