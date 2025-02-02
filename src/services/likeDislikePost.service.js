import { config } from '../../config.js';

export const likeDislikePost = async (postId, accessToken) => {
    try {

        // contattiamo il backend: lo contattiamo in POST, con l'access token dell'utente loggato ( è necessario essere loggati per poter postare)
        const request = await fetch(`${config.api.BASE_URL}/post/like`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                postId: postId,
            })

        });

        if (!request.ok) {
            throw new Error('Errore sul like/dislike post: '+postId);
        }

        const data = await request.json();
        const posizione = data[0]

        return posizione;
    } catch (error) {
        console.log('Errore:', error);
        throw error;
    }
};

