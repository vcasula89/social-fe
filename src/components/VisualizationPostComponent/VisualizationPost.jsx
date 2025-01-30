import { useEffect, useState } from 'react';
import { config } from '../../../config';
import styles from './VisualizationPost.module.css';
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
    const [commentText, setCommentText] = useState('');

    useEffect(() => {
        // Simulazione di controllo autenticazione
        const checkAuth = () => {
            const userIsLoggedIn = true;
            setIsLoggedIn(userIsLoggedIn);
        };
        checkAuth();
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
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

        fetchPosts();
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

    //funzione per l'aggiunta dei like
    const addLike = async (postId) => {
        try {
            console.log(`Adding like to post ${postId}`);
            const response = await fetch(`${config.api.BASE_URL}/post/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ postId, userId })
            });
            if (!response.ok) {
                const errorMessage = await response.text();
                console.error('Error in addLike:', errorMessage);
                throw new Error('Errore nel mettere il like');
            }
            const updatedPost = await response.json();
            setPosts(prevPosts => prevPosts.map(post =>
                post.id === postId ? { ...post, likes: updatedPost.likes } : post
            ));
        } catch (error) {
            setError(error);
            console.error('Error in addLike:', error);
        }
    };

    //funzione per l'aggiunta dei commenti
    const addComment = async (postId, commentText) => {
        try {
            console.log(`Adding comment to post ${postId}: ${commentText}`);
            const response = await fetch(`${config.api.BASE_URL}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ postId, text: commentText, userId })
            });
            if (!response.ok) {
                const errorMessage = await response.text();
                console.error('Error in addComment:', errorMessage);
                throw new Error('Errore nel mettere il commento');
            }
            const updatedComment = await response.json();
            setPosts(prevPosts => prevPosts.map(post =>
                post.id === postId ? { ...post, comments: [...post.comments, updatedComment] } : post
            ));
        } catch (error) {
            setError(error);
            console.error('Error in addComment:', error);
        }
    };

    const handleCommentChange = (e) => {
        setCommentText(e.target.value);
    };

    const handleSubmitComment = (postId) => {
        addComment(postId, commentText);
        setCommentText('');
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
                    
            <div className={styles.author}>
            <img 
                src={post.userId?.avatar} 
                className={styles.avatar} 
                alt={post.userId?.displayName} 
            />
            <span className={styles.authorName}>
                {post.userId?.displayName}
            </span>
            </div>
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
                                    
                        <div className={styles.author}>
                            <img 
                                src={comment.userId?.avatar} 
                                className={styles.avatar} 
                                alt={comment.userId?.displayName} 
                            />
                            <span className={styles.authorName}>
                                {comment.userId?.displayName}
                            </span>
                        </div>
                                <div>
                                    
                                    <p>{comment.commentText}</p>
                                </div>
                                    <p>{comment.text}</p>
                                    
                                </div>
                            ))}
                            <div className={styles.commentForm}>
                                <input
                                    type="text"
                                    value={commentText}
                                    onChange={handleCommentChange}
                                    placeholder="Scrivi un commento..."
                                />
                                <button onClick={() => handleSubmitComment(post.id)}>Invia</button>
                            </div>
                        </div>
                    )}
                    {isLoggedIn && (
                        <div className={styles.buttonGroup}>
                            <button className={styles.likeButton} onClick={() => addLike(post.id)}>
                                <AiTwotoneLike/>
                            </button>
                            <div className={styles.commentButtons}>
                                <button onClick={() => toggleAccordion(post.id)}><TfiCommentAlt/></button>
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
