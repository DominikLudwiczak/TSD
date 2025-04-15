// src/components/Card.js
import React from 'react';
import './Card.css';

const Card = ({ card, isSelected, isRevealed, onClick, disabled }) => {
  return (
    <div 
      className={`card ${isSelected ? 'selected' : ''} ${isRevealed ? 'revealed' : ''} ${disabled ? 'disabled' : ''}`} 
      onClick={() => !disabled && onClick(card)}
    >
      <div className="card-content">
        <span className="card-value">{card.displayValue}</span>
      </div>
    </div>
  );
};

export default Card;