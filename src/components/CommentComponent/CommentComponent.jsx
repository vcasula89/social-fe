import styles from './CommentComponent.module.css';
import Grid from '@mui/material/Grid2';
import Link from '@mui/material/Link';
import {Card, CardContent, TextField} from "@mui/material";
import {useSelector} from "react-redux";
import {UserSelector} from "../../reducers/user.slice.js";
import {useState} from "react";
import {updateCommentPost, deleteCommentPost} from "../../services/commentPost.service.js";
const CommentComponent = ({comment, postId, pullOutCommentEvent }) => {

    const user = useSelector(UserSelector);
    const [isEditable, setIsEditable] = useState(false);
    const [commentText, setCommentText] = useState(comment.commentText);

    //per poter modificare/cancellare i commenti l'utente deve essere registrato. Confronto quindi user id della persona
    // loggata e user id del commento. la uso nell'HTML per mostrare i bottoni, se il commento è mio
    const userCompare = () =>{
        if (user.id === comment.userId) {
            return true;
        }
        return false;
    }
    //funzione che serve a rendere editabile il commento. viene chiamata quando l'utente clicca su modifica
    const editCommentInterface = () => {
        setIsEditable(!isEditable)
    }
    //funzione che serve a revertare l'editabilità del commento. viene chiamata quando l'utente clicca su annulla
    const revertEditing = () => {
        setIsEditable(!isEditable)
    }

    const handleCommentChange = (e) => {
        setCommentText(e.target.value);
    };

    //funzione per modificare il commento
    const updateComment = () => {
       updateCommentPost(comment._id, user.accessToken, commentText)
           .then((data) => {
               setIsEditable(!isEditable)
               comment.commentText = data.commentText;
           })
           .catch(error => {
               console.error("Errore nell'aggiornamento del commento", error);
           });
   };

    //funzione per cancellare il commento.
    const deleteComment = () => {
        deleteCommentPost(comment._id, user.accessToken)
            .then((data) => {
                //zappare via il commento dalla lista post. la funzione è un evento, quindi scatena una funzione nel
                // componente(padre) che incorpora questo componente
                pullOutCommentEvent(comment._id,postId);
            })
            .catch(error => {
                console.error("Errore nell'eliminazione del commento", error);
            });
    };

    return(
        <>
            <div className={styles.commentBlock}>
                <Grid container spacing={1} mt={2}>
                    <Grid size={1}>
                        <img
                            src={comment.user.avatar}
                            className={styles.avatar}
                            alt={comment.user.displayName}
                        />
                    </Grid>
                    <Grid size={11}>
                        <Grid size={12}>{comment.user.displayName}</Grid>
                        <Grid size={12}>
                            <Card>
                                <CardContent
                                    className={isEditable ? styles.cardComment:''}
                                    sx={{
                                    padding: !isEditable ? 0.5:0,
                                    outline: 'none',
                                    backgroundColor: '#3b3b3b',
                                    border: '1px solid #444',
                                    color: 'white',
                                }}>
                                    {
                                        !isEditable ? comment.commentText : <TextField
                                            fullWidth
                                            id="standard-multiline-static"
                                            multiline
                                            minRows={3}
                                            onChange={handleCommentChange}
                                            value={commentText}
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
                                        />
                                    }
                                </CardContent>
                            </Card>

                        </Grid>
                        <Grid container spacing={1}>
                            <Grid item xs={4}>Date: {new Date(comment.createdAt).toLocaleString()}</Grid>

                            {userCompare() &&(
                                isEditable ? (
                                    <>
                                        <Grid item xs={2}><Link onClick={updateComment} sx={{cursor:"pointer"}} >Conferma</Link></Grid>
                                        <Grid item xs={2}><Link onClick={revertEditing} sx={{cursor:"pointer"}}>Annulla</Link></Grid>
                                    </>
                                ) : (
                                    <>
                                        <Grid item xs={2}><Link onClick={editCommentInterface} sx={{cursor:"pointer"}} >Modifica</Link></Grid>
                                        <Grid item xs={2}><Link onClick={deleteComment} sx={{cursor:"pointer"}}>Elimina</Link></Grid>
                                    </>
                                )
                            )
                            }

                            <Grid item xs={userCompare() ? 4 : 8}></Grid>
                        </Grid>

                    </Grid>
                </Grid>

            </div>

        </>
    )
}
export default CommentComponent;