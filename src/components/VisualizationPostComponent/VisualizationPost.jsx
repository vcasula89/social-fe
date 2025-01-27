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
    //eseguo una chiamata API per ottenere i post
    useEffect(() => {
        const fetchPosts = async (page) => {
            try {
                const response = await fetch(`${config.api.BASE_URL}/posts?page=${page}`);
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

    //implemrntazione dello scroll, quando arrivo alla fine della pagina carico altri post
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

    //apertura dell'accordion per la visualizzaione dei commenti
    const toggleAccordion = (postId) => {
        setOpenAccordion(openAccordion === postId ? null : postId);
    };

    const addLike = (postId) => {
        // Implementare la logica per aggiungere un like
    };

    const addComment = (postId) => {
        // Implementare la logica per aggiungere un commento
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }
     
    //parte di come vengono visualizzati i post
    return (
        <div>
            {posts.map((post, postIndex) => (
                <div key={post.id || postIndex} className={styles.post}>
                    <h2>{post.title}</h2>
                    {post.image && <img src={post.image} alt={post.title} className={styles.image} />}
                    <p>{post.body}</p>
                    <div className={styles.date}>Date: {new Date(post.date).toLocaleDateString()}</div>
                    <div className={styles.likes}>Likes: {post.likes}</div>
                    <div className={styles.comments}>Comments: {post.comments.length}</div>
                    {openAccordion === post.id && (
                        <div className={styles.accordion}>
                            {post.comments.map((comment, commentIndex) => (
                                <div key={comment.id || commentIndex} className={styles.comment}>
                                    <p>{comment.text}</p>
                                    <p>By: {comment.author}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    {isLoggedIn && (
                        <div className={styles.buttonGroup}>
                            <button className={styles.likeButton} onClick={() => addLike(post.id)}>
                                <AiTwotoneLike />
                            </button>
                            <div className={styles.commentButtons}>
                                <button onClick={() => addComment(post.id)}><TfiCommentAlt /></button>
                                <button onClick={() => toggleAccordion(post.id)}>
                                    {openAccordion === post.id ? <RxEyeClosed /> : <LiaComments />}
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