import React from 'react';

const Card = ({ value, onSelect, isSelected }) => (
  <button
    onClick={() => onSelect(value)}
    style={{
      padding: '10px 20px',
      margin: '5px',
      fontSize: '1.5rem',
      backgroundColor: isSelected ? '#4caf50' : '#f0f0f0',
      border: '2px solid #ccc',
      borderRadius: '8px',
      cursor: 'pointer'
    }}
  >
    {value}
  </button>
);

export default Card;
