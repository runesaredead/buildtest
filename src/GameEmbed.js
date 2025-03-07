import React, { useEffect } from 'react';
import { useLaserEyes } from "@omnisat/lasereyes";

const SIMPLEBOARDS_API = 'https://api.simpleboards.dev';
const API_KEY = '32ec16d9-75b3-4da9-8ac4-1e6a84a212bf';
const LEADERBOARD_ID = '5f1e7966-1bc6-44f9-fe77-08dd57a9d20b';

function GameEmbed() {
  const { address } = useLaserEyes();

  useEffect(() => {
    // Make wallet address available to the iframe
    if (address) {
      window.walletAddress = address;
    }
    
    const handleGameEnd = async (event) => {
      // Skip wallet extension messages
      if (event.data && typeof event.data === 'object' && 
          (event.data.target === 'rabby-page-provider' || 
           event.data.target === 'metamask-inpage')) {
        return; // Ignore wallet messages
      }
      
      // Process both gameEnd and gameScore message types
      if (event.data && typeof event.data === 'object' && 
          ((event.data.type === 'gameEnd' && 'score' in event.data) ||
           (event.data.type === 'gameScore' && 'score' in event.data))) {
        
        const score = event.data.score;
        console.log(`Received ${event.data.type} message with score:`, score);
        
        if (!address) {
          console.log('No wallet connected - please connect wallet first');
          return;
        }

        try {
          // Use last 4 characters of address for display name
          const lastFour = address.slice(-4);
          const playerDisplayName = address.substring(0, 4) + '...' + lastFour;
          
          const payload = {
            leaderboardId: LEADERBOARD_ID,
            playerId: address,
            playerDisplayName: playerDisplayName,
            score: score.toString()
          };
          console.log('Sending high score to API:', payload);

          const response = await fetch(`${SIMPLEBOARDS_API}/api/entries`, {
            method: 'POST',
            headers: {
              'x-api-key': API_KEY,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });

          console.log('Response status:', response.status);
          const responseText = await response.text();
          console.log('Response text:', responseText);

          if (!response.ok) {
            console.error('API Error:', response.status, responseText);
            throw new Error(`API Error: ${response.status} ${responseText}`);
          }

          if (responseText) {
            try {
              const responseData = JSON.parse(responseText);
              console.log('API Response:', responseData);
            } catch (e) {
              console.log('Could not parse response as JSON:', responseText);
            }
          }

        } catch (error) {
          console.error('Error updating score:', error);
        }
      }
    };

    window.addEventListener('message', handleGameEnd);
    return () => window.removeEventListener('message', handleGameEnd);
  }, [address]);

  return (
    <iframe
      src="/mariodins-flight-main/index.html"
      style={{ 
        width: "100%",
        height: "100%",
        border: "none",
        maxWidth: "1200px"  // Optional: prevent getting too wide
      }}
      title="My Game"
    />
  );
}

export default GameEmbed;