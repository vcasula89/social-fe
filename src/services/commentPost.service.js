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

export const updateCommentPost = async (commentId, accessToken, commentText) => {
    try {
        // contattiamo il backend: lo contattiamo in Patch, con l'access token dell'utente loggato ( è necessario essere loggati per poter commentare)
        const request = await fetch(`${config.api.BASE_URL}/comment/`+commentId, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                commentText: commentText,
            })
        });
        if (!request.ok) {
            throw new Error('Errore sull update del comment: '+commentId);
        }
        const data = await request.json();
        return data;
    } catch (error) {
        console.log('Errore:', error);
        throw error;
    }
};

export const deleteCommentPost = async (commentId, accessToken) => {
    try {
        // contattiamo il backend: lo contattiamo in DELETE, con l'access token dell'utente loggato ( è necessario essere loggati per poter eliminare il commento)
        const request = await fetch(`${config.api.BASE_URL}/comment/`+commentId, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' }
        });
        if (!request.ok) {
            throw new Error('Errore sull eliminazione del comment: '+commentId);
        }
    } catch (error) {
        console.log('Errore:', error);
        throw error;
    }
};

