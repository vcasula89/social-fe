import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { UserSelector } from "../../reducers/user.slice.js";
import styles from './Avatar.module.css';

const Avatar = () => {
  const user = useSelector(UserSelector);
  const [avatar, setAvatar] = useState(user.avatarUrl || "URL_default_avatar"); // Usa un avatar di default se non è presente
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAvatar = async () => {
      if (!user) return;

      // Se l'avatar è già nel Redux store, non fare una richiesta
      if (user.avatarUrl) {
        setAvatar(user.avatarUrl);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/user/${user.id}/avatar`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Avatar non trovato');
        }

        const data = await response.json();
        setAvatar(data.avatarUrl);  // Cambiato da `data.avatar` a `data.avatarUrl` in base alla risposta del backend
      } catch (error) {
        setError('Errore nel caricamento dell\'avatar');
        console.error("Errore nell'ottenere l’avatar:", error);
      }
    };

    if (user?.id) {
      fetchAvatar();
    }
  }, [user]);

  return (
    <div className={styles.avatarContainer}>
      <img src={avatar} alt="Avatar" className={styles.avatar} />
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default Avatar;