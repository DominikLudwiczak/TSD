/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: Room management
 */

const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

/**
 * @swagger
 * /rooms/{id}:
 *   get:
 *     summary: Get room by ID
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Room ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Room found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       404:
 *         description: Room not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', roomController.getRoomById);

module.exports = router;
