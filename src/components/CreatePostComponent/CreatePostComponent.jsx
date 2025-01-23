import {useState} from 'react';
import styles from "./CreatePostComponent.module.css";
import {useSelector} from "react-redux";
import {UserSelector} from "../../reducers/user.slice.js";
import {createPost} from "../../services/createPost.service.js";

//dichiarazione del componente PostComponent
const PostComponent = () => {

    //stiamo dichiarando delle costanti con i relativi SETTER ( sono funzioni per dare il valore alla costante )
    //useState() lo usiamo per rendere reattiva la costante con un valore iniziale uguale a come dichiarato nelle parentesi
    const [title, setTitle] = useState(''); 
    const [body, setBody] = useState(''); 
    const [image, setImage] = useState(null); 
    const [error, setError] = useState(''); 

    //prendiamo lo user loggato
    const user = useSelector(UserSelector);

    //questi sono i change events per attribuire il valore inserito alla costante di riferimento usando il setter
    const handleTitleChange = (e) => setTitle(e.target.value);
    const handleBodyChange = (e) => setBody(e.target.value);
    const handleImageChange = (e) => setImage(e.target.files[0]); 

    //una funzione che viene attivata quando abbiamo il submit del form attraverso il bottone
    const handleSubmit = (e) => {

        //blocchiamo l'invio del form
        e.preventDefault();

        //controllo se title o body sono vuoti, nel caso restituisco errore
        if (!title || !body) {
            setError('Title and body are required.');
            return;
        }

        //controllo se la dimensione dell'immagine è sotto i 5MB
        if (image && image.size > 5 * 1024 * 1024) {
            setError('Image size must be less than 5MB.');
            return;
        }

        //è una costante in cui memorizzo l'oggetto con title e body, questo è il mio payload
        const postObject = {
            title, 
            body
        };

        //se l'immagine è presente viene aggiunta all'oggeto payload
        if(image !== null){
            postObject.image = image;
        }

        //ho tutto e posso spedire al BACKEND
        createPost(postObject, user.accessToken)
            .then(data => {
                //se è andato a buon fine stampo un messaggio in console
                console.log('Post creato con successo:', data);
            })
            .catch(error => {
                //se non è andato a buon fine stampo un messaggio in console con l'errore
                console.error('Errore nella creazione del post:', error);
            });
    };
    if (user && user.accessToken) {
        return (

            <>
                <form onSubmit={handleSubmit} className={styles.postForm}>
                    <div className={styles.formGroup}>
                        <label>
                            Title:
                            <input type="text" value={title} onChange={handleTitleChange} maxLength="100"/>
                        </label>
                    </div>
                    <div className={styles.formGroup}>
                        <label>
                            Body:
                            <textarea value={body} onChange={handleBodyChange} maxLength="200"></textarea>
                        </label>
                    </div>
                    <div className={styles.formGroup}>
                        <label>
                            Image (optional):
                            <input type="file" accept="image/jpeg,image/png" onChange={handleImageChange}/>
                        </label>
                    </div>
                    {error && <p style={{color: 'red'}}>{error}</p>}
                    <button type="submit" className={styles.submitButton}>Create Post</button>
                </form>
            </>

        );
    }
};

export default PostComponent;