import React, { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import { MOCK_POSTS, CURRENT_USER } from '../data/posts';
import { ChevronUp, ChevronDown } from 'lucide-react';
import '../styles/Home.css';

const Home = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    // Combine CreatePost and Posts into a single navigable list
    // We'll treat the CreatePost component as index 0
    const totalItems = 1 + MOCK_POSTS.length;

    const handleNavigation = (direction) => {
        if (direction === 'down' && activeIndex < totalItems - 1) {
            setActiveIndex(prev => prev + 1);
        } else if (direction === 'up' && activeIndex > 0) {
            setActiveIndex(prev => prev - 1);
        }
    };

    // Optional: Add keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowDown') handleNavigation('down');
            if (e.key === 'ArrowUp') handleNavigation('up');
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeIndex]);

    return (
        <div className="home-layout container">
            <div className="feed-wrapper">
                <div className="scroll-controls">
                    <button
                        className="scroll-btn"
                        onClick={() => handleNavigation('up')}
                        disabled={activeIndex === 0}
                        style={{ opacity: activeIndex === 0 ? 0.3 : 1 }}
                    >
                        <ChevronUp size={24} />
                    </button>
                    <button
                        className="scroll-btn"
                        onClick={() => handleNavigation('down')}
                        disabled={activeIndex === totalItems - 1}
                        style={{ opacity: activeIndex === totalItems - 1 ? 0.3 : 1 }}
                    >
                        <ChevronDown size={24} />
                    </button>
                </div>

                <div className="feed-window">
                    <div
                        className="feed-slider"
                        style={{ transform: `translateY(-${activeIndex * 100}%)` }}
                    >
                        {/* Index 0: Create Post */}
                        <div className="slide-item">
                            <div className="slide-content">
                                <CreatePost user={CURRENT_USER} />
                            </div>
                        </div>

                        {/* Index 1+: Posts */}
                        {MOCK_POSTS.map(post => (
                            <div key={post.id} className="slide-item">
                                <div className="slide-content">
                                    <PostCard post={post} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="sidebar-column">
                {/* Sidebar content stays static */}
                <div className="sidebar-card">
                    <h3>Tendances AURA</h3>
                    <ul className="trending-list">
                        <li>
                            <span className="trend-cat">Technologie</span>
                            <p>#ReactJS</p>
                            <span>12k posts</span>
                        </li>
                        <li>
                            <span className="trend-cat">Design</span>
                            <p>#UIUX</p>
                            <span>8.5k posts</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Home;
