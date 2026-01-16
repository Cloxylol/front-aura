import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';


import api from './services/api';


const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch (e) {
    return true;
  }
};


const ProtectedLayout = () => {
  const [auraEnabled, setAuraEnabled] = useState(true);
  const [auraScore, setAuraScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');

      if (!token || isTokenExpired(token)) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setLoading(false);
        return;
      }

      try {

        const res = await api.get('/me');
        if (res.data && res.data.total_aura !== undefined) {
          setAuraScore(res.data.total_aura);
        }
      } catch (err) {
        console.error("Échec de la vérification d'authentification", err);

      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }


  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;

  const activePage = location.pathname.includes('profile') ? 'profile' : 'home';

  return (
    <div className="app">
      <Navbar
        activePage={activePage}
        onNavigate={(page) => navigate(`/${page}`)}
        auraEnabled={auraEnabled}
        onToggleAura={() => setAuraEnabled(!auraEnabled)}
        score={auraScore}
      />
      <main>
        <Outlet context={{ auraScore, setAuraScore }} />
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:userId" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
