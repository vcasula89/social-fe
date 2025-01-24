import { useEffect, useState } from 'react';
import { config } from '../../../config';
import styles from './visualizationPost.module.css';
import { AiTwotoneLike } from "react-icons/ai";
import { LiaComments } from "react-icons/lia";
import { TfiCommentAlt } from "react-icons/tfi";
import { RxEyeClosed } from "react-icons/rx";

const VisualizationPost = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [openAccordion, setOpenAccordion] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Simulazione di controllo autenticazione
        const checkAuth = () => {
            const userIsLoggedIn = true;
            setIsLoggedIn(userIsLoggedIn);
        };

        checkAuth();
    }, []);

    useEffect(() => {
        const fetchPosts = async (page) => {
            try {
                const response = await fetch(`${config.api.BASE_URL}/api/posts?page=${page}`);
                if (!response.ok) {
                    throw new Error('Qualcosa è andato storto');
                }
                const data = await response.json();
                setPosts(prevPosts => [...prevPosts, ...data]);
                if (data.length < 25) {
                    setHasMore(false);
                }
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchPosts(page);
    }, [page]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading || !hasMore) {
                return;
            }
            setPage(prevPage => prevPage + 1);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, hasMore]);

    const toggleAccordion = (postId) => {
        setOpenAccordion(openAccordion === postId ? null : postId);
    };

    const addLike = (postId) => {
        // Implementa la logica per aggiungere un like
    };

    const addComment = (postId) => {
        // Implementa la logica per aggiungere un commento
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            {posts.map(post => (
                <div key={post.id} className={styles.post}>
                    <h2>{post.title}</h2>
                    {post.image && <img src={post.image} alt={post.title} className={styles.image}/>}
                    <p>{post.body}</p>
                    <div className={styles.date}>Date: {new Date(post.date).toLocaleDateString()}</div>
                    <div className={styles.likes}>Likes: {post.likes}</div>
                    <div className={styles.comments}>Comments: {post.comments.length}</div>
                    {openAccordion === post.id && (
                        <div className={styles.accordion}>
                            {post.comments.map(comment => (
                                <div key={comment.id} className={styles.comment}>
                                    <p>{comment.text}</p>
                                    <p>By: {comment.author}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    {isLoggedIn && (
                        <div className={styles.buttonGroup}>
                            <button className={styles.likeButton} onClick={() => addLike(post.id)}>
                                <AiTwotoneLike/>
                            </button>
                            <div className={styles.commentButtons}>
                                <button onClick={() => addComment(post.id)}><TfiCommentAlt/></button>
                                <button onClick={() => toggleAccordion(post.id)}>
                                    {openAccordion === post.id ? <RxEyeClosed/> : <LiaComments/>}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
            {loading && <div>Caricando altri post...</div>}
        </div>

    );
};

export default VisualizationPost;