import { useEffect, useState } from 'react';
import { config } from '../../../config';
import './visualizationPost.module.css';

const VisualizationPost = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [openAccordion, setOpenAccordion] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Stato per gestire l'autenticazione

    useEffect(() => {
        const fetchPosts = async (page) => {
            try {
                const response = await fetch(`${config.api.BASE_URL}/api/posts?page=${page}`);
                if (!response.ok) {
                    throw new Error('Qualcosa è andato storto');
                }
                const data = await response.json();
                setPosts(prevPosts => [...prevPosts, ...data]);
                if (data.length < 25) {
                    setHasMore(false);
                }
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchPosts(page);
    }, [page]);

   

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading || !hasMore) {
                return;
            }
            setPage(prevPage => prevPage + 1);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, hasMore]);

    const toggleAccordion = (postId) => {
        setOpenAccordion(openAccordion === postId ? null : postId);
    };

    const addLike = (postId) => {
        // Implementa la logica per aggiungere un like
    };

    const addComment = (postId) => {
        // Implementa la logica per aggiungere un commento
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            {posts.map(post => (
                <div key={post.id} className="post">
                    <h2>{post.title}</h2>
                    {post.image && <img src={post.image} alt={post.title}/>}
                    <p>{post.body}</p>
                    <p>Author: {post.author}</p>
                    <p>Date: {new Date(post.date).toLocaleDateString()}</p>
                    <p>Likes: {post.likes}</p>
                    <p>Comments: {post.comments.length}</p>
                    <button onClick={() => toggleAccordion(post.id)}>
                        {openAccordion === post.id ? 'Hide Comments' : 'Show Comments'}
                    </button>
                    {openAccordion === post.id && (
                        <div className="accordion">
                            {post.comments.map((comment, index) => (
                                <div key={index} className="comment">
                                    <p>{comment.text}</p>
                                    <p>By: {comment.author}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    {isLoggedIn && (
                        <>
                            <button onClick={() => addLike(post.id)}>Mi Piace</button>
                            <button onClick={() => addComment(post.id)}>Commenta</button>
                        </>
                    )}
                </div>
            ))}
            {loading && <div>Caricando altri post..</div>}
        </div>
    );
};

export default VisualizationPost;