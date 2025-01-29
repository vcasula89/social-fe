import { useEffect, useState } from 'react';
import { config } from '../../../config';
import styles from './visualizationPost.module.css';
import { AiTwotoneLike } from "react-icons/ai";
import { LiaComments } from "react-icons/lia";
import { TfiCommentAlt } from "react-icons/tfi";
import { RxEyeClosed } from "react-icons/rx";
import {useSelector} from "react-redux";
import {UserSelector} from "../../reducers/user.slice.js"
import {likeDislikePost} from "../../services/likeDislikePost.service.js";


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
    useEffect(() => {
        const fetchPosts = async (page) => {
            try {
                let response = {};
                if(user != null && user.accessToken != null) {
                    response = await fetch(`${config.api.BASE_URL}/posts?page=${page}`,{
                        method: 'GET',
                        headers: { 'Authorization': `Bearer ${user.accessToken}` },
                    });
                }else{
                    response = await fetch(`${config.api.BASE_URL}/posts?page=${page}`,{
                        method: 'GET',

                    });
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
                <div key={post.id || postIndex} className={styles.post}>
                    <h2>{post.title}</h2>
                    {post.image && <img src={post.image} alt={post.title} className={styles.image} />}
                    <p>{post.body}</p>
                    <div className={styles.date}>Date: {new Date(post.date).toLocaleDateString()}</div>
                    <div className={styles.likes}>Likes: {post.likesCounter}</div>
                    <div className={styles.comments}>Comments: {post.comments.length}</div>
                    {openAccordion === post.id && (
                        <div className={styles.accordion}>
                            {post.comments.map((comment, commentIndex) => (
                                <div key={comment.id || commentIndex} className={styles.comment}>
                                    <p>{comment.commentText}</p>
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
                                <button onClick={() => handleSubmitComment(post.id)}>Invia</button>
                            </div>
                        </div>
                    )}
                    {isLoggedIn && (
                        <div className={styles.buttonGroup}>
                            {showLike(post.isLiked)}
                            <button className={styles.likeButton} onClick={()=> addLike(post._id, post.isLiked)}>
                                <AiTwotoneLike />
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
