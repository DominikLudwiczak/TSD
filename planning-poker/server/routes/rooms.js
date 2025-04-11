// server/routes/rooms.js
const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: Room management
 */

// GET /api/rooms - Get all rooms
router.get('/', roomController.getAllRooms);

// GET /api/rooms/:id - Get room by ID
router.get('/:id', roomController.getRoomById);

// POST /api/rooms - Create a new room
router.post('/', roomController.createRoom);

// PUT /api/rooms/:id - Update a room
router.put('/:id', roomController.updateRoom);

// POST /api/rooms/:id/participants - Add participant to room
router.post('/:id/participants', roomController.addParticipant);

// DELETE /api/rooms/:roomId/participants/:userId - Remove participant from room
router.delete('/:roomId/participants/:userId', roomController.removeParticipant);

// PUT /api/rooms/:id/settings - Update room settings
router.put('/:id/settings', roomController.updateRoomSettings);

// DELETE /api/rooms/:id - Delete a room
router.delete('/:id', roomController.deleteRoom);

module.exports = router;