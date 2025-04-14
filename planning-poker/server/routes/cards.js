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

/**
 * @swagger
 * /cards:
 *   get:
 *     summary: Get all cards
 *     tags: [Cards]
 *     responses:
 *       200:
 *         description: List of all cards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Card'
 */
router.get('/', cardController.getAllCards);

/**
 * @swagger
 * /cards/{id}:
 *   get:
 *     summary: Get a card by ID
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
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
 */
router.get('/:id', cardController.getCardById);

/**
 * @swagger
 * /cards:
 *   post:
 *     summary: Create a new card
 *     tags: [Cards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Card'
 *     responses:
 *       201:
 *         description: Card created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 */
router.post('/', cardController.createCard);

/**
 * @swagger
 * /cards/{id}:
 *   put:
 *     summary: Update a card
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Card'
 *     responses:
 *       200:
 *         description: Card updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       404:
 *         description: Card not found
 */
router.put('/:id', cardController.updateCard);

/**
 * @swagger
 * /cards/{id}:
 *   delete:
 *     summary: Delete a card
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Card deleted
 *       404:
 *         description: Card not found
 */
router.delete('/:id', cardController.deleteCard);


module.exports = router;