import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import Webcam from 'react-webcam';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import { ChevronUp, ChevronDown } from 'lucide-react';
import api, { getBaseUrl } from '../services/api';
import '../styles/Home.css';

const Home = () => {
    const { setAuraScore } = useOutletContext();
    const onScoreUpdate = (newPoints) => setAuraScore(prev => prev + newPoints);
    const [activeIndex, setActiveIndex] = useState(0);
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const webcamRef = useRef(null);
    const [viewedPosts, setViewedPosts] = useState(new Set());
    const isCapturing = useRef(false);
    const [isWebcamReady, setIsWebcamReady] = useState(false);
    const [lastCapturedFrames, setLastCapturedFrames] = useState([]);


    const [activeTag, setActiveTag] = useState(null);

    useEffect(() => {
        window.handleTagClick = (tag) => {
            console.log("Définition du tag actif :", tag);
            setActiveTag(tag);
        };
        return () => { window.handleTagClick = null; };
    }, []);

    const fetchPosts = useCallback(async () => {
        try {
            const params = {};
            if (activeTag) params.tag = activeTag;

            const res = await api.get('/posts', { params });
            const mapped = res.data.map(p => ({
                id: p.id,

                author: {
                    id: p.author_details?.id,
                    name: p.author_details?.name || p.author,
                    avatar: p.author_details?.avatar
                        ? `${getBaseUrl()}${p.author_details.avatar}`
                        : `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.author}`
                },
                timestamp: new Date(p.created_at).toLocaleString(),
                content: p.content,
                image: p.image_url ? `${getBaseUrl()}${p.image_url}` : null,
                aura_score: p.aura_score,
                likes: 0,
                comments: 0
            }));
            setPosts(mapped);
        } catch (err) {
            console.error("Erreur lors de la récupération des posts", err);
        }
    }, [activeTag]);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));

        fetchPosts();
    }, [fetchPosts]);




    const availableTags = Array.from(new Set(posts.flatMap(p => {
        const matches = p.content?.match(/#[a-zA-Z0-9\u00C0-\u00FF_]+/g);
        return matches || [];
    }))).slice(0, 5);









    const [isProcessingAura, setIsProcessingAura] = useState(false);

    const handlePostViewed = useCallback(async (postId) => {
        if (viewedPosts.has(postId) || isCapturing.current) return;

        if (!isWebcamReady) {
            console.warn("Webcam non prête, capture ignorée pour le post", postId);
            return;
        }

        setIsProcessingAura(true);

        setViewedPosts(prev => {
            const newSet = new Set(prev);
            newSet.add(postId);
            return newSet;
        });
        isCapturing.current = true;

        console.log(`Début de la capture aura pour le post ${postId}...`);

        const frames = [];
        let count = 0;
        const intervalId = setInterval(() => {
            if (webcamRef.current) {
                const imageSrc = webcamRef.current.getScreenshot();
                if (imageSrc) {
                    console.log(`[Détail] Trame ${count + 1} capturée :`, imageSrc.substring(0, 50) + "...");
                    frames.push(imageSrc);
                }
            }
            count++;
            if (count >= 12) {
                clearInterval(intervalId);
                sendFrames(postId, frames);
                isCapturing.current = false;
            }
        }, 166);

    }, [viewedPosts, isWebcamReady]);

    const sendFrames = async (postId, frames) => {
        if (frames.length === 0) {
            setIsProcessingAura(false);
            return;
        }
        setLastCapturedFrames(frames);
        try {
            console.log(`Envoi de ${frames.length} trames pour le post ${postId}`);
            console.log("Charge utile complète des trames (pour débogage) :", frames);
            const res = await api.post(`/posts/${postId}/aura`, { images: frames });
            if (res.data.auraScore !== undefined) {
                console.log(`%c Post ${postId} Score Aura : ${res.data.auraScore}`, 'background: #222; color: #bada55; font-size: 16px');
                console.log("Émotions :", res.data.emotions);
                if (onScoreUpdate) onScoreUpdate(res.data.auraScore);
            }
        } catch (err) {
            console.error("Erreur lors de l'envoi des trames aura :", err);
        } finally {
            setIsProcessingAura(false);
        }
    };

    const handleNavigation = (direction) => {
        if (isProcessingAura) return;

        if (direction === 'down' && activeIndex < posts.length - 1) {
            setActiveIndex(prev => prev + 1);
        } else if (direction === 'up' && activeIndex > 0) {
            setActiveIndex(prev => prev - 1);
        }
    };

    const getCurrentUserAvatar = () => {
        if (user?.avatar) return `${getBaseUrl()}${user.avatar}`;
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'invité'}`;
    }

    const currentUserForPost = user ? {
        name: `${user.first_name} ${user.last_name}`,
        avatar: getCurrentUserAvatar()
    } : { name: 'Invité', avatar: '' };

    return (
        <div className="home-layout container">
            <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={224}
                height={224}
                videoConstraints={{
                    width: 224,
                    height: 224,
                    facingMode: "user"
                }}
                forceScreenshotSourceSize={true}

                style={{ position: 'fixed', bottom: '10px', left: '10px', width: '100px', opacity: 0.5, zIndex: 9000, pointerEvents: 'none' }}
                onUserMedia={() => {
                    console.log("Webcam démarrée avec succès");
                    setIsWebcamReady(true);
                }}
                onUserMediaError={(err) => console.error("Échec du démarrage de la webcam :", err)}
            />
            <div className="feed-column">
                <div className="static-create-post">
                    <CreatePost user={currentUserForPost} onPostCreated={fetchPosts} />
                </div>

                <div className="feed-wrapper">
                    {posts.length > 0 && (
                        <div className="scroll-controls">
                            <button
                                className="scroll-btn"
                                onClick={() => handleNavigation('up')}
                                disabled={activeIndex === 0 || isProcessingAura}
                                style={{ opacity: activeIndex === 0 || isProcessingAura ? 0.3 : 1 }}
                            >
                                <ChevronUp size={24} />
                            </button>
                            <button
                                className="scroll-btn"
                                onClick={() => handleNavigation('down')}
                                disabled={activeIndex === posts.length - 1 || isProcessingAura}
                                style={{ opacity: activeIndex === posts.length - 1 || isProcessingAura ? 0.3 : 1 }}
                            >
                                <ChevronDown size={24} />
                            </button>
                        </div>
                    )}

                    <div className="feed-window">
                        {posts.length > 0 ? (
                            <div
                                className="feed-slider"
                                style={{ transform: `translateY(-${activeIndex * 100}%)` }}
                            >
                                {posts.map(post => (
                                    <div key={post.id} className="slide-item">
                                        <div className="slide-content">
                                            <PostCard post={post} onPostViewed={handlePostViewed} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                Aucun post pour le moment.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="sidebar-column">
                <div className="sidebar-card">
                    <h3>Tendances AURA</h3>
                    {activeTag && (
                        <div style={{ marginBottom: '1rem', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }} onClick={() => setActiveTag(null)}>
                            <span>Filtre: <strong>#{activeTag}</strong></span>
                            <span style={{ fontSize: '0.8em', textDecoration: 'underline' }}>(Effacer)</span>
                        </div>
                    )}
                    <ul className="trending-list">
                        {availableTags.length > 0 ? availableTags.map(tag => (
                            <li key={tag} onClick={() => setActiveTag(tag.substring(1))} style={{ cursor: 'pointer' }}>
                                <span className="trend-cat">Sujet</span>
                                <p style={{ color: '#ef4444' }}>{tag}</p>
                                <span>Voir les posts</span>
                            </li>
                        )) : (
                            !activeTag && <li style={{ color: 'var(--text-muted)' }}>Aucun hashtag populaire</li>
                        )}
                        {!activeTag && availableTags.length === 0 && (
                            <>
                                <li onClick={() => setActiveTag('AuraApp')} style={{ cursor: 'pointer' }}>
                                    <span className="trend-cat">Officiel</span>
                                    <p style={{ color: '#ef4444' }}>#AuraApp</p>
                                </li>
                                <li onClick={() => setActiveTag('Innovation')} style={{ cursor: 'pointer' }}>
                                    <span className="trend-cat">Technologie</span>
                                    <p style={{ color: '#ef4444' }}>#Innovation</p>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>

            {/* DEBUG  */}
            {lastCapturedFrames.length > 0 && (
                <div style={{
                    position: 'fixed', bottom: 0, left: 0, right: 0,
                    background: 'rgba(0,0,0,0.8)', padding: '10px',
                    display: 'flex', gap: '5px', overflowX: 'auto', zIndex: 9999
                }}>
                    <strong style={{ color: 'white', marginRight: '10px' }}>Debug Capture:</strong>
                    {lastCapturedFrames.map((src, i) => (
                        <img key={i} src={src} alt={`frame-${i}`} style={{ height: '60px', borderRadius: '4px' }} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
