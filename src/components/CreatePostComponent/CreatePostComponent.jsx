import React, { useState } from 'react';
import styles from "./CreatePostComponent.module.css";
import {useSelector} from "react-redux";
import {UserSelector} from "../../reducers/user.slice.js";

const PostComponent = () => {
    const [title, setTitle] = useState(''); 
    const [body, setBody] = useState(''); 
    const [image, setImage] = useState(null); 
    const [error, setError] = useState(''); 
    const [posts, setPosts] = useState([]); 
    const user = useSelector(UserSelector);
    
    const handleTitleChange = (e) => setTitle(e.target.value); 
    const handleBodyChange = (e) => setBody(e.target.value); 
    const handleImageChange = (e) => setImage(e.target.files[0]); 
    
    const handleSubmit = (e) => { 
        e.preventDefault(); 
        if (!title || !body) { 
            setError('Title and body are required.'); 
            return; 
        } 
        if (image && image.size > 5 * 1024 * 1024) { 
            setError('Image size must be less than 5MB.'); 
            return; 
        } 
        
        const post = { 
            title, 
            body, 
            image: image ? URL.createObjectURL(image) : null,
            timestamp: new Date().toISOString(), 
            author: user.displayName,
        }; 
        
        setPosts([post, ...posts]); console.log(post);
        setTitle(''); 
        setBody(''); 
        setImage(null); 
        setError('');
    };

    return ( 
        <> 
        <form onSubmit={handleSubmit} className={styles.postForm}>
             <div className={styles.formGroup}> 
                <label> 
                    Title: 
                    <input type="text" value={title} onChange={handleTitleChange} maxLength="100" /> 
                </label> 
             </div> 
            <div className={styles.formGroup}> 
                    <label> 
                            Body: 
                            <textarea value={body} onChange={handleBodyChange} maxLength="200"></textarea> 
                            </label> 
                        </div> 
                        <div className={styles.formGroup}> 
                            <label> 
                                Image (optional):
                                <input type="file" accept="image/jpeg,image/png" onChange={handleImageChange} /> 
                            </label> 
                        </div> 
                     {error && <p style={{ color: 'red' }}>{error}</p>} 
                    <button type="submit" className={styles.submitButton}>Create Post</button>
             </form> 
         </> 
    );
};

export default PostComponent;
