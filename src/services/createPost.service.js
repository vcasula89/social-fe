export const createPost = async () => {
    try {
        const request = await fetch('http://localhost:8000/post/create-post/', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        });

        if (request.ok) {
            throw new Error('Errore durante la creazione del post'); 
        } 
        
        const data = await request.json(); 
        return data; 
} catch (error) { 
    console.error('Errore:', error); 
    throw error; 
    }
}; 

//Esempio di utilizzo
const postData = { 
    title: 'Titolo del post', 
    content: 'Contenuto del post' 
};
    
createPost(postData) 
.then(data => { 
    console.log('Post creato con successo:', data); 
}) 
.catch(error => { 
    console.error('Errore nella creazione del post:', error); 
});