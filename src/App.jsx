import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import AuraSensor from './components/AuraSensor';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [auraEnabled, setAuraEnabled] = useState(true);
  const [auraScore, setAuraScore] = useState(8420);

  return (
    <div className="app">
      <Navbar
        activePage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
        auraEnabled={auraEnabled}
        onToggleAura={() => setAuraEnabled(!auraEnabled)}
        score={auraScore}
      />

      <main>
        {currentPage === 'home' && <Home auraEnabled={auraEnabled} />}
        {currentPage === 'profile' && <Profile auraEnabled={auraEnabled} />}
      </main>

      {auraEnabled && (
        <AuraSensor onScoreUpdate={setAuraScore} />
      )}
    </div>
  );
}

export default App;
