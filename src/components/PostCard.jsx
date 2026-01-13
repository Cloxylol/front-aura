import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import '../styles/PostCard.css';

const PostCard = ({ post }) => {
    const [liked, setLiked] = useState(false);

    return (
        <div className="post-card">
            <div className="post-header">
                <div className="post-author-info">
                    <img src={post.author.avatar} alt={post.author.name} className="avatar" />
                    <div className="author-details">
                        <span className="author-name">{post.author.name}</span>
                        <span className="post-time">{post.timestamp}</span>
                    </div>
                </div>
                <button className="more-btn">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            <div className="post-content">
                <p>{post.content}</p>
                {post.image && (
                    <div className="post-image-container">
                        <img src={post.image} alt="Post content" className="post-image" />
                    </div>
                )}
            </div>

            <div className="post-actions">
                <button
                    className={`action-btn ${liked ? 'liked' : ''}`}
                    onClick={() => setLiked(!liked)}
                >
                    <Heart size={20} fill={liked ? "currentColor" : "none"} />
                    <span>{post.likes + (liked ? 1 : 0)}</span>
                </button>
                <button className="action-btn">
                    <MessageCircle size={20} />
                    <span>{post.comments}</span>
                </button>
                <button className="action-btn">
                    <Share2 size={20} />
                </button>
            </div>
        </div>
    );
};

export default PostCard;
