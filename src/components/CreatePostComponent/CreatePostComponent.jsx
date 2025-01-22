import { useState } from 'react';
import styles from "./CreatePostComponent.module.css";
import { useSelector } from "react-redux";
import { UserSelector } from "../../reducers/user.slice.js";

const PostComponent = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const [posts, setPosts] = useState([]);
    const user = useSelector(UserSelector);

    const handleTitleChange = (e) => setTitle(e.target.value);
    const handleBodyChange = (e) => setBody(e.target.value);
    const handleImageChange = (e) => setImage(e.target.files[0]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !body) {
            setError('Titolo e descrizione richiesti. Immagine opzionale');
            return;
        }
        if (image && image.size > 5 * 1024 * 1024) {
            setError('La dimensione dell\'immagine deve essere inferiore a 5MB.');
            return;
        }

        const post = {
            title,
            body,
            image: image ? URL.createObjectURL(image) : null,
            timestamp: new Date().toISOString(),
            author: user.displayName,
        };

        setPosts([post, ...posts]); console.log(post);
        setTitle('');
        setBody('');
        setImage(null);
        setError('');
    };

    return (
        <>
            <form onSubmit={handleSubmit} className={styles.postForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="title"> Titolo
                        <textarea id="title" value={title} onChange={handleTitleChange} maxLength="100"
                                  placeholder="Inserisci il titolo"></textarea>
                    </label>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="body"> Descrizione
                        <textarea id="body" value={body} onChange={handleBodyChange} maxLength="200"
                                  placeholder="Inserisci il testo"></textarea>
                    </label>
                </div>
                {error && <p className={styles.errorMessage}>{error}</p>} {/* Spostato il messaggio di errore */}
                <div className={styles.buttonContainer}>
                    <label htmlFor="fileInput" className={styles.iconLabel}>
                        <img src="src/assets/add-photo.svg" alt="Upload" className={styles.uploadIcon}/>
                        Carica immagine
                    </label>
                    <input
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={handleImageChange}
                        style={{display: 'none'}}
                        id="fileInput"
                    />
                    <button type="submit" className={styles.submitButton}>Create Post</button>
                </div>
            </form>

        </>
    );
};

export default PostComponent;
