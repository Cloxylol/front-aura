import React, { useState, useRef } from 'react';
import { Image, Smile } from 'lucide-react';
import api from '../services/api';
import '../styles/CreatePost.css';

const CreatePost = ({ user, onPostCreated }) => {
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        if (e.target.files[0]) setImage(e.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!content.trim() && !image) return;
        setLoading(true);

        const formData = new FormData();
        formData.append('content', content);
        if (image) formData.append('image', image);

        try {
            await api.post('/posts', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setContent('');
            setImage(null);
            if (onPostCreated) onPostCreated();
        } catch (err) {
            console.error("Échec de la publication", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-post-card">
            <div className="cp-input-area">
                <div style={{ width: 40, height: 40, background: '#333', borderRadius: '50%', flexShrink: 0, overflow: 'hidden' }}>

                    <img src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Generique"} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <input
                    type="text"
                    placeholder={`Quoi de neuf, ${user?.name?.split(' ')[0] || 'toi'} ?`}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>

            {image && (
                <div style={{ margin: '0.5rem 1rem', position: 'relative' }}>
                    <span style={{ color: 'var(--primary)', fontSize: '0.8rem' }}>Image sélectionnée: {image.name}</span>
                    <button onClick={() => setImage(null)} style={{ marginLeft: '0.5rem', color: 'red' }}>x</button>
                </div>
            )}

            <div className="cp-actions">
                <div className="cp-options">
                    <button className="cp-btn" onClick={() => fileInputRef.current?.click()}>
                        <Image size={20} className="text-primary" />
                        <span>Photo</span>
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        style={{ display: 'none' }}
                    />
                </div>
                <button
                    className="post-submit-btn"
                    onClick={handleSubmit}
                    disabled={loading || (!content && !image)}
                    style={{ opacity: loading ? 0.5 : 1 }}
                >
                    {loading ? '...' : 'Publier'}
                </button>
            </div>
        </div>
    );
};

export default CreatePost;
