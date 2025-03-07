import React from 'react';
import GameEmbed from './GameEmbed';
import WalletConnector from './WalletConnector';
import Leaderboard from './Leaderboard';

function App() {
  return (
    <div className="App" style={{ border: '1px solid red' }}>
      <WalletConnector />
      <Leaderboard style={{ 
        position: 'fixed',
        left: '20px',
        top: '20px',
        width: '250px',
        zIndex: 1000,
        border: '1px solid blue'
      }} />
      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        border: '1px solid green'
      }}>
        <GameEmbed />
      </div>
    </div>
  );
}

export default App;