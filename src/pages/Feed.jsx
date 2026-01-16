import React, { useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import api, { logout } from '../services/api';
import { LogOut } from 'lucide-react';

export default function Feed() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const webcamRef = React.useRef(null);
    const [viewedPosts, setViewedPosts] = useState(new Set());
    const isCapturing = React.useRef(false);
    const [isWebcamReady, setIsWebcamReady] = useState(false);

    const fetchPosts = useCallback(async () => {
        try {
            const res = await api.get('/posts');
            setPosts(res.data);
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 401) {
                logout();
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchPosts();
    }, [fetchPosts, navigate]);

    const handlePostViewed = useCallback(async (postId) => {
        if (viewedPosts.has(postId) || isCapturing.current) return;

        if (!isWebcamReady) {
            return;
        }

        setViewedPosts(prev => {
            const newSet = new Set(prev);
            newSet.add(postId);
            return newSet;
        });
        isCapturing.current = true;

        const frames = [];
        let count = 0;
        const intervalId = setInterval(() => {
            if (webcamRef.current) {
                const imageSrc = webcamRef.current.getScreenshot();
                if (imageSrc) {
                    frames.push(imageSrc);
                } else {
                    console.warn("La capture de trame a renvoyé null");
                }
            }
            count++;
            if (count >= 12) {
                clearInterval(intervalId);
                sendFrames(postId, frames);

                isCapturing.current = false;
            }
        }, 166);

    }, [viewedPosts]);

    const sendFrames = async (postId, frames) => {
        if (frames.length === 0) return;
        try {
            const res = await api.post(`/posts/${postId}/aura`, { images: frames });

            if (res.data.auraScore !== undefined) {
                setPosts(prevPosts =>
                    prevPosts.map(p =>
                        p.id === postId ? { ...p, aura_score: res.data.auraScore } : p
                    )
                );
            }
        } catch (err) {
            console.error("Erreur lors de l'envoi des trames aura :", err);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
            <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={224}
                height={224}
                style={{ position: 'fixed', top: '-1000px', left: '-1000px' }}
                onUserMedia={() => {
                    console.log("Webcam démarrée avec succès");
                    setIsWebcamReady(true);
                }}
                onUserMediaError={(err) => console.error("Échec du démarrage de la webcam :", err)}
            />
            <div className="container" style={{ width: '100%' }}>
                <div className="glass" style={{
                    position: 'sticky', top: 0, zIndex: 10, padding: '1rem',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Accueil</h2>
                    <button onClick={logout} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}>
                        <LogOut size={20} />
                    </button>
                </div>

                <CreatePost onPostCreated={fetchPosts} />

                <div style={{ paddingBottom: '2rem' }}>
                    {loading ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Chargement...</div>
                    ) : (
                        posts.map(post => (
                            <PostCard key={post.id} post={post} onPostViewed={handlePostViewed} />
                        ))
                    )}
                    {!loading && posts.length === 0 && (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Aucun post pour le moment.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
