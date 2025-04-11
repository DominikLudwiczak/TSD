// server/routes/cards.js
const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');

/**
 * @swagger
 * tags:
 *   name: Cards
 *   description: Card management
 */

// GET /api/cards - Get all cards
router.get('/', cardController.getAllCards);

// GET /api/cards/:id - Get card by ID
router.get('/:id', cardController.getCardById);

// POST /api/cards - Create a new card
router.post('/', cardController.createCard);

// PUT /api/cards/:id - Update a card
router.put('/:id', cardController.updateCard);

// DELETE /api/cards/:id - Delete a card
router.delete('/:id', cardController.deleteCard);

module.exports = router;