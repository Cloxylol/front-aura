import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';
import { Upload } from 'lucide-react';
import '../index.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        first_name: '',
        last_name: '',
        bio: '',
        city: ''
    });
    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(formData, avatar);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.msg || 'Erreur lors de l\'inscription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg-body)', padding: '2rem 0'
        }}>
            <div style={{
                background: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius-lg)',
                width: '100%', maxWidth: '500px', border: '1px solid var(--border)'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.5rem' }} className="text-gradient">
                    Créer votre profil Aura
                </h2>
                {error && <p style={{ color: '#ef4444', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>


                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{
                            width: 100, height: 100, borderRadius: '50%', background: '#333',
                            overflow: 'hidden', marginBottom: '0.5rem', border: '2px solid var(--primary)'
                        }}>
                            {preview ? (
                                <img src={preview} alt="Avatar Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ fontSize: '3rem', color: '#555' }}>?</span>
                                </div>
                            )}
                        </div>
                        <label className="btn-secondary" style={{
                            cursor: 'pointer', color: 'var(--primary)', fontWeight: '600',
                            display: 'flex', alignItems: 'center', gap: '0.5rem'
                        }}>
                            <Upload size={16} /> Ajouter une photo
                            <input type="file" onChange={handleAvatarChange} accept="image/*" style={{ display: 'none' }} />
                        </label>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <input
                            type="text"
                            placeholder="Prénom"
                            className="input"
                            style={{ padding: '0.75rem', background: '#000', border: '1px solid var(--border)', color: 'white', borderRadius: 'var(--radius-sm)' }}
                            value={formData.first_name}
                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Nom"
                            className="input"
                            style={{ padding: '0.75rem', background: '#000', border: '1px solid var(--border)', color: 'white', borderRadius: 'var(--radius-sm)' }}
                            value={formData.last_name}
                            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                            required
                        />
                    </div>

                    <input
                        type="text"
                        placeholder="Pseudo (@username)"
                        className="input"
                        style={{ padding: '0.75rem', background: '#000', border: '1px solid var(--border)', color: 'white', borderRadius: 'var(--radius-sm)' }}
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Mot de passe"
                        className="input"
                        style={{ padding: '0.75rem', background: '#000', border: '1px solid var(--border)', color: 'white', borderRadius: 'var(--radius-sm)' }}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />

                    <input
                        type="text"
                        placeholder="Ville"
                        className="input"
                        style={{ padding: '0.75rem', background: '#000', border: '1px solid var(--border)', color: 'white', borderRadius: 'var(--radius-sm)' }}
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />

                    <textarea
                        placeholder="Votre bio..."
                        className="input"
                        style={{ padding: '0.75rem', background: '#000', border: '1px solid var(--border)', color: 'white', borderRadius: 'var(--radius-sm)', resize: 'none' }}
                        rows={3}
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            background: 'var(--primary-gradient)', color: 'white', padding: '0.75rem',
                            borderRadius: 'var(--radius-full)', fontWeight: '600', marginTop: '0.5rem',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Création...' : 'S\'inscrire'}
                    </button>
                </form>

                <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Déjà un compte ? <Link to="/login" style={{ color: 'var(--primary)' }}>Connexion</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
