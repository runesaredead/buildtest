import React, { useEffect } from 'react';
import { useLaserEyes } from "@omnisat/lasereyes";

// Constants for SimpleBoards API
const SIMPLEBOARDS_API = 'https://api.simpleboards.dev';
const API_KEY = '32ec16d9-75b3-4da9-8ac4-1e6a84a212bf';
const LEADERBOARD_ID = '5f1e7966-1bc6-44f9-fe77-08dd57a9d20b';

function GameEmbed() {
  const { address } = useLaserEyes();

  useEffect(() => {
    // Simple message handler that focuses only on game scores
    function handleMessage(event) {
      // Skip if data is missing or not an object
      if (!event.data || typeof event.data !== 'object') return;
      
      // Skip wallet extension messages
      if (event.data.target === 'rabby-page-provider' || 
          event.data.target === 'metamask-inpage') return;
      
      // Handle both message types
      let score, isNewHighScore;
      
      // Handle gameScore type (from our new implementation)
      if (event.data.type === 'gameScore' && event.data.score !== undefined) {
        score = event.data.score;
        isNewHighScore = event.data.isNewHighScore;
        console.log(`Received gameScore message: score=${score}, isNewHighScore=${isNewHighScore}`);
      }
      // Handle gameEnd type (from old implementation, just in case)
      else if (event.data.type === 'gameEnd' && event.data.score !== undefined) {
        score = event.data.score;
        isNewHighScore = true; // Assume it's a high score for backward compatibility
        console.log(`Received gameEnd message: score=${score}`);
      }
      
      // Process the score if we got one
      if (score !== undefined) {
        // Always post the score for testing purposes
        postScore(score);
      }
    }
    
    // Function to post score to SimpleBoards API
    async function postScore(score) {
      try {
        // Use authenticated address or a test ID
        const playerId = address || 'test-player-' + Math.floor(Math.random() * 1000);
        console.log(`Posting score ${score} for player ${playerId}`);
        
        const response = await fetch('https://api.simpleboards.dev/api/entries', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
          },
          body: JSON.stringify({
            leaderboardId: LEADERBOARD_ID,
            playerId: playerId,
            playerDisplayName: playerId.substring(0, 10),
            score: score.toString(),
            metadata: '{}'
          })
        });
        
        if (response.ok) {
          console.log('Score posted successfully');
        } else {
          console.error('Failed to post score:', await response.text());
        }
      } catch (error) {
        console.error('Error posting score:', error);
      }
    }
    
    // Add event listener when component mounts
    window.addEventListener('message', handleMessage);
    console.log('GameEmbed: Message listener added');
    
    // Clean up when component unmounts
    return () => {
      window.removeEventListener('message', handleMessage);
      console.log('GameEmbed: Message listener removed');
    };
  }, [address]);
  
  return (
    <div className="game-container">
      <iframe
        src="/mariodins-flight-main/index.html"
        title="Mario Dins Flight"
        style={{ width: '100%', height: '600px', border: 'none' }}
      />
    </div>
  );
}

export default GameEmbed;