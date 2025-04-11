import React, { useEffect, useState } from 'react';
import { getAllCards } from '../services/cardService';
import Card from './Card';
import './CardDeck.css'; // Możesz dodać style CSS

const CardDeck = ({ deckType = 'fibonacci', onSelectCard }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        const data = await getAllCards(deckType);
        setCards(data);
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

  const handleCardSelect = (card) => {
    setSelectedCard(card._id);
    if (onSelectCard) {
      onSelectCard(card);
    }
  };

  if (loading) return <div>Loading cards...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="card-deck">
      <h2>Select a Card</h2>
      <div className="cards-container">
        {cards.map((card) => (
          <Card
            key={card._id}
            card={card}
            isSelected={card._id === selectedCard}
            onClick={() => handleCardSelect(card)}
          />
        ))}
      </div>
    </div>
  );
};

export default CardDeck;