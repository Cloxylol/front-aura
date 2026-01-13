import React from 'react';
import { MapPin, Link, Calendar } from 'lucide-react';
import PostCard from '../components/PostCard';
import { MOCK_POSTS, CURRENT_USER } from '../data/posts';
import '../styles/Profile.css';

const Profile = () => {
    const userPosts = MOCK_POSTS; // For demo purposes, showing all posts. In real app, filter by user.id

    return (
        <div className="profile-page container">
            <div className="profile-header">
                <div className="banner"></div>
                <div className="profile-info-container">
                    <div className="profile-top">
                        <img src={CURRENT_USER.avatar} alt={CURRENT_USER.name} className="profile-avatar" />
                        <button className="edit-profile-btn">Éditer le profil</button>
                    </div>

                    <div className="profile-details">
                        <h1 className="profile-name">{CURRENT_USER.name}</h1>
                        <p className="profile-handle">{CURRENT_USER.handle}</p>

                        <p className="profile-bio">{CURRENT_USER.bio}</p>

                        <div className="profile-meta">
                            <span><MapPin size={16} /> Paris, France</span>
                            <span><Link size={16} /> portfolio.dev</span>
                            <span><Calendar size={16} /> A rejoint en Septembre 2024</span>
                        </div>

                        <div className="profile-stats">
                            <span><strong>{CURRENT_USER.following}</strong> abonnements</span>
                            <span><strong>{CURRENT_USER.followers}</strong> abonnés</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="profile-content">
                <div className="profile-tabs">
                    <button className="tab active">Posts</button>
                    <button className="tab">Réponses</button>
                    <button className="tab">Médias</button>
                    <button className="tab">J'aime</button>
                </div>

                <div className="profile-feed">
                    {userPosts.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Profile;
