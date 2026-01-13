import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="app">
      <Navbar
        activePage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
      />

      <main>
        {currentPage === 'home' && <Home />}
        {currentPage === 'profile' && <Profile />}
      </main>
    </div>
  );
}

export default App;
