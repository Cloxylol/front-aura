import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import '../index.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData.username, formData.password);
            navigate('/');
        } catch (err) {
            setError('Identifiants incorrects');
        }
    };

    return (
        <div style={{
            height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg-body)'
        }}>
            <div style={{
                background: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius-lg)',
                width: '100%', maxWidth: '400px', border: '1px solid var(--border)'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.5rem' }} className="text-gradient">
                    Connexion AURA
                </h2>
                {error && <p style={{ color: '#ef4444', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Nom d'utilisateur"
                        className="input"
                        style={{
                            padding: '0.75rem', background: '#000', border: '1px solid var(--border)',
                            color: 'white', borderRadius: 'var(--radius-sm)'
                        }}
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        className="input"
                        style={{
                            padding: '0.75rem', background: '#000', border: '1px solid var(--border)',
                            color: 'white', borderRadius: 'var(--radius-sm)'
                        }}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button
                        type="submit"
                        style={{
                            background: 'var(--primary-gradient)', color: 'white', padding: '0.75rem',
                            borderRadius: 'var(--radius-full)', fontWeight: '600', marginTop: '0.5rem'
                        }}
                    >
                        Se connecter
                    </button>
                </form>

                <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Pas encore de compte ? <Link to="/register" style={{ color: 'var(--primary)' }}>S'inscrire</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
