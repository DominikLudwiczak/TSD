const cardService = require('../services/cardService');

const getAllCards = async (req, res) => {
  try {
    const cards = await cardService.getAllCards(req.query.deckType);
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCardById = async (req, res) => {
  try {
    const card = await cardService.getCardById(req.params.id);
    card ? res.json(card) : res.status(404).json({ error: 'Card not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createCard = async (req, res) => {
  try {
    const newCard = await cardService.createCard(req.body);
    res.status(201).json(newCard);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteCard = async (req, res) => {
  try {
    await cardService.deleteCard(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllCards,
  getCardById,
  createCard,
  deleteCard
};
