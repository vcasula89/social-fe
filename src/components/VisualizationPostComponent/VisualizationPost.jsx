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
import commentComponent from "../CommentComponent/CommentComponent.jsx";
import CommentComponent from "../CommentComponent/CommentComponent.jsx";
import Grid from "@mui/material/Grid2";
import {Button, Card, CardContent, TextField} from "@mui/material";
import {BiCaretUp} from "react-icons/bi";

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
    console.log(user)

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

    const pullOutComment = ( commentId, postId) => {
        setPosts(prevPosts => {
            return prevPosts.map(post => {
                if (String(post._id) === String(postId)) {

                    if (!post.comments) {
                        return post;
                    }

                    const updatedComments = post.comments.filter(comment => String(comment._id) !== String(commentId));

                    return { ...post, comments: updatedComments };
                }
                return post;
            });
        });
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
        <div className={styles.date}>
            Date: {new Date(post.createdAt || post.date).toLocaleDateString()}
        </div>
        <div className={styles.likes}>Likes: {post.likesCounter}</div>
        <div className={`${styles.comments} ${openAccordion === post._id ? styles.open : ''}`} onClick={() => toggleAccordion(post._id)}>
            Comments: {post.commentsCounter}
        </div>
        {openAccordion === post._id && (
            <div className={styles.accordion}>
                {post.comments.map((comment, commentIndex) => (
                    <CommentComponent comment={comment} commentIndex={commentIndex} postId={post._id} pullOutCommentEvent={pullOutComment} />
                ))}
                <Grid container spacing={1} mt={2}>
                    <Grid size={1}>
                        <img  src={user.avatarUrl} className={styles.avatar} alt={user.displayName} />
                    </Grid>
                    <Grid size={11}>
                        <Grid size={12}>{user.displayName}</Grid>
                        <Grid size={12}>
                            <Card>
                                <CardContent sx={{ padding: 0.5 }}>
                                    <TextField

                                        fullWidth
                                        id="standard-multiline-static"
                                        multiline
                                        minRows={3}
                                        value={commentText}
                                        onChange={handleCommentChange}
                                        defaultValue="Scrivi un commento..."
                                    />
                                </CardContent>
                            </Card>

                        </Grid>
                        <Grid container spacing={1} mt={1}>
                            <Grid size={12} sx={{textAlign: "right"}}>
                                <Button variant="contained" onClick={() => handleSubmitComment(post._id)}>
                                    Invia
                                </Button>
                            </Grid>

                        </Grid>
                    </Grid>
                </Grid>
            </div>
        )}
        {isLoggedIn && (
            <div className={styles.buttonGroup}>
                {showLike(post.isLiked, post._id)}
                <div className={styles.commentButtons}>
                    <button onClick={() => toggleAccordion(post._id)}>Commenta<TfiCommentAlt /></button>
                    
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