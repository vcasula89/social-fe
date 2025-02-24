import { useEffect, useState, useRef } from 'react';
import { config } from '../../../config';
import styles from './VisualizationPost.module.css';
import { TfiCommentAlt } from "react-icons/tfi";
import { RxEyeClosed } from "react-icons/rx";
import { AiOutlineLike } from "react-icons/ai";
import { AiOutlineDislike } from "react-icons/ai";
import {useSelector} from "react-redux";
import {UserSelector} from "../../reducers/user.slice.js"
import {likeDislikePost} from "../../services/likeDislikePost.service.js";
import {addCommentPost} from "../../services/commentPost.service.js";
import CommentComponent from "../CommentComponent/CommentComponent.jsx";
import Grid from "@mui/material/Grid2";
import {Button, Card, CardContent, TextField} from "@mui/material";


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
  const lastPostRef = useRef(null);

  const observer = useRef(
      new IntersectionObserver(
          (entries) => {
            const lastPost = entries[0];
            if (lastPost.isIntersecting) {
              setPage((prevPage) => prevPage + 1);
            }
          },
          { root: document.getElementById("postListContainer"), rootMargin: "100px", threshold: 0.5 }
      )
  );

  useEffect(() => {
    if (lastPostRef.current) observer.current.observe(lastPostRef.current);
    return () => observer.current.disconnect();
  }, [posts, loading, hasMore]);



  //apertura dell'accordion per la visualizzazione dei commenti
  const toggleAccordion = (postId) => {
    setOpenAccordion(openAccordion === postId ? null : postId);
  };

  const addLike = (postId, isLiked) => {

    //ho tutto e posso spedire al BACKEND
    likeDislikePost(postId, user.accessToken, isLiked)
        .then((data)=>{
          // Trova l'indice del post da aggiornare
          const postIndex = posts.findIndex(post => post._id === postId);

          if (postIndex !== -1) {
            //Crea una copia del post da aggiornare, prendendo il likesCounter dal BE e isLiked dal post,
            //invertendo la logica tra mi piace/non mi piace
            const updatedPost = {...posts[postIndex], likesCounter: data.likesCounter, isLiked:!isLiked};
            console.log("sto cercando questo errore",data)
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
          const firstElementIsAPost = data[0];
          // Trova l'indice del post da aggiornare
          const postIndex = posts.findIndex(post => post._id === postId);

          if (postIndex !== -1) {
            //Crea una copia del post da aggiornare, prendendo il commentsCounter dal BE

            const updatedPost = {...posts[postIndex], commentsCounter: firstElementIsAPost.commentsCounter, comments: firstElementIsAPost.comments };

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
      <Grid container spacing={2}>
        <Grid xs={6}>
      <div id="postListContainer" style={{ overflowY: 'auto', paddingBottom: '4rem' }}>
        {posts.map((post, postIndex) => (
            <div key={post._id || postIndex}  className={styles.post}
                 ref={postIndex === posts.length - 1 ? lastPostRef : null}>
              <div className={styles.author}>
                <img
                    src={post.user?.avatar}
                    className={styles.avatar}
                    alt={post.user?.displayName}
                />
                <span className={styles.authorName}>
                {post.user?.displayName}
            </span>
              </div>
              <h2>{post.title}</h2>
              {post.image &&
                  <img src={config.api.BASE_URL + post.image} alt={post.title} className={styles.image}/>}
              <p>{post.body}</p>
              <div className={styles.date}>
                Date: {new Date(post.createdAt || post.date).toLocaleDateString()}
              </div>
                  <hr/>
                  <Grid container>
                      <Grid size={6}>Mi piace: {post.likesCounter}</Grid>
                      <Grid size={6} sx={{
                        textAlign: "right",
                        transition: 'border-color 0.3s ease-in-out',
                        display: 'inline-block', // Permette all'elemento di occupare solo la larghezza del contenuto

                        '&:hover': {
                          textDecoration: "underline",
                          textShadow: '0 0 8px #0078D77F',
                          cursor: "pointer"
                        }
                      }}
                            onClick={() => toggleAccordion(post._id)}>Commenti: {post.commentsCounter}</Grid>
                  </Grid>
                  <hr/>
                  {openAccordion === post._id && (
                      <div >
                          {post.comments.map((comment, commentIndex) => (
                              //sono parametri del componente, cioè ciò di cui il componente ha bisogno per funzionare
                              <CommentComponent comment={comment} commentIndex={commentIndex} postId={post._id}
                                                pullOutCommentEvent={pullOutComment}/>
                          ))}
                        {user && user.accessToken && (
                        <Grid container spacing={1} mt={2}>
                              <Grid size={1}>
                                  <img src={user.avatarUrl} className={styles.avatar} alt={user.displayName}/>
                              </Grid>
                              <Grid size={11}>
                                  <Grid size={12} > {user.displayName}</Grid>
                                  <Grid sx={{padding: '0px'}} size={12}>
                                    <Card >
                                      <CardContent sx={{
                                        padding: '0px',
                                        backgroundColor: '#3b3b3b',
                                        border: '1px solid #444',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                      }}
                                       className={styles.cardComment}
                                      >
                                        <TextField
                                            fullWidth
                                            multiline
                                            minRows={3}
                                            placeholder='Scrivi un commento'
                                            value={commentText}
                                            onChange={handleCommentChange}
                                            variant="outlined"
                                            sx={{
                                              backgroundColor: '#3b3b3b',
                                              '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                  borderColor: '#444',
                                                  borderWidth: '1px',
                                                },
                                                '&:hover fieldset': {
                                                  borderColor: '#0078D7',
                                                  boxShadow: '0 0 8px rgba(0, 120, 215, 0.5)',
                                                },
                                                '&.Mui-focused fieldset': {
                                                  borderColor: '#0078D7',
                                                  boxShadow: '0 0 8px rgba(0, 120, 215, 0.5)',
                                                },
                                              },
                                              '& .MuiInputBase-input': {
                                                color: 'white',
                                                border: 'none',
                                                boxShadow: 'none',

                                              },
                                              '& .MuiInputLabel-root': {
                                                color: '#6e6e6e',
                                                '&.Mui-focused': {
                                                  color: '#0078D7'
                                                },
                                              }
                                            }}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                      </CardContent>
                                    </Card>

                                  </Grid>
                                  <Grid container spacing={1} mt={1}>
                                      <Grid size={12} sx={{textAlign: "right"}}>
                                          <Button variant="contained" onClick={() => handleSubmitComment(post._id)}
                                                  sx={{
                                                    backgroundColor: '#142cff',
                                                    boxShadow: 'none',
                                                    color: 'white',
                                                    '&:hover': {
                                                      boxShadow: '0 0 8px #0078D77F',
                                                      backgroundColor: '#0066FFFF'
                                                    }
                                                  }}>
                                              Invia
                                          </Button>
                                      </Grid>

                                  </Grid>
                              </Grid>

                          </Grid>
                            )}

                      </div>
                  )}
                  {user && user.accessToken && (
                      <div className={styles.buttonGroup}>
                          {showLike(post.isLiked, post._id)}
                          <div className={styles.commentButtons}>
                              <button onClick={() => toggleAccordion(post._id)}>Commenta<TfiCommentAlt/></button>

                          </div>
                      </div>
                  )}
              </div>
          ))}
            {loading && <div>Caricando altri post...</div>}
        </div>
      </Grid>
      </Grid>
    );

};

export default VisualizationPost;
