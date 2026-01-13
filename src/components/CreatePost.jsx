import React from 'react';
import { Image, Smile, Calendar, MapPin } from 'lucide-react';
import '../styles/CreatePost.css';

const CreatePost = ({ user }) => {
    return (
        <div className="create-post-card">
            <div className="cp-input-area">
                <img src={user.avatar} alt="User" className="cp-avatar" />
                <input type="text" placeholder={`Quoi de neuf, ${user.name.split(' ')[0]} ?`} />
            </div>
            <div className="cp-actions">
                <div className="cp-options">
                    <button className="cp-btn">
                        <Image size={20} className="text-primary" />
                        <span>Photo</span>
                    </button>
                    <button className="cp-btn">
                        <Smile size={20} className="text-yellow" />
                        <span>Humeur</span>
                    </button>
                </div>
                <button className="post-submit-btn">
                    Publier
                </button>
            </div>
        </div>
    );
};

export default CreatePost;
