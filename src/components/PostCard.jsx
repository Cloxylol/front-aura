import React, { useEffect, useRef, useState } from 'react';
import { MoreHorizontal, Trash2, Edit2, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/PostCard.css';

const PostCard = ({ post, onPostViewed }) => {
    const cardRef = useRef(null);
    const navigate = useNavigate();
    const [content, setContent] = useState(post.content);
    const [image, setImage] = useState(post.image);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState('');

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const isOwner = currentUser && post.author?.id && String(currentUser.id) === String(post.author.id);

    useEffect(() => {
        if (!onPostViewed) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    onPostViewed(post.id);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [post.id, onPostViewed]);

    const handleDelete = async () => {
        if (window.confirm("Voulez-vous vraiment supprimer ce post ? (L'Aura sera conservé)")) {
            try {
                await api.delete(`/posts/${post.id}`);
                setContent("<i>Ce poste n'est plus disponible</i>");
                setImage(null);
            } catch (err) {
                console.error("Failed to delete post", err);
                alert("Erreur lors de la suppression");
            }
        }
    };

    const handleEditStart = () => {
        setEditContent(content);
        setIsEditing(true);
    };

    const handleEditCancel = () => {
        setIsEditing(false);
        setEditContent('');
    };

    const handleEditSave = async () => {
        if (!editContent.trim()) return;

        try {
            await api.put(`/posts/${post.id}`, { content: editContent });
            setContent(editContent);
            setIsEditing(false);
        } catch (err) {
            console.error("Failed to update post", err);
            alert("Erreur lors de la modification");
        }
    };

    const formatContent = (text) => {
        if (!text) return null;

        if (text === "<i>Ce poste n'est plus disponible</i>") {
            return <i style={{ color: 'var(--text-muted)' }}>Ce poste n'est plus disponible</i>;
        }

        const parts = text.split(/(#[a-zA-Z0-9\u00C0-\u00FF_]+)/g);
        return parts.map((part, index) => {
            if (part.match(/^#[a-zA-Z0-9\u00C0-\u00FF_]+$/)) {
                return (
                    <span
                        key={index}
                        className="hashtag"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (window.handleTagClick) window.handleTagClick(part.substring(1));
                        }}
                    >
                        {part}
                    </span>
                );
            }
            return part;
        });
    };

    return (
        <div className="post-card" ref={cardRef}>
            <div className="post-header">
                <div
                    className="post-author-info"
                    onClick={() => post.author?.id && navigate(`/profile/${post.author.id}`)}
                    style={{ cursor: 'pointer' }}
                >
                    <img src={post.author.avatar} alt={post.author.name} className="avatar" />
                    <div className="author-details">
                        <span className="author-name">{post.author.name}</span>
                        <span className="post-time">{post.timestamp}</span>
                    </div>
                </div>
                <div className="flex items-center gap-sm">
                    {post.aura_score !== undefined && post.aura_score > 0 && (
                        <div className="aura-score-badge">
                            <img src="/aura.gif" alt="Aura" style={{ width: '24px', height: '24px' }} />
                            <span>{new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(post.aura_score)}</span>
                        </div>
                    )}
                    {isOwner && content !== "<i>Ce poste n'est plus disponible</i>" && !isEditing && (
                        <>
                            <button className="more-btn" onClick={handleEditStart} title="Modifier le post" style={{ marginRight: '4px' }}>
                                <Edit2 size={18} color="var(--text-muted)" />
                            </button>
                            <button className="more-btn" onClick={handleDelete} title="Supprimer le post">
                                <Trash2 size={18} color="#ef4444" />
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="post-content">
                {isEditing ? (
                    <div className="edit-post-container" style={{ width: '100%', marginBottom: '1rem' }}>
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            style={{
                                width: '100%',
                                background: 'var(--bg-card-hover)',
                                border: '1px solid var(--border)',
                                color: 'var(--text-main)',
                                borderRadius: '8px',
                                padding: '10px',
                                minHeight: '80px',
                                resize: 'vertical',
                                fontFamily: 'inherit'
                            }}
                        />
                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px', justifyContent: 'flex-end' }}>
                            <button onClick={handleEditCancel} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                                <X size={16} /> Annuler
                            </button>
                            <button onClick={handleEditSave} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '6px', background: 'var(--primary)', color: 'white' }}>
                                <Check size={16} /> Enregistrer
                            </button>
                        </div>
                    </div>
                ) : (
                    <p>{formatContent(content)}</p>
                )}

                {image && (
                    <div className="post-image-container">
                        <img src={image} alt="Post content" className="post-image" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostCard;
