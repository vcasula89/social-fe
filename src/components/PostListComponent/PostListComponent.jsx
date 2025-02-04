import React, { useImperativeHandle, useRef, forwardRef } from 'react';
import styles from "./PostListComponent.module.css";
import VisualizationPost from "../VisualizationPostComponent/VisualizationPost.jsx";

const PostListComponent = forwardRef((props, ref) => {

    const postListRef = useRef(null);

    const aggiornaLista = () => {
        console.log("Lista dei post aggiornata!");
        // Qui puoi aggiornare la lista, ad esempio facendo una nuova fetch
        if (postListRef.current) {
            postListRef.current.updateList();
        }
    };

    useImperativeHandle(ref, () => ({
        aggiornaLista
    }));
    return (
        <div className={styles.postList}>
            <VisualizationPost ref={postListRef}  />
        </div>
    );
});

export default PostListComponent;