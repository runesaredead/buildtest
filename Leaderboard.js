import React, { useState, useEffect } from 'react';
import { useLaserEyes } from "@omnisat/lasereyes";

const SIMPLEBOARDS_API = 'https://api.simpleboards.dev';
const API_KEY = '32ec16d9-75b3-4da9-8ac4-1e6a84a212bf';
const LEADERBOARD_ID = '5f1e7966-1bc6-44f9-fe77-08dd57a9d20b';

const Leaderboard = ({ style }) => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const { address } = useLaserEyes();

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch(
          `${SIMPLEBOARDS_API}/leaderboards/${LEADERBOARD_ID}/entries`,
          {
            headers: {
              'x-api-key': API_KEY
            }
          }
        );
        if (!response.ok) throw new Error('Failed to fetch scores');
        const entries = await response.json();
        setScores(entries);
      } catch (error) {
        console.error('Error fetching scores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
    const interval = setInterval(fetchScores, 10000);
    return () => clearInterval(interval);
  }, []);

  const baseStyle = {
    ...style,
    fontFamily: "'Press Start 2P', sans-serif",
    fontSize: '12px',
    background: 'red',
    color: 'white',
    padding: '10px',
    boxShadow: '3px 3px 5px rgba(0,0,0,0.5)',
    minWidth: '300px'
  };

  const buttonStyle = {
    width: '100%',
    background: 'white',
    color: 'red',
    border: 'none',
    padding: '8px',
    cursor: 'pointer',
    fontFamily: "'Press Start 2P', sans-serif",
    fontSize: '12px',
    marginBottom: '10px'
  };

  const scrollStyle = {
    maxHeight: '400px',
    overflowY: 'auto',
    marginTop: '10px'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse'
  };

  const cellStyle = {
    padding: '8px',
    textAlign: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.2)'
  };

  const highlightStyle = {
    backgroundColor: 'rgba(255,255,255,0.1)'
  };

  // Safe function to check if entry matches current user
  const isCurrentUser = (entry) => {
    if (!entry || !address) return false;
    return entry.playerId === address;
  };

  // Safe function to get player display name
  const getPlayerDisplay = (entry) => {
    if (!entry) return 'Unknown';
    
    if (entry.playerDisplayName) {
      return entry.playerDisplayName;
    }
    
    if (entry.playerId) {
      return `${entry.playerId.substring(0, 4)}...`;
    }
    
    return 'Anonymous';
  };

  if (loading) return <div style={baseStyle}>Loading scores...</div>;

  const displayScores = showAll ? scores : scores.slice(0, 10);

  return (
    <div style={baseStyle}>
      <h2 style={{margin: '0 0 10px 0', fontSize: '14px', textAlign: 'center'}}>
        Top Scores
      </h2>
      <button 
        style={buttonStyle}
        onClick={() => setShowAll(!showAll)}
      >
        {showAll ? 'Show Top 10' : 'Show All'}
      </button>
      <div style={scrollStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={cellStyle}>#</th>
              <th style={cellStyle}>Player</th>
              <th style={cellStyle}>Score</th>
            </tr>
          </thead>
          <tbody>
            {displayScores.map((entry, index) => (
              <tr 
                key={index}
                style={isCurrentUser(entry) ? {...cellStyle, ...highlightStyle} : cellStyle}
              >
                <td style={cellStyle}>{index + 1}</td>
                <td style={cellStyle}>{getPlayerDisplay(entry)}</td>
                <td style={cellStyle}>{entry.score || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard; 