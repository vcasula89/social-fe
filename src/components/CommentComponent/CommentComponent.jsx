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
        if (user.id === comment.userId._id) {
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
            <div>
                <Grid container spacing={1} mt={2}>
                    <Grid size={1}>
                        <img
                            src={comment.userId?.avatar}
                            className={styles.avatar}
                            alt={comment.userId?.displayName}
                        />
                    </Grid>
                    <Grid size={11}>
                        <Grid size={12}>{comment.userId?.displayName}</Grid>
                        <Grid size={12}>
                            <Card>
                                <CardContent sx={{ padding: 0.5 }}>
                                    {
                                        !isEditable ? comment.commentText : <TextField
                                            fullWidth
                                            id="standard-multiline-static"
                                            multiline
                                            minRows={3}
                                            onChange={handleCommentChange}
                                            value={commentText}
                                        />
                                    }
                                </CardContent>
                            </Card>

                        </Grid>
                        <Grid container spacing={1}>
                            <Grid item xs={4}>{comment.createdAt}</Grid>

                            {userCompare() &&(
                                isEditable ? (
                                    <>
                                        <Grid item xs={2}><Link onClick={ () => updateComment}>Conferma</Link></Grid>
                                        <Grid item xs={2}><Link onClick={revertEditing}>Annulla</Link></Grid>
                                    </>
                                ) : (
                                    <>
                                        <Grid item xs={2}><Link onClick={editCommentInterface}>Modifica</Link></Grid>
                                        <Grid item xs={2}><Link onClick={deleteComment}>Elimina</Link></Grid>
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