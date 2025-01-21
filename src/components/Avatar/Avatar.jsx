import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './Avatar.module.css';

const Avatar = ({ userId, initialAvatar }) => {
    const [avatar, setAvatar] = useState(initialAvatar || '/default-avatar.png');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const response = await fetch(`http://localhost:8000/user/${userId}/avatar`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (response.ok) {
                    const data = await response.json();
                    setAvatar(data.avatarUrl); 
                } else {
                    setError('Impossibile caricare l\'avatar.');
                }
            } catch (error) {
                setError('Errore di connessione al server.');
            }
        };

        if (userId) fetchAvatar();
    }, [userId]);

    return (
        <div className={styles.avatarContainer}>
            <img src={avatar} alt="Avatar" className={styles.avatar} />
            {error && <div className={styles.errorMessage}>{error}</div>}
        </div>
    );
};

Avatar.propTypes = {
    userId: PropTypes.string.isRequired,
    initialAvatar: PropTypes.string,
};

export default Avatar;