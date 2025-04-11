import React from 'react';
import './Card.css'; // Możesz dodać style CSS

const Card = ({ card, isSelected, onClick }) => {
  return (
    <div 
      className={`card ${isSelected ? 'selected' : ''}`} 
      onClick={onClick}
    >
      <div className="card-content">
        <span className="card-value">{card.displayValue}</span>
      </div>
    </div>
  );
};

export default Card;