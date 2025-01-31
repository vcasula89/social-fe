import styles from "../VisualizationPostComponent/VisualizationPost.module.css";
import Grid from '@mui/material/Grid2';
import Link from '@mui/material/Link';
import {Card, CardContent} from "@mui/material";
const CommentComponent = (commentParameter, commentIndex) => {
    return(
        <>
            <div>
                <Grid container spacing={1} mt={2}>
                    <Grid size={1}>
                        <img
                            src={commentParameter.comment.userId?.avatar}
                            className={styles.avatar}
                            alt={commentParameter.comment.userId?.displayName}
                        />
                    </Grid>
                    <Grid size={11}>
                        <Grid size={12}>{commentParameter.comment.userId?.displayName}</Grid>
                        <Grid size={12}>
                            <Card>
                                <CardContent sx={{ padding: 0.5 }}>
                                {commentParameter.comment.commentText}
                                </CardContent>
                            </Card>

                        </Grid>
                        <Grid container spacing={1}>
                            <Grid size={4}>{commentParameter.comment.createdAt}</Grid>
                            <Grid size={2}><Link>Modifica</Link></Grid>
                            <Grid size={2}><Link>Elimina</Link></Grid>
                            <Grid size={4}></Grid>
                        </Grid>
                    </Grid>
                </Grid>

            </div>

        </>
    )
}
export default CommentComponent;