const Card = require('../models/Card');

const getAllCards = async (deckType) => {
  return deckType 
    ? await Card.find({ deckType }).sort({ sortOrder: 1 })
    : await Card.find().sort({ sortOrder: 1 });
};

const getCardById = async (id) => {
  return await Card.findById(id);
};

const createCard = async (cardData) => {
  const card = new Card(cardData);
  return await card.save();
};

const deleteCard = async (id) => {
  return await Card.findByIdAndDelete(id);
};

module.exports = {
  getAllCards,
  getCardById,
  createCard,
  deleteCard
};
