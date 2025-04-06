/**
 * @swagger
 * tags:
 *   name: Cards
 *   description: Card management
 */

const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');

/**
 * @swagger
 * /cards:
 *   get:
 *     summary: Get all cards
 *     tags: [Cards]
 *     parameters:
 *       - in: query
 *         name: deckType
 *         schema:
 *           type: string
 *         description: Optional deck type filter (fibonacci, tshirt, custom)
 *     responses:
 *       200:
 *         description: List of cards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Card'
 *       500:
 *         description: Internal Server Error
 */
router.get('/', cardController.getAllCards);

/**
 * @swagger
 * /cards/{id}:
 *   get:
 *     summary: Get card by ID
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Card ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Card found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       404:
 *         description: Card not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', cardController.getCardById);

module.exports = router;
