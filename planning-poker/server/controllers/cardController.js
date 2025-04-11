// server/controllers/cardController.js
const cardService = require('../services/cardService');

/**
 * @swagger
 * /cards:
 *   get:
 *     summary: Get all cards
 *     description: Retrieve a list of all cards, optionally filtered by deck type
 *     parameters:
 *       - in: query
 *         name: deckType
 *         schema:
 *           type: string
 *           enum: [fibonacci, tshirt, custom]
 *         description: Optional deck type filter
 *     responses:
 *       200:
 *         description: A list of cards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Card'
 *       500:
 *         description: Server error
 */
const getAllCards = async (req, res) => {
  try {
    const cards = await cardService.getAllCards(req.query.deckType);
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /cards/{id}:
 *   get:
 *     summary: Get card by ID
 *     description: Retrieve a specific card by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Card ID
 *     responses:
 *       200:
 *         description: Card details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       404:
 *         description: Card not found
 *       500:
 *         description: Server error
 */
const getCardById = async (req, res) => {
  try {
    const card = await cardService.getCardById(req.params.id);
    card ? res.json(card) : res.status(404).json({ error: 'Card not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /cards:
 *   post:
 *     summary: Create a new card
 *     description: Create a new card in the deck
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - value
 *               - displayValue
 *             properties:
 *               value:
 *                 type: string
 *               displayValue:
 *                 type: string
 *               sortOrder:
 *                 type: integer
 *               deckType:
 *                 type: string
 *                 enum: [fibonacci, tshirt, custom]
 *               isSpecial:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Card created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
const createCard = async (req, res) => {
  try {
    const newCard = await cardService.createCard(req.body);
    res.status(201).json(newCard);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * @swagger
 * /cards/{id}:
 *   put:
 *     summary: Update a card
 *     description: Update an existing card by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Card ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: string
 *               displayValue:
 *                 type: string
 *               sortOrder:
 *                 type: integer
 *               deckType:
 *                 type: string
 *                 enum: [fibonacci, tshirt, custom]
 *               isSpecial:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Updated card
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       404:
 *         description: Card not found
 *       500:
 *         description: Server error
 */
const updateCard = async (req, res) => {
  try {
    const updatedCard = await cardService.updateCard(req.params.id, req.body);
    res.json(updatedCard);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /cards/{id}:
 *   delete:
 *     summary: Delete a card
 *     description: Delete a card by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Card ID
 *     responses:
 *       204:
 *         description: Card deleted
 *       404:
 *         description: Card not found
 *       500:
 *         description: Server error
 */
const deleteCard = async (req, res) => {
  try {
    await cardService.deleteCard(req.params.id);
    res.status(204).end();
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllCards,
  getCardById,
  createCard,
  updateCard,
  deleteCard
};