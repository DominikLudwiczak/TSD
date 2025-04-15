// src/components/MVP/PlanningDeck.js
import React, { useState, useEffect } from 'react';
import './PlanningDeck.css';

// Default Fibonacci deck of cards
const defaultCards = [
  { id: 1, value: '0', displayValue: '0' },
  { id: 2, value: '1', displayValue: '1' },
  { id: 3, value: '2', displayValue: '2' },
  { id: 4, value: '3', displayValue: '3' },
  { id: 5, value: '5', displayValue: '5' },
  { id: 6, value: '8', displayValue: '8' },
  { id: 7, value: '13', displayValue: '13' },
  { id: 8, value: '21', displayValue: '21' },
  { id: 9, value: '34', displayValue: '34' },
  { id: 10, value: '?', displayValue: '?', isSpecial: true },
  { id: 11, value: 'coffee', displayValue: '☕', isSpecial: true }
];

// Mock participants for demo purposes
const mockParticipants = [
  { id: 1, name: 'Alice', vote: null },
  { id: 2, name: 'Bob', vote: null },
  { id: 3, name: 'Charlie', vote: null }
];

const PlanningDeck = () => {
  const [cards] = useState(defaultCards);
  const [selectedCard, setSelectedCard] = useState(null);
  const [participants, setParticipants] = useState(mockParticipants);
  const [isRevealed, setIsRevealed] = useState(false);
  const [currentUser] = useState({ id: 0, name: 'You (Developer)' });

  // Simulate participants selecting cards randomly
  useEffect(() => {
    if (selectedCard && !isRevealed) {
      const timeout = setTimeout(() => {
        const updatedParticipants = participants.map(p => ({
          ...p,
          vote: cards[Math.floor(Math.random() * cards.length)].value
        }));
        setParticipants(updatedParticipants);
      }, 1500);
      
      return () => clearTimeout(timeout);
    }
  }, [selectedCard, isRevealed, cards, participants]);

  const handleCardSelect = (card) => {
    if (!isRevealed) {
      setSelectedCard(card);
    }
  };

  const handleReveal = () => {
    setIsRevealed(true);
  };

  const handleReset = () => {
    setSelectedCard(null);
    setIsRevealed(false);
    setParticipants(mockParticipants);
  };

  // Calculate statistics if revealed
  const getStats = () => {
    if (!isRevealed || !selectedCard) return null;
    
    const votes = participants
      .map(p => p.vote)
      .filter(vote => !isNaN(Number(vote)));
    
    votes.push(selectedCard.value);
    
    const numericVotes = votes
      .filter(vote => !isNaN(parseFloat(vote)))
      .map(vote => parseFloat(vote));
    
    if (numericVotes.length === 0) return { totalVotes: votes.length };
    
    return {
      totalVotes: votes.length,
      average: (numericVotes.reduce((sum, v) => sum + v, 0) / numericVotes.length).toFixed(1),
      min: Math.min(...numericVotes),
      max: Math.max(...numericVotes)
    };
  };

  const stats = getStats();

  return (
    <div className="planning-poker-container">
      <h1 className="planning-title">Planning Poker</h1>
      
      <div className="control-panel">
        {selectedCard ? (
          <>
            {!isRevealed ? (
              <button className="reveal-button" onClick={handleReveal}>
                Reveal Cards
              </button>
            ) : (
              <button className="reset-button" onClick={handleReset}>
                Reset Estimation
              </button>
            )}
            <div className="selected-info">
              Your selection: <span className="selected-value">{selectedCard.displayValue}</span>
            </div>
          </>
        ) : (
          <div className="instruction">Select a card from your deck</div>
        )}
      </div>
      
      <div className="deck-container">
        {cards.map(card => (
          <div 
            key={card.id}
            className={`card ${selectedCard?.id === card.id ? 'selected' : ''} ${card.isSpecial ? 'special' : ''}`}
            onClick={() => !selectedCard && handleCardSelect(card)}
          >
            <div className="card-inner">
              <div className="card-value">{card.displayValue}</div>
            </div>
          </div>
        ))}
      </div>
      
      {selectedCard && (
        <div className="results-container">
          <h2>Team Estimations</h2>
          
          {isRevealed && stats && (
            <div className="stats-container">
              <div className="stat-item">
                <span className="stat-label">Votes:</span>
                <span className="stat-value">{stats.totalVotes}</span>
              </div>
              {stats.average && (
                <>
                  <div className="stat-item">
                    <span className="stat-label">Average:</span>
                    <span className="stat-value">{stats.average}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Min:</span>
                    <span className="stat-value">{stats.min}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Max:</span>
                    <span className="stat-value">{stats.max}</span>
                  </div>
                </>
              )}
            </div>
          )}
          
          <ul className="participants-list">
            <li className="participant current-user">
              <span className="participant-name">{currentUser.name}</span>
              <span className="participant-vote">
                {selectedCard.displayValue}
              </span>
            </li>
            {participants.map(participant => (
              <li key={participant.id} className="participant">
                <span className="participant-name">{participant.name}</span>
                {participant.vote ? (
                  <span className="participant-vote">
                    {isRevealed 
                      ? (participant.vote === 'coffee' ? '☕' : participant.vote)
                      : '✓'}
                  </span>
                ) : (
                  <span className="participant-vote pending">...</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PlanningDeck;