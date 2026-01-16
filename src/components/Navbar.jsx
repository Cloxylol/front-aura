import React, { useState, useEffect, useRef } from 'react';
import { Home, User, Bell, Search, Sparkles, LogOut } from 'lucide-react';
import api, { getBaseUrl } from '../services/api';
import '../styles/Navbar.css';

const formatAura = (num) => {
  return new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(num);
};

const Navbar = ({ activePage, onNavigate, auraEnabled, onToggleAura, score }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ users: [], posts: [] });
  const [showResults, setShowResults] = useState(false);
  const searchTimeout = useRef(null);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults({ users: [], posts: [] });
      return;
    }

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(async () => {
      try {
        const [usersRes, postsRes] = await Promise.all([
          api.get(`/users/search?q=${searchQuery}`),
          api.get(`/posts?q=${searchQuery}`)
        ]);

        setSearchResults({
          users: usersRes.data || [],
          posts: postsRes.data || []
        });
      } catch (err) {
        console.error("Search error", err);
      }
    }, 300);

    return () => clearTimeout(searchTimeout.current);
  }, [searchQuery]);

  const handleUserClick = (userId) => {
    onNavigate(`profile/${userId}`);
    setShowResults(false);
    setSearchQuery('');
  };

  const handlePostClick = (authorId) => {
    onNavigate(`profile/${authorId}`);
    setShowResults(false);
    setSearchQuery('');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <div className="flex items-center gap-md">
          <div className="logo text-gradient" onClick={() => onNavigate('home')}>
            AURA
          </div>
        </div>

        <div className="search-container" style={{ position: 'relative' }}>
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowResults(true); }}
              onFocus={() => setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
            />
          </div>
          {showResults && (searchResults.users.length > 0 || searchResults.posts.length > 0) && (
            <div className="search-results-dropdown">
              {searchResults.users.length > 0 && (
                <>
                  <div style={{ padding: '8px 12px', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Utilisateurs</div>
                  {searchResults.users.map(user => (
                    <div key={`u-${user.id}`} className="search-result-item" onClick={() => handleUserClick(user.id)}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={user.avatar ? `${getBaseUrl()}${user.avatar}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                          alt={user.username}
                          style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#000' }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: '600' }}>{user.name}</span>
                          <span style={{ fontSize: '0.8em', color: 'var(--text-muted)' }}>@{user.username}</span>
                        </div>
                      </div>
                      <div className="search-aura-badge">
                        <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{formatAura(user.total_aura)}</span>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {searchResults.posts.length > 0 && (
                <>
                  <div style={{ padding: '8px 12px', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', borderTop: searchResults.users.length ? '1px solid var(--border)' : 'none' }}>Posts</div>
                  {searchResults.posts.map(post => (
                    <div key={`p-${post.id}`} className="search-result-item" onClick={() => handlePostClick(post.author_details?.id)}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {post.content}
                        </span>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Par @{post.author}</span>
                          {post.aura_score > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.75rem', color: 'var(--primary)' }}>
                              <img src="/aura.gif" alt="Aura" style={{ width: '12px', height: '12px' }} />
                              <strong>{formatAura(post.aura_score)}</strong>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        <div className="nav-links">


          <button
            className={`nav-item ${activePage === 'home' ? 'active' : ''}`}
            onClick={() => onNavigate('home')}
          >
            <Home size={24} />
          </button>

          <button
            className={`nav-item ${activePage === 'profile' ? 'active' : ''}`}
            onClick={() => onNavigate('profile')}
          >
            <User size={24} />
          </button>

          <div className="aura-score-badge" style={{ marginLeft: '8px' }}>
            <img src="/aura.gif" alt="Aura" style={{ width: '24px', height: '24px' }} />
            <span>{formatAura(score)}</span>
          </div>

          <button
            className="nav-item"
            onClick={() => {
              import('../services/api').then(mod => mod.logout());
            }}
            title="Se déconnecter"
          >
            <LogOut size={24} color="#ef4444" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
