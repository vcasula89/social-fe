import { useEffect, useState } from 'react';
import { config } from '../../../config';
import styles from './VisualizationPost.module.css';
import { AiTwotoneLike } from "react-icons/ai";
import { LiaComments } from "react-icons/lia";
import { TfiCommentAlt } from "react-icons/tfi";
import { RxEyeClosed } from "react-icons/rx";
import { AiOutlineLike } from "react-icons/ai";
import { AiOutlineDislike } from "react-icons/ai";
import {useSelector} from "react-redux";
import {UserSelector} from "../../reducers/user.slice.js"
import {likeDislikePost} from "../../services/likeDislikePost.service.js";
import {addCommentPost, updateCommentPost} from "../../services/commentPost.service.js";


const VisualizationPost = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [openAccordion, setOpenAccordion] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [commentText, setCommentText] = useState('');
    const user = useSelector(UserSelector);

    useEffect(() => {
        // Simulazione di controllo autenticazione
        const checkAuth = () => {
            const userIsLoggedIn = true;
            setIsLoggedIn(userIsLoggedIn);
        };

        checkAuth();
    }, []);
    //eseguo una chiamata API per ottenere i post
    const fetchPosts = async (page) => {
        try {
            let cursor = new Date().toISOString(); // Usa la data corrente per la prima chiamata

            if (posts.length > 0) {
                // Se ci sono già post, prendi la data dell'ultimo post
                cursor = new Date(posts[posts.length - 1].createdAt).toISOString();
            }

            let response = {};
            const url = `${config.api.BASE_URL}/posts?cursor=${encodeURIComponent(cursor)}&limit=25`;

            if (user != null && user.accessToken != null) {
                response = await fetch(url, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${user.accessToken}` },
                });
            } else {
                response = await fetch(url, { method: 'GET' });
            }

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


    useEffect(() => {
        fetchPosts(page);
    }, [page]);

    //implementazione dello scroll, quando arrivo alla fine della pagina carico altri post
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

    const addLike = (postId, isLiked) => {

        //ho tutto e posso spedire al BACKEND
        likeDislikePost(postId, user.accessToken, isLiked)
            .then((data)=>{
                console.log(data);
                // Trova l'indice del post da aggiornare
                const postIndex = posts.findIndex(post => post._id === postId);

                if (postIndex !== -1) {
                    //Crea una copia del post da aggiornare, prendendo il likesCounter dal BE e isLiked dal post,
                    //invertendo la logica tra mi piace/non mi piace
                    const updatedPost = {...posts[postIndex], likesCounter: data.likesCounter, isLiked:!isLiked};

                    // Crea una nuova copia dell'array con il post aggiornato
                    const updatedPosts = [
                        ...posts.slice(0, postIndex),
                        updatedPost,
                        ...posts.slice(postIndex + 1)
                    ];

                    // Aggiorna lo stato con il nuovo array
                    setPosts(updatedPosts);
                    console.log("Post aggiornato", updatedPost);
                }
            })

            .catch(error => {

            });
        return;
    }
    const showLike = (isLiked, postId) => {
        return (
            <button className={styles.likeButton} onClick={() => addLike(postId, isLiked)}>
                {isLiked ?<AiOutlineDislike /> : <AiOutlineLike />}
                {isLiked ? ' Non mi piace più' : ' Mi piace'}
            </button>
        );
    };

    const addComment = (postId, commentText) => {
        //ho tutto e posso spedire al BACKEND
        addCommentPost(postId, user.accessToken, commentText)
            .then((data)=>{
                console.log(data);
                // Trova l'indice del post da aggiornare
                const postIndex = posts.findIndex(post => post._id === postId);

                if (postIndex !== -1) {
                    //Crea una copia del post da aggiornare, prendendo il commentsCounter dal BE

                    const updatedPost = {...posts[postIndex], commentsCounter: data.commentsCounter, comments: data.comments };

                    // Crea una nuova copia dell'array con il post aggiornato
                    const updatedPosts = [
                        ...posts.slice(0, postIndex),
                        updatedPost,
                        ...posts.slice(postIndex + 1)
                    ];

                    // Aggiorna lo stato con il nuovo array
                    setPosts(updatedPosts);
                    console.log("Post aggiornato", updatedPost);
                }
            })

            .catch(error => {

            });
        return;

    };

    /*const updateComment = (postId, commentId, newCommentText) => {
        updateCommentPost(commentId, user.accessToken, newCommentText)
            .then((data) => {
                console.log(data);

                // Trova l'indice del post che contiene il commento
                const postIndex = posts.findIndex(post => post._id === postId);
                if (postIndex !== -1) {
                    // Trova l'indice del commento da aggiornare
                    const commentIndex = posts[postIndex].comments.findIndex(comment => comment._id === commentId);
                    if (commentIndex !== -1) {
                        // Clona il post e aggiorna il commento specifico
                        const updatedComments = [...posts[postIndex].comments];
                        updatedComments[commentIndex] = { ...updatedComments[commentIndex], commentText: newCommentText };

                        const updatedPost = { ...posts[postIndex], comments: updatedComments };

                        // Aggiorna lo stato con il post modificato
                        const updatedPosts = [...posts];
                        updatedPosts[postIndex] = updatedPost;
                        setPosts(updatedPosts);

                        console.log("Commento aggiornato", updatedPost);
                    }
                }
            })
            .catch(error => {
                console.error("Errore nell'aggiornamento del commento", error);
            });
    };
*/
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
     
    //parte di come vengono visualizzati i post
    return (
        <div>
          {posts.map((post, postIndex) => (
    <div key={post._id || postIndex} className={styles.post}>
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
        {post.image && <img src={post.image} alt={post.title} className={styles.image} />}
        <p>{post.body}</p>
        <div className={styles.date}>Date: {new Date(post.date).toLocaleDateString()}</div>
        <div className={styles.likes}>Likes: {post.likesCounter}</div>
        <div className={styles.comments}>Comments: {post.commentsCounter}</div>
        {openAccordion === post._id && (
            <div className={styles.accordion}>
                {post.comments.map((comment, commentIndex) => (
                    <div key={comment._id || commentIndex} className={styles.comment}>
                        <p>{comment.commentText}</p>
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
                        <p>By: {comment.userId.displayName}</p>
                    </div>
                ))}
                <div className={styles.commentForm}>
                    <input
                        type="text"
                        value={commentText}
                        onChange={handleCommentChange}
                        placeholder="Scrivi un commento..."
                    />
                    <button onClick={() => handleSubmitComment(post._id)}>Invia</button>
                </div>
            </div>
        )}
        {isLoggedIn && (
            <div className={styles.buttonGroup}>
                {showLike(post.isLiked, post._id)}
                <div className={styles.commentButtons}>
                    <button onClick={() => toggleAccordion(post._id)}><TfiCommentAlt /></button>
                    <button onClick={() => toggleAccordion(post._id)}>
                        {openAccordion === post._id ? <RxEyeClosed /> : <LiaComments />}
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
