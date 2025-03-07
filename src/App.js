import React from 'react';
import { LaserEyesProvider } from "@omnisat/lasereyes";
import GameEmbed from './GameEmbed';
import WalletConnector from './WalletConnector';
import Leaderboard from './Leaderboard';

function App() {
  return (
    <LaserEyesProvider>
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
          height: '100vh',
          border: '1px solid green'
        }}>
          <GameEmbed />
        </div>
      </div>
    </LaserEyesProvider>
  );
}

export default App;