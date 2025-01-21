import { config } from '../../config.js';

export const createPost = async (postData, accessToken) => {
    try {

        //questo form non è un json. è un multipart perchè potrebbe essere presente l'immagine
        // per questo motivo creo l'oggeto STANDARD FormData
        const formData = new FormData();

        // Aggiungi i campi di postData a formData
        //popolerà le chiavi dell'oggeto formData una per ogni chiave presente in postData
        for (const key in postData) {
            formData.append(key, postData[key]);
        }

        //postData è stato convertito da oggeto stanrd JSON in FormData

        // contattiamo il backend: lo contattiamo in POST, con l'access token dell'utente loggato ( è necessario essere loggati per poter postare)
        // mettendo nel body l'oggetto FormData
        const request = await fetch(`${config.api.BASE_URL}/post/create-post/`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${accessToken}`},
            body: formData
        });

        if (!request.ok) {
            throw new Error('Errore durante la creazione del post'); 
        } 
        
        const data = await request.json(); 
        return data; 
} catch (error) { 
    console.log('Errore:', error);
    throw error; 
    }
}; 

