import { config } from '../../config.js';

export const addCommentPost = async (postId, accessToken, commentText) => {
    try {
        // contattiamo il backend: lo contattiamo in POST, con l'access token dell'utente loggato ( è necessario essere loggati per poter commentare)
        const request = await fetch(`${config.api.BASE_URL}/comment`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                postId: postId,
                commentText: commentText,
            })
        });
        if (!request.ok) {
            throw new Error('Errore sul comment post: '+postId);
        }
        const data = await request.json();
        return data;
    } catch (error) {
        console.log('Errore:', error);
        throw error;
    }
};

export const updateCommentPost = async (postId, accessToken, commentText) => {
    try {
        // contattiamo il backend: lo contattiamo in Patch, con l'access token dell'utente loggato ( è necessario essere loggati per poter commentare)
        const request = await fetch(`${config.api.BASE_URL}/comment`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                postId: postId,
                commentText: commentText,
            })
        });
        if (!request.ok) {
            throw new Error('Errore sul comment post: '+postId);
        }
        const data = await request.json();
        return data;
    } catch (error) {
        console.log('Errore:', error);
        throw error;
    }
};

