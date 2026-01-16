import React, { useEffect, useState } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { MapPin, Link as LinkIcon, Calendar, Sparkles } from 'lucide-react';
import PostCard from '../components/PostCard';
import api, { getBaseUrl } from '../services/api';
import '../styles/Profile.css';

const Profile = () => {
    const { userId } = useParams();
    const { auraScore } = useOutletContext();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [editForm, setEditForm] = useState({
        first_name: '',
        last_name: '',
        bio: '',
        city: ''
    });

    useEffect(() => {
        fetchProfile();
    }, [userId]);

    const fetchProfile = async () => {
        try {
            const currentUserStr = localStorage.getItem('user');
            const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;

            let profileData;

            if (!userId || (currentUser && String(currentUser.id) === String(userId))) {
                const res = await api.get('/me');
                profileData = res.data;
                setIsOwnProfile(true);
            } else {
                const res = await api.get(`/users/${userId}`);
                profileData = res.data;
                setIsOwnProfile(false);
            }

            setUser(profileData);

            if (isOwnProfile || !userId || (currentUser && String(currentUser.id) === String(userId))) {
                setEditForm({
                    first_name: profileData.first_name || '',
                    last_name: profileData.last_name || '',
                    bio: profileData.bio || '',
                    city: profileData.city || ''
                });
            }

            fetchUserPosts(profileData.id);
        } catch (err) {
            console.error("Échec de la récupération du profil", err);
        }
    };

    const fetchUserPosts = async (uid) => {
        try {
            const res = await api.get(`/posts?user_id=${uid}`);
            const mapped = res.data.map(p => ({
                id: p.id,
                author: p.author_details || { name: p.author, avatar: null },
                timestamp: new Date(p.created_at).toLocaleString(),
                content: p.content,
                image: p.image_url ? `${getBaseUrl()}${p.image_url}` : null,
                aura_score: p.aura_score,
                likes: 0,
                comments: 0
            }));
            setPosts(mapped);
        } catch (err) {
            console.error(err);
        }
    };

    const getAvatar = () => {
        if (user?.avatar) return `${getBaseUrl()}${user.avatar}`;
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`;
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.put('/me', editForm);
            setUser(res.data.user);
            setIsEditing(false);

            localStorage.setItem('user', JSON.stringify(res.data.user));
        } catch (err) {
            console.error("Échec de la mise à jour du profil", err);
            alert("Erreur lors de la mise à jour");
        }
    };

    const handleInputChange = (e) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });
    };

    if (!user) return <div className="container" style={{ padding: '2rem' }}>Chargement...</div>;

    const displayAura = isOwnProfile ? auraScore : (user.total_aura || 0);

    return (
        <div className="profile-page container">
            <div className="profile-header">
                <div className="banner"></div>
                <div className="profile-info-container">
                    <div className="profile-top">
                        <img src={getAvatar()} alt={user.username} className="profile-avatar" style={{ backgroundColor: '#000' }} />
                        {isOwnProfile && (
                            <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>Éditer le profil</button>
                        )}
                    </div>

                    <div className="profile-details">
                        <h1 className="profile-name">{user.first_name} {user.last_name}</h1>
                        <p className="profile-handle">@{user.username}</p>

                        <p className="profile-bio">{user.bio || "Pas de bio pour le moment."}</p>

                        <div className="profile-meta">
                            {user.city && <span><MapPin size={16} /> {user.city}</span>}
                            <span><Calendar size={16} /> A rejoint Aura récemment</span>
                        </div>

                        <div className="profile-stats">

                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <img src="/aura.gif" alt="Aura" style={{ width: '24px', height: '24px' }} />
                                <strong>{new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(displayAura)}</strong> Aura
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="profile-content">


                <div className="profile-feed">
                    {posts.length > 0 ? (
                        posts.map(post => (
                            <PostCard key={post.id} post={{
                                ...post,
                                author: {
                                    id: user.id,
                                    name: `${user.first_name} ${user.last_name}`.trim() || user.username,
                                    avatar: getAvatar()
                                }
                            }} />
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                            Aucun post publié.
                        </div>
                    )}
                </div>
            </div>
            {
                isEditing && isOwnProfile && (
                    <div className="edit-modal-overlay">
                        <div className="edit-modal-content">
                            <h2>Modifier le profil</h2>
                            <form onSubmit={handleEditSubmit}>
                                <div className="form-group">
                                    <label>Prénom</label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={editForm.first_name}
                                        onChange={handleInputChange}
                                        className="input-field"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Nom</label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={editForm.last_name}
                                        onChange={handleInputChange}
                                        className="input-field"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Ville</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={editForm.city}
                                        onChange={handleInputChange}
                                        className="input-field"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Bio</label>
                                    <textarea
                                        name="bio"
                                        value={editForm.bio}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        rows={4}
                                    />
                                </div>

                                <div className="modal-actions">
                                    <button type="button" onClick={() => setIsEditing(false)} className="btn-cancel">
                                        Annuler
                                    </button>
                                    <button type="submit" className="btn-save">
                                        Enregistrer
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default Profile;
