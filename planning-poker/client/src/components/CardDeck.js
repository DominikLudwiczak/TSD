// src/components/CardDeck.js
import React, { useEffect, useState } from 'react';
import { getAllCards } from '../services/cardService';
import Card from './Card';
import './CardDeck.css';

const CardDeck = ({ deckType = 'fibonacci', onSelectCard, selectedCard, isRevealed = false, disabled = false }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        const data = await getAllCards(deckType);
        // Sort cards by sortOrder if available
        const sortedCards = data.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        setCards(sortedCards);
        setError(null);
      } catch (err) {
        setError('Failed to load cards');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [deckType]);

  useEffect(() => {
    // Update selected card if passed from parent
    if (selectedCard) {
      setSelectedCardId(selectedCard._id);
    } else {
      setSelectedCardId(null);
    }
  }, [selectedCard]);

  const handleCardSelect = (card) => {
    if (disabled) return;
    
    setSelectedCardId(card._id);
    if (onSelectCard) {
      onSelectCard(card);
    }
  };

  if (loading) return <div className="text-center py-4">Loading cards...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  if (cards.length === 0) return <div className="text-center py-4">No cards available</div>;

  return (
    <div className="card-deck">
      <div className="cards-container">
        {cards.map((card) => (
          <Card
            key={card._id}
            card={card}
            isSelected={card._id === selectedCardId}
            isRevealed={isRevealed}
            onClick={handleCardSelect}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
};

export default CardDeck;