// server/services/cardService.js
const Card = require('../models/Card');

/**
 * Get all cards, optionally filtered by deck type
 * @param {String} deckType - Optional deck type filter (fibonacci, tshirt, custom)
 * @returns {Promise<Array>} List of cards
 */
const getAllCards = async (deckType) => {
  try {
    let query = {};
    
    if (deckType) {
      query.deckType = deckType;
    }
    
    const cards = await Card.find(query).sort({ sortOrder: 1 });
    return cards;
  } catch (error) {
    throw new Error(`Error fetching cards: ${error.message}`);
  }
};

/**
 * Get a card by ID
 * @param {String} id - Card ID
 * @returns {Promise<Object>} Card object
 */
const getCardById = async (id) => {
  try {
    const card = await Card.findById(id);
    if (!card) {
      throw new Error('Card not found');
    }
    return card;
  } catch (error) {
    throw new Error(`Error fetching card: ${error.message}`);
  }
};

/**
 * Create a new card
 * @param {Object} cardData - Card data
 * @returns {Promise<Object>} Created card
 */
const createCard = async (cardData) => {
  try {
    // Find the highest sortOrder for the given deckType
    const highestSortOrder = await Card.findOne({ deckType: cardData.deckType || 'fibonacci' })
      .sort({ sortOrder: -1 })
      .select('sortOrder');
    
    // Set the sortOrder to be one higher than the current highest
    if (!cardData.sortOrder) {
      cardData.sortOrder = highestSortOrder ? highestSortOrder.sortOrder + 1 : 1;
    }
    
    const newCard = new Card(cardData);
    await newCard.save();
    return newCard;
  } catch (error) {
    throw new Error(`Error creating card: ${error.message}`);
  }
};

/**
 * Update a card
 * @param {String} id - Card ID
 * @param {Object} cardData - Card data to update
 * @returns {Promise<Object>} Updated card
 */
const updateCard = async (id, cardData) => {
  try {
    const card = await Card.findByIdAndUpdate(
      id,
      cardData,
      { new: true, runValidators: true }
    );
    
    if (!card) {
      throw new Error('Card not found');
    }
    
    return card;
  } catch (error) {
    throw new Error(`Error updating card: ${error.message}`);
  }
};

/**
 * Delete a card
 * @param {String} id - Card ID
 * @returns {Promise<Boolean>} True if deleted
 */
const deleteCard = async (id) => {
  try {
    const card = await Card.findByIdAndDelete(id);
    
    if (!card) {
      throw new Error('Card not found');
    }
    
    return true;
  } catch (error) {
    throw new Error(`Error deleting card: ${error.message}`);
  }
};

module.exports = {
  getAllCards,
  getCardById,
  createCard,
  updateCard,
  deleteCard
};